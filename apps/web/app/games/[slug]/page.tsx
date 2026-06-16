'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Info, ShoppingCart, ShieldCheck, Loader2 } from 'lucide-react';
import { useTranslation } from '../../../stores/useTranslation';
import { fetchGameBySlug, createOrder } from '../../../services/api';
import toast from 'react-hot-toast';

type PackageItem = {
  id: string;
  title: string;
  amount: number;
  price: number | string;
  image?: string | null;
};

type GameData = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  packages: PackageItem[];
};

export default function GameDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const gameSlug = String(slug);
  const router = useRouter();
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [uid, setUid] = useState('');
  const [region, setRegion] = useState('Global');
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchGameBySlug(gameSlug)
      .then((data) => setGame(data))
      .catch(() => toast.error(t('games.fetch_error')))
      .finally(() => setLoading(false));
  }, [gameSlug]);

  const handlePurchase = async () => {
    if (!selectedPkg || !uid.trim()) return;

    setPurchasing(true);
    try {
      await createOrder(selectedPkg, uid.trim(), region);
      toast.success(t('games.order_success'));
      router.push('/history');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || t('games.error_occurred');
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-20 text-muted">
        <p>{t('games.not_found')}</p>
      </div>
    );
  }

  const gameImage = game.logo || 'https://images6.alphacoders.com/102/1028306.jpg';
  const packages = game.packages ?? [];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <header className="flex items-center justify-between">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{game.name}</h1>
        <div className="w-10 h-10" />
      </header>

      <section className="relative h-48 rounded-[2.5rem] overflow-hidden shadow-premium flex items-end p-6">
        <img
          src={gameImage}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />

        <div className="relative z-10 flex items-center space-x-4">
          <div className="w-20 h-20 rounded-2xl bg-card p-2 border border-white/10 shadow-lg">
            <img src={gameImage} alt={game.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{game.name}</h2>
            <p className="text-xs text-primary font-bold flex items-center bg-primary/10 px-2 py-1 rounded-full w-fit mt-1">
              <ShieldCheck size={12} className="mr-1" /> {t('games.official_partner')}
            </p>
          </div>
        </div>
      </section>

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
                <img src={pkg.image || gameImage} alt={pkg.title} className="w-12 h-12 object-contain rounded-xl" />
                <div>
                  <h4 className="font-bold text-lg">{pkg.title}</h4>
                  <p className={`text-xs font-bold mt-1 ${selectedPkg === pkg.id ? 'text-primary' : 'text-muted'}`}>
                    {Number(pkg.price).toLocaleString()} {t('common.uzs')}
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

      <div className="mt-8">
        <button
          onClick={handlePurchase}
          disabled={!selectedPkg || !uid || purchasing}
          className={`w-full h-14 md:h-16 rounded-[2rem] font-bold text-lg flex items-center justify-center space-x-3 shadow-premium transition-all duration-300 ${
            selectedPkg && uid && !purchasing
              ? 'bg-gold-gradient text-bg shadow-gold scale-100'
              : 'bg-card text-muted opacity-50 cursor-not-allowed scale-95'
          }`}
        >
          {purchasing ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <>
              <ShoppingCart size={22} />
              <span>{t('games.place_order')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
