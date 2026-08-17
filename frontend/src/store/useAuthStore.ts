import { create } from 'zustand';
import { User, UserRole } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  fetchMe: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  fetchMe: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.get('/auth/me');
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    } catch (e) {
      set({ user: null, isAuthenticated: false });
    }
  },

  switchRole: async (role: UserRole) => {
    try {
      set({ isLoading: true });
      const res = await api.post('/auth/demo-switch', { role });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to switch role' });
    }
  },
}));
