# Project Source Code Compilation

## File: apps/web/app/styles/globals.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #020D2B;
}

html, body, #__next {
  height: 100%;
}

body {
  background: var(--bg);
}

/* Glass morphism effect */
@layer components {
  .glass {
    @apply bg-white/10 backdrop-blur-md border border-white/20;
  }

  .glass-card {
    @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl;
  }

  .premium-border {
    @apply border-white/5;
  }

  .btn-gold {
    @apply bg-gold-gradient text-bg font-bold rounded-2xl shadow-gold hover:shadow-[0_6px_20px_rgba(255,196,0,0.5)] transition-all duration-300 active:scale-95;
  }

  .danger-foreground {
    @apply text-danger;
  }

  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .animate-fade-in {
    @apply animate-in fade-in duration-500;
  }

  /* Telegram WebApp optimizations */
  @supports (padding: max(0px)) {
    body {
      padding-left: max(12px, env(safe-area-inset-left));
      padding-right: max(12px, env(safe-area-inset-right));
      padding-bottom: max(12px, env(safe-area-inset-bottom));
      padding-top: max(12px, env(safe-area-inset-top));
    }
  }
} 

```

## File: apps/web/app/profile/personal/page.tsx

```
'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { User, Smartphone, Hash, Save, ShieldCheck, Loader2 } from 'lucide-react';
import { BackButton } from '../../../components/BackButton';
import { updateProfile, pingBackend } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { useTranslation } from '../../../stores/useTranslation';

// Telegram WebApp interfeysi uchun to'liq tipifikatsiya
interface TelegramUser {
  id: number;
  username?: string;
  first_name: string;
  photo_url?: string; // Telegram ba'zan guruh kontekstida berishi mumkin
}

interface TelegramWebApp {
  initDataUnsafe?: {
    user?: TelegramUser;
  };
}

