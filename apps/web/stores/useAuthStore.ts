import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  user: any | null;
  language: 'uz' | 'ru' | 'en';
  isAuthenticating: boolean;
  setAuth: (t: string, u: any) => void;
  setAuthenticating: (val: boolean) => void;
  updateUser: (u: any) => void;
  setLanguage: (lang: 'uz' | 'ru' | 'en') => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      language: 'uz',
      isAuthenticating: true,
      setAuth: (t, u) => {
        console.log('DEBUG: Setting auth, token:', t);
        set(() => ({ token: t, user: u, isAuthenticating: false }));
      },
      setAuthenticating: (val) => set(() => ({ isAuthenticating: val })),
      updateUser: (u) => set((state) => ({ user: { ...state.user, ...u } })),
      setLanguage: (lang) => set(() => ({ language: lang })),
    }),
    {
      name: 'gp_auth_storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
