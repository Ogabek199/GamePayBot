import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type User = {
  id: string;
  telegramId: string;
  username?: string | null;
  firstName?: string | null;
  photoUrl?: string | null;
  role?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  language: 'uz' | 'ru' | 'en';
  isAuthenticating: boolean;
  setAuth: (t: string, u: User) => void;
  setAuthenticating: (val: boolean) => void;
  updateUser: (u: Partial<User>) => void;
  setLanguage: (lang: 'uz' | 'ru' | 'en') => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      language: 'uz',
      // false — chunki persist dan tiklanadi, TelegramAuth keyin tekshiradi
      isAuthenticating: false,
      setAuth: (t, u) => {
        set({ token: t, user: u, isAuthenticating: false });
      },
      setAuthenticating: (val) => set({ isAuthenticating: val }),
      updateUser: (u) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...u } : null,
        })),
      setLanguage: (lang) => set({ language: lang }),
      logout: () => {
        set({ token: null, user: null, isAuthenticating: false });
      },
    }),
    {
      name: 'gp_auth_storage',
      // localStorage — sessionStorage emas! Tab yopilsa ham saqlanadi
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      // Faqat token va user ni saqlash kerak
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        language: state.language,
      }),
    }
  )
);