export default function PersonalInfoPage() {
  const { user, updateUser } = useAuthStore();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Agar do'konda (store) backend'dan kelgan to'liq user bo'lsa
    if (user && Object.keys(user).length > 0) {
      setFirstName(user.firstName || '');
    }
    // 2. Agar store bo'sh bo'lsa, Telegram WebApp oynasidan ma'lumotni yuklash
    else if (typeof window !== 'undefined') {
      const tg = (window as any).Telegram?.WebApp as TelegramWebApp | undefined;
      const tgUser = tg?.initDataUnsafe?.user;

      if (tgUser) {
        setFirstName(tgUser.first_name || '');

        // Store'ni boshlang'ich ma'lumotlar bilan to'ldiramiz
        updateUser({
          telegramId: tgUser.id.toString(),
          username: tgUser.username || '',
          firstName: tgUser.first_name,
          // MUHIM: Agar backend'dan rasm hali kelmagan bo'lsa, tgUser.photo_url'ni tekshiramiz
          photoUrl: user?.photoUrl || tgUser.photo_url || ''
        });
      }
    }
  }, [user, updateUser]);

  const handleTestConnection = async () => {
    const success = await pingBackend();
    if (success) {
      toast.success('Backend ulanishi muvaffaqiyatli!');
    } else {
      toast.error('Backendga ulanib bo\'lmadi!');
    }
  };

  const handleUpdate = async () => {
    if (!firstName.trim()) return;
    setLoading(true);
    try {
      const updatedUser = await updateProfile({ firstName: firstName.trim() });
      updateUser(updatedUser);
      toast.success('Ma\'lumotlar muvaffaqiyatli yangilandi!');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-8 md:ml-20 lg:ml-64">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-bold">{t('profile_personal.title')}</h1>
        <button onClick={handleTestConnection} className="text-[10px] text-muted underline">{t('profile_personal.debug')}</button>
      </header>

      {/* Profil rasmi bo'limi */}
      <section className="text-center">
         <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-4 border-primary/20 p-1 overflow-hidden bg-card mx-auto flex items-center justify-center flex-shrink-0">
            {/* Rasm mavjudligini va u bo'sh string emasligini tekshiramiz */}
            {user?.photoUrl && user.photoUrl.trim() !== '' ? (
              <img
                src={user.photoUrl}
                alt="Avatar"
                className="w-full h-full object-cover rounded-[1.5rem]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold bg-primary/10 text-primary rounded-[1.5rem]">
                {firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <p className="text-xs md:text-sm text-muted mt-3 font-medium">Telegram profil rasmi ishlatilmoqda</p>
      </section>

      {/* Ma'lumotlar kiritish maydonlari */}
      <section className="space-y-4">
        {/* Tahrirlanadigan Ism maydoni */}
        <div className="glass-card p-4 md:p-6 flex items-center space-x-4 premium-border">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary flex-shrink-0">
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Ism</p>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-transparent font-bold text-base md:text-lg focus:outline-none border-b border-white/10 pb-1 mt-1"
              placeholder="Ismingizni kiriting"
            />
          </div>
        </div>

        {/* Faqat o'qish uchun: Username */}
        <div className="glass-card p-4 md:p-6 flex items-center space-x-4 premium-border opacity-80">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary flex-shrink-0">
            <Smartphone size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Username</p>
            <p className="font-bold text-base md:text-lg truncate">
              {user?.username ? `@${user.username}` : 'aniqlanmagan'}
            </p>
          </div>
        </div>

        {/* Faqat o'qish uchun: Telegram ID */}
        <div className="glass-card p-4 md:p-6 flex items-center space-x-4 premium-border opacity-80">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary flex-shrink-0">
            <Hash size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Telegram ID</p>
            <p className="font-bold text-base md:text-lg truncate">{user?.telegramId || 'aniqlanmagan'}</p>
          </div>
        </div>
      </section>

      {/* Xavfsizlik bo'yicha eslatma */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start space-x-3">
        <ShieldCheck className="text-primary flex-shrink-0" size={20} />
        <p className="text-[11px] text-muted leading-relaxed">
          Ma'lumotlaringiz Telegram orqali xavfsiz ulangan. Ismingizni shu yerda o'zgartirishingiz mumkin, qolgan ma'lumotlar avtomatik yangilanadi.
        </p>
      </div>

      {/* Yangilash tugmasi */}
      <button
        onClick={handleUpdate}
        disabled={loading || !firstName.trim()}
        className="w-full btn-gold h-12 md:h-14 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            <Save size={20} />
            <span>Ma'lumotlarni yangilash</span>
          </>
        )}
      </button>
    </main>
  );
}

```

## File: apps/web/app/profile/page.tsx

```
'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTranslation } from '../../stores/useTranslation';
import { User, CreditCard, Globe, Headset, ChevronRight, Award, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BackButton } from '../../components/BackButton';
import { Modal } from '../../components/Modal';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { lang, setLang, t } = useTranslation();
  const router = useRouter();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const menuItems = [
    { icon: User, label: t('profile.personal_info'), onClick: () => router.push('/profile/personal') },
    { icon: CreditCard, label: t('profile.payment_methods'), onClick: () => router.push('/wallet') },
    { icon: Globe, label: t('profile.language'), onClick: () => setIsLangOpen(true), value: lang.toUpperCase() },
    { icon: Headset, label: t('common.support'), onClick: () => setIsSupportOpen(true) },
  ];

  const languages = [
    { id: 'uz', name: 'O\'zbekcha', icon: '🇺🇿' },
    { id: 'ru', name: 'Русский', icon: '🇷🇺' },
    { id: 'en', name: 'English', icon: '🇺🇸' },
  ];

  return (
    <div className="max-w-3xl mx-auto w-full h-full space-y-8 animate-fade-in">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-xl font-bold">{t('common.profile')}</h1>
        <div className="w-10 h-10" />
      </header>

      <section className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-4 border-primary/20 p-1 overflow-hidden bg-card">
            {user?.photoUrl && user.photoUrl.trim() ? (
              <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover rounded-[1.5rem]" onError={(e) => { (e.target as any).style.display = 'none'; }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold bg-primary/10 text-primary">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gold-gradient p-1.5 rounded-xl shadow-gold border-2 border-bg">
            <Award size={16} className="text-bg" />
          </div>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold">{user?.firstName || 'Foydalanuvchi'}</h2>
          <p className="text-muted text-xs md:text-sm font-medium">@{user?.username || 'user'} • {t('profile.id')}: {user?.telegramId || '000000'}</p>
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="glass-card p-4 md:p-6 text-center space-y-1">
          <p className="text-[10px] text-muted font-bold uppercase">{t('common.balance')}</p>
          <p className="text-lg md:text-xl font-bold">0 {t('common.uzs')}</p>
        </div>
        <div className="glass-card p-4 md:p-6 text-center space-y-1">
          <p className="text-[10px] text-muted font-bold uppercase">{t('profile.membership')}</p>
          <p className="text-lg md:text-xl font-bold text-primary">{t('profile.gold')}</p>
        </div>
      </section>

      {/* Menu List */}
      <section className="space-y-3">
        {menuItems.map((item, i) => (
          <button 
            key={i}
            onClick={item.onClick}
            className="w-full glass-card p-4 flex items-center justify-between premium-border active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted">
                <item.icon size={20} />
              </div>
              <span className="font-bold text-sm">{item.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              {item.value && <span className="text-[10px] font-bold text-primary">{item.value}</span>}
              <ChevronRight size={18} className="text-muted/30" />
            </div>
          </button>
        ))}
      </section>

      {/* Language Modal */}
      <Modal 
        isOpen={isLangOpen} 
        onClose={() => setIsLangOpen(false)} 
        title={t('profile.select_language')}
      >
        <div className="space-y-3">
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setLang(l.id as any);
                setIsLangOpen(false);
              }}
              className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all ${
                lang === l.id ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/5 text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{l.icon}</span>
                <span className="font-bold">{l.name}</span>
              </div>
              {lang === l.id && <Check size={20} />}
            </button>
          ))}
        </div>
      </Modal>

      {/* Support Modal */}
      <Modal 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
        title={t('common.support')}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted text-center">Biz bilan bog'lanish uchun quyidagi usullardan foydalaning:</p>
          <div className="grid grid-cols-2 gap-4">
            <a href="https://t.me/admin" target="_blank" className="glass-card p-6 flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Globe size={24} />
              </div>
              <span className="font-bold text-sm">Telegram</span>
            </a>
            <div className="glass-card p-6 flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center">
                <Headset size={24} />
              </div>
              <span className="font-bold text-sm">Online Chat</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

```

## File: apps/web/app/support/page.tsx

```
'use client';

import React from 'react';
import { ChevronLeft, MessageCircle, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupportPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-10 max-w-4xl mx-auto flex flex-col justify-between md:ml-20 lg:ml-64">
      {/* Header qismi */}
      <header className="flex items-center justify-between w-full pt-2">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-muted hover:text-white transition-colors active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-sm font-semibold tracking-wide text-muted uppercase">Yordam Markazi</h1>
        <div className="w-10 h-10" /> {/* Simmetriya uchun bo'sh joy */}
      </header>

      {/* Markaziy kontent bo'limi */}
      <section className="flex-1 flex flex-col justify-center items-center text-center space-y-8 my-auto">
        {/* Asosiy animatsion ikonka */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-lg relative animate-bounce [animation-duration:3s]">
            <MessageCircle size={40} className="drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          </div>
        </div>

        {/* Matnlar */}
        <div className="space-y-2 px-4">
          <h2 className="text-2xl font-black tracking-tight">Qo'llab-quvvatlash</h2>
          <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
            Savollaringiz yoki takliflaringiz bormi? Biz bilan bevosita Telegram orqali bog'laning.
          </p>
        </div>
      </section>

      {/* Pastki Harakat Tugmasi (Call to Action) */}
      <footer className="w-full">
        <a
          href="https://t.me/otaxonov_o17"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full glass-card p-5 flex items-center justify-between border border-primary/30 bg-primary/5 rounded-2xl hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 active:scale-[0.98] group shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Send size={22} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Telegram Chat</p>
              <p className="font-bold text-base text-white">@otaxonov_o17</p>
            </div>
          </div>

          {/* Tugma ichidagi kichik yo'naltiruvchi strelka */}
          <div className="text-primary group-hover:translate-x-1 transition-transform">
            <ChevronLeft size={20} className="rotate-180" />
          </div>
        </a>
      </footer>
    </main>
  );
}

```

## File: apps/web/app/layout.tsx

```
import '../styles/globals.css';
import { BottomNav } from '../components/BottomNav';
import TelegramAuth from '../components/TelegramAuth';
import { Toaster } from 'react-hot-toast';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata = {
  title: 'Gang Pay - Premium Gaming Store',
  description: 'Fast and secure gaming topups',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
      <html lang="uz" className="bg-bg">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" defer/>
        <meta name="theme-color" content="#020D2B"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <title/>
      </head>
      <body className="bg-bg text-white min-h-dvh pb-24 md:pb-0 overflow-x-hidden" suppressHydrationWarning>
      <Toaster position="top-center" reverseOrder={false}/>
      <div className="flex min-h-screen">
        <TelegramAuth/>
        <BottomNav/>
        <main className="flex-1 overflow-y-auto bg-bg p-4 md:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
      </body>
      </html>
  );
}

```

## File: apps/web/app/history/page.tsx

```
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
  const [mainTab, setMainTab] = useState<'all' | 'orders' | 'deposits'>('all');
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
    if (mainTab === 'all') {
      items = [...formattedOrders, ...formattedDeposits];
    } else if (mainTab === 'orders') {
      items = formattedOrders;
    } else if (mainTab === 'deposits') {
      items = formattedDeposits;
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
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-6 md:ml-20 lg:ml-64">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-bold">{t('common.history')}</h1>
        <div className="w-10 h-10" />
      </header>

      {/* Main Tabs */}
      <section className="flex border-b border-white/5 pb-px">
        {[
          { id: 'all', label: 'Barchasi' },
          { id: 'orders', label: 'Buyurtmalar' },
          { id: 'deposits', label: 'Depositlar' },
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
            placeholder="Qidirish (ID yoki Nomi)..." 
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
                        <h4 className="font-bold text-sm">Hisobni to'ldirish</h4>
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
                        <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">To'lov usuli</p>
                        <p className="text-[11px] font-bold">Karta (Manual)</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">Sana</p>
                        <div className="flex items-center text-[10px] text-muted font-medium">
                          <Calendar size={10} className="mr-1" /> {item.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {item.adminNote && (
                      <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 mt-2">
                        <p className="text-[9px] text-danger font-bold uppercase tracking-tighter mb-1">Rad etilish sababi</p>
                        <p className="text-xs text-danger-foreground font-medium">{item.adminNote}</p>
                      </div>
                    )}
                    
                    <div className="pt-2 flex justify-between items-center border-t border-white/5 mt-2">
                      <span className="text-[10px] text-muted font-bold uppercase">To'ldirilgan summa</span>
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
                      <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">To'lov usuli</p>
                      <p className="text-[11px] font-bold">Balans</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">Ma'lumot</p>
                      <p className="text-[10px] font-medium text-primary line-clamp-1">{item.uid}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[8px] text-muted font-bold uppercase tracking-tighter">Sana</p>
                      <div className="flex items-center justify-end text-[10px] text-muted font-medium">
                        <Calendar size={10} className="mr-1" /> {item.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {item.adminNote && (
                    <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 mt-2">
                      <p className="text-[9px] text-danger font-bold uppercase tracking-tighter mb-1">Izoh</p>
                      <p className="text-xs text-danger-foreground font-medium">{item.adminNote}</p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center border-t border-white/5 mt-2">
                    <span className="text-[10px] text-muted font-bold uppercase">To'langan summa</span>
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
            <p className="text-muted text-sm">Hech qanday ma'lumot topilmadi</p>
          </div>
        )}
      </section>
    </main>
  );
}

```

## File: apps/web/app/wallet/deposit/page.tsx

```
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, CreditCard, Landmark, Smartphone, ChevronRight, Wallet } from 'lucide-react';
import { BackButton } from '../../../components/BackButton';

import { fetchPaymentCards } from '../../../services/api';

export default function DepositPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Amount, 2: Method
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
          if (Array.isArray(data)) {
            setCards(data);
            if (data.length > 0) {
              setSelectedMethod(data[0].id);
            }
          } else {
            setFetchError("Ma'lumotlar formati noto'g'ri");
          }
        })
        .catch((err) => {
          console.error('Error fetching cards:', err);
          const errorMsg = err.response?.data?.message || err.message || "Noma'lum";
          setFetchError("Xatolik: " + errorMsg);
        })
        .finally(() => {
          setIsLoadingCards(false);
        });
    }
  }, [step]);

  const handleNext = () => {
    if (step === 1 && amount) setStep(2);
    else if (step === 2 && selectedMethod) {
      router.push(`/wallet/payment?amount=${amount}&card=${selectedMethod}`);
    }
  };

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-8 md:ml-20 lg:ml-64">
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
                  onChange={(e) => {
                    const val = e.target.value;
                    if (Number(val) < 0) return;
                    setAmount(val);
                  }}
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
              <div className="text-center py-8 text-muted">Karta turlari yuklanmoqda...</div>
            ) : fetchError ? (
              <div className="text-center py-8 text-danger font-bold">{fetchError}</div>
            ) : cards.length === 0 ? (
              <div className="text-center py-8 text-danger font-bold">Faol to'lov kartalari topilmadi. Keyinroq urinib ko'ring.</div>
            ) : (
              cards.map((card) => {
                const isHumoCard = card.cardNumber.replace(/\s/g, '').startsWith('9860');
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

      {/* Action Button */}
      <div className="fixed fixed-action-btn left-0 right-0 px-4 md:px-6 z-40 pointer-events-none md:ml-20 lg:ml-64">
        <div className="max-w-2xl mx-auto pointer-events-auto">
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

```

## File: apps/web/app/wallet/payment/page.tsx

```
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

  useEffect(() => {
    setIsLoadingCard(true);
    setErrorMsg(null);
    fetchPaymentCards()
      .then((cards) => {
        const found = cards.find((c: any) => c.id === cardType);
        if (found) {
          setCardData(found);
        } else {
          setErrorMsg("To'lov kartasi topilmadi");
        }
      })
      .catch((err) => {
        setErrorMsg("Karta ma'lumotlarini yuklashda xatolik yuz berdi");
        console.error('Fetch card error:', err);
      })
      .finally(() => {
        setIsLoadingCard(false);
      });
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
    let currentToken = token;
    if (!currentToken) {
        console.log('DEBUG: Token missing, attempting re-auth via Telegram...');
        const initData = window.Telegram?.WebApp?.initData;
        if (!initData) {
            setErrorMsg("Siz avtorizatsiyadan o'tmagansiz. Iltimos, Telegram orqali qaytadan kiring.");
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
            return;
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
      <main className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4 md:ml-20 lg:ml-64">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin animate-fade-in"></div>
        <p className="text-muted text-sm">Karta ma'lumotlari yuklanmoqda...</p>
      </main>
    );
  }

  if (errorMsg && !cardData) {
    return (
      <main className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4 md:ml-20 lg:ml-64">
        <BackButton />
        <p className="text-danger font-bold text-center text-sm">{errorMsg}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-6 md:ml-20 lg:ml-64">
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
      <section className="bg-premium-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 border border-white/5 shadow-premium text-center space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-50"></div>
        <div className="relative z-10">
          <p className="text-muted text-[10px] font-bold uppercase tracking-widest">To'lov summasi</p>
          <div className="flex items-center justify-center space-x-2 flex-wrap">
            <h2 className="text-4xl md:text-5xl font-black">{Number(amount).toLocaleString()}</h2>
            <span className="text-primary font-bold text-lg md:text-2xl">UZS</span>
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
      <div className="fixed fixed-action-btn left-0 right-0 px-4 md:px-6 z-40 pointer-events-none md:ml-20 lg:ml-64">
        <div className="max-w-2xl mx-auto pointer-events-auto">
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

```

## File: apps/web/app/wallet/page.tsx

```
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from '../../stores/useTranslation';
import { Plus, History, Gift, CreditCard, ChevronRight, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { Modal } from '../../components/Modal';
import { fetchMyWallet, fetchMyTransactions } from '../../services/api';

export default function WalletPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isCardsOpen, setIsCardsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) return null;

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-8 md:ml-20 lg:ml-64">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-2xl font-bold">{t('common.wallet')}</h1>
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary active:scale-95 transition-all">
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
            let title = 'Buyurtma to\'lovi';
            let sign = '-';

            if (isDeposit) {
              icon = ArrowDownLeft;
              iconClass = 'bg-success/10 text-success';
              amountClass = 'text-success';
              title = 'Hisobni to\'ldirish';
              sign = '+';
            } else if (isRefund) {
              icon = ArrowDownLeft;
              iconClass = 'bg-blue-500/10 text-blue-500';
              amountClass = 'text-blue-500';
              title = 'Mablag\' qaytarilishi';
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
             <p className="text-center text-muted text-sm py-4">Tranzaksiyalar yo'q</p>
          )}
        </div>
      </section>

      <Modal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} title="Mablag'ni yechib olish">
        <p>Hozircha yechib olish funksiyasi mavjud emas. Administrator bilan bog'laning.</p>
      </Modal>
      <Modal isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} title="Promo kodlar">
        <p>Hozircha promo kodlar bo'limi mavjud emas.</p>
      </Modal>
      <Modal isOpen={isCardsOpen} onClose={() => setIsCardsOpen(false)} title="Mening kartalarim">
        <p>Hozircha kartalar bo'limi mavjud emas.</p>
      </Modal>
    </main>
  );
}

```

## File: apps/web/app/page.tsx

```
'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, Crown, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const popularGames = [
  { id: '1', name: 'PUBG Mobile', slug: 'pubg-mobile', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/PUBG_Mobile_Logo.jpg/220px-PUBG_Mobile_Logo.jpg' },
  { id: '2', name: 'Mobile Legends', slug: 'mobile-legends', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mobile_Legends_Bang_Bang_logo.png/220px-Mobile_Legends_Bang_Bang_logo.png' },
  { id: '3', name: 'Free Fire', slug: 'free-fire', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Free_Fire_logo.png/220px-Free_Fire_logo.png' },
  { id: '4', name: 'Valorant', slug: 'valorant', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/220px-Valorant_logo_-_pink_color_version.svg.png' },
  { id: '5', name: 'Steam', slug: 'steam', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/220px-Steam_icon_logo.svg.png' },
];

import { useTranslation } from '../stores/useTranslation';
import { fetchMyWallet, fetchMyDeposits } from '../services/api';

function Home() {
  const {user} = useAuthStore();
  const {t} = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [todayTopup, setTodayTopup] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchMyWallet()
        .then((walletData) => {
          setBalance(Number(walletData?.balance || 0));
        })
        .catch((e) => console.error('Error fetching wallet balance:', e));

      fetchMyDeposits()
        .then((depositsData) => {
          const today = new Date();
          const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const sumToday = depositsData
            .filter((d: any) => d.status === 'approved' && new Date(d.createdAt) >= startOfToday)
            .reduce((sum: number, d: any) => sum + Number(d.amount), 0);
          setTodayTopup(sumToday);
        })
        .catch((e) => console.error('Error fetching deposits:', e));
    }
  }, [user]);

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // @ts-ignore
  return (
      <main
          className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 space-y-8 w-full max-w-4xl mx-auto md:ml-20 lg:ml-64">
        {/* User Welcome Card */}
        <section className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative flex-shrink-0">
              <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary/50 overflow-hidden bg-card">
                {user?.photoUrl && user.photoUrl.trim() ? (
                    <img src={user.photoUrl} alt="User" className="w-full h-full object-cover" onError={(e) => {
                      (e.target as any).style.display = 'none';
                    }}/>
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center text-xl md:text-2xl font-bold bg-primary/10 text-primary">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                )}
              </div>
              <div
                  className="absolute -bottom-1 -right-1 bg-primary text-bg rounded-full p-1 shadow-lg border-2 border-bg">
                <Crown size={12} fill="currentColor"/>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="text-muted text-xs">{t('common.welcome')}</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold leading-tight truncate">
                {user?.firstName || 'Foydalanuvchi'}
              </h2>
            </div>
          </div>
          <Link
              href="/profile"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-white transition-colors flex-shrink-0">
            <ChevronRight size={20}/>
          </Link>
        </section>

        {/* Balance Card */}
        <section className="relative group">
          <div
              className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] md:rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div
              className="relative bg-premium-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 border border-white/5 overflow-hidden shadow-premium">
            {/* Background Decorative Circles */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>

            <div className="flex flex-col md:flex-row justify-between items-start relative z-10 gap-4">
              <div className="space-y-1 flex-1">
                <p className="text-muted text-xs font-medium uppercase tracking-wider">{t('wallet.total_balance')}</p>
                <div className="flex items-baseline space-x-1 flex-wrap">
                  <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    {balance.toLocaleString('ru-RU')}
                  </h3>
                  <span className="text-primary font-bold text-lg">{t('common.uzs')}</span>
                </div>
              </div>
              <div
                  className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md flex-shrink-0">
              <span className="text-[10px] font-bold text-primary flex items-center space-x-1">
                <Crown size={10} className="mr-1"/> {t('profile.gold').toUpperCase()}
              </span>
              </div>
            </div>

            <div
                className="mt-8 md:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-0.5 flex-1">
                <p className="text-[10px] text-muted font-bold uppercase">{t('common.balance')} {t('common.topup').toLowerCase()}</p>
                <p className="text-sm md:text-base font-semibold">+ {todayTopup.toLocaleString('ru-RU')} {t('common.uzs')} bugun</p>
              </div>
              <Link
                  href="/wallet/deposit"
                  className="btn-gold h-12 w-12 md:h-14 md:w-14 !p-0 !rounded-2xl flex-shrink-0"
              >
                <Plus size={24} strokeWidth={3}/>
              </Link>
            </div>
          </div>
        </section>

        {/* Banner Carousel (Placeholder) */}
        <section className="h-40 rounded-3xl overflow-hidden glass premium-border relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-purple-600/40 animate-pulse"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-6">
            <span
                className="bg-primary/20 text-primary text-[10px] font-bold py-1 px-2 rounded w-fit mb-2">HOT OFFER</span>
            <h3 className="text-xl font-bold max-w-[60%]">PUBG Mobile UC bo'yicha katta chegirma!</h3>
            <p className="text-xs text-muted mt-1">Hozir sotib oling va 10% bonusga ega bo'ling</p>
          </div>
        </section>

        {/* Popular Games Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl md:text-2xl font-bold">{t('home.popular_games')}</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {popularGames.map((game) => (
                <Link key={game.id} href={`/games/${game.slug}`} className="block group">
                  <div
                      className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-card to-card/50 border border-white/10 shadow-lg group-hover:border-primary/50 transition-all duration-300 transform group-hover:-translate-y-1">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover p-6 transition-transform duration-500 group-hover:scale-110" onError={(e) => {
                      (e.target as any).style.display = 'none';
                    }}/>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-sm bg-primary px-3 py-1 rounded-full">Sotib olish</span>
                    </div>
                  </div>
                  <p className="text-[12px] font-bold text-center mt-3 group-hover:text-primary transition-colors line-clamp-1">
                    {game.name}
                  </p>
                </Link>
            ))}
          </div>
        </section>

        {/* Premium Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full text-primary">
              <Crown size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg">Premium Obuna</h4>
              <p className="text-sm text-muted">Eksklyuziv bonuslar va chegirmalar.</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-3xl border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-full text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg">Xavfsiz Tranzaksiyalar</h4>
              <p className="text-sm text-muted">100% kafolatlangan va tezkor.</p>
            </div>
          </div>
        </section>
      </main>
  );
}

export default Home

function Wallet({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function Clock({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

```

## File: apps/web/app/games/[slug]/page.tsx

```
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../../stores/useTranslation';

const packages = [
  { id: '1', title: '60 UC', amount: 60, price: '12 000', image: 'https://www.midasbuy.com/images/apps/pubgm/1.png' },
  { id: '2', title: '325 UC', amount: 325, price: '55 000', image: 'https://www.midasbuy.com/images/apps/pubgm/2.png' },
  { id: '3', title: '660 UC', amount: 660, price: '110 000', image: 'https://www.midasbuy.com/images/apps/pubgm/3.png' },
  { id: '4', title: '1800 UC', amount: 1800, price: '280 000', image: 'https://www.midasbuy.com/images/apps/pubgm/4.png' },
  { id: '5', title: '3850 UC', amount: 3850, price: '580 000', image: 'https://www.midasbuy.com/images/apps/pubgm/5.png' },
  { id: '6', title: '8100 UC', amount: 8100, price: '1 150 000', image: 'https://www.midasbuy.com/images/apps/pubgm/6.png' },
];

const gameImages: { [key: string]: string } = {
  'pubg-mobile': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/PUBG_Mobile_Logo.jpg/220px-PUBG_Mobile_Logo.jpg',
  'mobile-legends': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mobile_Legends_Bang_Bang_logo.png/220px-Mobile_Legends_Bang_Bang_logo.png',
  'free-fire': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Free_Fire_logo.png/220px-Free_Fire_logo.png',
  'valorant': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/220px-Valorant_logo_-_pink_color_version.svg.png',
  'steam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/220px-Steam_icon_logo.svg.png',
};

export default function GameDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const gameSlug = String(slug);
  const router = useRouter();
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [uid, setUid] = useState('');
  const [region, setRegion] = useState('Global');

  const gameName = gameSlug.replace(/-/g, ' ').toUpperCase();
  const gameImage = gameImages[gameSlug] || 'https://images6.alphacoders.com/102/1028306.jpg';

  const handlePurchase = () => {
    if (!selectedPkg || !uid) return;
    router.push(`/wallet/payment?pkg=${selectedPkg}&uid=${uid}&game=${gameSlug}`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{gameName}</h1>
        <div className="w-10 h-10" />
      </header>

      {/* Hero Banner */}
      <section className="relative h-48 rounded-[2.5rem] overflow-hidden shadow-premium flex items-end p-6">
        <img 
          src={gameImage} 
          alt={gameName} 
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent"></div>
        
        <div className="relative z-10 flex items-center space-x-4">
          <div className="w-20 h-20 rounded-2xl bg-card p-2 border border-white/10 shadow-lg">
            <img src={gameImage} alt={gameName} className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{gameName}</h2>
            <p className="text-xs text-primary font-bold flex items-center bg-primary/10 px-2 py-1 rounded-full w-fit mt-1">
              <ShieldCheck size={12} className="mr-1" /> {t('games.official_partner')}
            </p>
          </div>
        </div>
      </section>

      {/* Form Fields */}
      <section className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted uppercase ml-2">{t('games.uid')}</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder={t('games.enter_uid')} 
              className="w-full h-12 md:h-14 bg-card rounded-2xl px-6 border border-border focus:border-primary/50 outline-none transition-all font-bold tracking-wider text-base"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
            />
            <Info size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/50" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted uppercase ml-2">{t('games.region')}</label>
          <select 
            className="w-full h-12 md:h-14 bg-card rounded-2xl px-6 border border-border focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-pointer text-base"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option>Global</option>
            <option>Turkey</option>
            <option>Europe</option>
          </select>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="space-y-4">
        <h3 className="text-lg md:text-xl font-bold px-1">{t('games.select_package')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPkg(pkg.id)}
              className={`relative p-5 rounded-3xl border-2 transition-all duration-200 cursor-pointer active:scale-97 ${
                selectedPkg === pkg.id 
                ? 'bg-primary/10 border-primary shadow-gold' 
                : 'bg-card border-border hover:border-white/10'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <img src={pkg.image} alt={pkg.title} className="w-12 h-12 object-contain" />
                <div>
                  <h4 className="font-bold text-lg">{pkg.title}</h4>
                  <p className={`text-xs font-bold mt-1 ${selectedPkg === pkg.id ? 'text-primary' : 'text-muted'}`}>
                    {pkg.price} {t('common.uzs')}
                  </p>
                </div>
              </div>
              {selectedPkg === pkg.id && (
                <div className="absolute top-2 right-2 bg-primary text-bg rounded-full p-1">
                  <ShieldCheck size={12} fill="currentColor" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Purchase Button Footer */}
      <div className="mt-8">
        <button
          onClick={handlePurchase}
          disabled={!selectedPkg || !uid}
          className={`w-full h-14 md:h-16 rounded-[2rem] font-bold text-lg flex items-center justify-center space-x-3 shadow-premium transition-all duration-300 ${
            selectedPkg && uid 
            ? 'bg-gold-gradient text-bg shadow-gold scale-100' 
            : 'bg-card text-muted opacity-50 cursor-not-allowed scale-95'
          }`}
        >
          <ShoppingCart size={22} />
          <span>{t('wallet.select_method')}</span> 
        </button>
      </div>
    </div>
  );
}

```

## File: apps/web/stores/useAuthStore.ts

```
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  user: any | null;
  language: 'uz' | 'ru' | 'en';
  setAuth: (t: string, u: any) => void;
  updateUser: (u: any) => void;
  setLanguage: (lang: 'uz' | 'ru' | 'en') => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      language: 'uz',
      setAuth: (t, u) => {
        console.log('DEBUG: Setting auth, token:', t);
        set(() => ({ token: t, user: u }));
      },
      updateUser: (u) => set((state) => ({ user: { ...state.user, ...u } })),
      setLanguage: (lang) => set(() => ({ language: lang })),
    }),
    {
      name: 'gp_auth_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

```

## File: apps/web/stores/useTranslation.ts

```
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import uz from '../public/locales/uz.json';
import ru from '../public/locales/ru.json';
import en from '../public/locales/en.json';

const translations: any = { uz, ru, en };

type TranslationState = {
  lang: 'uz' | 'ru' | 'en';
  setLang: (l: 'uz' | 'ru' | 'en') => void;
  t: (key: string) => string;
  hasHydrated: boolean;
  setHasHydrated: (h: boolean) => void;
};

export const useTranslation = create<TranslationState>()(
  persist(
    (set, get) => ({
      lang: 'uz',
      hasHydrated: false,
      setLang: (l) => set({ lang: l }),
      setHasHydrated: (h) => set({ hasHydrated: h }),
      t: (key: string) => {
        if (!get().hasHydrated) return ''; // Return empty or placeholder until hydrated
        const [section, subkey] = key.split('.');
        return translations[get().lang]?.[section]?.[subkey] || key;
      },
    }),
    { 
      name: 'gp_lang_storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

```

## File: apps/web/styles/globals.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-white antialiased selection:bg-primary/30;
    font-feature-settings: "ss01", "ss02", "cv01", "cv02";
  }
}

@layer components {
  .glass {
    @apply bg-white/5 backdrop-blur-md border border-white/10;
  }
  
  .glass-card {
    @apply bg-card/60 backdrop-blur-lg border border-border rounded-2xl;
  }

  .btn-gold {
    @apply bg-gold-gradient text-bg font-bold py-3 px-6 rounded-xl shadow-gold active:scale-95 transition-all duration-200 flex items-center justify-center;
  }

  .premium-border {
    @apply border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)];
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

/* Smooth Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

/* Hide number input spinners */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

/* Safe-area utility classes for mobile browsers / Telegram WebApp */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
.pt-safe {
  padding-top: env(safe-area-inset-top);
}
.bottom-safe {
  bottom: env(safe-area-inset-bottom);
}

.fixed-action-btn {
  bottom: calc(6.5rem + env(safe-area-inset-bottom));
}

@media (min-width: 768px) {
  .fixed-action-btn {
    bottom: 2rem;
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

```

## File: apps/web/components/BackButton.tsx

```
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.back()} 
      className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-white transition-colors"
    >
      <ChevronLeft size={20} />
    </button>
  );
}

```

## File: apps/web/components/BottomSheet.tsx

```
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
          />
          <div
            className="fixed bottom-0 left-0 right-0 glass rounded-t-[3xl] z-[101] max-w-md mx-auto p-6 space-y-6 premium-border animate-slide-up"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{title}</h3>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="pb-16 max-h-[70vh] overflow-y-auto hide-scrollbar">
              {children}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

```

## File: apps/web/components/FloatingNav.tsx

```
import React from 'react';

export default function FloatingNav(){
  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card/80 backdrop-blur-md px-4 py-2 rounded-full shadow-xl">
      <ul className="flex gap-6 items-center">
        <li>🏠</li>
        <li>💼</li>
        <li>🕒</li>
        <li>👤</li>
      </ul>
    </nav>
  );
}

```

## File: apps/web/components/BottomNav.tsx

```
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Wallet, Clock, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Bosh sahifa', icon: LayoutGrid, path: '/' },
  { name: 'Hamyon', icon: Wallet, path: '/wallet' },
  { name: 'Tarix', icon: Clock, path: '/history' },
  { name: 'Profil', icon: User, path: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div 
        className="md:hidden fixed bottom-6 left-0 right-0 px-4 z-50 pointer-events-none"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        <nav className="w-full max-w-md mx-auto h-16 glass rounded-[9999px] shadow-premium flex items-center justify-around px-4 premium-border pointer-events-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-all duration-300 relative flex-1",
                  isActive ? "text-primary" : "text-muted hover:text-white"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.name}</span>
                {isActive && (
                  <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(255,196,0,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-64 glass flex-col items-center lg:items-start justify-start pt-8 lg:p-8 gap-4 lg:gap-6 z-40 premium-border border-r border-l-0">
        <div className="text-primary font-bold text-2xl lg:text-3xl mb-8">
          GP
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center justify-center lg:justify-start lg:px-4 lg:py-3 rounded-xl transition-all duration-300 relative group w-12 lg:w-full",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="hidden lg:inline text-sm font-medium ml-4">{item.name}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_8px_rgba(255,196,0,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

```

## File: apps/web/components/TelegramAuth.tsx

```
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { loginWithTelegram } from '../services/api';

export default function TelegramAuth() {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const initTelegram = async () => {
      console.log('AUTO_AUTH: Checking Telegram WebApp...');

      if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
        console.error('AUTO_AUTH: Telegram WebApp not detected.');
        return;
      }

      const webapp = window.Telegram.WebApp;
      webapp.ready();
      webapp.expand();

      const initData = webapp.initData;
      if (!initData) {
        console.error('AUTO_AUTH: No initData available.');
        return;
      }

      try {
        console.log('AUTO_AUTH: Attempting automatic login with initData...');
        const { token, user } = await loginWithTelegram(initData);
        
        console.log('AUTO_AUTH: Success, updating store.');
        setAuth(token, user);
      } catch (error) {
        console.error('AUTO_AUTH: Automatic login failed:', error);
      }
    };

    initTelegram();
  }, [setAuth]);

  return null;
}

// Add Telegram type definition to window
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            photo_url?: string;
          };
        };
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

```

## File: apps/web/components/Modal.tsx

```
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose as any}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[10000] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full rounded-t-[2rem] md:rounded-[2rem] p-6 space-y-4 premium-border border border-white/10 shadow-2xl md:max-h-[80vh] flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">{title}</h3>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-muted hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="text-muted text-sm leading-relaxed overflow-y-auto">
                {children}
              </div>
              <button 
                onClick={onClose as any}
                className="w-full h-12 bg-primary/10 text-primary font-bold rounded-xl active:scale-95 transition-all mt-auto"
              >
                Tushunarli
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

```

## File: apps/web/tailwind.config.cjs

```
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#020D2B',
        card: '#1E2746',
        primary: {
          DEFAULT: '#FFC400',
          dark: '#D4A017',
        },
        secondary: '#D4A017',
        success: '#00C853',
        danger: '#FF5252',
        muted: '#A5A9B5',
        border: 'rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFC400 0%, #D4A017 100%)',
        'premium-card': 'linear-gradient(135deg, #1E2746 0%, #020D2B 100%)',
      },
      boxShadow: {
        'premium': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'gold': '0 4px 14px 0 rgba(255, 196, 0, 0.39)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

```

## File: apps/web/declarations.d.ts

```
declare module '*.css';

```

## File: apps/web/services/api.ts

```
import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach JWT if present
api.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().token;
  
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
    console.log('DEBUG: Authorization header set directly from Zustand:', cfg.url);
  } else {
    console.warn('DEBUG: No token found in Zustand store.');
  }
  
  return cfg;
});

