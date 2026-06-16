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
  const {user, isAuthenticating} = useAuthStore();
  const {t} = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [todayTopup, setTodayTopup] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    if (user) {
      Promise.all([
        fetchMyWallet().catch(() => ({ balance: 0 })),
        fetchMyDeposits().catch(() => [])
      ]).then(([walletData, depositsData]) => {
        setBalance(Number(walletData?.balance || 0));
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const sumToday = depositsData
          .filter((d: any) => d.status === 'approved' && new Date(d.createdAt) >= startOfToday)
          .reduce((sum: number, d: any) => sum + Number(d.amount), 0);
        setTodayTopup(sumToday);
      }).catch((e) => {
        console.error('Error fetching home data:', e);
        setBalance(0);
        setTodayTopup(0);
      });
    }
  }, [user]);

  if (!mounted) return null;

  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 text-center">
          <p className="text-muted">Autentifikatsiya muvaffaqiyatsiz tugadi. Iltimos, qayta urinib ko'ring.</p>
        </div>
    );
  }

  // @ts-ignore
  return (
      <main
          className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 space-y-8 w-full max-w-4xl mx-auto">
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
