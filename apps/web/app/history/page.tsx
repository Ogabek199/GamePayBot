'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../stores/useTranslation';
import { ChevronLeft, Search, Filter, Gamepad2, Clock, CheckCircle2, XCircle, AlertCircle, Calendar, ShoppingBag } from 'lucide-react';
import { BackButton } from '../../components/BackButton';

const initialOrders = [
  { id: 'GP-9281', game: 'PUBG Mobile', package: '325 UC', amount: '55 000', status: 'completed', date: '15 Iyun, 10:30', method: 'Uzcard', details: 'UID: 5123456789' },
  { id: 'GP-9282', game: 'Mobile Legends', package: '257 Diamonds', amount: '48 000', status: 'processing', date: '15 Iyun, 12:45', method: 'Humo', details: 'UID: 987654321 (Global)' },
  { id: 'GP-9283', game: 'Free Fire', package: '100 Diamonds', amount: '12 000', status: 'pending', date: 'Bugun, 14:20', method: 'Deposit', details: 'UID: 12344321' },
  { id: 'GP-9284', game: 'Valorant', package: '1000 VP', amount: '120 000', status: 'cancelled', date: '14 Iyun, 09:15', method: 'Uzcard', details: 'UID: Player#EUW' },
];

const statusStyles: Record<string, any> = {
  pending: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
  processing: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: AlertCircle },
  completed: { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: CheckCircle2 },
  cancelled: { color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', icon: XCircle },
};

export default function HistoryPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Barchasi');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredOrders = initialOrders.filter(order => {
    const matchesSearch = order.game.toLowerCase().includes(search.toLowerCase()) || order.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'Barchasi' || 
                         (filter === 'Jarayonda' && (order.status === 'pending' || order.status === 'processing')) ||
                         (filter === 'Yakunlangan' && order.status === 'completed') ||
                         (filter === 'Bekor qilingan' && order.status === 'cancelled');
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-6 md:ml-20 lg:ml-64">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-bold">{t('common.history')}</h1>
        <div className="w-10 h-10" />
      </header>

      {/* Search & Filter */}
      <section className="space-y-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="ID..." 
            className="w-full h-12 bg-card rounded-xl px-11 border border-border focus:border-primary/50 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-4 top-3.5 text-muted" />
        </div>

        <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-1">
          {['Barchasi', 'Jarayonda', 'Yakunlangan', 'Bekor qilingan'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setFilter(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                filter === tab ? 'bg-primary text-bg border-primary shadow-gold' : 'glass border-white/5 text-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Orders List */}
      <section className="space-y-4">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => {
          const style = statusStyles[order.status];
          const StatusIcon = style.icon;

          return (
            <div key={order.id} className="glass-card p-5 space-y-4 premium-border relative overflow-hidden group">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:bg-primary/10 transition-colors">
                    <Gamepad2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{order.game}</h4>
                    <p className="text-[10px] text-muted font-bold">{order.package}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest flex items-center space-x-1 ${style.bg} ${style.color} ${style.border}`}>
                  <StatusIcon size={10} />
                  <span>{order.status}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5 relative z-10">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="space-y-0.5">
                    <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">ID</p>
                    <p className="text-[11px] font-bold">#{order.id}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">To'lov usuli</p>
                    <p className="text-[11px] font-bold">{order.method}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">Ma'lumot</p>
                    <p className="text-[10px] font-medium text-primary line-clamp-1">{order.details}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">Sana</p>
                    <div className="flex items-center justify-end text-[10px] text-muted font-medium">
                      <Calendar size={10} className="mr-1" /> {order.date}
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[10px] text-muted font-bold uppercase">To'langan summa</span>
                  <p className="font-black text-lg text-white">{order.amount} {t('common.uzs')}</p>
                </div>
              </div>
              
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity ${style.bg}`}></div>
            </div>
          );
        }) : (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-muted/30">
              <ShoppingBag size={32} />
            </div>
            <p className="text-muted text-sm">Buyurtmalar topilmadi</p>
          </div>
        )}
      </section>
    </main>
  );
}
