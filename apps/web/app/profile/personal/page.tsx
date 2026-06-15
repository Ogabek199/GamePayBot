'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { User, Smartphone, Hash, Save, ShieldCheck, Loader2 } from 'lucide-react';
import { BackButton } from '../../../components/BackButton';
import { updateProfile, pingBackend } from '../../../services/api';
import { toast } from 'react-hot-toast';

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
        <h1 className="text-lg font-bold">Shaxsiy ma'lumotlar</h1>
        <button onClick={handleTestConnection} className="text-[10px] text-muted underline">Debug</button>
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
