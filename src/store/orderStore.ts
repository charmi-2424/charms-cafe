import { create } from 'zustand';
import type { Order, PaymentSession } from '../types/restaurant';

interface OrderState {
  currentOrder: Order | null;
  paymentSession: PaymentSession | null;
  orderStatus: 'idle' | 'processing' | 'success' | 'failed';
  errorMessage: string | null;

  // Populated after successful order placement
  placedOrderId: string | null;        // internal UUID
  placedDisplayId: string | null;      // e.g. "CH-4231"
  placedTrackingToken: string | null;  // UUID for SSE + public lookup
  estimatedReadyAt: string | null;     // ISO timestamp

  setOrder: (order: Order) => void;
  setPaymentSession: (session: PaymentSession) => void;
  setStatus: (status: OrderState['orderStatus'], error?: string) => void;
  setPlacedOrder: (data: { orderId: string; displayId: string; trackingToken: string; estimatedReadyAt: string }) => void;
  reset: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  paymentSession: null,
  orderStatus: 'idle',
  errorMessage: null,
  placedOrderId: null,
  placedDisplayId: null,
  placedTrackingToken: null,
  estimatedReadyAt: null,

  setOrder: (order) => set({ currentOrder: order }),
  setPaymentSession: (session) => set({ paymentSession: session }),
  setStatus: (status, error) => set({ orderStatus: status, errorMessage: error ?? null }),
  setPlacedOrder: (data) => set({
    placedOrderId: data.orderId,
    placedDisplayId: data.displayId,
    placedTrackingToken: data.trackingToken,
    estimatedReadyAt: data.estimatedReadyAt,
  }),
  reset: () => set({
    currentOrder: null,
    paymentSession: null,
    orderStatus: 'idle',
    errorMessage: null,
    placedOrderId: null,
    placedDisplayId: null,
    placedTrackingToken: null,
    estimatedReadyAt: null,
  }),
}));

