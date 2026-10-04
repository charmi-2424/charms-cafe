import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Minus, Plus, Trash2, UtensilsCrossed,
  ShoppingBag as TakeawayIcon, Car, CreditCard,
  Smartphone, Banknote, Shield, Lock, CheckCircle2,
  AlertCircle, Clock, Loader2, ArrowLeft, Receipt
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { formatINR, generateOrderId, getEstimatedReadyAt } from '../lib/utils';
import type { FulfillmentType, PaymentMethod, CustomerDetails } from '../types/restaurant';

// ─── Tip Selector ─────────────────────────────────────────────────────────────
const TipSelector: React.FC = () => {
  const { tip, tipPreset, setTip, financials } = useCartStore();
  const { subtotal } = financials();
  const presets = [10, 15, 20];
  const [customInput, setCustomInput] = useState('');

  const handlePreset = (pct: number) => {
    setTip(Math.round(subtotal * pct / 100), pct);
  };

  const handleCustom = (val: string) => {
    setCustomInput(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0) setTip(Math.round(n), 'custom');
  };

  return (
    <div>
      <p className="text-sm font-semibold text-espresso mb-3">Add a Tip 💛</p>
      <div className="flex gap-2 flex-wrap">
        {presets.map(pct => (
          <button
            key={pct}
            onClick={() => handlePreset(pct)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
              ${tipPreset === pct ? 'bg-terracotta text-cream border-terracotta' : 'border-gray-200 text-gray-700 hover:border-terracotta/50'}`}
          >
            {pct}% · {formatINR(Math.round(subtotal * pct / 100))}
          </button>
        ))}
        <button
          onClick={() => { setTip(0, 'custom'); setCustomInput(''); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
            ${tipPreset === 'custom' ? 'bg-terracotta text-cream border-terracotta' : 'border-gray-200 text-gray-700 hover:border-terracotta/50'}`}
        >
          Custom
        </button>
      </div>
      {tipPreset === 'custom' && (
        <div className="mt-3 relative max-w-[180px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
          <input
            type="number"
            min="0"
            value={customInput}
            onChange={e => handleCustom(e.target.value)}
            placeholder="0"
            className="input-field pl-7"
          />
        </div>
      )}
      {tip > 0 && (
        <p className="text-xs text-sage mt-2">Thank you for your generosity! ✨</p>
      )}
    </div>
  );
};

// ─── Fulfillment Selector ─────────────────────────────────────────────────────
const FulfillmentSelector: React.FC = () => {
  const { fulfillment, setFulfillment } = useCartStore();

  const options: { type: FulfillmentType; icon: React.ElementType; label: string; desc: string }[] = [
    { type: 'dine-in', icon: UtensilsCrossed, label: 'Dine In', desc: 'Served to your table' },
    { type: 'takeaway', icon: TakeawayIcon, label: 'Takeaway', desc: 'Pick up at counter' },
    { type: 'curbside', icon: Car, label: 'Curbside', desc: 'We bring it out to you' },
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-espresso mb-3">Fulfillment</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map(({ type, icon: Icon, label, desc }) => (
          <button
            key={type}
            onClick={() => setFulfillment({ ...fulfillment, type })}
            className={`p-3 rounded-xl border text-center text-xs transition-all
              ${fulfillment.type === type
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-gray-200 text-gray-600 hover:border-terracotta/40'
              }`}
            aria-pressed={fulfillment.type === type}
          >
            <Icon className="w-5 h-5 mx-auto mb-1" />
            <p className="font-semibold">{label}</p>
            <p className="text-[10px] opacity-70 mt-0.5">{desc}</p>
          </button>
        ))}
      </div>
      {fulfillment.type === 'dine-in' && (
        <input
          type="text"
          placeholder="Table number (optional)"
          value={fulfillment.tableNumber ?? ''}
          onChange={e => setFulfillment({ ...fulfillment, tableNumber: e.target.value })}
          className="input-field mt-3"
        />
      )}
      {(fulfillment.type === 'takeaway' || fulfillment.type === 'curbside') && (
        <input
          type="time"
          value={fulfillment.pickupTime ?? ''}
          onChange={e => setFulfillment({ ...fulfillment, pickupTime: e.target.value })}
          className="input-field mt-3"
        />
      )}
    </div>
  );
};

