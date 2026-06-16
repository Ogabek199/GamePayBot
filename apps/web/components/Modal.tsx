'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
      />
      <div className="relative z-[100000] w-full max-w-md bg-card rounded-[2rem] p-6 space-y-4 premium-border border border-white/10 shadow-2xl max-h-[85vh] flex flex-col animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-muted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="text-muted text-sm leading-relaxed overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