// Response helper to centralize error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
       console.error('DEBUG: 401 Unauthorized detected');
    }
    return Promise.reject(err);
  }
);
// ... keep the rest of the file exports ...

// Telegram WebApp helper: send initData to backend and store token
export async function loginWithTelegram(initData: string) {
  const resp = await api.post('/auth/telegram', { initData });
  const { token, user } = resp.data;
  return { token, user };
}

export async function updateProfile(data: { firstName: string }) {
  console.log('Updating profile with:', data);
  try {
    const resp = await api.patch('/auth/profile', data);
    console.log('Update response:', resp.data);
    return resp.data;
  } catch (error: any) {
    console.error('API Error details:', error.response?.data || error.message);
    throw error;
  }
}

export async function fetchOrders() {
  try {
    const resp = await api.get('/orders');
    return resp.data;
  } catch (error: any) {
    console.error('Fetch orders failed:', error.message);
    throw error;
  }
}

// ──────────────────────────────────────────────
// Payment Cards — active manual-transfer cards
// ──────────────────────────────────────────────
export async function fetchPaymentCards() {
  const resp = await api.get('/payments/cards');
  return resp.data;
}

// ──────────────────────────────────────────────
// Deposits — manual card deposit flow
// ──────────────────────────────────────────────
export async function createDeposit(amount: number, cardId: string) {
  const resp = await api.post('/deposits', { amount, cardId });
  return resp.data;
}

