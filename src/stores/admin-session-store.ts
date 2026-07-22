// GGH — Admin Session Store
// Zustand store for admin authentication state with session persistence

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AdminUser } from '@/types/ggh';

interface AdminSessionState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  isLoading: boolean;

  // Actions
  login: (admin: AdminUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkSession: () => Promise<void>;
}

export const useAdminSessionStore = create<AdminSessionState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      isLoading: false,

      login: (admin: AdminUser) => {
        set({
          isAuthenticated: true,
          admin,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          admin: null,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkSession: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/admin/auth/session');
          const result = await response.json();

          if (result.success && result.data?.authenticated) {
            const user = result.data.user;
            set({
              isAuthenticated: true,
              admin: {
                id: user.id,
                email: user.email,
                nameEn: user.nameEn,
                nameAr: user.nameAr,
                phone: user.phone,
                isActive: user.isActive,
                lastLoginAt: null,
                customerId: user.customerId,
                roles: user.roleNames || [],
                createdAt: '',
              },
              isLoading: false,
            });
          } else {
            set({
              isAuthenticated: false,
              admin: null,
              isLoading: false,
            });
          }
        } catch {
          set({
            isAuthenticated: false,
            admin: null,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'ggh-admin-session',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        admin: state.admin,
      }),
    }
  )
);
