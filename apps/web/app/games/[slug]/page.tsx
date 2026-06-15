'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, ShoppingCart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const packages = [
  { id: '1', title: '60 UC', amount: 60, price: '12 000', image: 'https://www.midasbuy.com/images/apps/pubgm/1.png' },
  { id: '2', title: '325 UC', amount: 325, price: '55 000', image: 'https://www.midasbuy.com/images/apps/pubgm/2.png' },
  { id: '3', title: '660 UC', amount: 660, price: '110 000', image: 'https://www.midasbuy.com/images/apps/pubgm/3.png' },
  { id: '4', title: '1800 UC', amount: 1800, price: '280 000', image: 'https://www.midasbuy.com/images/apps/pubgm/4.png' },
  { id: '5', title: '3850 UC', amount: 3850, price: '580 000', image: 'https://www.midasbuy.com/images/apps/pubgm/5.png' },
  { id: '6', title: '8100 UC', amount: 8100, price: '1 150 000', image: 'https://www.midasbuy.com/images/apps/pubgm/6.png' },
];

export default function GameDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [uid, setUid] = useState('');
  const [region, setRegion] = useState('Global');

  const gameName = String(slug).replace(/-/g, ' ').toUpperCase();

  const handlePurchase = () => {
    if (!selectedPkg || !uid) return;
    // Logic to create order and redirect to payment
    router.push(`/payment?pkg=${selectedPkg}&uid=${uid}&game=${slug}`);
  };

  return (
    <main className="min-h-screen animate-fade-in p-5 pb-32 max-w-md mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{gameName}</h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      {/* Hero Banner */}
      <section className="relative h-48 rounded-[2.5rem] overflow-hidden shadow-premium">
        <img 
          src="https://images6.alphacoders.com/102/1028306.jpg" 
          alt={gameName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 flex items-center space-x-3">
          <div className="w-16 h-16 rounded-2xl glass p-2 border-white/20">
            <img src="https://img.tapimg.net/market/lcs/a1715694b7c152a4f6645a86d5e12812_360.png" alt="logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{gameName}</h2>
            <p className="text-xs text-primary font-bold flex items-center">
              <ShieldCheck size={12} className="mr-1" /> Rasmiy hamkor
            </p>
          </div>
        </div>
      </section>

      {/* Form Fields */}
      <section className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted uppercase ml-2">Foydalanuvchi ID (UID)</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="UID kiriting" 
              className="w-full h-14 bg-card rounded-2xl px-6 border border-border focus:border-primary/50 outline-none transition-all font-bold tracking-wider"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
            />
            <Info size={18} className="absolute right-4 top-4 text-muted/50" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted uppercase ml-2">Region</label>
          <select 
            className="w-full h-14 bg-card rounded-2xl px-6 border border-border focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-pointer"
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
        <h3 className="text-lg font-bold px-1">Paketni tanlang</h3>
        <div className="grid grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedPkg(pkg.id)}
              className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer ${
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
                    {pkg.price} UZS
                  </p>
                </div>
              </div>
              {selectedPkg === pkg.id && (
                <div className="absolute top-2 right-2 bg-primary text-bg rounded-full p-1">
                  <ShieldCheck size={12} fill="currentColor" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Purchase Button Footer */}
      <div className="fixed bottom-28 left-0 right-0 px-6 z-40 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={handlePurchase}
            disabled={!selectedPkg || !uid}
            className={`w-full h-16 rounded-[2rem] font-bold text-lg flex items-center justify-center space-x-3 shadow-premium transition-all duration-300 ${
              selectedPkg && uid 
              ? 'bg-gold-gradient text-bg shadow-gold scale-100' 
              : 'bg-card text-muted opacity-50 cursor-not-allowed scale-95'
            }`}
          >
            <ShoppingCart size={22} />
            <span>Sotib olish</span>
          </button>
        </div>
      </div>
    </main>
  );
}
