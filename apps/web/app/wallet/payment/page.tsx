'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Clock, Copy, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackButton } from '../../../components/BackButton';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '0';
  const cardType = searchParams.get('card') || '1';

  const [timeLeft, setTimeLeft] = useState(300);
  const [copied, setCopied] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handlePaid = async () => {
    setIsSubmitting(true);
    try {
      // API CALL Simulation
      // await api.post('/deposits', { amount, cardId: cardType });
      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/history');
      }, 1500);
    } catch (e) {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen animate-fade-in p-5 pb-48 max-w-md mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-bold">To'lov ma'lumotlari</h1>
        <div className="w-10 h-10" />
      </header>

      {/* Timer Section */}
      <section className="flex flex-col items-center justify-center space-y-2 py-2">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full glass border-white/10 ${timeLeft < 60 ? 'text-danger animate-pulse' : 'text-primary'}`}>
          <Clock size={18} />
          <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
        </div>
      </section>

      {/* Amount Card */}
      <section className="bg-premium-card rounded-[2rem] p-8 border border-white/5 shadow-premium text-center space-y-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-50"></div>
        <div className="relative z-10">
          <p className="text-muted text-[10px] font-bold uppercase tracking-widest">To'lov summasi</p>
          <div className="flex items-center justify-center space-x-2">
            <h2 className="text-4xl font-black">{Number(amount).toLocaleString()}</h2>
            <span className="text-primary font-bold">UZS</span>
          </div>
          <button 
            onClick={() => copyToClipboard(amount, 'Summa')}
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
          <span className="font-bold uppercase tracking-tighter">Muhim:</span> Iltimos, aynan ko'rsatilgan summani yuboring. Aks holda to'lov tasdiqlanmasligi mumkin.
        </p>
      </section>

      {/* Payment Details */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-muted uppercase ml-2 tracking-widest">Karta ma'lumotlari</h3>
        
        <div className="space-y-3">
          {[
            { label: 'Karta raqami', value: '8600 1234 5678 9012', id: 'card' },
            { label: 'Karta egasi', value: 'OGABEK O.', id: 'holder' },
            { label: 'Bank nomi', value: 'AGROBANK', id: 'bank' },
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

      {/* Action Button */}
      <div className="fixed bottom-28 left-0 right-0 px-6 z-40 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={handlePaid}
            disabled={isSubmitting}
            className={`w-full h-16 rounded-[2rem] bg-success text-white font-bold text-lg shadow-[0_8px_32px_rgba(0,200,83,0.3)] flex items-center justify-center space-x-3 active:scale-95 transition-all ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle2 size={22} />
                <span>Men to'ladim</span>
              </>
            )}
          </button>
        </div>
      </div>

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

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary font-bold">Yuklanmoqda...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
