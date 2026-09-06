import { create } from 'zustand';
import { TaskStatus } from '@/types';

interface UIStore {
  isCommandPaletteOpen: boolean;
  isCreateTaskModalOpen: boolean;
  createTaskDefaultStatus: TaskStatus | null;
  isCreateProjectModalOpen: boolean;
  isInviteMemberModalOpen: boolean;
  isCreateWorkspaceModalOpen: boolean;
  selectedTaskIdForModal: string | null;
  searchQuery: string;

  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCreateTaskModalOpen: (open: boolean, defaultStatus?: TaskStatus | null) => void;
  setCreateProjectModalOpen: (open: boolean) => void;
  setInviteMemberModalOpen: (open: boolean) => void;
  setCreateWorkspaceModalOpen: (open: boolean) => void;
  setSelectedTaskIdForModal: (taskId: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCommandPaletteOpen: false,
  isCreateTaskModalOpen: false,
  createTaskDefaultStatus: null,
  isCreateProjectModalOpen: false,
  isInviteMemberModalOpen: false,
  isCreateWorkspaceModalOpen: false,
  selectedTaskIdForModal: null,
  searchQuery: '',

  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCreateTaskModalOpen: (open, defaultStatus = null) => set({ isCreateTaskModalOpen: open, createTaskDefaultStatus: defaultStatus }),
  setCreateProjectModalOpen: (open) => set({ isCreateProjectModalOpen: open }),
  setInviteMemberModalOpen: (open) => set({ isInviteMemberModalOpen: open }),
  setCreateWorkspaceModalOpen: (open) => set({ isCreateWorkspaceModalOpen: open }),
  setSelectedTaskIdForModal: (taskId) => set({ selectedTaskIdForModal: taskId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
