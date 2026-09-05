import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#370A00]/45 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative w-full ${maxWidth} max-h-[92vh] flex flex-col bg-[#FFF7ED] border-2 border-[#FFD6A7] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10`}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#FFD6A7] shrink-0 bg-[#FEECD3]">
              <div className="pr-3">
                {title && <h3 className="text-base sm:text-lg font-black text-[#370A00] tracking-tight">{title}</h3>}
                {description && <p className="text-xs text-[#7C2808] mt-0.5 font-medium">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#7C2808] hover:text-[#370A00] hover:bg-[#FFF7ED] border border-transparent hover:border-[#FFD6A7] transition-all shrink-0"
                aria-label="Close modal"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto bg-[#FFF7ED] text-[#370A00]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

