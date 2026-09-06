import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { authService } from '@/services/auth.service';
import { useAuthStore as useRealAuthStore } from '@/features/auth/store/useAuthStore';

interface AuthStore {
  currentUser: User;
  members: User[];
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  inviteMember: (name: string, email: string, role: UserRole) => User;
  updateMemberRole: (id: string, role: UserRole) => void;
  removeMember: (id: string) => void;
  refresh: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  // Subscribe to the real auth store to bridge fake state with real state
  // until workspace/team features are fully migrated
  useRealAuthStore.subscribe((state) => {
    if (state.user && state.profile) {
      set({
        isAuthenticated: true,
        currentUser: {
          id: state.user.id,
          name: state.profile.full_name || state.user.email!.split('@')[0],
          email: state.user.email!,
          avatar: state.profile.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          role: 'owner',
          team: 'Product & Design',
          createdAt: new Date().toISOString(),
        }
      });
    } else {
      set({
        isAuthenticated: false,
        currentUser: authService.getCurrentUser() // Fallback
      });
    }
  });

  return {
    currentUser: authService.getCurrentUser(),
    members: authService.getUsers(),
    isAuthenticated: false,

    login: (email: string) => {
      const user = authService.login(email);
      set({ currentUser: user, isAuthenticated: true, members: authService.getUsers() });
    },

    logout: () => {
      set({ isAuthenticated: false });
    },

    switchRole: (role: UserRole) => {
      const { currentUser } = get();
      const updatedUsers = authService.updateRole(currentUser.id, role);
      const updatedUser = updatedUsers.find((u) => u.id === currentUser.id) || {
        ...currentUser,
        role,
      };
      set({ currentUser: updatedUser, members: updatedUsers });
    },

    inviteMember: (name: string, email: string, role: UserRole) => {
      const newMember = authService.inviteMember(name, email, role);
      set({ members: authService.getUsers() });
      return newMember;
    },

    updateMemberRole: (id: string, role: UserRole) => {
      const updatedUsers = authService.updateRole(id, role);
      const { currentUser } = get();
      const updatedUser = updatedUsers.find((u) => u.id === currentUser.id) || currentUser;
      set({ members: updatedUsers, currentUser: updatedUser });
    },

    removeMember: (id: string) => {
      const updatedUsers = authService.removeMember(id);
      set({ members: updatedUsers });
    },

    refresh: () => {
      set({ currentUser: authService.getCurrentUser(), members: authService.getUsers() });
    },
  };
});
