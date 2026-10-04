import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LogOut, Bell, Archive, ChevronDown, ChevronUp } from 'lucide-react';
import type { AdminOrder, KitchenOrderStatus } from '../../types/restaurant';
import { useAdminStore } from '../../store/adminStore';
import { useAdminSSE } from '../../hooks/useAdminSSE';
import { OrderCard } from '../../components/admin/OrderCard';
import { OrderReadyModal } from '../../components/admin/OrderReadyModal';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [readyOrder, setReadyOrder] = useState<AdminOrder | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const adminEmail = useAdminStore(s => s.adminEmail);
  const clearAuth = useAdminStore(s => s.clearAuth);
  const navigate = useNavigate();

  // Fetch all orders on mount
  useEffect(() => {
    fetch('/api/admin/orders', { credentials: 'include' })
      .then(r => r.json())
      .then((data: AdminOrder[]) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Handle new order from SSE
  const handleNewOrder = useCallback((order: AdminOrder) => {
    setOrders(prev => [order, ...prev]);
    // Play audio chime (optional)
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    } catch {}
  }, []);

  // Handle order update from SSE
  const handleOrderUpdated = useCallback((data: { id: string; kitchenStatus?: string; paymentStatus?: string }) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === data.id
          ? {
              ...o,
              kitchenStatus: (data.kitchenStatus ?? o.kitchenStatus) as KitchenOrderStatus,
              paymentStatus: (data.paymentStatus ?? o.paymentStatus) as AdminOrder['paymentStatus'],
            }
          : o
      )
    );
  }, []);

  useAdminSSE({ onNewOrder: handleNewOrder, onOrderUpdated: handleOrderUpdated });

  // Update order status
  async function updateStatus(orderId: string, status: KitchenOrderStatus) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Status update failed');

      const updated: AdminOrder = await res.json();
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));

      // Show modal if status is now "ready"
      if (status === 'ready') {
        setReadyOrder(updated);
      }
    } catch {
      alert('Failed to update order status');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    clearAuth();
    navigate('/admin/login');
  }

  const pending = orders.filter(o => o.kitchenStatus === 'pending');
  const preparing = orders.filter(o => o.kitchenStatus === 'preparing');
  const ready = orders.filter(o => o.kitchenStatus === 'ready');
  const completed = orders.filter(o => o.kitchenStatus === 'completed');
  const cancelled = orders.filter(o => o.kitchenStatus === 'cancelled');

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-espresso text-cream shadow-lg">
        <div className="container-site py-4 flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-2xl font-bold">Kitchen Dashboard</h1>
            <p className="text-sm text-cream/70">{adminEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-cream/10 hover:bg-cream/20 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <div className="container-site py-12 text-center text-espresso/60">Loading orders...</div>
      ) : (
        <div className="container-site py-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card bg-amber-50 border-amber-200 p-4 text-center">
              <div className="text-3xl font-bold text-amber-700">{pending.length}</div>
              <div className="text-sm text-amber-600 font-medium">Pending</div>
            </div>
            <div className="card bg-blue-50 border-blue-200 p-4 text-center">
              <div className="text-3xl font-bold text-blue-700">{preparing.length}</div>
              <div className="text-sm text-blue-600 font-medium">Preparing</div>
            </div>
            <div className="card bg-emerald-50 border-emerald-200 p-4 text-center">
              <div className="text-3xl font-bold text-emerald-700">{ready.length}</div>
              <div className="text-sm text-emerald-600 font-medium">Ready</div>
            </div>
          </div>

          {/* Columns */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Pending */}
            <div>
              <h2 className="font-playfair text-xl font-bold text-espresso mb-3 flex items-center gap-2">
                <Bell size={20} className="text-amber-600" />
                Pending
              </h2>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {pending.map(order => (
                    <OrderCard key={order.id} order={order} onStatusChange={updateStatus} />
                  ))}
                </AnimatePresence>
                {pending.length === 0 && (
                  <p className="text-sm text-espresso/40 text-center py-8">No pending orders</p>
                )}
              </div>
            </div>

            {/* Preparing */}
            <div>
              <h2 className="font-playfair text-xl font-bold text-espresso mb-3 flex items-center gap-2">
                <span className="text-blue-600">⏱</span>
                Preparing
              </h2>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {preparing.map(order => (
                    <OrderCard key={order.id} order={order} onStatusChange={updateStatus} />
                  ))}
                </AnimatePresence>
                {preparing.length === 0 && (
                  <p className="text-sm text-espresso/40 text-center py-8">No orders in prep</p>
                )}
              </div>
            </div>

            {/* Ready */}
            <div>
              <h2 className="font-playfair text-xl font-bold text-espresso mb-3 flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                Ready
              </h2>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {ready.map(order => (
                    <OrderCard key={order.id} order={order} onStatusChange={updateStatus} />
                  ))}
                </AnimatePresence>
                {ready.length === 0 && (
                  <p className="text-sm text-espresso/40 text-center py-8">No orders ready</p>
                )}
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between bg-espresso/5 hover:bg-espresso/10 rounded-xl p-4 transition-colors mb-3"
            >
              <div className="flex items-center gap-3">
                <Archive size={20} className="text-espresso/60" />
                <h2 className="font-playfair text-xl font-bold text-espresso">
                  Order History
                </h2>
                <span className="text-sm text-espresso/50">
                  ({completed.length + cancelled.length} orders)
                </span>
              </div>
              {showHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showHistory && (
              <div className="space-y-4">
                {/* Completed Orders */}
                {completed.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                      <span>✓</span> Completed ({completed.length})
                    </h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      <AnimatePresence mode="popLayout">
                        {completed.map(order => (
                          <OrderCard key={order.id} order={order} onStatusChange={updateStatus} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Cancelled Orders */}
                {cancelled.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                      <span>✕</span> Cancelled ({cancelled.length})
                    </h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      <AnimatePresence mode="popLayout">
                        {cancelled.map(order => (
                          <OrderCard key={order.id} order={order} onStatusChange={updateStatus} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {completed.length === 0 && cancelled.length === 0 && (
                  <p className="text-sm text-espresso/40 text-center py-8">No order history yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ready modal */}
      <AnimatePresence>
        {readyOrder && (
          <OrderReadyModal
            displayId={readyOrder.displayId}
            customerName={readyOrder.customerName}
            onClose={() => setReadyOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
