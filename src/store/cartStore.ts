import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem, FulfillmentDetails, OrderFinancials } from '../types/restaurant';

// ─── Constants ────────────────────────────────────────────────────────────────
const TAX_RATE = 0.05;           // 5% GST
const SERVICE_CHARGE_RATE = 0.05; // 5% service charge

// ─── State Shape ──────────────────────────────────────────────────────────────
interface CartState {
  items: CartItem[];
  fulfillment: FulfillmentDetails;
  tip: number;           // flat amount in INR
  tipPreset: number | 'custom'; // 10 | 15 | 20 | 'custom'

  // Actions
  addItem: (item: MenuItem, selectedAddons?: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setFulfillment: (fulfillment: FulfillmentDetails) => void;
  setTip: (tip: number, preset?: number | 'custom') => void;

  // Computed
  totalItems: () => number;
  financials: () => OrderFinancials;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeUnitPrice(item: MenuItem, selectedAddons?: Record<string, string>): number {
  let price = item.price;
  if (selectedAddons && item.addons) {
    for (const addon of item.addons) {
      const selectedOptionId = selectedAddons[addon.id];
      if (selectedOptionId) {
        const option = addon.options.find(o => o.id === selectedOptionId);
        if (option) price += option.priceModifier;
      }
    }
  }
  return price;
}

function buildCartKey(itemId: string, selectedAddons?: Record<string, string>): string {
  if (!selectedAddons || Object.keys(selectedAddons).length === 0) return itemId;
  const suffix = Object.entries(selectedAddons).sort().map(([k, v]) => `${k}:${v}`).join('|');
  return `${itemId}__${suffix}`;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      fulfillment: { type: 'dine-in' },
      tip: 0,
      tipPreset: 10,

      addItem: (item, selectedAddons) => {
        const key = buildCartKey(item.id, selectedAddons);
        const unitPrice = computeUnitPrice(item, selectedAddons);
        set(state => {
          const existingIndex = state.items.findIndex(
            ci => buildCartKey(ci.menuItem.id, ci.selectedAddons) === key
          );
          if (existingIndex !== -1) {
            const updated = [...state.items];
            const existing = updated[existingIndex];
            const newQty = existing.quantity + 1;
            updated[existingIndex] = {
              ...existing,
              quantity: newQty,
              lineTotal: existing.unitPrice * newQty,
            };
            return { items: updated };
          }
          return {
            items: [...state.items, {
              menuItem: item,
              quantity: 1,
              selectedAddons,
              unitPrice,
              lineTotal: unitPrice,
            }],
          };
        });
      },

      removeItem: (itemId) => {
        set(state => ({ items: state.items.filter(ci => ci.menuItem.id !== itemId) }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set(state => ({
          items: state.items.map(ci =>
            ci.menuItem.id === itemId
              ? { ...ci, quantity, lineTotal: ci.unitPrice * quantity }
              : ci
          ),
        }));
      },

      clearCart: () => set({ items: [], tip: 0, tipPreset: 10 }),

      setFulfillment: (fulfillment) => set({ fulfillment }),

      setTip: (tip, preset) => set({
        tip,
        tipPreset: preset ?? 'custom',
      }),

      totalItems: () => get().items.reduce((sum, ci) => sum + ci.quantity, 0),

      financials: () => {
        const { items, tip } = get();
        const subtotal = items.reduce((s, ci) => s + ci.lineTotal, 0);
        const tax = Math.round(subtotal * TAX_RATE);
        const serviceCharge = Math.round(subtotal * SERVICE_CHARGE_RATE);
        const total = subtotal + tax + serviceCharge + tip;
        return {
          subtotal,
          taxRate: TAX_RATE,
          serviceChargeRate: SERVICE_CHARGE_RATE,
          tax,
          serviceCharge,
          tip,
          total,
        };
      },
    }),
    {
      name: 'charms-cart',
      partialize: (state) => ({
        items: state.items,
        fulfillment: state.fulfillment,
        tip: state.tip,
        tipPreset: state.tipPreset,
      }),
    }
  )
);
