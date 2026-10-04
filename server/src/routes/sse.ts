import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import { verifyJWT } from '../middleware/auth.js';
import { sseManager } from '../sseManager.js';

export const sseRouter = Router();

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'X-Accel-Buffering': 'no', // disable Nginx buffering
};

// ─── GET /api/sse/order/:trackingToken ────────────────────────────────────────
// Customer-facing stream — updates this customer's order status in real time
sseRouter.get('/order/:trackingToken', async (req, res) => {
  const { trackingToken } = req.params;

  // Validate token format
  if (!/^[0-9a-f-]{36}$/.test(trackingToken)) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  // Verify order exists
  const order = await db.order.findUnique({ where: { trackingToken }, select: { id: true } });
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.set(SSE_HEADERS);
  res.flushHeaders();

  const clientId = uuidv4();
  const client = { id: clientId, res };

  sseManager.addOrderClient(trackingToken, client);

  // Send initial heartbeat
  res.write(': connected\n\n');

  // Keepalive ping every 25s (prevents proxy/browser timeout)
  const keepalive = setInterval(() => {
    try { res.write(': ping\n\n'); } catch { clearInterval(keepalive); }
  }, 25_000);

  req.on('close', () => {
    clearInterval(keepalive);
    sseManager.removeOrderClient(trackingToken, clientId);
  });
});

// ─── GET /api/sse/admin ───────────────────────────────────────────────────────
// Admin-only stream — push all new orders and status changes to kitchen display
sseRouter.get('/admin', verifyJWT, (req, res) => {
  res.set(SSE_HEADERS);
  res.flushHeaders();

  const clientId = uuidv4();
  const client = { id: clientId, res };

  sseManager.addAdminClient(client);

  // Send connected event
  res.write(`event: connected\ndata: ${JSON.stringify({ clientId })}\n\n`);

  // Keepalive
  const keepalive = setInterval(() => {
    try { res.write(': ping\n\n'); } catch { clearInterval(keepalive); }
  }, 25_000);

  req.on('close', () => {
    clearInterval(keepalive);
    sseManager.removeAdminClient(clientId);
  });
});
