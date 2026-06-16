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
