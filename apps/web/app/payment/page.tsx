'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Clock, Copy, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen animate-fade-in p-5 pb-32 max-w-md mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">To'lovni yakunlash</h1>
        <div className="w-10 h-10" />
      </header>

      {/* Timer Section */}
      <section className="flex flex-col items-center justify-center space-y-2 py-4">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full glass border-white/10 ${timeLeft < 60 ? 'text-danger animate-pulse' : 'text-primary'}`}>
          <Clock size={18} />
          <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
        </div>
        <p className="text-[10px] text-muted font-bold uppercase tracking-widest">To'lov uchun qolgan vaqt</p>
      </section>

      {/* Amount Card */}
      <section className="bg-premium-card rounded-[2rem] p-8 border border-white/5 shadow-premium text-center space-y-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-50"></div>
        <div className="relative z-10">
          <p className="text-muted text-xs font-bold uppercase tracking-widest">To'lov summasi</p>
          <div className="flex items-center justify-center space-x-2">
            <h2 className="text-4xl font-black">51 000</h2>
            <span className="text-primary font-bold">UZS</span>
          </div>
          <button 
            onClick={() => copyToClipboard('51000', 'Summa')}
            className="mt-4 flex items-center space-x-2 mx-auto text-[10px] font-bold text-primary/80 hover:text-primary transition-colors bg-white/5 px-3 py-1 rounded-full border border-white/5"
          >
            <Copy size={12} />
            <span>SUMMANI NUSXALASH</span>
          </button>
        </div>
      </section>

      {/* Warning Card */}
      <section className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex items-start space-x-3">
        <AlertTriangle className="text-danger flex-shrink-0" size={20} />
        <p className="text-[11px] text-danger-foreground font-medium leading-relaxed">
          <span className="font-bold">DIQQAT:</span> Iltimos, aynan ko'rsatilgan summani yuboring. Aks holda to'lov avtomatik tasdiqlanmasligi mumkin.
        </p>
      </section>

      {/* Payment Details */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-muted uppercase ml-2 tracking-widest">Karta ma'lumotlari</h3>
        
        <div className="space-y-3">
          {[
            { label: 'Karta raqami', value: '8600 1234 5678 9012', id: 'card' },
            { label: 'Karta egasi', value: 'ABDUVOKHIDOV A.', id: 'holder' },
            { label: 'Bank nomi', value: 'TBC BANK', id: 'bank' },
          ].map((item) => (
            <div key={item.id} className="glass-card p-5 flex items-center justify-between premium-border group hover:bg-white/10 transition-colors">
              <div className="space-y-1">
                <p className="text-[9px] text-muted font-bold uppercase tracking-tighter">{item.label}</p>
                <p className="text-sm font-bold tracking-wider">{item.value}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(item.value, item.label)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted group-hover:text-primary transition-colors border border-white/5"
              >
                <Copy size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badge */}
      <section className="flex items-center justify-center space-x-2 text-muted">
        <ShieldCheck size={16} className="text-success" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Xavfsiz va kafolatlangan to'lov</span>
      </section>

      {/* Action Button */}
      <div className="fixed bottom-28 left-0 right-0 px-6 z-40 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            className="w-full h-16 rounded-[2rem] bg-success text-white font-bold text-lg shadow-[0_8px_32px_rgba(0,200,83,0.3)] flex items-center justify-center space-x-3 active:scale-95 transition-all"
          >
            <CheckCircle2 size={22} />
            <span>Men to'ladim</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-success text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center space-x-2"
          >
            <CheckCircle2 size={18} />
            <span>{copied} nusxalandi</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
