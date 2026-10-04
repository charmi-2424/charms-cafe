import type { Response } from 'express';

// ─── SSE Manager ──────────────────────────────────────────────────────────────
// Manages Server-Sent Events channels for real-time order updates.
// Two channel types:
//   1. Admin channel: receives all new-order events
//   2. Per-order channels: keyed by trackingToken, receives status updates

interface SSEClient {
  id: string;
  res: Response;
}

class SSEManager {
  private adminClients = new Set<SSEClient>();
  private orderClients = new Map<string, Set<SSEClient>>();

  // ── Admin channel ────────────────────────────────────────────────────────────

  addAdminClient(client: SSEClient): void {
    this.adminClients.add(client);
  }

  removeAdminClient(clientId: string): void {
    for (const c of this.adminClients) {
      if (c.id === clientId) { this.adminClients.delete(c); break; }
    }
  }

  broadcastToAdmin(event: string, data: unknown): void {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.adminClients) {
      try { client.res.write(payload); } catch { this.adminClients.delete(client); }
    }
  }

  // ── Order-specific channel ──────────────────────────────────────────────────

  addOrderClient(trackingToken: string, client: SSEClient): void {
    if (!this.orderClients.has(trackingToken)) {
      this.orderClients.set(trackingToken, new Set());
    }
    this.orderClients.get(trackingToken)!.add(client);
  }

  removeOrderClient(trackingToken: string, clientId: string): void {
    const clients = this.orderClients.get(trackingToken);
    if (!clients) return;
    for (const c of clients) {
      if (c.id === clientId) { clients.delete(c); break; }
    }
    if (clients.size === 0) this.orderClients.delete(trackingToken);
  }

  broadcastToOrder(trackingToken: string, event: string, data: unknown): void {
    const clients = this.orderClients.get(trackingToken);
    if (!clients) return;
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of clients) {
      try { client.res.write(payload); } catch { clients.delete(client); }
    }
  }

  get adminClientCount(): number { return this.adminClients.size; }
}

// Singleton — shared across all route handlers
export const sseManager = new SSEManager();
