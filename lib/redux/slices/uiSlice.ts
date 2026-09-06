import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UIState {
  isCommandPaletteOpen: boolean;
  isCreateTaskModalOpen: boolean;
  isCreateProjectModalOpen: boolean;
  isInviteMemberModalOpen: boolean;
  selectedTaskIdForModal: string | null;
  searchQuery: string;
  toasts: ToastMessage[];
}

const initialState: UIState = {
  isCommandPaletteOpen: false,
  isCreateTaskModalOpen: false,
  isCreateProjectModalOpen: false,
  isInviteMemberModalOpen: false,
  selectedTaskIdForModal: null,
  searchQuery: '',
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.isCommandPaletteOpen = action.payload;
    },
    toggleCommandPalette: (state) => {
      state.isCommandPaletteOpen = !state.isCommandPaletteOpen;
    },
    setCreateTaskModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateTaskModalOpen = action.payload;
    },
    setCreateProjectModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateProjectModalOpen = action.payload;
    },
    setInviteMemberModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isInviteMemberModalOpen = action.payload;
    },
    setSelectedTaskIdForModal: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskIdForModal = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addToast: (state, action: PayloadAction<{ type: ToastMessage['type']; message: string }>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      state.toasts.push({
        id,
        type: action.payload.type,
        message: action.payload.message,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setCommandPaletteOpen,
  toggleCommandPalette,
  setCreateTaskModalOpen,
  setCreateProjectModalOpen,
  setInviteMemberModalOpen,
  setSelectedTaskIdForModal,
  setSearchQuery,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
