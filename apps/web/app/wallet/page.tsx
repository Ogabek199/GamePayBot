'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from '../../stores/useTranslation';
import { Plus, History, Gift, CreditCard, ChevronRight, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { BackButton } from '../../components/BackButton';

export default function WalletPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const transactions = [
    { id: '1', type: 'deposit', amount: '+ 50 000', status: 'completed', date: 'Bugun, 12:45', method: 'Uzcard' },
    { id: '2', type: 'order', amount: '- 12 000', status: 'completed', date: 'Kecha, 18:20', method: 'PUBG UC' },
  ];

  return (
    <main className="min-h-screen animate-fade-in p-5 pb-32 max-w-md mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-2xl font-bold">{t('common.wallet')}</h1>
        <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <Gift size={20} className="text-primary" />
        </div>
      </header>

      {/* Main Balance Card */}
      <section className="bg-premium-card rounded-[2.5rem] p-8 border border-white/5 shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-2">
          <p className="text-muted text-sm font-medium uppercase tracking-widest">{t('wallet.total_balance')}</p>
          <h2 className="text-5xl font-black tracking-tighter">0 <span className="text-primary text-2xl">{t('common.uzs')}</span></h2>
          
          <div className="flex space-x-3 mt-8 w-full">
            <button 
              onClick={() => router.push('/wallet/deposit')}
              className="flex-1 btn-gold h-14 space-x-2"
            >
              <Plus size={20} strokeWidth={3} />
              <span>{t('common.topup')}</span>
            </button>
            <button className="flex-1 h-14 glass rounded-xl font-bold text-sm border-white/10 active:scale-95 transition-all">
              {t('common.withdraw')}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { icon: Gift, label: t('wallet.promo'), color: 'text-primary', onClick: () => alert('Yaqinda...') },
          { icon: CreditCard, label: t('wallet.cards'), color: 'text-blue-400', onClick: () => alert('Yaqinda...') },
          { icon: History, label: t('common.history'), color: 'text-success', onClick: () => router.push('/history') },
        ].map((item, i) => (
          <button key={i} onClick={item.onClick} className="glass-card p-4 flex flex-col items-center space-y-2 active:scale-95 transition-all">
            <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
              <item.icon size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted">{item.label}</span>
          </button>
        ))}
      </section>

      {/* Transaction History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold">{t('wallet.recent_txs')}</h3>
          <button onClick={() => router.push('/history')} className="text-xs font-bold text-primary">{t('home.see_all')}</button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="glass-card p-4 flex items-center justify-between premium-border">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'deposit' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}>
                  {tx.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{tx.method}</h4>
                  <p className="text-[10px] text-muted font-medium">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.type === 'deposit' ? 'text-success' : 'text-white'}`}>
                  {tx.amount} {t('common.uzs')}
                </p>
                <p className="text-[8px] font-bold uppercase text-muted tracking-widest">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
