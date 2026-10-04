import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { formatINR } from '../../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, financials } = useCartStore();
  const navigate = useNavigate();
  const { subtotal, total } = financials();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-cream z-50 flex flex-col shadow-2xl"
            aria-label="Shopping cart"
            role="dialog"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-dark">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-terracotta" />
                <h2 className="text-xl font-bold text-espresso">Your Order</h2>
                {items.length > 0 && (
                  <span className="badge bg-terracotta text-cream">{items.reduce((s, i) => s + i.quantity, 0)}</span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cream-dark transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center">
                    <ShoppingBag className="w-9 h-9 text-sage" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-espresso">Your cart is empty</p>
                    <p className="text-sm text-gray-500 mt-1">Add some delicious items from our menu</p>
                  </div>
                  <button onClick={onClose} className="btn-secondary text-sm px-5 py-2.5">
                    Explore Menu
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map(ci => (
                      <motion.li
                        key={ci.menuItem.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4 pb-4 border-b border-cream-dark last:border-0"
                      >
                        <img
                          src={ci.menuItem.image}
                          alt={ci.menuItem.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-espresso text-sm leading-tight line-clamp-1">
                            {ci.menuItem.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{formatINR(ci.unitPrice)} each</p>
                          {ci.selectedAddons && Object.keys(ci.selectedAddons).length > 0 && (
                            <p className="text-xs text-sage mt-0.5">
                              {Object.entries(ci.selectedAddons).map(([, v]) => v).join(', ')}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 bg-cream-dark rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">{ci.quantity}</span>
                              <button
                                onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-espresso">{formatINR(ci.lineTotal)}</span>
                              <button
                                onClick={() => removeItem(ci.menuItem.id)}
                                className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-cream-dark bg-white">
                <div className="flex justify-between mb-1 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Taxes & service charge calculated at checkout</p>
                <div className="flex justify-between mb-4 font-bold text-espresso">
                  <span>Estimated Total</span>
                  <span className="text-terracotta">{formatINR(total)}</span>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full justify-center">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
