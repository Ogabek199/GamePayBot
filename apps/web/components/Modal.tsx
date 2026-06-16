'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <>
          <div 
            onClick={onClose} 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] animate-fade-in"
          />
          <div className="fixed inset-x-0 bottom-0 z-[10000] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md animate-slide-up">
            <div className="bg-card w-full rounded-t-[2rem] md:rounded-[2rem] p-6 space-y-4 premium-border border border-white/10 shadow-2xl md:max-h-[80vh] flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">{title}</h3>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-muted hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="text-muted text-sm leading-relaxed overflow-y-auto">
                {children}
              </div>
              <button 
                onClick={onClose}
                className="w-full h-12 bg-primary/10 text-primary font-bold rounded-xl active:scale-95 transition-all mt-auto"
              >
                Tushunarli
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
