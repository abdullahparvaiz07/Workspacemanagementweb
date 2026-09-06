import { create } from 'zustand';
import { Workspace, WorkspaceMemberWithProfile } from '../types';
import { workspaceService } from '../services/workspace.service';
import { UserRole } from '@/types';

export interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  members: WorkspaceMemberWithProfile[];
  loading: boolean;
  activeTab: string;
  selectedProjectFilter: string | null;
  onlineUsers: string[];
  
  setOnlineUsers: (users: string[]) => void;
  setActiveTab: (tab: string) => void;
  setSelectedProjectFilter: (projectId: string | null) => void;
  loadWorkspaces: (userId: string) => Promise<void>;
  createWorkspace: (name: string, description: string, category: string, userId: string) => Promise<Workspace>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  
  loadMembers: (workspaceId: string) => Promise<void>;
  updateMemberRole: (workspaceId: string, userId: string, role: UserRole) => Promise<void>;
  removeMember: (workspaceId: string, userId: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspaceId: null,
  members: [],
  loading: false,
  activeTab: 'overview',
  selectedProjectFilter: null,
  onlineUsers: [],

  setOnlineUsers: (users: string[]) => set({ onlineUsers: users }),

  setActiveTab: (tab: string) => set({ activeTab: tab }),
  setSelectedProjectFilter: (projectId: string | null) => set({ selectedProjectFilter: projectId }),

  loadWorkspaces: async (userId: string) => {
    set({ loading: true });
    try {
      const workspaces = await workspaceService.getUserWorkspaces(userId);
      
      const state = get();
      // If we don't have an active workspace or it's not in the new list, select the first one
      let activeId = state.activeWorkspaceId;
      if (!activeId || !workspaces.find(w => w.id === activeId)) {
        activeId = workspaces.length > 0 ? workspaces[0].id : null;
      }
      
      set({ workspaces, activeWorkspaceId: activeId, loading: false });
      
      if (activeId) {
        await get().loadMembers(activeId);
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  createWorkspace: async (name, description, category, userId) => {
    const newWs = await workspaceService.createWorkspace(name, description, category, userId);
    set((state) => ({ workspaces: [...state.workspaces, newWs] }));
    await get().switchWorkspace(newWs.id);
    return newWs;
  },

  switchWorkspace: async (workspaceId: string) => {
    set({ activeWorkspaceId: workspaceId, selectedProjectFilter: null });
    await get().loadMembers(workspaceId);
  },

  updateWorkspace: async (workspaceId, updates) => {
    const updated = await workspaceService.updateWorkspace(workspaceId, updates);
    set((state) => ({
      workspaces: state.workspaces.map(w => w.id === workspaceId ? updated : w)
    }));
  },

  deleteWorkspace: async (workspaceId) => {
    await workspaceService.deleteWorkspace(workspaceId);
    const { workspaces, activeWorkspaceId } = get();
    const updated = workspaces.filter(w => w.id !== workspaceId);
    let nextId = activeWorkspaceId;
    if (activeWorkspaceId === workspaceId) {
      nextId = updated.length > 0 ? updated[0].id : null;
    }
    set({ workspaces: updated, activeWorkspaceId: nextId, selectedProjectFilter: null });
    if (nextId) {
      await get().loadMembers(nextId);
    }
  },

  loadMembers: async (workspaceId) => {
    try {
      const members = await workspaceService.getWorkspaceMembers(workspaceId);
      set({ members });
    } catch (error) {
      console.error(error);
    }
  },

  updateMemberRole: async (workspaceId, userId, role) => {
    await workspaceService.updateMemberRole(workspaceId, userId, role);
    await get().loadMembers(workspaceId);
  },

  removeMember: async (workspaceId, userId) => {
    await workspaceService.removeMember(workspaceId, userId);
    await get().loadMembers(workspaceId);
  }
}));
