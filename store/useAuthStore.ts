import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { authService } from '@/services/auth.service';

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

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: authService.getCurrentUser(),
  members: authService.getUsers(),
  isAuthenticated: true,

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
}));
