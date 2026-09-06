import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface AuthState {
  currentUser: User;
  members: User[];
  isAuthenticated: boolean;
}

const initialMembers: User[] = [
  {
    id: 'u-1',
    name: 'Abdullah Parvaiz',
    email: 'abdullah@acme.studio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'owner',
  },
  {
    id: 'u-2',
    name: 'Sarah Chen',
    email: 'sarah@acme.studio',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'admin',
  },
  {
    id: 'u-3',
    name: 'Karan Mehta',
    email: 'karan@acme.studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'member',
  },
  {
    id: 'u-4',
    name: 'Priya Singh',
    email: 'priya@acme.studio',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    role: 'viewer',
  },
];

const initialState: AuthState = {
  currentUser: initialMembers[0],
  members: initialMembers,
  isAuthenticated: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    switchUserRole: (state, action: PayloadAction<User['role']>) => {
      state.currentUser.role = action.payload;
      const m = state.members.find((u) => u.id === state.currentUser.id);
      if (m) m.role = action.payload;
    },
    addMember: (state, action: PayloadAction<User>) => {
      state.members.push(action.payload);
    },
    updateMemberRole: (state, action: PayloadAction<{ id: string; role: User['role'] }>) => {
      const m = state.members.find((u) => u.id === action.payload.id);
      if (m) m.role = action.payload.role;
      if (state.currentUser.id === action.payload.id) {
        state.currentUser.role = action.payload.role;
      }
    },
    removeMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter((u) => u.id !== action.payload);
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const {
  setCurrentUser,
  switchUserRole,
  addMember,
  updateMemberRole,
  removeMember,
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
