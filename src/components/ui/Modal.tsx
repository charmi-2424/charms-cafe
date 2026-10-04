import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, children, maxWidth = 'max-w-lg'
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-espresso/50 backdrop-blur-sm z-50"
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full ${maxWidth}
                      bg-cream rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}
        >
          {title && (
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-cream-dark">
              <h2 id="modal-title" className="text-xl font-bold text-espresso">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-espresso hover:bg-cream-dark transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className={title ? 'p-6' : 'p-6'}>{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
