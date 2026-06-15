'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, CreditCard, Landmark, Smartphone, ChevronRight, Wallet } from 'lucide-react';
import { BackButton } from '../../../components/BackButton';

const initialCards = [
  { id: '1', name: 'Uzcard', icon: CreditCard, color: 'from-blue-600 to-blue-400' },
  { id: '2', name: 'Humo', icon: CreditCard, color: 'from-orange-600 to-orange-400' },
];

export default function DepositPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Amount, 2: Method
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleNext = () => {
    if (step === 1 && amount) setStep(2);
    else if (step === 2 && selectedMethod) {
      router.push(`/wallet/payment?amount=${amount}&card=${selectedMethod}`);
    }
  };

  return (
    <main className="min-h-screen animate-fade-in p-5 pb-32 max-w-md mx-auto space-y-8">
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

      {/* Progress Dots */}
      <div className="flex justify-center space-x-2">
        <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`} />
        <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`} />
      </div>

      {step === 1 ? (
        <section className="space-y-8">
          <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <p className="text-center text-muted text-[10px] font-bold uppercase tracking-widest mb-6">To'lov summasini kiriting</p>
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  placeholder="0"
                  min="0"
                  className="bg-transparent text-center text-5xl font-black outline-none placeholder:text-white/5 w-full"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (Number(val) < 0) return;
                    setAmount(val);
                  }}
                  autoFocus
                />
                <span className="text-primary text-xl font-bold mt-2">UZS</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-8 w-full">
                {['50000', '100000', '200000', '500000'].map((val) => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className="h-12 rounded-2xl glass text-xs font-bold border-white/5 active:scale-95 transition-all"
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
            {initialCards.map((method) => (
              <motion.div
                key={method.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod(method.id)}
                className={`relative p-5 rounded-[2rem] border transition-all cursor-pointer overflow-hidden group ${
                  selectedMethod === method.id ? 'border-primary shadow-gold bg-primary/5' : 'bg-card border-border hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white shadow-lg`}>
                      <method.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{method.name}</h4>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Manual Card</p>
                    </div>
                  </div>
                  {selectedMethod === method.id ? (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-bg">
                      <Check size={14} strokeWidth={4} />
                    </div>
                  ) : (
                    <ChevronRight size={18} className="text-muted/30" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Action Button */}
      <div className="fixed bottom-28 left-0 right-0 px-6 z-40 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={handleNext}
            disabled={step === 1 ? !amount : !selectedMethod}
            className={`w-full h-16 rounded-[2rem] font-bold text-lg shadow-premium transition-all duration-300 ${
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
