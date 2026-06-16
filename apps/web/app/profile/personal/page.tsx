'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { Smartphone, Hash, Save, ShieldCheck, Loader2 } from 'lucide-react';
import { BackButton } from '../../../components/BackButton';
import { updateProfile, pingBackend } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { useTranslation } from '../../../stores/useTranslation';

export default function PersonalInfoPage() {
  const { user } = useAuthStore();
  const { t, hasHydrated } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (user?.firstName) {
      setFirstName(user.firstName);
    }
  }, [user]);

  const handleTestConnection = async () => {
    try {
      const success = await pingBackend();
      if (success) {
        toast.success(t('profile_personal.connection_success'));
      } else {
        toast.error(t('profile_personal.connection_failed'));
      }
    } catch (err) {
      console.error('Connection test error:', err);
      toast.error(t('profile_personal.connection_failed'));
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
      const updatedUser = await updateProfile({ firstName: firstName.trim() });
      useAuthStore.getState().updateUser(updatedUser);
      toast.success(t('profile_personal.update_success'));
    } catch (err) {
      console.error('Update failed:', err);
      setError(t('profile_personal.update_failed'));
      toast.error(t('profile_personal.update_failed'));
    } finally {
      setLoading(false);
    }
  };

  // Tarjimalar yuklanmaguncha loading ko'rsat
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const avatarLetter = (user?.firstName || user?.username || 'U').charAt(0).toUpperCase();

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-32 md:pb-8 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-bold">{t('profile_personal.title')}</h1>
        <button onClick={handleTestConnection} className="text-[10px] text-muted underline">
          {t('profile_personal.debug')}
        </button>
      </header>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 text-danger text-sm">
          {error}
        </div>
      )}

      <section className="text-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-4 border-primary/20 p-1 overflow-hidden bg-card mx-auto flex items-center justify-center flex-shrink-0">
          {user?.photoUrl && !imgError ? (
            <img
              src={user.photoUrl}
              alt="Avatar"
              className="w-full h-full object-cover rounded-[1.5rem]"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold bg-primary/10 text-primary rounded-[1.5rem]">
              {avatarLetter}
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted mt-3">{t('profile_personal.profile_photo_desc')}</p>
      </section>

      <section className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-3">
            {t('profile_personal.name')}
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t('profile_personal.name_placeholder')}
            className="w-full bg-card border border-border rounded-2xl px-6 py-3 text-white placeholder:text-muted/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="glass-card p-4 md:p-6 flex items-center space-x-4 premium-border opacity-80">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary flex-shrink-0">
            <Smartphone size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('profile_personal.username')}</p>
            <p className="font-bold text-base md:text-lg truncate">
              {user?.username ? `@${user.username}` : t('profile_personal.unknown')}
            </p>
          </div>
        </div>

        <div className="glass-card p-4 md:p-6 flex items-center space-x-4 premium-border opacity-80">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary flex-shrink-0">
            <Hash size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('profile_personal.telegram_id')}</p>
            <p className="font-bold text-base md:text-lg truncate">{user?.telegramId || t('profile_personal.unknown')}</p>
          </div>
        </div>
      </section>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start space-x-3">
        <ShieldCheck className="text-primary flex-shrink-0" size={20} />
        <p className="text-[11px] text-muted leading-relaxed">
          {t('profile_personal.security_note')}
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
            <span>{t('profile_personal.update')}</span>
          </>
        )}
      </button>
    </main>
  );
}