export async function fetchMyDeposits() {
  const resp = await api.get('/deposits/me');
  return resp.data;
}

// ──────────────────────────────────────────────
// Wallet — user balance
// ──────────────────────────────────────────────
export async function fetchMyWallet() {
  const resp = await api.get('/wallet/me');
  return resp.data;
}

// ──────────────────────────────────────────────
// Transactions — deposit / order / refund history
// ──────────────────────────────────────────────
export async function fetchMyTransactions() {
  const resp = await api.get('/transactions/me');
  return resp.data;
}

export async function pingBackend() {
  try {
    const resp = await api.post('/auth/test-connection');
    console.log('Ping response:', resp.data);
    return true;
  } catch (error: any) {
    console.error('Ping failed:', error.message);
    return false;
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gp_auth_storage');
  }
}

export default api;

```

## File: apps/admin/app/layout.tsx

```
import './globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-bg text-white">{children}</body>
    </html>
  );
}

```

## File: apps/admin/app/page.tsx

```
'use client';

import React from 'react';
import { Users, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, TrendingUp, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Jami foydalanuvchilar', value: '1,240', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Jami daromad', value: '45,200,000 UZS', icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Barcha buyurtmalar', value: '3,842', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Kutilayotgan', value: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const recentOrders = [
    { id: 'GP-9283', user: 'Azamat', amount: '12,000', game: 'PUBG', status: 'pending' },
    { id: 'GP-9282', user: 'Malika', amount: '48,000', game: 'MLBB', status: 'checking' },
    { id: 'GP-9281', user: 'Sardor', amount: '55,000', game: 'PUBG', status: 'paid' },
  ];

  return (
    <main className="min-h-screen bg-[#020D2B] text-white p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted text-sm mt-1">Xush kelibsiz, Super Admin</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-primary text-bg font-bold px-6 py-2 rounded-xl shadow-gold hover:scale-105 transition-transform">
            Hisobot yuklash
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1E2746] p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <TrendingUp size={16} className="text-success" />
            </div>
            <div>
              <p className="text-muted text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <section className="lg:col-span-2 bg-[#1E2746] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-lg">So'nggi buyurtmalar</h3>
            <button className="text-primary text-xs font-bold">Hammasini ko'rish</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-muted font-bold uppercase tracking-widest bg-white/5">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Foydalanuvchi</th>
                  <th className="px-6 py-4">O'yin</th>
                  <th className="px-6 py-4">Summa</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.user}</td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">{order.game}</td>
                    <td className="px-6 py-4 text-sm font-bold">{order.amount} UZS</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                        order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-all">
                          <CheckCircle size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all">
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Links / Actions */}
        <section className="space-y-6">
          <div className="bg-[#1E2746] p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="font-bold text-lg mb-4">Tezkor amallar</h3>
            <div className="space-y-2">
              <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between group transition-all">
                <span className="text-sm font-bold">O'yin qo'shish</span>
                <ChevronRight size={18} className="text-muted group-hover:text-primary" />
              </button>
              <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between group transition-all">
                <span className="text-sm font-bold">Paket qo'shish</span>
                <ChevronRight size={18} className="text-muted group-hover:text-primary" />
              </button>
              <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between group transition-all">
                <span className="text-sm font-bold">Banner sozlamalari</span>
                <ChevronRight size={18} className="text-muted group-hover:text-primary" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-secondary/10 p-6 rounded-2xl border border-primary/20 shadow-premium relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-primary">Tizim holati</h4>
              <p className="text-xs text-muted mt-2">Barcha servislar normal ishlamoqda.</p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success animate-ping"></div>
                <span className="text-[10px] font-bold uppercase">Online</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

