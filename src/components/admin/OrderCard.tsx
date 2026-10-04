import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { AdminOrder, KitchenOrderStatus } from '../../types/restaurant';
import { PaymentBadge } from './PaymentBadge';

interface OrderCardProps {
  order: AdminOrder;
  onStatusChange: (orderId: string, status: KitchenOrderStatus) => void;
}

const STATUS_TRANSITIONS: Record<KitchenOrderStatus, KitchenOrderStatus | null> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'completed',
  completed: null,
  cancelled: null,
};

const STATUS_LABELS: Record<KitchenOrderStatus, string> = {
  pending: 'Accept Order',
  preparing: 'Mark Ready',
  ready: 'Mark Collected',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const FULFILLMENT_LABEL: Record<string, string> = {
  'dine-in': 'Dine-in',
  takeaway: 'Takeaway',
  curbside: 'Curbside',
};

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const nextStatus = STATUS_TRANSITIONS[order.kitchenStatus];
  const buttonLabel = STATUS_LABELS[order.kitchenStatus];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="card bg-cream border border-espresso/10 rounded-xl p-4 space-y-3"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-playfair font-bold text-espresso text-lg">#{order.displayId}</span>
          <span className="ml-2 text-xs text-espresso/50">
            {FULFILLMENT_LABEL[order.fulfillmentType] ?? order.fulfillmentType}
            {order.tableNumber && ` · Table ${order.tableNumber}`}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-espresso/50 shrink-0">
          <Clock size={12} />
          {formatTime(order.createdAt)}
        </div>
      </div>

      {/* Customer */}
      <p className="text-sm text-espresso/70">{order.customerName}</p>
      {order.customerNotes && (
        <p className="text-xs text-sage bg-sage/10 rounded-md px-2 py-1">📝 {order.customerNotes}</p>
      )}

      {/* Items */}
      <ul className="divide-y divide-espresso/8 text-sm">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between py-1">
            <span className="text-espresso">
              <span className="font-medium">{item.quantity}×</span> {item.menuItemName}
            </span>
            <span className="text-espresso/60">₹{item.lineTotal.toFixed(0)}</span>
          </li>
        ))}
      </ul>

      {/* Total + payment */}
      <div className="flex items-center justify-between pt-1">
        <span className="font-bold text-espresso">₹{order.total.toFixed(0)}</span>
        <PaymentBadge order={order} />
      </div>

      {/* Action button */}
      {nextStatus && (
        <button
          className="btn-primary w-full text-sm py-2"
          onClick={() => onStatusChange(order.id, nextStatus)}
        >
          {buttonLabel}
        </button>
      )}
      {!nextStatus && order.kitchenStatus !== 'cancelled' && (
        <p className="text-center text-sm text-sage font-medium">✓ {buttonLabel}</p>
      )}
    </motion.div>
  );
}
