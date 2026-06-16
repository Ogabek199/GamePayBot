'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Clock, Copy, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackButton } from '../../../components/BackButton';

import { fetchPaymentCards, createDeposit, loginWithTelegram } from '../../../services/api';
import { useAuthStore } from '../../../stores/useAuthStore';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '0';
  const cardType = searchParams.get('card') || '1';
  const { token, setAuth } = useAuthStore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300);
  const [copied, setCopied] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadCardData = async () => {
    setIsLoadingCard(true);
    setErrorMsg(null);
    try {
      const cards = await fetchPaymentCards();
      const found = cards.find((c: any) => c.id === cardType);
      if (found) {
        setCardData(found);
      } else {
        setCardData(null);
        setErrorMsg("To'lov kartasi topilmadi");
      }
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.message || "Karta ma'lumotlarini yuklashda xatolik yuz berdi";
      setErrorMsg(Array.isArray(apiMessage) ? apiMessage[0] : apiMessage);
      // eslint-disable-next-line no-console
      console.error('Fetch card error:', err);
    } finally {
      setIsLoadingCard(false);
    }
  };

  useEffect(() => {
    loadCardData();
  }, [cardType]);

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
    if (isAuthenticating) return;
    let currentToken = token;
    
    // Check if token exists in session storage directly as a fallback
    if (!currentToken) {
        const storedAuth = sessionStorage.getItem('gp_auth_storage');
        if (storedAuth) {
            currentToken = JSON.parse(storedAuth).state.token;
        }
    }

    if (!currentToken) {
        setIsAuthenticating(true);
        console.log('DEBUG: Token missing, attempting re-auth via Telegram...');
        const initData = window.Telegram?.WebApp?.initData;
        if (!initData) {
            setErrorMsg("Siz avtorizatsiyadan o'tmagansiz. Iltimos, Telegram orqali qaytadan kiring.");
            setIsAuthenticating(false);
            return;
        }
        try {
            const { token: newToken, user } = await loginWithTelegram(initData);
            setAuth(newToken, user);
            currentToken = newToken;
            console.log('DEBUG: Re-auth successful.');
        } catch (err) {
            console.error('Re-auth failed:', err);
            setErrorMsg("Avtorizatsiyadan o'tishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
            setIsAuthenticating(false);
            return;
        } finally {
            setIsAuthenticating(false);
        }
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await createDeposit(Number(amount), cardType);
      setSuccessMsg("To'lov so'rovi qabul qilindi. Admin tomonidan tekshirilmoqda.");
      setTimeout(() => {
        router.push('/history');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      const apiMessage = err.response?.data?.message || err.message || "Xatolik yuz berdi";
      setErrorMsg(Array.isArray(apiMessage) ? apiMessage[0] : apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCard) {
    return (
      <main className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin animate-fade-in"></div>
        <p className="text-muted text-sm">Karta ma'lumotlari yuklanmoqda...</p>
      </main>
    );
  }

  if (errorMsg && !cardData) {
    return (
      <main className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4">
        <BackButton />
        <p className="text-danger font-bold text-center text-sm">{errorMsg}</p>
        <button
          onClick={loadCardData}
          className="mt-3 px-4 py-2 rounded-full bg-primary text-white font-bold hover:opacity-90 transition"
        >
          Qayta urinib ko'rish
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-6 flex flex-col">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-bold">To'lov ma'lumotlari</h1>
        <div className="w-10 h-10" />
      </header>

      {/* Timer Section */}
      <section className="flex flex-col items-center justify-center space-y-3 py-4 md:py-6">
        <p className="text-xs text-muted font-bold uppercase tracking-widest">Vaqti qolgan</p>
        <div className={`flex items-center space-x-3 px-6 py-3 rounded-full glass border-white/10 transition-all ${timeLeft < 60 ? 'text-danger animate-pulse shadow-[0_0_16px_rgba(255,71,87,0.3)]' : 'text-primary'}`}>
          <Clock size={20} />
          <span className="font-mono text-2xl md:text-3xl font-black tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      </section>

      {/* Amount Card */}
      <section className="bg-premium-card rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-white/5 shadow-premium text-center space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-50"></div>
        <div className="relative z-10 space-y-4">
          <p className="text-muted text-[10px] font-bold uppercase tracking-widest">To'lov summasi</p>
          <div className="flex items-center justify-center space-x-1 md:space-x-3 flex-wrap gap-1">
            <h2 className="text-3xl md:text-5xl font-black leading-none">{Number(amount).toLocaleString()}</h2>
            <span className="text-primary font-bold text-base md:text-2xl">UZS</span>
          </div>
          <button 
            onClick={() => copyToClipboard(amount, 'Summa')}
            className="mt-3 flex items-center space-x-2 mx-auto text-[10px] font-bold text-primary/80 hover:text-primary transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 hover:border-primary/30"
          >
            <Copy size={14} />
            <span>NUSXALASH</span>
          </button>
        </div>
      </section>

      {/* Error and Success Alert boxes */}
      {errorMsg && (
        <section className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex items-start space-x-3">
          <AlertTriangle className="text-danger flex-shrink-0 animate-bounce" size={20} />
          <p className="text-[11px] text-danger-foreground font-medium leading-relaxed">
            <span className="font-bold uppercase tracking-tighter">Xatolik:</span> {errorMsg}
          </p>
        </section>
      )}

      {successMsg && (
        <section className="bg-success/10 border border-success/20 rounded-2xl p-4 flex items-start space-x-3 animate-pulse">
          <CheckCircle2 className="text-success flex-shrink-0" size={20} />
          <p className="text-[11px] text-success-foreground font-medium leading-relaxed">
            <span className="font-bold uppercase tracking-tighter">Muvaffaqiyatli:</span> {successMsg}
          </p>
        </section>
      )}

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
            { label: 'Karta raqami', value: cardData?.cardNumber || '', id: 'card' },
            { label: 'Karta egasi', value: cardData?.cardHolder || '', id: 'holder' },
            { label: 'Bank nomi', value: cardData?.bankName || '', id: 'bank' },
          ].map((item) => (
            <div key={item.id} className="glass-card p-4 md:p-5 flex items-center justify-between premium-border group hover:bg-white/10 transition-colors">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-[9px] text-muted font-bold uppercase tracking-tighter">{item.label}</p>
                <p className="text-sm md:text-base font-bold tracking-wider truncate">{item.value}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(item.value, item.label)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted group-hover:text-primary transition-colors border border-white/5 flex-shrink-0 ml-2"
              >
                <Copy size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Action Button */}
      <div className="fixed bottom-24 md:bottom-4 left-0 right-0 px-4 md:px-6 z-30 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <button
            onClick={handlePaid}
            disabled={isSubmitting || !!successMsg}
            className={`w-full h-14 md:h-16 rounded-[2rem] bg-success text-white font-bold text-lg shadow-[0_8px_32px_rgba(0,200,83,0.3)] flex items-center justify-center space-x-3 active:scale-95 transition-all ${isSubmitting || successMsg ? 'opacity-70 cursor-not-allowed' : ''}`}
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

      {copied && (
        <div 
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-success text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center space-x-2 transition-all duration-300 animate-fade-in"
        >
          <CheckCircle2 size={18} />
          <span>{copied} nusxalandi</span>
        </div>
      )}
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