```

## File: apps/admin/app/globals.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0f172a;
  --foreground: #ffffff;
}

body {
  background-color: var(--background);
  color: var(--foreground);
}

```

## File: apps/admin/tailwind.config.cjs

```
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#020D2B',
        card: '#1E2746',
        primary: '#FFC400',
        secondary: '#D4A017',
        success: '#00C853',
        danger: '#FF5252',
        muted: '#A5A9B5'
      }
    }
  },
  plugins: []
};

```

## File: apps/admin/declarations.d.ts

```
declare module '*.css';

```

## File: backend/prisma/seed.ts

```
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed active payment cards used by the manual-card deposit flow.
  const cardCount = await prisma.paymentCard.count();
  if (cardCount === 0) {
    await prisma.paymentCard.createMany({
      data: [
        {
          cardHolder: 'OGABEK O.',
          cardNumber: '8600 1234 5678 9012',
          bankName: 'Agrobank',
        },
        {
          cardHolder: 'OGABEK O.',
          cardNumber: '9860 5678 1234 9012',
          bankName: 'Humo - TBC Bank',
        },
      ],
    });
    console.log('Seeded payment cards');
  } else {
    console.log('Payment cards already exist, skipping');
  }

  // Seed Games and Packages
  const gameCount = await prisma.game.count();
  if (gameCount === 0) {
    const pubg = await prisma.game.create({
      data: {
        name: 'PUBG Mobile',
        slug: 'pubg-mobile',
        logo: 'https://img.tapimg.net/market/lcs/a1715694b7c152a4f6645a86d5e12812_360.png',
        status: 'active',
        packages: {
          create: [
            { title: '60 UC', amount: 60, price: 12000, status: 'active' },
            { title: '325 UC', amount: 325, price: 60000, status: 'active' },
            { title: '660 UC', amount: 660, price: 120000, status: 'active' },
          ],
        },
      },
    });

    const mlbb = await prisma.game.create({
      data: {
        name: 'Mobile Legends',
        slug: 'mobile-legends',
        logo: 'https://gwy-res.moonton.com/mlbb/home/logo.png',
        status: 'active',
        packages: {
          create: [
            { title: '86 Diamonds', amount: 86, price: 18000, status: 'active' },
            { title: '172 Diamonds', amount: 172, price: 35000, status: 'active' },
            { title: '257 Diamonds', amount: 257, price: 52000, status: 'active' },
          ],
        },
      },
    });

    console.log('Seeded games and packages');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```

