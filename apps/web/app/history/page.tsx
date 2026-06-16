'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {
  AlertCircle,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Gamepad2,
  Loader2,
  Search,
  ShoppingBag,
  XCircle
} from 'lucide-react';
import {BackButton} from '../../components/BackButton';
import {fetchMyDeposits, fetchOrders} from '../../services/api';
import {useTranslation} from '../../stores/useTranslation';

const statusStyles: Record<string, any> = {
  pending: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
  processing: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: AlertCircle },
  completed: { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: CheckCircle2 },
  cancelled: { color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', icon: XCircle },
};

const getStatusDetails = (status: string) => {
  let normalized = status;
  if (status === 'approved') normalized = 'completed';
  if (status === 'rejected') normalized = 'cancelled';
  return statusStyles[normalized] || statusStyles.pending;
};

export default function HistoryPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [mainTab, setMainTab] = useState<'pending' | 'completed' | 'cancelled'>('pending');
  const [orders, setOrders] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchOrders().catch((e) => {
        console.error('Fetch orders failed:', e);
        return [];
      }),
      fetchMyDeposits().catch((e) => {
        console.error('Fetch deposits failed:', e);
        return [];
      })
    ])
      .then(([ordersData, depositsData]) => {
        setOrders(ordersData);
        setDeposits(depositsData);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const combinedItems = React.useMemo(() => {
    const formattedOrders = orders.map(item => ({
      ...item,
      historyType: 'order',
      date: new Date(item.createdAt),
    }));
    const formattedDeposits = deposits.map(item => ({
      ...item,
      historyType: 'deposit',
      date: new Date(item.createdAt),
    }));
    
    let items: any[] = [];
    if (mainTab === 'pending') {
      items = [...formattedOrders, ...formattedDeposits].filter(i => i.status === 'pending' || i.status === 'processing');
    } else if (mainTab === 'completed') {
      items = [...formattedOrders, ...formattedDeposits].filter(i => i.status === 'approved' || i.status === 'completed');
    } else if (mainTab === 'cancelled') {
      items = [...formattedOrders, ...formattedDeposits].filter(i => i.status === 'rejected' || i.status === 'cancelled');
    }

    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [orders, deposits, mainTab]);

  const filteredItems = combinedItems.filter(item => {
    const query = search.toLowerCase();
    const itemId = item.id?.toString().toLowerCase() || '';

    return itemId.includes(query) ||
        (item.historyType === 'order' && (item.game?.name || '').toLowerCase().includes(query)) ||
        (item.historyType === 'deposit' && (item.card?.bankName || '').toLowerCase().includes(query));
  });

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-bold">{t('common.history')}</h1>
        <div className="w-10 h-10" />
      </header>

      {/* Main Tabs */}
      <section className="flex border-b border-white/5 pb-px">
        {[
          { id: 'pending', label: t('history_page.status_pending') },
          { id: 'completed', label: t('history_page.status_completed') },
          { id: 'cancelled', label: t('history_page.status_cancelled') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMainTab(tab.id as any)}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              mainTab === tab.id
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-muted hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* Search */}
      <section>
        <div className="relative">
          <input 
            type="text" 
            placeholder={t('history_page.search_placeholder')}
            className="w-full h-12 bg-card rounded-xl px-11 border border-border focus:border-primary/50 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-4 top-3.5 text-muted" />
        </div>
      </section>

      {/* Items List */}
      <section className="space-y-4">
        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-primary" size={32}/></div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isDeposit = item.historyType === 'deposit';
            const statusDetails = getStatusDetails(item.status);
            const StatusIcon = statusDetails.icon;

            if (isDeposit) {
              return (
                <div key={item.id} className="glass-card p-5 space-y-4 premium-border relative overflow-hidden group">
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success border border-success/20">
                        <ArrowDownLeft size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{t('tx_types.deposit')}</h4>
                        <p className="text-[10px] text-muted font-bold">
                          {item.card?.bankName || 'Karta'} (..{item.card?.cardNumber?.slice(-4) || ''})
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest flex items-center space-x-1 ${statusDetails.bg} ${statusDetails.color} ${statusDetails.border}`}>
                      <StatusIcon size={10} />
                      <span>{item.status}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5 relative z-10">
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="space-y-0.5">
                        <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">ID</p>
                        <p className="text-[11px] font-bold">#{String(item.id).slice(0, 8)}</p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">{t('history_page.payment_method')}</p>
                        <p className="text-[11px] font-bold">{t('history_page.card')} (Manual)</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">{t('history_page.date')}</p>
                        <div className="flex items-center text-[10px] text-muted font-medium">
                          <Calendar size={10} className="mr-1" /> {item.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {item.adminNote && (
                      <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 mt-2">
                        <p className="text-[9px] text-danger font-bold uppercase tracking-tighter mb-1">{t('history_page.reject_reason')}</p>
                        <p className="text-xs text-danger-foreground font-medium">{item.adminNote}</p>
                      </div>
                    )}
                    
                    <div className="pt-2 flex justify-between items-center border-t border-white/5 mt-2">
                      <span className="text-[10px] text-muted font-bold uppercase">{t('history_page.deposit_amount')}</span>
                      <p className="font-black text-lg text-success">+{Number(item.amount).toLocaleString('ru-RU')} {t('common.uzs')}</p>
                    </div>
                  </div>
                  
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity ${statusDetails.bg}`}></div>
                </div>
              );
            }

            return (
              <div key={item.id} className="glass-card p-5 space-y-4 premium-border relative overflow-hidden group">
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:bg-primary/10 transition-colors">
                      <Gamepad2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{item.game?.name || 'Unknown'}</h4>
                      <p className="text-[10px] text-muted font-bold">{item.package?.title || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest flex items-center space-x-1 ${statusDetails.bg} ${statusDetails.color} ${statusDetails.border}`}>
                    <StatusIcon size={10} />
                    <span>{item.status}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5 relative z-10">
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">ID</p>
                      <p className="text-[11px] font-bold">#{String(item.id).slice(0, 8)}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">{t('history_page.payment_method')}</p>
                      <p className="text-[11px] font-bold">{t('common.balance')}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">{t('history_page.info')}</p>
                      <p className="text-[10px] font-medium text-primary line-clamp-1">{item.uid}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">{t('history_page.date')}</p>
                      <div className="flex items-center justify-end text-[10px] text-muted font-medium">
                        <Calendar size={10} className="mr-1" /> {item.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {item.adminNote && (
                    <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 mt-2">
                      <p className="text-[9px] text-danger font-bold uppercase tracking-tighter mb-1">{t('history_page.note')}</p>
                      <p className="text-xs text-danger-foreground font-medium">{item.adminNote}</p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center border-t border-white/5 mt-2">
                    <span className="text-[10px] text-muted font-bold uppercase">{t('history_page.paid_amount')}</span>
                    <p className="font-black text-lg text-white">{Number(item.price).toLocaleString('ru-RU')} {t('common.uzs')}</p>
                  </div>
                </div>
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity ${statusDetails.bg}`}></div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-muted/30">
              <ShoppingBag size={32} />
            </div>
            <p className="text-muted text-sm">{t('history_page.no_data')}</p>
          </div>
        )}
      </section>
    </main>
  );
}