// ─── Order Receipt ─────────────────────────────────────────────────────────────
const OrderReceipt: React.FC<{ orderId: string; eta: string }> = ({ orderId, eta }) => {
  const { items, financials, fulfillment } = useCartStore();
  const { subtotal, tax, serviceCharge, tip, total } = financials();
  const { placedDisplayId, placedTrackingToken } = useOrderStore();
  const navigate = useNavigate();
  const clearCart = useCartStore(s => s.clearCart);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>
        <h2 className="text-3xl font-serif text-espresso mb-1">Order Confirmed!</h2>
        <p className="text-gray-500">We're preparing your order with love.</p>
      </div>

      <div className="card p-6 space-y-4">
        {/* Order meta */}
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-400 text-xs">Order ID</p>
            <p className="font-bold text-espresso text-lg">#{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">Estimated Ready</p>
            <div className="flex items-center gap-1.5 justify-end">
              <Clock className="w-4 h-4 text-terracotta" />
              <p className="font-semibold text-espresso">{eta}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-cream-dark" />

        {/* Items */}
        <ul className="space-y-2">
          {items.map(ci => (
            <li key={ci.menuItem.id} className="flex justify-between text-sm">
              <span className="text-gray-700">{ci.quantity}× {ci.menuItem.name}</span>
              <span className="font-medium text-espresso">{formatINR(ci.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-cream-dark" />

        {/* Financials */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
          <div className="flex justify-between text-gray-500"><span>GST (5%)</span><span>{formatINR(tax)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Service charge (5%)</span><span>{formatINR(serviceCharge)}</span></div>
          {tip > 0 && <div className="flex justify-between text-gray-500"><span>Tip (Thank you! 💛)</span><span>{formatINR(tip)}</span></div>}
          <div className="flex justify-between font-bold text-espresso text-base pt-2 border-t border-cream-dark">
            <span>Total Paid</span>
            <span className="text-terracotta">{formatINR(total)}</span>
          </div>
        </div>

        {/* Fulfillment */}
        <div className="bg-cream-dark rounded-xl p-3 text-xs text-gray-600">
          <Receipt className="w-4 h-4 text-terracotta inline mr-1" />
          {fulfillment.type === 'dine-in' && `Dine-in${fulfillment.tableNumber ? ` · Table #${fulfillment.tableNumber}` : ''}`}
          {fulfillment.type === 'takeaway' && `Takeaway Pickup${fulfillment.pickupTime ? ` at ${fulfillment.pickupTime}` : ''}`}
          {fulfillment.type === 'curbside' && 'Curbside Delivery'}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {placedDisplayId && placedTrackingToken && (
          <button
            onClick={() => navigate(`/track/${placedDisplayId}?token=${placedTrackingToken}`)}
            className="btn-primary w-full justify-center"
          >
            Track Your Order →
          </button>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => { clearCart(); navigate('/menu'); }}
            className="btn-secondary flex-1 justify-center"
          >
            Order Again
          </button>
          <button
            onClick={() => { clearCart(); navigate('/'); }}
            className="btn-secondary flex-1 justify-center"
          >
            Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Checkout Page ─────────────────────────────────────────────────────────────
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, financials } = useCartStore();
  const { setStatus, orderStatus } = useOrderStore();
  const { subtotal, tax, serviceCharge, tip, total } = financials();

  const [orderId] = useState(generateOrderId());
  const [eta] = useState(getEstimatedReadyAt(15));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '', email: '', phone: '', notes: '',
  });

  const updateCustomer = (field: keyof CustomerDetails, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof CustomerDetails, string>> = {};
    if (!customer.name.trim()) errors.name = 'Name is required';
    if (!customer.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(customer.email)) errors.email = 'Enter a valid email';
    if (!customer.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\+?[\d\s\-]{8,15}$/.test(customer.phone)) errors.phone = 'Enter a valid phone number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) return;

    setStatus('processing');

    try {
      const { fulfillment, items } = useCartStore.getState();

      // Build API payload
      const payload = {
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          notes: customer.notes?.trim() || undefined,
        },
        items: items.map(ci => ({
          menuItemId: ci.menuItem.id,
          menuItemName: ci.menuItem.name,
          quantity: ci.quantity,
          unitPrice: ci.unitPrice,
          lineTotal: ci.lineTotal,
          selectedAddons: ci.selectedAddons,
        })),
        fulfillment: {
          type: fulfillment.type,
          tableNumber: fulfillment.tableNumber || undefined,
          pickupTime: fulfillment.pickupTime || undefined,
        },
        financials: {
          subtotal,
          tax,
          serviceCharge,
          tip,
          total,
        },
        paymentMethod,
        transactionId: paymentMethod === 'cash' ? undefined : `txn_${Date.now()}_mock`, // mock txn ID for non-cash
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error ?? 'Order submission failed');
      }

      const data = await res.json() as { orderId: string; displayId: string; trackingToken: string; estimatedReadyAt: string };

      // Store tracking info in orderStore
      useOrderStore.getState().setPlacedOrder(data);
      setStatus('success');

      // Navigate to tracking page after a brief delay
      setTimeout(() => {
        navigate(`/track/${data.displayId}?token=${data.trackingToken}`);
      }, 2000);

    } catch (err) {
      setStatus('failed', err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    }
  };

  const paymentMethods: { method: PaymentMethod; icon: React.ElementType; label: string }[] = [
    { method: 'card', icon: CreditCard, label: 'Card' },
    { method: 'upi', icon: Smartphone, label: 'UPI' },
    { method: 'google-pay', icon: Smartphone, label: 'Google Pay' },
    { method: 'cash', icon: Banknote, label: 'Cash' },
  ];

  if (orderStatus === 'success') {
    return (
      <>
        <Header />
        <main className="pt-20 pb-24 min-h-screen bg-cream-dark">
          <div className="container-site py-12">
            <OrderReceipt orderId={orderId} eta={eta} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-cream-dark" id="main-content">
        <div className="container-site py-10">
          <button onClick={() => navigate('/menu')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-espresso transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Continue shopping
          </button>

          <h1 className="text-3xl font-serif text-espresso mb-8">Checkout</h1>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag className="w-12 h-12 text-sage mx-auto mb-4" />
              <p className="text-lg font-semibold text-espresso">Your cart is empty</p>
              <button onClick={() => navigate('/menu')} className="btn-primary mt-4">
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
              {/* ── Left Column ──────────────────────────────────────────────── */}
              <div className="space-y-6">
                {/* Cart Items */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-espresso mb-5">
                    Order Summary <span className="text-gray-400 font-normal text-base">({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  </h2>
                  <ul className="space-y-4 divide-y divide-cream-dark">
                    <AnimatePresence>
                      {items.map(ci => (
                        <motion.li
                          key={ci.menuItem.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-4 pt-4 first:pt-0"
                        >
                          <img src={ci.menuItem.image} alt={ci.menuItem.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-espresso text-sm line-clamp-1">{ci.menuItem.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{formatINR(ci.unitPrice)} each</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5 bg-cream-dark rounded-xl px-1 py-1">
                                <button onClick={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors" aria-label="Decrease">
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-bold">{ci.quantity}</span>
                                <button onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors" aria-label="Increase">
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-espresso text-sm">{formatINR(ci.lineTotal)}</span>
                                <button onClick={() => removeItem(ci.menuItem.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors" aria-label="Remove">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                {/* Fulfillment */}
                <div className="card p-6">
                  <FulfillmentSelector />
                </div>

                {/* Tip */}
                <div className="card p-6">
                  <TipSelector />
                </div>

                {/* Billing Details */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-espresso mb-5">Your Details</h2>
                  <div className="space-y-4">
                    {[
                      { field: 'name' as const, label: 'Full Name', placeholder: 'Ananya Krishnan', type: 'text' },
                      { field: 'email' as const, label: 'Email Address', placeholder: 'you@example.com', type: 'email' },
                      { field: 'phone' as const, label: 'Phone Number', placeholder: '+91 98765 43210', type: 'tel' },
                    ].map(({ field, label, placeholder, type }) => (
                      <div key={field}>
                        <label htmlFor={field} className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
                        <input
                          id={field}
                          type={type}
                          value={customer[field]}
                          onChange={e => updateCustomer(field, e.target.value)}
                          placeholder={placeholder}
                          className={`input-field ${formErrors[field] ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                          aria-describedby={formErrors[field] ? `${field}-error` : undefined}
                        />
                        {formErrors[field] && (
                          <p id={`${field}-error`} className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {formErrors[field]}
                          </p>
                        )}
                      </div>
                    ))}
                    <div>
                      <label htmlFor="notes" className="block text-xs font-semibold text-gray-700 mb-1.5">Kitchen Notes <span className="font-normal text-gray-400">(optional)</span></label>
                      <textarea
                        id="notes"
                        value={customer.notes}
                        onChange={e => updateCustomer('notes', e.target.value)}
                        rows={3}
                        placeholder="Allergies, special requests, etc."
                        className="input-field resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right Column (sticky) ─────────────────────────────────────── */}
              <div className="space-y-5">
                {/* Payment Card */}
                <div className="card p-6 sticky top-28">
                  {/* Payment Method */}
                  <h2 className="text-xl font-semibold text-espresso mb-4">Payment</h2>
                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {paymentMethods.map(({ method, icon: Icon, label }) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-xl border text-xs text-center transition-all flex flex-col items-center gap-1
                          ${paymentMethod === method
                            ? 'border-terracotta bg-terracotta/10 text-terracotta'
                            : 'border-gray-200 text-gray-500 hover:border-terracotta/40'
                          }`}
                        aria-pressed={paymentMethod === method}
                      >
                        <Icon className="w-5 h-5" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Card mock UI */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3 mb-5">
                      <div className="bg-gradient-to-br from-espresso to-espresso-light rounded-xl p-5 text-cream">
                        <p className="text-xs opacity-50 mb-4">Secure Card Payment · Razorpay</p>
                        <div className="font-mono text-base tracking-widest mb-4">•••• •••• •••• 4242</div>
                        <div className="flex justify-between text-xs opacity-70">
                          <span>CARD HOLDER</span><span>EXPIRES</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold mt-1">
                          <span>{customer.name || 'YOUR NAME'}</span><span>MM/YY</span>
                        </div>
                      </div>
                      <input type="text" placeholder="Card number" maxLength={19} className="input-field font-mono" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM / YY" maxLength={7} className="input-field" />
                        <input type="text" placeholder="CVV" maxLength={4} className="input-field" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="mb-5">
                      <input type="text" placeholder="yourname@upi" className="input-field" />
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                      Pay in cash when your order is ready. We'll send a pickup notification.
                    </div>
                  )}

                  {/* Order total */}
                  <div className="space-y-2 text-sm border-t border-cream-dark pt-4 mb-4">
                    <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
                    <div className="flex justify-between text-gray-500"><span>GST (5%)</span><span>{formatINR(tax)}</span></div>
                    <div className="flex justify-between text-gray-500"><span>Service charge (5%)</span><span>{formatINR(serviceCharge)}</span></div>
                    {tip > 0 && <div className="flex justify-between text-gray-500"><span>Tip</span><span>{formatINR(tip)}</span></div>}
                    <div className="flex justify-between font-bold text-espresso text-base pt-2 border-t border-cream-dark">
                      <span>Total Due</span>
                      <span className="text-terracotta">{formatINR(total)}</span>
                    </div>
                  </div>

                  {/* Failed state */}
                  <AnimatePresence>
                    {orderStatus === 'failed' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex gap-2 mb-4"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Payment failed</p>
                          <p className="text-xs mt-0.5 text-red-600">Payment was declined. Please try another method.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pay button */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePayment}
                    disabled={orderStatus === 'processing'}
                    className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {orderStatus === 'processing' ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                    ) : (
                      <><Lock className="w-4 h-4" /> Pay {formatINR(total)}</>
                    )}
                  </motion.button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <Shield className="w-3.5 h-3.5 text-green-500" /> 256-bit SSL
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <Lock className="w-3.5 h-3.5 text-green-500" /> PCI-DSS Compliant
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Razorpay Secured
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;
