import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  user: any | null;
  language: 'uz' | 'ru' | 'en';
  // True only when the user explicitly logged out. While true, we never
  // auto-login from Telegram initData — the user must press "Kirish".
  loggedOut: boolean;
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
      loggedOut: false,
      setAuth: (t, u) => set(() => ({ token: t, user: u, loggedOut: false })),
      updateUser: (u) => set((state) => ({ user: { ...state.user, ...u } })),
      setLanguage: (lang) => set(() => ({ language: lang })),
      // Clear all user-specific data. We intentionally do NOT reload the page:
      // the AuthGate re-renders to the login screen and hides every piece of
      // user data (balance, transactions, deposits, profile).
      logout: () => set(() => ({ token: null, user: null, loggedOut: true })),
    }),
    {
      name: 'gp_auth_storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        language: state.language,
        loggedOut: state.loggedOut,
      }),
    }
  )
);
