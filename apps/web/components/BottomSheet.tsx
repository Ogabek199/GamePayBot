'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
          />
          <div
            className="fixed bottom-0 left-0 right-0 glass rounded-t-[3xl] z-[101] max-w-md mx-auto p-6 space-y-6 premium-border animate-slide-up"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{title}</h3>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="pb-16 max-h-[70vh] overflow-y-auto hide-scrollbar">
              {children}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
