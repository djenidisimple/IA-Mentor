// lib/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  username: string;
  roles?: string[]; // 🔥 Ajouter les rôles
  avatarUrl?: string;
  points?: number;
  isPremium?: boolean;
  role?: string;
  createdAt?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  hasRole: (role: string) => boolean; // 🔥 Helper pour vérifier les rôles
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        // 🔥 Stocker aussi le token dans un cookie HttpOnly si possible
        localStorage.setItem('jwt_token', token);
        
        set({ 
          token, 
          user, 
          isAuthenticated: true 
        });
      },

      logout: () => {
        localStorage.removeItem('jwt_token');
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false 
        });
      },

      hasRole: (role: string) => {
        const { user } = get();
        return user?.roles?.includes(role) || false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);