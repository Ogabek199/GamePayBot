'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { User, Smartphone, Hash, Save, ShieldCheck, Loader2 } from 'lucide-react';
import { BackButton } from '../../../components/BackButton';
import { updateProfile, pingBackend } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { useTranslation } from '../../../stores/useTranslation';

export default function PersonalInfoPage() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (user?.firstName) {
        setFirstName(user.firstName);
      }
    } catch (err) {
      console.error('Error in personal page effect:', err);
      setError('Sahifani yuklashda xatolik');
    }
  }, []);

  const handleTestConnection = async () => {
    try {
      const success = await pingBackend();
      if (success) {
        toast.success('Backend ulanishi muvaffaqiyatli!');
      } else {
        toast.error('Backendga ulanib bo\'lmadi!');
      }
    } catch (err) {
      console.error('Connection test error:', err);
      toast.error('Ulanish testida xatolik');
    }
  };

  const handleUpdate = async () => {
    if (!firstName.trim()) {
      toast.error('Ismni kiriting');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateProfile({ firstName: firstName.trim() });
      toast.success('Ma\'lumotlar muvaffaqiyatli yangilandi!');
    } catch (error) {
      console.error('Update failed:', error);
      setError('Ma\'lumotlarni yangilashda xatolik');
      toast.error('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-bold">{t('profile_personal.title')}</h1>
        <button onClick={handleTestConnection} className="text-[10px] text-muted underline">{t('profile_personal.debug')}</button>
      </header>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 text-danger text-sm">
          {error}
        </div>
      )}

      <section className="text-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-4 border-primary/20 p-1 overflow-hidden bg-card mx-auto flex items-center justify-center flex-shrink-0">
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
            <User size={64} className="text-primary/50" />
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-3">
            Ismingiz
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ismingizni kiriting"
            className="w-full bg-card border border-border rounded-2xl px-6 py-3 text-white placeholder:text-muted/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

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

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start space-x-3">
        <ShieldCheck className="text-primary flex-shrink-0" size={20} />
        <p className="text-[11px] text-muted leading-relaxed">
          Ma'lumotlaringiz Telegram orqali xavfsiz ulangan. Ismingizni shu yerda o'zgartirishingiz mumkin, qolgan ma'lumotlar avtomatik yangilanadi.
        </p>
      </div>

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
