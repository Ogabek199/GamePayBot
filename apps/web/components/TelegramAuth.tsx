'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { loginWithTelegram } from '../services/api';

export default function TelegramAuth() {
  const { setAuth, token } = useAuthStore();

  useEffect(() => {
    const initTelegram = async () => {
      // Check if we are inside Telegram WebApp
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const webapp = window.Telegram.WebApp;
        webapp.ready();
        webapp.expand();

        const initData = webapp.initData;
        const userUnsafe = webapp.initDataUnsafe?.user;
        
        if (initData) {
          try {
            // Log user data for debugging (as requested by user's example)
            if (userUnsafe) {
              console.log(`Telegram User detected: ID: ${userUnsafe.id}, Username: @${userUnsafe.username}`);
            }

            const { token: newToken, user } = await loginWithTelegram(initData);
            setAuth(newToken, user);
          } catch (error) {
            console.error('Telegram login failed:', error);
          }
        }
      }
    };

    initTelegram();
  }, [setAuth, token]);

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
