'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useTranslation } from '../stores/useTranslation';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, Crown, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { fetchWalletStats, fetchGames } from '../services/api';

type GameItem = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
};

export default function Home() {
  const { user, isAuthenticating } = useAuthStore();
  const { t } = useTranslation();
  const [balance, setBalance] = useState<number>(0);
  const [todayTopup, setTodayTopup] = useState<number>(0);
  const [pendingDeposits, setPendingDeposits] = useState<number>(0);
  const [games, setGames] = useState<GameItem[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetchWalletStats()
      .then((stats) => {
        setBalance(Number(stats?.balance ?? 0));
        setTodayTopup(Number(stats?.todayPayments ?? 0));
        setPendingDeposits(Number(stats?.pendingDeposits ?? 0));
      })
      .catch((error) => {
        console.error('fetchWalletStats failed:', error?.response?.status, error?.response?.data || error?.message);
        toast.error("Balans ma'lumotlarini yuklashda xatolik");
      });

    setGamesLoading(true);
    fetchGames()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data ?? data?.games ?? []);
        if (Array.isArray(list)) {
          setGames(list);
          setGamesError(null);
        } else {
          console.warn('fetchGames returned non-array:', data);
          setGames([]);
        }
      })
      .catch((error) => {
        console.error('fetchGames failed:', error?.response?.status, error?.response?.data || error?.message);
        setGamesError("O'yinlar ro'yxatini yuklab bo'lmadi");
        toast.error("O'yinlar ro'yxatini yuklashda xatolik");
      })
      .finally(() => setGamesLoading(false));
  }, [user]);

  // Loading — TelegramAuth ishlaguncha
  if (isAuthenticating || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted text-sm">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 space-y-8 w-full max-w-4xl mx-auto">

      <section className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary/50 overflow-hidden bg-card flex items-center justify-center">
              {user.photoUrl?.trim() && !avatarError ? (
                <img
                  src={user.photoUrl}
                  alt="User"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="text-lg font-bold text-primary">
                  {(user.firstName || user.username || '?').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest">{t('home.welcome')}</p>
            <h1 className="text-lg md:text-xl font-black truncate">
              {user.firstName || user.username || t('home.user')}
            </h1>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 border border-primary/20 shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-2">{t('home.your_balance')}</p>
          <div className="flex items-end space-x-2 mb-6">
            <h2 className="text-4xl md:text-5xl font-black text-primary">{balance.toLocaleString()}</h2>
            <span className="text-xl md:text-2xl font-bold text-primary/80 mb-2">UZS</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/wallet/deposit"
              className="flex items-center justify-center space-x-2 h-12 md:h-14 rounded-[1.5rem] bg-gold-gradient text-bg font-bold shadow-gold hover:shadow-gold/50 transition-all active:scale-95"
            >
              <Plus size={20} />
              <span>{t('home.topup')}</span>
            </Link>
            <Link
              href="/wallet"
              className="flex items-center justify-center space-x-2 h-12 md:h-14 rounded-[1.5rem] glass border border-primary/30 font-bold text-primary hover:bg-primary/10 transition-all active:scale-95"
            >
              <ChevronRight size={20} />
              <span>{t('common.wallet')}</span>
            </Link>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest">{t('home.popular_games')}</p>
            <h3 className="text-lg font-black">{t('home.choose_game')}</h3>
          </div>
        </div>

        {gamesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-[2rem] bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : gamesError ? (
          <div className="text-center py-8 text-muted text-sm">
            {gamesError}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">
            Hozircha o'yinlar mavjud emas
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {games.map((game) => (
              <motion.div key={game.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href={`/games/${game.slug}`} className="relative group overflow-hidden rounded-[2rem] aspect-square block">
                  <img
                    src={game.logo || '/images/game-placeholder.jpg'}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <p className="text-white font-bold text-xs line-clamp-2">{game.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <div className="glass-card p-5 md:p-6 rounded-[2rem] border border-primary/10 text-center">
          <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-2">{t('home.today_topup')}</p>
          <h3 className="text-2xl md:text-3xl font-black text-primary">{todayTopup.toLocaleString()}</h3>
          <p className="text-[10px] text-muted mt-2">UZS</p>
        </div>
        <div className="glass-card p-5 md:p-6 rounded-[2rem] border border-primary/10 text-center">
          <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-2">{t('home.pending_reqs')}</p>
          <h3 className="text-2xl md:text-3xl font-black text-yellow-500">{pendingDeposits.toLocaleString()}</h3>
          <p className="text-[10px] text-muted mt-2">{t('home.request')}</p>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-start space-x-3 p-4 md:p-5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
          <Crown className="text-primary flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="font-bold text-sm">{t('home.premium_topups')}</p>
            <p className="text-[10px] text-muted">{t('home.premium_desc')}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 md:p-5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
          <ShieldCheck className="text-primary flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="font-bold text-sm">{t('home.secure_topups')}</p>
            <p className="text-[10px] text-muted">{t('home.secure_desc')}</p>
          </div>
        </div>
      </section>
    </main>
  );
}