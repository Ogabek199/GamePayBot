'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, CreditCard, ChevronRight } from 'lucide-react';
import { BackButton } from '../../../components/BackButton';
import toast from 'react-hot-toast';
import { fetchPaymentCards } from '../../../services/api';

export default function DepositPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  React.useEffect(() => {
    if (step === 2) {
      setIsLoadingCards(true);
      setFetchError(null);
      fetchPaymentCards()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setCards(data);
            setSelectedMethod(data[0].id);
          } else {
            setFetchError("Hozircha to'lov kartalari mavjud emas");
          }
        })
        .catch((err) => {
          console.error('Error fetching cards:', err);
          const errorMsg = err?.response?.data?.message || err?.message || "Noma'lum xatolik";
          setFetchError(`Xatolik: ${errorMsg}`);
          toast.error(`Karta yuklanishida xatolik: ${errorMsg}`);
        })
        .finally(() => {
          setIsLoadingCards(false);
        });
    }
  }, [step]);

  const handleNext = () => {
    if (step === 1) {
      if (!amount || Number(amount) <= 0) {
        toast.error('Iltimos, to\'lov summasini kiriting');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedMethod) {
        toast.error('Iltimos, to\'lov usulini tanlang');
        return;
      }
      router.push(`/wallet/payment?amount=${amount}&card=${selectedMethod}`);
    }
  };

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => step === 1 ? router.back() : setStep(1)} 
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Hisobni to'ldirish</h1>
        <div className="w-10 h-10" />
      </header>

      {/* Progress */}
      <div className="flex justify-center space-x-2">
        <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`} />
        <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`} />
      </div>

      {step === 1 ? (
        <section className="space-y-8">
          <div className="bg-card rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 border border-border shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <p className="text-center text-muted text-[10px] font-bold uppercase tracking-widest mb-6">To'lov summasini kiriting</p>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center space-x-2 justify-center flex-wrap">
                <input 
                  type="number" 
                  placeholder="0"
                  min="0"
                  className="bg-transparent text-center text-4xl md:text-5xl font-black outline-none placeholder:text-white/5 no-spinner"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
                <span className="text-primary text-xl md:text-2xl font-bold">UZS</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-8 w-full">
                {['50000', '100000', '200000', '500000'].map((val) => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className="h-10 md:h-12 rounded-2xl glass text-xs font-bold border-white/5 active:scale-95 transition-all"
                  >
                    +{Number(val).toLocaleString()} UZS
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="px-1">
            <h3 className="text-sm font-bold text-muted uppercase tracking-widest">To'lov usulini tanlang</h3>
          </div>
          <div className="space-y-3">
            {isLoadingCards ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                <p className="text-muted text-sm mt-3">Karta turlari yuklanmoqda...</p>
              </div>
            ) : fetchError ? (
              <div className="text-center py-8 bg-danger/10 rounded-2xl border border-danger/20 p-4">
                <p className="text-danger font-bold text-sm">{fetchError}</p>
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-8 bg-danger/10 rounded-2xl border border-danger/20 p-4">
                <p className="text-danger font-bold text-sm">Hozircha to'lov kartalari mavjud emas</p>
              </div>
            ) : (
              cards.map((card) => {
                const isHumoCard = card.cardNumber?.replace(/\s/g, '')?.startsWith('9860');
                const cardTypeName = isHumoCard ? 'Humo' : 'Uzcard';
                const cardColor = isHumoCard ? 'from-orange-600 to-orange-400' : 'from-blue-600 to-blue-400';
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedMethod(card.id)}
                    className={`relative p-5 rounded-[2rem] border transition-all duration-200 cursor-pointer overflow-hidden group active:scale-98 ${
                      selectedMethod === card.id ? 'border-primary shadow-gold bg-primary/5' : 'bg-card border-border hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cardColor} flex items-center justify-center text-white shadow-lg`}>
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{cardTypeName} ({card.bankName})</h4>
                          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{card.cardHolder}</p>
                        </div>
                      </div>
                      {selectedMethod === card.id ? (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-bg">
                          <Check size={14} strokeWidth={4} />
                        </div>
                      ) : (
                        <ChevronRight size={18} className="text-muted/30" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Action Button - Fixed at bottom */}
      <div className="fixed bottom-24 md:bottom-4 left-0 right-0 px-4 md:px-6 z-30 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <button
            onClick={handleNext}
            disabled={step === 1 ? !amount : !selectedMethod}
            className={`w-full h-14 md:h-16 rounded-[2rem] font-bold text-lg shadow-premium transition-all duration-300 ${
              (step === 1 ? amount : selectedMethod) 
              ? 'bg-gold-gradient text-bg shadow-gold scale-100' 
              : 'bg-card text-muted opacity-50 cursor-not-allowed scale-95'
            }`}
          >
            {step === 1 ? 'Davom etish' : 'To\'lovga o\'tish'}
          </button>
        </div>
      </div>
    </main>
  );
}

