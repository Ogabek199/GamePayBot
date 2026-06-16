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
