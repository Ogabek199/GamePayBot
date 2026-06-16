'use client';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { loginWithTelegram } from '../services/api';

export default function TelegramAuth() {
  const { setAuth, setAuthenticating, token, user } = useAuthStore();
  // useRef — re-render bo'lsa ham bir marta ishlaydi
  const initiated = useRef(false);

  useEffect(() => {
    // Hydration kutish — persist store yuklanishi kerak
    const run = async () => {
      // Allaqachon ishlayapti — ikkinchi marta chaqirilmasin
      if (initiated.current) return;
      initiated.current = true;

      // Telegram WebApp mavjudligini tekshir
      if (typeof window === 'undefined') return;

      // WebApp skripti yuklanishini kut (max 3 soniya)
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

      // Token va user allaqachon localStorage da saqlangan bo'lsa —
      // initData ni yangilash uchun baribir re-auth qilamiz
      // (token eskirgan bo'lishi mumkin)
      setAuthenticating(true);

      try {
        console.log('[TelegramAuth] Login boshlandi...');
        const result = await loginWithTelegram(initData);
        setAuth(result.token, result.user);
        console.log('[TelegramAuth] Muvaffaqiyatli:', result.user?.firstName);
      } catch (err: any) {
        console.error('[TelegramAuth] Login xatosi:', err?.response?.data || err?.message);

        // Agar token va user localStorage da saqlangan bo'lsa — ishlataveramiz
        // Faqat to'liq yo'q bo'lsa xato ko'rsat
        if (token && user) {
          console.warn('[TelegramAuth] Eski session dan foydalanilmoqda');
          setAuthenticating(false);
        } else {
          setAuthenticating(false);
        }
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