## File: backend/src/main.ts

```
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { AppModule } from './modules/app.module';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.enableCors({
    origin: (origin, callback) => {
      // Allow all origins in development
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend is running on: http://localhost:${port}`);
  console.log(`For mobile devices, use: http://${require('os').networkInterfaces()['en0']?.[1]?.address || 'YOUR_IP'}:${port}`);
}

bootstrap();

```

## File: backend/src/common/filters/all-exceptions.filter.ts

```
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = (exception as any)?.message || 'Internal server error';
    const code = (exception as any)?.code;

    console.error('--- EXCEPTION START ---');
    console.error('Path:', request.url);
    console.error('Status:', status);
    console.error('Code:', code);
    console.error('Message:', message);
    if (exception instanceof Error) {
      console.error('Stack:', exception.stack);
    }
    console.error('--- EXCEPTION END ---');

    // Handle Prisma specific errors to avoid 500s for common issues
    if (code === 'P2002') {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Unique constraint failed',
        path: request.url,
      });
    }

    if (code === 'P2025' || code === 'P2003') {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Related record not found',
        path: request.url,
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}

```

## File: backend/src/common/decorators/user.decorator.ts

```
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});

```

## File: backend/src/common/jwt.service.ts

```
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private secret = process.env.JWT_SECRET || 'change_me';

  sign(payload: object, opts?: jwt.SignOptions) {
    return jwt.sign(payload, this.secret, { expiresIn: '7d', ...(opts || {}) });
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.secret) as any;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

```

## File: backend/src/common/prisma.service.ts

```
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

```

## File: backend/src/common/prisma.module.ts

```
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

```

## File: backend/src/common/guards/jwt.guard.ts

```
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    console.log('JWT_DEBUG: Incoming headers:', req.headers);
    console.log('JWT_DEBUG: Authorization header:', authHeader);

    let token: string | undefined;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies['gp_token']) {
      token = req.cookies['gp_token'];
    }
    
    if (!token) {
      console.warn('JWT_DEBUG: Token not found in header or cookies.');
      throw new UnauthorizedException('No token');
    }
    
    try {
        const payload = this.jwtService.verify(token);
        req.user = payload;
        return true;
    } catch (e) {
        console.error('JWT_DEBUG: Token verification failed:', e);
        throw new UnauthorizedException('Invalid token');
    }
  }
}

```

## File: backend/src/modules/payments/payments.controller.ts

```
import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Get('methods')
  listMethods() {
    return this.service.listMethods();
  }

  @Get('cards')
  listCards() {
    return this.service.listCards();
  }
}

```

## File: backend/src/modules/payments/payments.module.ts

```
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}

```

## File: backend/src/modules/payments/payments.service.ts

```
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  listMethods() {
    return this.prisma.paymentMethod.findMany({ where: { active: true } });
  }

  // Active manual-transfer cards shown on the deposit/payment screens.
  listCards() {
    return this.prisma.paymentCard.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}

```

## File: backend/src/modules/auth/dto/telegram-auth.dto.ts

```
import { IsString } from 'class-validator';

export class TelegramAuthDto {
  @IsString()
  initData: string;
}

```

## File: backend/src/modules/auth/auth.controller.ts

```
import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('telegram')
  async telegram(@Body() body: TelegramAuthDto) {
    const botToken = this.configService.get<string>('BOT_TOKEN');
    console.log('DEBUG: Bot token from config:', botToken);
    const result = await this.authService.telegramLogin(body.initData, botToken || '');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@CurrentUser() user: any, @Body() body: { firstName: string }) {
    return this.authService.updateProfile(user.sub, body);
  }

  @Post('test-connection')
  async testConnection() {
    return { status: 'ok', message: 'Backend is reachable' };
  }
}

```

## File: backend/src/modules/auth/auth.service.ts

```
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/prisma.service';
import { JwtService } from '../../common/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}
verifyTelegramInitData(initData: string, botToken: string): Record<string, string> {
  console.log('DEBUG: botToken used for verification:', botToken);
  // initData is the raw query string from Telegram WebApp
  const params = initData.split('&').map(p => {
// ... (rest of the file)
      const [k, ...rest] = p.split('=');
      return [k, decodeURIComponent(rest.join('='))];
    });
    const obj: Record<string, string> = Object.fromEntries(params as [string, string][]);
    const hash = obj.hash;
    if (!hash) throw new UnauthorizedException('Missing hash');

    const dataCheckArray = params
      .filter(([k]) => k !== 'hash')
      .map(([k, v]) => `${k}=${v}`)
      .sort();
    const dataCheckString = dataCheckArray.join('\n');
    console.log('DEBUG: dataCheckString:', dataCheckString);

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    console.log('DEBUG: hmac:', hmac);
    console.log('DEBUG: hash:', hash);

    // Timing safe compare
    const hashLower = hash.toLowerCase();
    const hmacBuffer = Buffer.from(hmac, 'hex');
    const hashBuffer = Buffer.from(hashLower, 'hex');

    if (hmacBuffer.length !== hashBuffer.length || !crypto.timingSafeEqual(hmacBuffer, hashBuffer)) {
      throw new UnauthorizedException('Invalid initData signature');
    }

    // Basic freshness check (auth_date)
    const authDate = Number(obj.auth_date || '0');
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 60 * 60 * 24) {
      throw new UnauthorizedException('initData is too old');
    }

    return obj;
  }

  async telegramLogin(initData: string, botToken: string) {
    const payload = this.verifyTelegramInitData(initData, botToken);
    
    let tgUser: any = {};
    try {
      if (payload.user) {
        tgUser = JSON.parse(payload.user);
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid user data in initData');
    }

    const telegramId = tgUser.id || payload.id || payload.user_id;
    if (!telegramId) throw new UnauthorizedException('telegram id missing');

    // Upsert user
    const user = await this.prisma.user.upsert({
      where: { telegramId: String(telegramId) },
      update: {
        username: tgUser.username || undefined,
        firstName: tgUser.first_name || undefined,
        photoUrl: tgUser.photo_url || undefined,
      },
      create: {
        telegramId: String(telegramId),
        username: tgUser.username || undefined,
        firstName: tgUser.first_name || undefined,
        photoUrl: tgUser.photo_url || undefined,
        wallets: {
          create: {
            balance: 0,
          },
        },
      },
    });

    // Issue JWT
    const token = this.jwtService.sign(
      { sub: user.id, role: user.role }
    );
    return { user, token };
  }

  async updateProfile(userId: string, data: { firstName: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { firstName: data.firstName },
    });
  }
}

```

## File: backend/src/modules/auth/auth.module.ts

```
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '../../common/jwt.service';

@Module({
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [AuthService, JwtService],
})
export class AuthModule {}

```

## File: backend/src/modules/admin/admin.controller.ts

```
import { Controller, Get, Patch, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateDepositStatusDto } from '../deposits/dto/update-deposit.dto';

@Controller('api/v1/admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

  @Get('orders')
  listOrders(@Query() query: any) {
    return this.service.listOrders(query);
  }

  @Patch('orders/:id')
  updateOrder(@Param('id') id: string, @Body() body: any) {
    return this.service.updateOrder(id, body);
  }

  @Get('deposits')
  listDeposits(@Query('status') status?: string) {
    return this.service.listDeposits(status);
  }

  @Patch('deposits/:id')
  updateDeposit(@Param('id') id: string, @Body() body: UpdateDepositStatusDto) {
    if (body.status === 'approved') {
      return this.service.approveDeposit(id);
    }
    if (body.status === 'rejected') {
      return this.service.rejectDeposit(id, body.reason || "To'lov topilmadi");
    }
    throw new BadRequestException('Invalid status');
  }
}

```

## File: backend/src/modules/admin/admin.module.ts

```
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DepositsModule } from '../deposits/deposits.module';

@Module({
  imports: [DepositsModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}

```

## File: backend/src/modules/admin/admin.service.ts

```
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { DepositsService } from '../deposits/deposits.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private deposits: DepositsService,
  ) {}

  async dashboard() {
    const totalUsers = await this.prisma.user.count();
    const totalOrders = await this.prisma.order.count();
    const totalRevenue = await this.prisma.order.aggregate({ _sum: { price: true } });
    const pendingOrders = await this.prisma.order.count({ where: { status: 'pending' } });
    const pendingDeposits = await this.prisma.deposit.count({ where: { status: 'pending' } });
    return { totalUsers, totalOrders, totalRevenue, pendingOrders, pendingDeposits };
  }

  listOrders(filter: any) {
    return this.prisma.order.findMany({ where: filter, include: { user: true, game: true, package: true } });
  }

  updateOrder(id: string, data: any) {
    return this.prisma.order.update({ where: { id }, data });
  }

  // --- Deposits ---
  listDeposits(status?: string) {
    return this.deposits.listAll(status);
  }

  approveDeposit(id: string) {
    return this.deposits.approve(id);
  }

  rejectDeposit(id: string, reason: string) {
    return this.deposits.reject(id, reason);
  }
}

