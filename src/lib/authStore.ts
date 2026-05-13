// src/lib/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { apiClient } from './api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirm: string) => Promise<void>;
  logout: () => Promise<void>;
  rehydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { user, token } = await apiClient.login(email, password);
          localStorage.setItem('auth_token', token);
          set({ user, token, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (name, email, password, confirm) => {
        set({ isLoading: true });
        try {
          const { user, token } = await apiClient.register(name, email, password, confirm);
          localStorage.setItem('auth_token', token);
          set({ user, token, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await apiClient.logout();
        } finally {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null });
        }
      },

      rehydrate: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token || get().user) return;
        try {
          const { user } = await apiClient.me();
          set({ user, token });
        } catch {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null });
        }
      },
    }),
    {
      name: 'mojawad-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
