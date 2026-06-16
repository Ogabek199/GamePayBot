'use client';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { loginWithTelegram } from '../services/api';

export default function TelegramAuth() {
  const { setAuth, setAuthenticating, token, user } = useAuthStore();
  const initiated = useRef(false);

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;

    if (typeof window === 'undefined') return;

    // DEV MODE: Telegram bo'lmasa darhol mock user o'rnat (async kutmasdan)
    if (process.env.NODE_ENV !== 'production') {
      const hasTelegramData = !!window.Telegram?.WebApp?.initData;
      if (!hasTelegramData) {
        console.warn('[TelegramAuth] Dev mode: Mock user o\'rnatildi');
        setAuth('dev-mock-token', {
          id: 'dev-user-id',
          telegramId: '123456789',
          firstName: 'Developer',
          username: 'dev_user',
          photoUrl: null,
          role: 'USER',
        });
        return;
      }
    }

    // PRODUCTION: Telegram WebApp orqali login
    const run = async () => {
      // WebApp SDK yuklanishini kut (max 3 soniya)
      let attempts = 0;
      while (!window.Telegram?.WebApp && attempts < 30) {
        await new Promise((r) => setTimeout(r, 100));
        attempts++;
      }

      if (!window.Telegram?.WebApp) {
        console.error('[TelegramAuth] WebApp SDK topilmadi');
        setAuthenticating(false);
        return;
      }

      const webapp = window.Telegram.WebApp;
      webapp.ready();
      webapp.expand();

      const initData = webapp.initData;

      if (!initData) {
        console.error('[TelegramAuth] initData bo\'sh — bot orqali kiring');
        setAuthenticating(false);
        return;
      }

      setAuthenticating(true);

      try {
        const result = await loginWithTelegram(initData);
        setAuth(result.token, result.user);
        console.log('[TelegramAuth] Login muvaffaqiyatli:', result.user?.firstName);
      } catch (err: any) {
        console.error('[TelegramAuth] Login xatosi:', err?.response?.data || err?.message);
        if (token && user) {
          console.warn('[TelegramAuth] Eski session ishlatilmoqda');
        }
        setAuthenticating(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            photo_url?: string;
          };
        };
        ready: () => void;
        expand: () => void;
      };
    };
  }
}