'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import uz from '../public/locales/uz.json';
import ru from '../public/locales/ru.json';
import en from '../public/locales/en.json';

const translations: any = { uz, ru, en };

type TranslationState = {
  lang: 'uz' | 'ru' | 'en';
  setLang: (l: 'uz' | 'ru' | 'en') => void;
  t: (key: string) => string;
  hasHydrated: boolean;
  setHasHydrated: (h: boolean) => void;
};

export const useTranslation = create<TranslationState>()(
  persist(
    (set, get) => ({
      lang: 'uz',
      hasHydrated: false,
      setLang: (l) => set({ lang: l }),
      setHasHydrated: (h) => set({ hasHydrated: h }),
      t: (key: string) => {
        const lang = get().lang;
        const [section, subkey] = key.split('.');
        // Har doim tarjimadan qiymat qaytarish (hydrated bo'lmasa ham uz default)
        return translations[lang]?.[section]?.[subkey]
          || translations['uz']?.[section]?.[subkey]
          || key;
      },
    }),
    { 
      name: 'gp_lang_storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
