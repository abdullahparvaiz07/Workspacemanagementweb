import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { AuthUser, Profile } from '../types';

interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,

  login: async (email, password) => {
    const { user } = await authService.signIn(email, password);
    if (user) {
      const profile = await authService.getProfile(user.id);
      set({ user: { id: user.id, email: user.email! }, profile, loading: false });
    }
  },

  signup: async (email, password, fullName) => {
    const { user } = await authService.signUp(email, password, fullName);
    if (user) {
      const profile = await authService.getProfile(user.id);
      set({ user: { id: user.id, email: user.email! }, profile, loading: false });
    }
  },

  logout: async () => {
    await authService.signOut();
    set({ user: null, profile: null, loading: false });
  },

  refreshUser: async () => {
    try {
      const session = await authService.getSession();
      if (session?.user) {
        const profile = await authService.getProfile(session.user.id);
        set({ user: { id: session.user.id, email: session.user.email! }, profile, loading: false });
      } else {
        set({ user: null, profile: null, loading: false });
      }
    } catch {
      set({ user: null, profile: null, loading: false });
    }
  },
}));
