'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg text-white">
      <div className="text-center max-w-md w-full glass-card p-8">
        <h2 className="text-2xl font-black mb-4 text-primary">Xatolik yuz berdi</h2>
        <p className="text-muted mb-8 text-sm leading-relaxed">
          {typeof error?.message === 'string' ? error.message : 'Noma\'lum xatolik yuz berdi'}
        </p>
        <button
          onClick={reset}
          className="w-full h-12 bg-gold-gradient text-bg rounded-xl font-bold active:scale-95 transition-all shadow-gold"
        >
          Qayta urinib ko'rish
        </button>
      </div>
    </div>
  );
}
