import { useEffect, useRef, useCallback } from 'react';
import type { KitchenOrderStatus } from '../types/restaurant';

interface UseSSEOptions {
  trackingToken: string | null;
  onStatusUpdate: (kitchenStatus: KitchenOrderStatus) => void;
  enabled?: boolean;
}

/**
 * Subscribes to the customer-facing SSE channel for a specific order.
 * Reconnects automatically up to MAX_RETRIES if the connection drops.
 */
export function useSSE({ trackingToken, onStatusUpdate, enabled = true }: UseSSEOptions) {
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef(0);
  const MAX_RETRIES = 5;

  const connect = useCallback(() => {
    if (!trackingToken || !enabled) return;
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    const url = `/api/sse/order/${trackingToken}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener('status-update', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { kitchenStatus: KitchenOrderStatus };
        onStatusUpdate(data.kitchenStatus);
        retryRef.current = 0; // reset on successful message
      } catch {
        console.warn('[useSSE] Failed to parse status-update event', e.data);
      }
    });

    es.onerror = () => {
      es.close();
      esRef.current = null;
      if (retryRef.current < MAX_RETRIES) {
        retryRef.current++;
        const delay = Math.min(1000 * 2 ** retryRef.current, 30_000);
        setTimeout(connect, delay);
      }
    };
  }, [trackingToken, onStatusUpdate, enabled]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [connect]);
}