```

## File: backend/src/modules/app.module.ts

```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { PackagesModule } from './packages/packages.module';
import { OrdersModule } from './orders/orders.module';
import { WalletsModule } from './wallets/wallets.module';
import { DepositsModule } from './deposits/deposits.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { SupportModule } from './support/support.module';
import { PrismaModule } from '../common/prisma.module';

import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    BotModule,
    GamesModule,
    PackagesModule,
    OrdersModule,
    WalletsModule,
    DepositsModule,
    TransactionsModule,
    PaymentsModule,
    AdminModule,
    SupportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

```

## File: backend/src/modules/deposits/dto/create-deposit.dto.ts

```
import { IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class CreateDepositDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  cardId: string;
}

```

## File: backend/src/modules/deposits/dto/update-deposit.dto.ts

```
import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateDepositStatusDto {
  @IsString()
  @IsIn(['approved', 'rejected'])
  status: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  reason?: string;
}

```

## File: backend/src/modules/deposits/deposits.controller.ts

```
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/deposits')
export class DepositsController {
  constructor(private readonly service: DepositsService) {}

  @Post()
  create(@Body() body: CreateDepositDto, @CurrentUser() user: any) {
    return this.service.create(user.sub, body.amount, body.cardId);
  }

  @Get('me')
  listMine(@CurrentUser() user: any) {
    return this.service.listMine(user.sub);
  }
}

```

## File: backend/src/modules/deposits/deposits.service.ts

```
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { BotService } from '../bot/bot.service';

const ANTI_SPAM_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class DepositsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private bot: BotService,
  ) {}

  // Register the Telegram inline-button handler so admins can approve/reject
  // a deposit directly from the notification message.
  onModuleInit() {
    this.bot.registerDepositActionHandler(async (action, depositId) => {
      if (action === 'approve') {
        const dep = await this.approve(depositId);
        return `✅ Deposit #${dep.id.slice(0, 8)} tasdiqlandi`;
      }
      const dep = await this.reject(depositId, "To'lov topilmadi");
      return `❌ Deposit #${dep.id.slice(0, 8)} rad etildi`;
    });
  }

  async create(userId: string, amount: number, cardId: string) {
    const card = await this.prisma.paymentCard.findUnique({ where: { id: cardId } });
    if (!card || !card.isActive) {
      throw new NotFoundException('To\'lov kartasi topilmadi');
    }
    if (amount <= 0) {
      throw new BadRequestException('Summa noto\'g\'ri');
    }

    // Anti-spam: same user + same amount + still pending within the last 5 minutes.
    const since = new Date(Date.now() - ANTI_SPAM_WINDOW_MS);
    const duplicate = await this.prisma.deposit.findFirst({
      where: {
        userId,
        amount,
        status: 'pending',
        createdAt: { gte: since },
      },
    });
    if (duplicate) {
      throw new ConflictException("Sizda hali tasdiqlanmagan to'lov mavjud");
    }

    const deposit = await this.prisma.deposit.create({
      data: { userId, cardId, amount, status: 'pending' },
      include: { user: true, card: true },
    });

    // Notify admin (fire-and-forget — a notification failure must not fail the request).
    console.log(`DEBUG: Attempting to send admin notification for deposit ${deposit.id}...`);
    this.bot
      .notifyAdminDeposit(deposit)
      .then(() => console.log(`DEBUG: Admin notification sent for deposit ${deposit.id}`))
      .catch((e) => console.error(`ERROR: notifyAdminDeposit failed for ${deposit.id}:`, e?.message, e?.stack));

    return deposit;
  }

  listMine(userId: string) {
    return this.prisma.deposit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { card: true },
    });
  }

  listAll(status?: string) {
    return this.prisma.deposit.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { user: true, card: true },
    });
  }

  async approve(id: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!deposit) throw new NotFoundException('Deposit topilmadi');
    if (deposit.status !== 'pending') {
      throw new BadRequestException('Bu deposit allaqachon ko\'rib chiqilgan');
    }

    // Atomically: mark approved, credit wallet, record a successful transaction.
    const [updated, wallet] = await this.prisma.$transaction(async (tx) => {
      const dep = await tx.deposit.update({
        where: { id },
        data: { status: 'approved' },
      });

      const existingWallet = await tx.wallet.findUnique({ where: { userId: deposit.userId } });
      const wal = existingWallet
        ? await tx.wallet.update({
            where: { userId: deposit.userId },
            data: { balance: { increment: deposit.amount } },
          })
        : await tx.wallet.create({
            data: { userId: deposit.userId, balance: deposit.amount },
          });

      await tx.transaction.create({
        data: {
          userId: deposit.userId,
          type: 'deposit',
          amount: deposit.amount,
          status: 'success',
        },
      });

      return [dep, wal];
    });

    // Notify the user.
    if (deposit.user?.telegramId) {
      this.bot
        .notifyUser(
          deposit.user.telegramId,
          `✅ To'lov tasdiqlandi\n\n${this.fmt(deposit.amount)} UZS balansingizga qo'shildi.\n\nJoriy balans: ${this.fmt(wallet.balance)} UZS`,
        )
        .catch((e) => console.error('notifyUser failed:', e?.message));
    }

    return updated;
  }

  async reject(id: string, reason: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!deposit) throw new NotFoundException('Deposit topilmadi');
    if (deposit.status !== 'pending') {
      throw new BadRequestException('Bu deposit allaqachon ko\'rib chiqilgan');
    }

    const updated = await this.prisma.deposit.update({
      where: { id },
      data: { status: 'rejected', adminNote: reason },
    });

    if (deposit.user?.telegramId) {
      this.bot
        .notifyUser(
          deposit.user.telegramId,
          `❌ To'lov rad etildi\n\nSabab: ${reason || "Noma'lum"}`,
        )
        .catch((e) => console.error('notifyUser failed:', e?.message));
    }

    return updated;
  }

  private fmt(value: any) {
    return Number(value).toLocaleString('ru-RU');
  }
}

```

## File: backend/src/modules/deposits/deposits.module.ts

```
import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { BotModule } from '../bot/bot.module';
import { JwtService } from '../../common/jwt.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Module({
  imports: [BotModule],
  providers: [DepositsService, JwtService, JwtAuthGuard],
  controllers: [DepositsController],
  exports: [DepositsService],
})
export class DepositsModule {}

```

## File: backend/src/modules/transactions/transactions.controller.ts

```
import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get('me')
  getMine(@CurrentUser() user: any) {
    return this.service.findByUser(user.sub);
  }
}

```

## File: backend/src/modules/transactions/transactions.service.ts

```
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  findByUser(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

```

## File: backend/src/modules/transactions/transactions.module.ts

```
import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { JwtService } from '../../common/jwt.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Module({
  providers: [TransactionsService, JwtService, JwtAuthGuard],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}

```

## File: backend/src/modules/support/support.service.ts

```
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(data: any) {
    return this.prisma.supportTicket.create({ data });
  }

  async listForUser(userId: string) {
    return this.prisma.supportTicket.findMany({ where: { userId } });
  }
}

```

## File: backend/src/modules/support/support.controller.ts

```
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('api/v1/support')
export class SupportController {
  constructor(private readonly service: SupportService) {}

  @Post('ticket')
  create(@Body() body: any) {
    return this.service.createTicket(body);
  }

  @Get()
  list(@Query('userId') userId: string) {
    return this.service.listForUser(userId);
  }
}

```

## File: backend/src/modules/support/support.module.ts

```
import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';

@Module({
  providers: [SupportService],
  controllers: [SupportController],
  exports: [SupportService],
})
export class SupportModule {}

```

## File: backend/src/modules/packages/packages.module.ts

```
import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';

@Module({
  providers: [PackagesService],
  controllers: [PackagesController],
  exports: [PackagesService],
})
export class PackagesModule {}

```

## File: backend/src/modules/packages/packages.service.ts

```
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.package.findMany();
  }

  async findByGame(gameId: string) {
    return this.prisma.package.findMany({ where: { gameId } });
  }

  async findOne(id: string) {
    const p = await this.prisma.package.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Package not found');
    return p;
  }
}

```

## File: backend/src/modules/packages/packages.controller.ts

```
import { Controller, Get, Param, Query } from '@nestjs/common';
import { PackagesService } from './packages.service';

