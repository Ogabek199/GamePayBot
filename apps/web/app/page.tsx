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

function Home() {
  const { user, isAuthenticating } = useAuthStore();
  const { t } = useTranslation();
  const [balance, setBalance] = useState<number>(0);
  const [todayTopup, setTodayTopup] = useState<number>(0);

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
          <p className="text-muted">Botda ro'yxatdan o'tish kerak. /start buyrug'ini bajaring.</p>
        </div>
    );
  }

  return (
      <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 space-y-8 w-full max-w-4xl mx-auto">
        {/* User Welcome Card */}
        <section className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary/50 overflow-hidden bg-card">
                {user?.photoUrl && user.photoUrl.trim() ? (
                    <img src={user.photoUrl} alt="User" className="w-full h-full object-cover" onError={(e) => {
                      (e.target as any).style.display = 'none';
                    }}/>
                ) : null}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest">Xush kelibsiz,</p>
              <h1 className="text-lg md:text-xl font-black truncate">{user?.firstName || user?.username || 'Foydalanuvchi'}</h1>
            </div>
          </div>
        </section>

        {/* Wallet Balance Card */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 border border-primary/20 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-2">Sizning balansingiz</p>
            <div className="flex items-end space-x-2 mb-6">
              <h2 className="text-4xl md:text-5xl font-black text-primary">{balance.toLocaleString()}</h2>
              <span className="text-xl md:text-2xl font-bold text-primary/80 mb-2">UZS</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/wallet/deposit" className="flex items-center justify-center space-x-2 h-12 md:h-14 rounded-[1.5rem] bg-gold-gradient text-bg font-bold shadow-gold hover:shadow-gold/50 transition-all active:scale-95">
                <Plus size={20} />
                <span>To'ldirish</span>
              </Link>
              <Link href="/wallet" className="flex items-center justify-center space-x-2 h-12 md:h-14 rounded-[1.5rem] glass border border-primary/30 font-bold text-primary hover:bg-primary/10 transition-all active:scale-95">
                <ChevronRight size={20} />
                <span>Hamyon</span>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Popular Games */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest">Mashhur o'yinlar</p>
              <h3 className="text-lg font-black">O'yin tanlang</h3>
            </div>
            <Link href="#" className="text-primary text-[10px] font-bold uppercase underline hover:text-primary/80">
              Barchasi →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {popularGames.map((game) => (
                <motion.div key={game.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href={`/games/${game.slug}`} className="relative group overflow-hidden rounded-[2rem] aspect-square block">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <p className="text-white font-bold text-xs line-clamp-2">{game.name}</p>
                    </div>
                  </Link>
                </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Cards */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="glass-card p-5 md:p-6 rounded-[2rem] border border-primary/10 text-center">
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-2">Bugungi to'lovlar</p>
            <h3 className="text-2xl md:text-3xl font-black text-primary">{todayTopup.toLocaleString()}</h3>
            <p className="text-[10px] text-muted mt-2">UZS</p>
          </div>
          <div className="glass-card p-5 md:p-6 rounded-[2rem] border border-primary/10 text-center">
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-2">Tasdiqlanmagan</p>
            <h3 className="text-2xl md:text-3xl font-black text-yellow-500">0</h3>
            <p className="text-[10px] text-muted mt-2">So'rov</p>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="space-y-3">
          <div className="flex items-start space-x-3 p-4 md:p-5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
            <Crown className="text-primary flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-bold text-sm">Premium to'lovlar</p>
              <p className="text-[10px] text-muted">Tezroq ishlash uchun premium xizmatdan foydalaning</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 md:p-5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
            <ShieldCheck className="text-primary flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-bold text-sm">Xavfsiz to'lovlar</p>
              <p className="text-[10px] text-muted">Barcha to'lovlar encrypted va xavfsizdir</p>
            </div>
          </div>
        </motion.section>
      </main>
  );
}

export default Home;
