// ─── Domain Entities ──────────────────────────────────────────────────────────

export type DietaryTag = 'Vegan' | 'Vegetarian' | 'Gluten-Free' | 'Nut-Free' | 'Dairy-Free';

export type Category =
  | 'Hot Brews'
  | 'Cold Beverages'
  | 'Bakery & Pastries'
  | 'All-Day Brunch'
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;           // in INR
  category: Category;
  dietaryTags: DietaryTag[];
  image: string;           // URL or placeholder
  isAvailable: boolean;
  isFeatured?: boolean;
  customizable?: boolean;
  addons?: Addon[];
}

export interface Addon {
  id: string;
  label: string;
  options: AddonOption[];
  required?: boolean;
}

export interface AddonOption {
  id: string;
  label: string;
  priceModifier: number;   // 0 if no extra charge
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedAddons?: Record<string, string>; // addonId -> optionId
  unitPrice: number;       // base price + addon modifiers
  lineTotal: number;       // unitPrice × quantity
  note?: string;
}

// ─── Fulfillment ──────────────────────────────────────────────────────────────

export type FulfillmentType = 'dine-in' | 'takeaway' | 'curbside';

export interface FulfillmentDetails {
  type: FulfillmentType;
  tableNumber?: string;    // dine-in
  pickupTime?: string;     // takeaway / curbside (ISO string or time string)
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'idle'
  | 'processing'
  | 'success'
  | 'failed';

export interface OrderFinancials {
  subtotal: number;
  taxRate: number;         // e.g. 0.05 for 5%
  serviceChargeRate: number;
  tax: number;
  serviceCharge: number;
  tip: number;
  total: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface Order {
  id: string;              // e.g. CH-0042
  items: CartItem[];
  fulfillment: FulfillmentDetails;
  customer: CustomerDetails;
  financials: OrderFinancials;
  status: OrderStatus;
  createdAt: string;       // ISO timestamp
  estimatedReadyAt?: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentMethod = 'card' | 'upi' | 'cash' | 'google-pay' | 'apple-pay';

export interface PaymentSession {
  orderId: string;
  amount: number;          // in INR
  currency: 'INR';
  razorpayOrderId?: string;
  method?: PaymentMethod;
  status: 'pending' | 'authorized' | 'captured' | 'failed';
}

// ─── Admin / Kitchen Types ────────────────────────────────────────────────────

export type KitchenOrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface AdminOrderItem {
  id: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;   // in INR
  lineTotal: number;   // in INR
}

export interface AdminOrder {
  id: string;
  displayId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string | null;
  fulfillmentType: FulfillmentType;
  tableNumber?: string | null;
  pickupTime?: string | null;
  items: AdminOrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  tip: number;
  total: number;       // all amounts in INR
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid' | 'authorized';
  transactionId?: string | null;
  kitchenStatus: KitchenOrderStatus;
  trackingToken: string;
  createdAt: string;   // ISO string
}

// Response from POST /api/orders
export interface PlaceOrderResponse {
  orderId: string;
  displayId: string;
  trackingToken: string;
  estimatedReadyAt: string;
}

// Public customer-facing order state (from GET /api/orders/:trackingToken)
export interface TrackingOrder {
  displayId: string;
  trackingToken: string;
  kitchenStatus: KitchenOrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid' | 'authorized';
  fulfillmentType: FulfillmentType;
  tableNumber?: string | null;
  pickupTime?: string | null;
  customerName: string;
  items: { menuItemName: string; quantity: number; lineTotal: number }[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  tip: number;
  total: number;
  createdAt: string;
}

// ─── Testimonial / Review ─────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;          // 1–5
  quote: string;
  date: string;
}
