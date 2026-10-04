import { create } from 'zustand';
import type { Order, PaymentSession } from '../types/restaurant';

interface OrderState {
  currentOrder: Order | null;
  paymentSession: PaymentSession | null;
  orderStatus: 'idle' | 'processing' | 'success' | 'failed';
  errorMessage: string | null;

  setOrder: (order: Order) => void;
  setPaymentSession: (session: PaymentSession) => void;
  setStatus: (status: OrderState['orderStatus'], error?: string) => void;
  reset: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  paymentSession: null,
  orderStatus: 'idle',
  errorMessage: null,

  setOrder: (order) => set({ currentOrder: order }),
  setPaymentSession: (session) => set({ paymentSession: session }),
  setStatus: (status, error) => set({ orderStatus: status, errorMessage: error ?? null }),
  reset: () => set({ currentOrder: null, paymentSession: null, orderStatus: 'idle', errorMessage: null }),
}));
