'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { loginWithTelegram } from '../services/api';

export default function TelegramAuth() {
  const { setAuth, setAuthenticating } = useAuthStore();

  useEffect(() => {
    const initTelegram = async () => {
      console.log('AUTO_AUTH: Checking Telegram WebApp...');

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
        console.log('AUTO_AUTH: Attempting automatic login with initData...');
        const { token, user } = await loginWithTelegram(initData);
        
        console.log('AUTO_AUTH: Success, updating store.');
        setAuth(token, user);
      } catch (error) {
        console.error('AUTO_AUTH: Automatic login failed:', error);
        setAuthenticating(false);
      }
    };

    initTelegram();
  }, [setAuth, setAuthenticating]);

  return null;
}

// Add Telegram type definition to window
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
