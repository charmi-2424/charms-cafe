import { motion } from 'framer-motion';
import { X, Bell } from 'lucide-react';

interface OrderReadyModalProps {
  displayId: string;
  customerName: string;
  onClose: () => void;
}

/** Animated modal shown when an order status changes to "ready". */
export function OrderReadyModal({ displayId, customerName, onClose }: OrderReadyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-espresso/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        className="relative bg-cream rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full"
        initial={{ opacity: 0, scale: 0.85, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-espresso/50 hover:text-espresso transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <motion.div
          className="mx-auto mb-4 size-16 rounded-full bg-terracotta/15 flex items-center justify-center"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Bell size={32} className="text-terracotta" />
        </motion.div>

        <h2 className="font-playfair text-2xl font-bold text-espresso mb-2">
          🎉 Order Ready!
        </h2>
        <p className="text-espresso/70 mb-1">
          <span className="font-semibold text-terracotta">#{displayId}</span> is ready for pickup.
        </p>
        <p className="text-sm text-espresso/60 mb-6">{customerName}</p>

        <button
          onClick={onClose}
          className="btn-primary w-full"
        >
          Got it!
        </button>
      </motion.div>
    </div>
  );
}
