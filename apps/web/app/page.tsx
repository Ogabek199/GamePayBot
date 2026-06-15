'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, Crown } from 'lucide-react';
import Link from 'next/link';

const popularGames = [
  { id: '1', name: 'PUBG Mobile', slug: 'pubg-mobile', image: 'https://img.tapimg.net/market/lcs/a1715694b7c152a4f6645a86d5e12812_360.png' },
  { id: '2', name: 'Mobile Legends', slug: 'mobile-legends', image: 'https://gwy-res.moonton.com/mlbb/home/logo.png' },
  { id: '3', name: 'Free Fire', slug: 'free-fire', image: 'https://dl.dir.freefiremobile.com/freefire/prospectus/static/media/logo.5d36e766.png' },
  { id: '4', name: 'Valorant', slug: 'valorant', image: 'https://images.contentstack.io/v3/assets/blvt82881e155672d65/blvt1524385966d4826d/5ead569c730e782631557a62/VAL_Logo_V_Black_on_Red.png' },
  { id: '5', name: 'Steam', slug: 'steam', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png' },
];

import { useTranslation } from '../stores/useTranslation';

export default function Home() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen animate-fade-in p-5 pb-32 space-y-8 max-w-md mx-auto">
      {/* User Welcome Card */}
      <section className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-primary/50 overflow-hidden bg-card">
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-primary/10 text-primary">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-bg rounded-full p-1 shadow-lg border-2 border-bg">
              <Crown size={12} fill="currentColor" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-muted text-xs">{t('common.welcome')}</span>
            </div>
            <h2 className="text-lg font-bold leading-tight">
              {user?.firstName || 'Foydalanuvchi'}
            </h2>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-white transition-colors">
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Balance Card */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-premium-card rounded-[2rem] p-7 border border-white/5 overflow-hidden shadow-premium">
          {/* Background Decorative Circles */}
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>

          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
              <p className="text-muted text-xs font-medium uppercase tracking-wider">{t('wallet.total_balance')}</p>
              <div className="flex items-baseline space-x-1">
                <h3 className="text-4xl font-extrabold tracking-tight">0</h3>
                <span className="text-primary font-bold">{t('common.uzs')}</span>
              </div>
            </div>
            <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-bold text-primary flex items-center space-x-1">
                <Crown size={10} className="mr-1" /> {t('profile.gold').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between relative z-10">
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted font-bold uppercase">{t('common.balance')} {t('common.topup').toLowerCase()}</p>
              <p className="text-sm font-semibold">+ 0 {t('common.uzs')} bugun</p>
            </div>
            <Link 
              href="/wallet/deposit"
              className="btn-gold h-12 w-12 !p-0 !rounded-2xl"
            >
              <Plus size={24} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Carousel (Placeholder) */}
      <section className="h-40 rounded-3xl overflow-hidden glass premium-border relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-purple-600/40 animate-pulse"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <span className="bg-primary/20 text-primary text-[10px] font-bold py-1 px-2 rounded w-fit mb-2">HOT OFFER</span>
          <h3 className="text-xl font-bold max-w-[60%]">PUBG Mobile UC bo'yicha katta chegirma!</h3>
          <p className="text-xs text-muted mt-1">Hozir sotib oling va 10% bonusga ega bo'ling</p>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold">{t('home.popular_games')}</h3>
          <button className="text-xs font-bold text-primary flex items-center">
            {t('home.see_all')} <ChevronRight size={14} className="ml-1" />
          </button>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-4 px-1 hide-scrollbar -mx-5 px-5">
          {popularGames.map((game) => (
            <motion.div 
              key={game.id}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link href={`/games/${game.slug}`} className="block group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-card border border-border shadow-lg group-hover:border-primary/50 transition-all duration-300">
                  <img src={game.image} alt={game.name} className="w-full h-full object-cover p-2" />
                </div>
                <p className="text-[11px] font-bold text-center mt-2 group-hover:text-primary transition-colors line-clamp-1">
                  {game.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories / Services (Extra) */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <Wallet size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-muted">{t('home.fast_payment')}</h4>
            <p className="text-xs">{t('home.auto_system')}</p>
          </div>
        </div>
        <div className="glass-card p-4 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Clock size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-muted">{t('home.support_247')}</h4>
            <p className="text-xs">{t('home.always_online')}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

// Dummy Wallet icon for categories section
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
