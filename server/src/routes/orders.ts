import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import { CreateOrderSchema } from '../schemas/order.schema.js';
import { sseManager } from '../sseManager.js';

export const ordersRouter = Router();

// Generate human-readable display ID (CH-XXXX)
function generateDisplayId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CH-${num}`;
}

// Estimated ready time 15 minutes from now
function getEstimatedReadyAt(): string {
  const d = new Date(Date.now() + 15 * 60 * 1000);
  return d.toISOString();
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────
ordersRouter.post('/', async (req, res) => {
  const parse = CreateOrderSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid order data', details: parse.error.flatten() });
    return;
  }

  const { customer, items, fulfillment, financials, paymentMethod, transactionId } = parse.data;

  // Ensure displayId is unique (retry up to 5 times on collision)
  let displayId = generateDisplayId();
  for (let i = 0; i < 5; i++) {
    const existing = await db.order.findUnique({ where: { displayId } });
    if (!existing) break;
    displayId = generateDisplayId();
  }

  const trackingToken = uuidv4();

  const order = await db.order.create({
    data: {
      displayId,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerNotes: customer.notes,
      fulfillmentType: fulfillment.type,
      tableNumber: fulfillment.tableNumber,
      pickupTime: fulfillment.pickupTime,
      subtotal: financials.subtotal,
      tax: financials.tax,
      serviceCharge: financials.serviceCharge,
      tip: financials.tip,
      total: financials.total,
      paymentMethod,
      paymentStatus: (paymentMethod === 'cash') ? 'unpaid' : 'paid',
      transactionId,
      kitchenStatus: 'pending',
      trackingToken,
      items: {
        create: items.map(item => ({
          menuItemId: item.menuItemId,
          menuItemName: item.menuItemName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          selectedAddons: item.selectedAddons ? JSON.stringify(item.selectedAddons) : null,
        })),
      },
    },
    include: { items: true },
  });

  // Notify admin SSE clients of the new order
  sseManager.broadcastToAdmin('new-order', formatOrderForAdmin(order));

  res.status(201).json({
    orderId: order.id,
    displayId: order.displayId,
    trackingToken: order.trackingToken,
    estimatedReadyAt: getEstimatedReadyAt(),
  });
});

// ─── GET /api/orders/:trackingToken ──────────────────────────────────────────
// Public endpoint — customers look up their own order by trackingToken (UUID)
// IDOR protection: sequential displayId is never used as the lookup key
ordersRouter.get('/:trackingToken', async (req, res) => {
  const { trackingToken } = req.params;

  // Validate it looks like a UUID to prevent unnecessary DB lookups
  if (!/^[0-9a-f-]{36}$/.test(trackingToken)) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const order = await db.order.findUnique({
    where: { trackingToken },
    include: { items: true },
  });

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  // Return safe customer subset — no internal IDs or payment transaction details
  res.json({
    displayId: order.displayId,
    trackingToken: order.trackingToken,
    kitchenStatus: order.kitchenStatus,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    fulfillmentType: order.fulfillmentType,
    tableNumber: order.tableNumber,
    pickupTime: order.pickupTime,
    customerName: order.customerName,
    items: order.items.map(i => ({
      menuItemName: i.menuItemName,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    serviceCharge: order.serviceCharge,
    tip: order.tip,
    total: order.total,
    createdAt: order.createdAt,
  });
});

// Helper to format an order for admin SSE payload
export function formatOrderForAdmin(order: {
  id: string;
  displayId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes: string | null;
  fulfillmentType: string;
  tableNumber: string | null;
  pickupTime: string | null;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  tip: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string | null;
  kitchenStatus: string;
  trackingToken: string;
  createdAt: Date;
  items: Array<{
    id: string;
    menuItemName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}) {
  return {
    id: order.id,
    displayId: order.displayId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerNotes: order.customerNotes,
    fulfillmentType: order.fulfillmentType,
    tableNumber: order.tableNumber,
    pickupTime: order.pickupTime,
    subtotal: order.subtotal,
    tax: order.tax,
    serviceCharge: order.serviceCharge,
    tip: order.tip,
    total: order.total,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    transactionId: order.transactionId,
    kitchenStatus: order.kitchenStatus,
    trackingToken: order.trackingToken,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map(i => ({
      id: i.id,
      menuItemName: i.menuItemName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      lineTotal: i.lineTotal,
    })),
  };
}
