import { useEffect, useRef, useCallback } from 'react';
import type { AdminOrder } from '../types/restaurant';

interface UseAdminSSEOptions {
  onNewOrder: (order: AdminOrder) => void;
  onOrderUpdated: (data: { id: string; kitchenStatus?: string; paymentStatus?: string }) => void;
  enabled?: boolean;
}

/**
 * Subscribes to the admin SSE channel.
 * Receives 'new-order' and 'order-updated' events.
 * Reconnects automatically with exponential back-off.
 */
export function useAdminSSE({ onNewOrder, onOrderUpdated, enabled = true }: UseAdminSSEOptions) {
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef(0);
  const MAX_RETRIES = 10;

  const connect = useCallback(() => {
    if (!enabled) return;
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    // Credentials needed so the server can read the HTTPOnly cookie
    const es = new EventSource('/api/sse/admin', { withCredentials: true });
    esRef.current = es;

    es.addEventListener('connected', () => {
      retryRef.current = 0;
    });

    es.addEventListener('new-order', (e: MessageEvent) => {
      try {
        const order = JSON.parse(e.data) as AdminOrder;
        onNewOrder(order);
        retryRef.current = 0;
      } catch {
        console.warn('[useAdminSSE] Failed to parse new-order event', e.data);
      }
    });

    es.addEventListener('order-updated', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { id: string; kitchenStatus?: string; paymentStatus?: string };
        onOrderUpdated(data);
        retryRef.current = 0;
      } catch {
        console.warn('[useAdminSSE] Failed to parse order-updated event', e.data);
      }
    });

    es.onerror = () => {
      es.close();
      esRef.current = null;
      if (retryRef.current < MAX_RETRIES) {
        retryRef.current++;
        const delay = Math.min(1000 * 2 ** retryRef.current, 60_000);
        setTimeout(connect, delay);
      }
    };
  }, [onNewOrder, onOrderUpdated, enabled]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [connect]);
}
