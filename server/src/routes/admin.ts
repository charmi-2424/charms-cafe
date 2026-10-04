import { Router } from 'express';
import { db } from '../db.js';
import { verifyJWT } from '../middleware/auth.js';
import { UpdateKitchenStatusSchema, UpdatePaymentStatusSchema } from '../schemas/order.schema.js';
import { sseManager } from '../sseManager.js';
import { formatOrderForAdmin } from './orders.js';

export const adminRouter = Router();

// All admin routes require JWT verification
adminRouter.use(verifyJWT);

// ─── GET /api/admin/orders ────────────────────────────────────────────────────
// Optional query: ?status=pending,preparing  (comma-separated)
adminRouter.get('/orders', async (req, res) => {
  const statusParam = req.query['status'] as string | undefined;
  const statusFilter = statusParam
    ? statusParam.split(',').map(s => s.trim()).filter(Boolean)
    : undefined;

  const orders = await db.order.findMany({
    where: statusFilter ? { kitchenStatus: { in: statusFilter } } : undefined,
    include: { items: true },
    orderBy: { createdAt: 'asc' },
  });

  res.json(orders.map(formatOrderForAdmin));
});

// ─── PATCH /api/admin/orders/:id/status ──────────────────────────────────────
adminRouter.patch('/orders/:id/status', async (req, res) => {
  const { id } = req.params;

  const parse = UpdateKitchenStatusSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid status', details: parse.error.flatten() });
    return;
  }

  const { status } = parse.data;

  const order = await db.order.update({
    where: { id },
    data: { kitchenStatus: status },
    include: { items: true },
  });

  // Push real-time update to customer's SSE stream
  sseManager.broadcastToOrder(order.trackingToken, 'status-update', {
    kitchenStatus: status,
    displayId: order.displayId,
  });

  // Also notify admin channel about status change
  sseManager.broadcastToAdmin('order-updated', { id, kitchenStatus: status });

  res.json(formatOrderForAdmin(order));
});

// ─── PATCH /api/admin/orders/:id/payment ─────────────────────────────────────
adminRouter.patch('/orders/:id/payment', async (req, res) => {
  const { id } = req.params;

  const parse = UpdatePaymentStatusSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid payment data', details: parse.error.flatten() });
    return;
  }

  const order = await db.order.update({
    where: { id },
    data: {
      paymentStatus: parse.data.paymentStatus,
      transactionId: parse.data.transactionId,
    },
    include: { items: true },
  });

  sseManager.broadcastToAdmin('order-updated', {
    id,
    paymentStatus: parse.data.paymentStatus,
    transactionId: parse.data.transactionId,
  });

  res.json(formatOrderForAdmin(order));
});

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
adminRouter.get('/stats', async (_req, res) => {
  const [pending, preparing, ready, completed] = await Promise.all([
    db.order.count({ where: { kitchenStatus: 'pending' } }),
    db.order.count({ where: { kitchenStatus: 'preparing' } }),
    db.order.count({ where: { kitchenStatus: 'ready' } }),
    db.order.count({ where: { kitchenStatus: 'completed' } }),
  ]);

  res.json({ pending, preparing, ready, completed });
});
