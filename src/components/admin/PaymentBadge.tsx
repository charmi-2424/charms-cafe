import type { AdminOrder } from '../../types/restaurant';

interface PaymentBadgeProps {
  order: Pick<AdminOrder, 'paymentMethod' | 'paymentStatus' | 'transactionId' | 'total'>;
}

/** Visual payment badge: green for online/PAID, amber for COD. */
export function PaymentBadge({ order }: PaymentBadgeProps) {
  const isCash = order.paymentMethod === 'cash';
  const amount = `₹${(order.total / 100).toFixed(0)}`;

  if (isCash) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <span className="size-2 rounded-full bg-amber-500 shrink-0" />
        COD · Collect {amount}
      </span>
    );
  }

  const methodLabel: Record<string, string> = {
    card: 'Card',
    upi: 'UPI',
    'google-pay': 'GPay',
    'apple-pay': 'Apple Pay',
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
      <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
      PAID · {methodLabel[order.paymentMethod] ?? order.paymentMethod}
      {order.transactionId && (
        <span className="font-normal text-emerald-600">#{order.transactionId.slice(-6)}</span>
      )}
    </span>
  );
}
