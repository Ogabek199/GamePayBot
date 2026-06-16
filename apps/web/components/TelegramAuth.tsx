'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { loginWithTelegram } from '../services/api';

export default function TelegramAuth() {
  const { setAuth, setAuthenticating, user, token } = useAuthStore();

  useEffect(() => {
    // Only run once, and only if not already authenticated
    const hasRunBefore = sessionStorage.getItem('telegram_auth_attempted');
    if (hasRunBefore || (token && user)) {
      setAuthenticating(false);
      return;
    }

    const initTelegram = async () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('AUTO_AUTH: Checking Telegram WebApp...');
      }
      sessionStorage.setItem('telegram_auth_attempted', 'true');

      if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
        console.error('AUTO_AUTH: Telegram WebApp not detected.');
        setAuthenticating(false);
        return;
      }

      const webapp = window.Telegram.WebApp;
      webapp.ready();
      webapp.expand();

      const initData = webapp.initData;
      if (!initData) {
        console.error('AUTO_AUTH: No initData available.');
        setAuthenticating(false);
        return;
      }

      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log('AUTO_AUTH: Attempting automatic login with initData...');
        }
        const { token, user } = await loginWithTelegram(initData);
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('AUTO_AUTH: Success, updating store with user:', user);
        }
        setAuth(token, user);
      } catch (error) {
        console.error('AUTO_AUTH: Automatic login failed:', error);
        setAuthenticating(false);
      }
    };

    initTelegram();
  }, []); // Empty dependency array - run only once

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
