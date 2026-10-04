import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ChefHat, Package, ArrowLeft } from 'lucide-react';
import type { TrackingOrder, KitchenOrderStatus } from '../types/restaurant';
import { useSSE } from '../hooks/useSSE';

const STATUS_STEPS: KitchenOrderStatus[] = ['pending', 'preparing', 'ready', 'completed'];

const STATUS_CONFIG: Record<KitchenOrderStatus, { label: string; icon: typeof CheckCircle; color: string }> = {
  pending: { label: 'Order Received', icon: CheckCircle, color: 'text-amber-600' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'text-blue-600' },
  ready: { label: 'Ready for Pickup', icon: Package, color: 'text-emerald-600' },
  completed: { label: 'Collected', icon: CheckCircle, color: 'text-sage' },
  cancelled: { label: 'Cancelled', icon: CheckCircle, color: 'text-gray-400' },
};

export default function TrackOrderPage() {
  const { displayId } = useParams<{ displayId: string }>();
  const [searchParams] = useSearchParams();
  const trackingToken = searchParams.get('token');

  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial order state
  useEffect(() => {
    if (!trackingToken) {
      setError('Missing tracking token');
      setLoading(false);
      return;
    }

    fetch(`/api/orders/${trackingToken}`)
      .then(r => {
        if (!r.ok) throw new Error('Order not found');
        return r.json() as Promise<TrackingOrder>;
      })
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Order not found');
        setLoading(false);
      });
  }, [trackingToken]);

  // Subscribe to SSE updates
  useSSE({
    trackingToken,
    onStatusUpdate: (kitchenStatus) => {
      setOrder(prev => (prev ? { ...prev, kitchenStatus } : prev));
      // Play notification sound if order is ready
      if (kitchenStatus === 'ready') {
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
        } catch {}
      }
    },
    enabled: !!trackingToken,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block size-12 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin mb-4" />
          <p className="text-espresso/60">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="font-playfair text-2xl font-bold text-espresso mb-2">Order Not Found</h1>
          <p className="text-espresso/60 mb-6">{error ?? 'Unable to load order details.'}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.kitchenStatus);
  const progress = ((currentStepIndex + 1) / STATUS_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-espresso text-cream shadow-lg">
        <div className="container-site py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-cream/70 hover:text-cream transition-colors mb-3">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="font-playfair text-3xl font-bold">Track Your Order</h1>
          <p className="text-cream/80 mt-1">Order #{displayId}</p>
        </div>
      </header>

      <div className="container-site py-8 max-w-2xl">
        {/* Progress bar */}
        <div className="card bg-white rounded-2xl p-6 mb-6">
          <div className="relative">
            {/* Background track */}
            <div className="h-2 bg-espresso/10 rounded-full overflow-hidden mb-8">
              <motion.div
                className="h-full bg-gradient-to-r from-terracotta to-sage rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-4 gap-2">
              {STATUS_STEPS.map((status, i) => {
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;
                const isActive = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;

                return (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div
                      className={`mx-auto mb-2 size-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? `${config.color} bg-current/10 ring-2 ring-current`
                          : 'bg-espresso/5 text-espresso/30'
                      } ${isCurrent ? 'scale-110' : ''}`}
                    >
                      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <p className={`text-xs font-medium ${isActive ? 'text-espresso' : 'text-espresso/40'}`}>
                      {config.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Current status message */}
          {order.kitchenStatus === 'ready' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
            >
              <p className="text-emerald-800 font-semibold text-lg">🎉 Your order is ready!</p>
              <p className="text-emerald-700 text-sm mt-1">Please collect it from the counter.</p>
            </motion.div>
          )}

          {order.kitchenStatus === 'preparing' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <p className="text-blue-800 font-semibold">Your order is being prepared</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-blue-600">
                <Clock size={14} />
                Estimated ready time: {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </div>
            </div>
          )}
        </div>

        {/* Order details */}
        <div className="card bg-white rounded-2xl p-6">
          <h2 className="font-playfair text-xl font-bold text-espresso mb-4">Order Details</h2>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-espresso/60">Customer</dt>
              <dd className="font-medium text-espresso">{order.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-espresso/60">Fulfillment</dt>
              <dd className="font-medium text-espresso capitalize">{order.fulfillmentType.replace('-', ' ')}</dd>
            </div>
            {order.tableNumber && (
              <div className="flex justify-between">
                <dt className="text-espresso/60">Table</dt>
                <dd className="font-medium text-espresso">{order.tableNumber}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-espresso/60">Payment</dt>
              <dd className={`font-medium ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order.paymentStatus === 'paid' ? '✓ Paid' : 'Cash on Delivery'}
              </dd>
            </div>
          </dl>

          <hr className="my-4 border-espresso/10" />

          <h3 className="font-semibold text-espresso mb-3">Items</h3>
          <ul className="space-y-2">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-espresso">
                  <span className="font-medium">{item.quantity}×</span> {item.menuItemName}
                </span>
                <span className="text-espresso/60">₹{item.lineTotal.toFixed(0)}</span>
              </li>
            ))}
          </ul>

          <hr className="my-4 border-espresso/10" />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-espresso/70">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-espresso/70">
              <span>Tax</span>
              <span>₹{order.tax.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-espresso/70">
              <span>Service Charge</span>
              <span>₹{order.serviceCharge.toFixed(0)}</span>
            </div>
            {order.tip > 0 && (
              <div className="flex justify-between text-espresso/70">
                <span>Tip</span>
                <span>₹{order.tip.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-espresso text-base pt-2 border-t border-espresso/10">
              <span>Total</span>
              <span>₹{order.total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
