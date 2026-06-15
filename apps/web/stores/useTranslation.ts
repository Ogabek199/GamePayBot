'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import uz from '../public/locales/uz.json';
import ru from '../public/locales/ru.json';
import en from '../public/locales/en.json';

const translations: any = { uz, ru, en };

type TranslationState = {
  lang: 'uz' | 'ru' | 'en';
  setLang: (l: 'uz' | 'ru' | 'en') => void;
  t: (key: string) => string;
};

export const useTranslation = create<TranslationState>()(
  persist(
    (set, get) => ({
      lang: 'uz',
      setLang: (l) => set({ lang: l }),
      t: (key: string) => {
        const [section, subkey] = key.split('.');
        return translations[get().lang]?.[section]?.[subkey] || key;
      },
    }),
    { name: 'gp_lang_storage' }
  )
);