@Controller('api/v1/packages')
export class PackagesController {
  constructor(private readonly service: PackagesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('by-game/:gameId')
  findByGame(@Param('gameId') gameId: string) {
    return this.service.findByGame(gameId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}

```

## File: backend/src/modules/bot/bot.service.ts

```
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

type DepositAction = 'approve' | 'reject';
type DepositActionHandler = (action: DepositAction, depositId: string) => Promise<string>;

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf | null = null;
  // Lazily-resolved handler registered by DepositsService to keep the modules decoupled.
  private depositActionHandler: DepositActionHandler | null = null;

  constructor(private configService: ConfigService) {}

  registerDepositActionHandler(handler: DepositActionHandler) {
    this.depositActionHandler = handler;
  }

  async onModuleInit() {
    const token = this.configService.get<string>('BOT_TOKEN');
    const adminChatId = this.configService.get<string>('ADMIN_CHAT_ID');

    if (!token || token === 'your_telegram_bot_token_here') {
      console.error('BOT_TOKEN is missing or invalid! Bot not started.');
      return;
    }

    if (!adminChatId) {
      console.warn('ADMIN_CHAT_ID is not set! Admin notifications will not work.');
    } else {
      console.log(`Admin notifications will be sent to: ${adminChatId}`);
    }

    this.bot = new Telegraf(token);
    this.setupHandlers();

    try {
      const webAppUrl = this.configService.get<string>('NEXT_PUBLIC_BASE_URL') || 'http://localhost:3000';

      await this.bot.telegram.setMyCommands([
        { command: 'start', description: 'Botni ishga tushirish' },
        { command: 'shop', description: 'Do\'konni ochish' },
        { command: 'profile', description: 'Profilni ko\'rish' },
        { command: 'orders', description: 'Buyurtmalar tarixini ko\'rish' },
        { command: 'help', description: 'Yordam va qo\'llab-quvvatlash' },
      ]);

      try {
        await this.bot.telegram.setChatMenuButton({
          menuButton: {
            type: 'web_app',
            text: 'Open',
            web_app: { url: webAppUrl },
          },
        });
      } catch (menuError) {
        // @ts-ignore
        console.warn('Could not set Chat Menu Button (likely due to non-HTTPS URL in dev):', menuError.message);
      }

      await this.bot.launch();
      console.log('Telegram Bot started successfully with commands');
    } catch (error) {
      console.error('Error starting Telegram Bot:', error);
    }
  }

  /** Send a new deposit request to the admin chat with Approve/Reject buttons. */
  async notifyAdminDeposit(deposit: any) {
    const adminChatId = this.configService.get<string>('ADMIN_CHAT_ID');
    if (!this.bot) {
      console.error('ERROR: Bot is not initialized. Cannot send admin notification.');
      return;
    }
    if (!adminChatId) {
      console.error('ERROR: ADMIN_CHAT_ID is not set in configuration. Admin notification skipped.');
      return;
    }

    const user = deposit.user || {};
    const amount = Number(deposit.amount).toLocaleString('ru-RU');
    const message =
      `💰 New Deposit Request\n\n` +
      `Deposit ID: #${deposit.id}\n` +
      `User: @${user.username || 'user'}\n` +
      `User ID: ${user.telegramId || '-'}\n` +
      `Amount: ${amount} UZS\n` +
      `Status: Pending`;

    await this.bot.telegram.sendMessage(adminChatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Approve', callback_data: `approve_deposit:${deposit.id}` },
            { text: '❌ Reject', callback_data: `reject_deposit:${deposit.id}` },
          ],
        ],
      },
    });
  }

  /** Send a direct message to a user by their Telegram id. */
  async notifyUser(telegramId: string, text: string) {
    if (!this.bot || !telegramId) return;
    await this.bot.telegram.sendMessage(telegramId, text);
  }

  private setupHandlers() {
    if (!this.bot) return;
    const webAppUrl = this.configService.get<string>('NEXT_PUBLIC_BASE_URL') || 'https://localhost:3000';
    // Telegram only allows HTTPS for WebApp buttons. 
    const isHttps = webAppUrl.startsWith('https://');
    
    if (!isHttps) {
      console.error('CRITICAL: WebApp URL must use HTTPS. Current URL:', webAppUrl);
    }

    this.bot.start(async (ctx) => {
      try {
        const replyMarkup = isHttps ? {
          inline_keyboard: [
            [{ text: '🚀 Do\'konni ochish', web_app: { url: webAppUrl } }],
          ],
        } : {
          inline_keyboard: [
            [{ text: '🔗 Brauzerda ochish', url: webAppUrl }],
          ],
        };

        await ctx.replyWithMarkdownV2(`*Xush kelibsiz, ${ctx.from.first_name || 'foydalanuvchi'}\\!* 🎮\n\nGang Pay orqali o'yinlar uchun paketlarni tez va arzon sotib oling\\.`, {
          reply_markup: replyMarkup,
        });
      } catch (e) {
        console.error('Bot start reply failed:', (e as Error).message);
        await ctx.reply(`Xush kelibsiz! Ilovani ochish uchun bosing: ${webAppUrl}`);
      }
    });

    this.bot.command('shop', async (ctx) => {
      try {
        if (isHttps) {
          await ctx.reply('Savdo qilish uchun pastdagi tugmani bosing:', {
            reply_markup: {
              inline_keyboard: [[{ text: '🛍 Do\'kon', web_app: { url: webAppUrl } }]],
            },
          });
        } else {
          await ctx.reply(`Savdo qilish uchun brauzer orqali kiring:\n${webAppUrl}`);
        }
      } catch (e) {
        await ctx.reply(`Do'kon: ${webAppUrl}`);
      }
    });

    this.bot.command('profile', (ctx) => {
      const url = `${webAppUrl}/profile`;
      if (isHttps) {
        ctx.reply('Profil ma\'lumotlarini ko\'rish uchun ilovani oching:', {
          reply_markup: {
            inline_keyboard: [[{ text: '👤 Profilim', web_app: { url } }]],
          },
        });
      } else {
        ctx.reply(`Profil uchun havola:\n${url}`);
      }
    });

    this.bot.command('orders', (ctx) => {
      const url = `${webAppUrl}/history`;
      if (isHttps) {
        ctx.reply('Barcha buyurtmalaringiz ro\'yxati ilovada:', {
          reply_markup: {
            inline_keyboard: [[{ text: '📋 Buyurtmalarim', web_app: { url } }]],
          },
        });
      } else {
        ctx.reply(`Buyurtmalar uchun havola:\n${url}`);
      }
    });

    this.bot.help((ctx) => {
      ctx.reply('Savollaringiz bormi? Biz bilan bog\'laning:\n\n👨‍💻 Admin: @Yoldashaliyev_19');
    });

    // Admin Approve / Reject inline-button callbacks.
    this.bot.action(/^approve_deposit:(.+)$/, (ctx) => this.handleDepositAction(ctx, 'approve'));
    this.bot.action(/^reject_deposit:(.+)$/, (ctx) => this.handleDepositAction(ctx, 'reject'));
  }

  private async handleDepositAction(ctx: any, action: DepositAction) {
    const depositId = ctx.match?.[1];
    try {
      if (!this.depositActionHandler || !depositId) {
        await ctx.answerCbQuery('Ishlov beruvchi mavjud emas');
        return;
      }
      const result = await this.depositActionHandler(action, depositId);
      await ctx.answerCbQuery(result);
      // Replace the inline keyboard so the action can't be repeated.
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] }).catch(() => {});
      await ctx.reply(result);
    } catch (e: any) {
      await ctx.answerCbQuery(e?.message?.slice(0, 190) || 'Xatolik').catch(() => {});
    }
  }
}

```

## File: backend/src/modules/bot/bot.module.ts

```
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';

@Module({
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}

```

## File: backend/src/modules/wallets/wallets.controller.ts

```
import { Controller, Get, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/wallet')
export class WalletsController {
  constructor(private readonly service: WalletsService) {}

  // Always scoped to the authenticated user — never trust a userId from the client.
  @Get('me')
  getMine(@CurrentUser() user: any) {
    return this.service.getOrCreateForUser(user.sub);
  }
}

```

## File: backend/src/modules/wallets/wallets.module.ts

```
import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { JwtService } from '../../common/jwt.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Module({
  providers: [WalletsService, JwtService, JwtAuthGuard],
  controllers: [WalletsController],
  exports: [WalletsService],
})
export class WalletsModule {}

```

## File: backend/src/modules/wallets/wallets.service.ts

```
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns the wallet for a user, creating an empty one if it does not exist.
   * The schema enforces a single wallet per user (Wallet.userId is unique).
   */
  async getOrCreateForUser(userId: string) {
    const existing = await this.prisma.wallet.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.wallet.create({ data: { userId, balance: 0 } });
  }
}

```

## File: backend/src/modules/orders/dto/create-order.dto.ts

```
import { IsString, IsNotEmpty, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  packageId: string;

  @IsString()
  @IsNotEmpty()
  uid: string; // game user id

  @IsString()
  @IsOptional()
  region?: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  currency?: string;
}

```

## File: backend/src/modules/orders/orders.module.ts

```
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { JwtService } from '../../common/jwt.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Module({
  providers: [OrdersService, JwtService, JwtAuthGuard],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}

```

## File: backend/src/modules/orders/orders.controller.ts

```
import { Controller, Post, Body, Get, Query, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  create(@Body() body: CreateOrderDto, @CurrentUser() user: any) {
    // attach userId
    const data = { ...body, userId: user.sub };
    return this.service.create(data);
  }

  @Get()
  findByUser(@Query('userId') userId: string, @CurrentUser() user: any) {
    // if userId not provided, use current user
    const uid = userId || user.sub;
    return this.service.findByUser(uid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}

```

## File: backend/src/modules/orders/orders.service.ts

```
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const order = await this.prisma.order.create({ data });
    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, include: { game: true, package: true } });
  }

  async findOne(id: string) {
    const o = await this.prisma.order.findUnique({ where: { id }, include: { game: true, package: true } });
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  async createOrder(userId: string, gameId: string, packageId: string, uid: string, region: string) {
    const pkg = await this.prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) throw new Error('Package not found');

    return this.prisma.order.create({
      data: {
        userId,
        gameId,
        packageId,
        uid,
        region,
        price: pkg.price,
        currency: 'UZS',
        status: 'pending',
      },
    });
  }
}

```

## File: backend/src/modules/games/games.module.ts

```
import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';

@Module({
  providers: [GamesService],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}

```

## File: backend/src/modules/games/games.service.ts

```
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.game.findMany({ include: { packages: true } });
  }

  async findOne(id: string) {
    const g = await this.prisma.game.findUnique({ where: { id }, include: { packages: true } });
    if (!g) throw new NotFoundException('Game not found');
    return g;
  }
}

```

## File: backend/src/modules/games/games.controller.ts

```
import { Controller, Get, Param } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('api/v1/games')
export class GamesController {
  constructor(private readonly service: GamesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}

```
