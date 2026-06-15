import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  user: any | null;
  language: 'uz' | 'ru' | 'en';
  setAuth: (t: string, u: any) => void;
  updateUser: (u: any) => void;
  setLanguage: (lang: 'uz' | 'ru' | 'en') => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      language: 'uz',
      setAuth: (t, u) => set(() => ({ token: t, user: u })),
      updateUser: (u) => set((state) => ({ user: { ...state.user, ...u } })),
      setLanguage: (lang) => set(() => ({ language: lang })),
      logout: () => {
        set(() => ({ token: null, user: null }));
        if (typeof window !== 'undefined') {
          localStorage.removeItem('gp_auth_storage');
          window.location.href = '/';
        }
      },
    }),
    {
      name: 'gp_auth_storage',
    }
  )
);
