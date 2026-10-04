import { z } from 'zod';

// ─── Customer Details ──────────────────────────────────────────────────────────

export const CustomerDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Name required').max(100),
  email: z.string().trim().email('Invalid email').max(200),
  phone: z.string().trim().regex(/^\+?[\d\s\-]{8,15}$/, 'Invalid phone').max(20),
  notes: z.string().trim().max(500).optional(),
});

// ─── Cart Item ─────────────────────────────────────────────────────────────────

export const OrderItemSchema = z.object({
  menuItemId: z.string().trim().min(1).max(100),
  menuItemName: z.string().trim().min(1).max(200),
  quantity: z.number().int().positive().max(50),
  unitPrice: z.number().int().nonnegative(),
  lineTotal: z.number().int().nonnegative(),
  selectedAddons: z.record(z.string()).optional(),
});

// ─── Fulfillment ───────────────────────────────────────────────────────────────

export const FulfillmentSchema = z.object({
  type: z.enum(['dine-in', 'takeaway', 'curbside']),
  tableNumber: z.string().trim().max(20).optional(),
  pickupTime: z.string().trim().max(20).optional(),
});

// ─── Create Order ──────────────────────────────────────────────────────────────

export const CreateOrderSchema = z.object({
  customer: CustomerDetailsSchema,
  items: z.array(OrderItemSchema).min(1, 'At least one item required').max(50),
  fulfillment: FulfillmentSchema,
  financials: z.object({
    subtotal: z.number().int().nonnegative(),
    tax: z.number().int().nonnegative(),
    serviceCharge: z.number().int().nonnegative(),
    tip: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  }),
  paymentMethod: z.enum(['card', 'upi', 'cash', 'google-pay', 'apple-pay']),
  transactionId: z.string().trim().max(200).optional(),
});

// ─── Admin Auth ────────────────────────────────────────────────────────────────

export const AdminLoginSchema = z.object({
  email: z.string().trim().email().max(200).toLowerCase(),
  password: z.string().min(1).max(200),
});

// ─── Kitchen Status Update ─────────────────────────────────────────────────────

export const UpdateKitchenStatusSchema = z.object({
  status: z.enum(['pending', 'preparing', 'ready', 'completed', 'cancelled']),
});

// ─── Payment Status Update ─────────────────────────────────────────────────────

export const UpdatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['unpaid', 'paid', 'authorized']),
  transactionId: z.string().trim().max(200).optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
