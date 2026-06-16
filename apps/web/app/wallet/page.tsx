'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from '../../stores/useTranslation';
import { Plus, History, Gift, CreditCard, ChevronRight, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { Modal } from '../../components/Modal';
import { fetchMyWallet, fetchMyTransactions } from '../../services/api';

import { toast } from 'react-hot-toast';

export default function WalletPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isCardsOpen, setIsCardsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    Promise.all([
      fetchMyWallet().catch((err) => {
        console.error('Fetch wallet error:', err);
        return { balance: 0 };
      }),
      fetchMyTransactions().catch((err) => {
        console.error('Fetch transactions error:', err);
        return [];
      }),
    ])
      .then(([walletData, txsData]) => {
        setBalance(Number(walletData?.balance || 0));
        setTransactions(txsData.slice(0, 5)); // Show 5 most recent
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);


  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-2xl font-bold">{t('common.wallet')}</h1>
        <button onClick={() => setIsPromoOpen(true)} className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary active:scale-95 transition-all">
          <Gift size={20} />
        </button>
      </header>

      {/* Main Balance Card */}
      <section className="bg-premium-card rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 border border-white/5 shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <p className="text-muted text-sm font-medium uppercase tracking-widest">{t('wallet.total_balance')}</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter flex flex-wrap justify-center gap-2">
            <span>{balance.toLocaleString('ru-RU')}</span> 
            <span className="text-primary text-xl md:text-2xl">{t('common.uzs')}</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
            <button 
              onClick={() => router.push('/wallet/deposit')}
              className="flex-1 btn-gold h-14 md:h-16 flex items-center justify-center space-x-2 text-base"
            >
              <Plus size={20} strokeWidth={3} />
              <span>{t('common.topup')}</span>
            </button>
            <button 
              onClick={() => setIsWithdrawOpen(true)}
              className="flex-1 h-14 py-2.5 md:h-16 glass rounded-xl font-bold text-base border-white/10 active:scale-95 transition-all"
            >
              {t('common.withdraw')}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {[
          { icon: Gift, label: t('wallet.promo'), color: 'text-primary', onClick: () => setIsPromoOpen(true) },
          { icon: CreditCard, label: t('wallet.cards'), color: 'text-blue-400', onClick: () => setIsCardsOpen(true) },
          { icon: History, label: t('common.history'), color: 'text-success', onClick: () => router.push('/history') },
        ].map((item, i) => (
          <button key={i} onClick={item.onClick} className="glass-card p-4 flex flex-col items-center space-y-2 active:scale-95 transition-all h-full">
            <div className={`p-3 rounded-xl bg-white/5 ${item.color}`}>
              <item.icon size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-tight text-muted text-center line-clamp-2">{item.label}</span>
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
          {loading ? (
            <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-primary" size={24}/></div>
          ) : transactions.length > 0 ? transactions.map((tx) => {
            const isDeposit = tx.type === 'deposit';
            const isRefund = tx.type === 'refund';

            let icon = ArrowUpRight;
            let iconClass = 'bg-danger/10 text-danger';
            let amountClass = 'text-white';
            let title = t('tx_types.order_payment');
            let sign = '-';

            if (isDeposit) {
              icon = ArrowDownLeft;
              iconClass = 'bg-success/10 text-success';
              amountClass = 'text-success';
              title = t('tx_types.deposit');
              sign = '+';
            } else if (isRefund) {
              icon = ArrowDownLeft;
              iconClass = 'bg-blue-500/10 text-blue-500';
              amountClass = 'text-blue-500';
              title = t('tx_types.refund');
              sign = '+';
            }

            const IconComponent = icon;

            return (
              <div key={tx.id} className="glass-card p-4 flex items-center justify-between premium-border">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconClass}`}>
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{title}</h4>
                    <p className="text-[10px] text-muted font-medium">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${amountClass}`}>
                    {sign}{Number(tx.amount).toLocaleString('ru-RU')} {t('common.uzs')}
                  </p>
                  <p className={`text-[8px] font-bold uppercase tracking-widest ${
                    tx.status === 'success' || tx.status === 'completed' ? 'text-success' : tx.status === 'pending' ? 'text-amber-500' : 'text-danger'
                  }`}>{tx.status}</p>
                </div>
              </div>
            );
          }) : (
             <p className="text-center text-muted text-sm py-4">{t('tx_types.no_txs')}</p>
          )}
        </div>
      </section>

      <Modal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} title={t('wallet_modal.withdraw_title')}>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted">{t('wallet_modal.withdraw_desc')}</p>
          <a href="https://t.me/Yoldashaliyev_19" target="_blank" rel="noopener noreferrer" className="w-full glass-card border border-white/10 h-14 flex items-center justify-center space-x-2 font-bold mt-2 hover:bg-white/5 transition-colors rounded-xl">
            {t('wallet_modal.contact_admin')}
          </a>
        </div>
      </Modal>

      <Modal isOpen={isPromoOpen} onClose={() => { setIsPromoOpen(false); setPromoCode(''); }} title={t('wallet_modal.promo_title')}>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted text-center">{t('wallet_modal.promo_desc')}</p>
          <input 
            type="text" 
            placeholder={t('wallet_modal.promo_placeholder')}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="w-full h-14 bg-card rounded-2xl px-6 border border-border focus:border-primary/50 outline-none transition-all font-black tracking-[0.2em] text-center uppercase text-lg placeholder:text-muted/30" 
          />
          <button 
            disabled={!promoCode.trim()}
            onClick={() => {
              toast.error(t('wallet_modal.promo_error'));
              setTimeout(() => setIsPromoOpen(false), 1500);
            }}
            className="w-full btn-gold h-14 flex items-center justify-center font-bold disabled:opacity-50 transition-opacity"
          >
            {t('wallet_modal.activate')}
          </button>
        </div>
      </Modal>

      <Modal isOpen={isCardsOpen} onClose={() => setIsCardsOpen(false)} title={t('wallet_modal.cards_title')}>
        <div className="space-y-4 pt-2">
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted">
              <CreditCard size={32} />
            </div>
            <p className="text-sm text-muted">{t('wallet_modal.cards_desc')}</p>
          </div>
          <button 
            onClick={() => {
              toast(t('wallet_modal.soon'), { icon: '🚧' });
            }}
            className="w-full glass-card h-14 flex items-center justify-center space-x-2 text-primary font-bold border border-primary/20 hover:bg-primary/10 transition-colors rounded-xl"
          >
            <Plus size={20} />
            <span>{t('wallet_modal.add_card')}</span>
          </button>
        </div>
      </Modal>
    </main>
  );
}
