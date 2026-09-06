import { create } from 'zustand';
import { Workspace } from '@/types';
import { workspaceService } from '@/services/workspace.service';

interface WorkspaceStore {
  activeWorkspaceId: string;
  activeTab: string;
  selectedProjectFilter: string | null;
  workspaces: Workspace[];
  setActiveTab: (tab: string) => void;
  setSelectedProjectFilter: (projectId: string | null) => void;
  switchWorkspace: (id: string) => void;
  createWorkspace: (name: string, description?: string, category?: string) => Workspace;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  updateWorkspaceName: (id: string, name: string) => void;
  updateWorkspaceDescription: (id: string, description: string) => void;
  deleteWorkspace: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  activeWorkspaceId: 'ws-1',
  activeTab: 'Overview',
  selectedProjectFilter: null,
  workspaces: workspaceService.getWorkspaces(),

  setActiveTab: (tab: string) => set({ activeTab: tab }),

  setSelectedProjectFilter: (projectId: string | null) => set({ selectedProjectFilter: projectId }),

  switchWorkspace: (id: string) => set({ activeWorkspaceId: id, selectedProjectFilter: null }),

  createWorkspace: (name: string, description?: string, category?: string) => {
    const newWs = workspaceService.createWorkspace(name, description, category);
    set({ workspaces: workspaceService.getWorkspaces(), activeWorkspaceId: newWs.id });
    return newWs;
  },

  updateWorkspace: (id: string, updates: Partial<Workspace>) => {
    const updated = workspaceService.updateWorkspace(id, updates);
    set({ workspaces: updated });
  },

  updateWorkspaceName: (id: string, name: string) => {
    const updated = workspaceService.updateWorkspace(id, { name });
    set({ workspaces: updated });
  },

  updateWorkspaceDescription: (id: string, description: string) => {
    const updated = workspaceService.updateWorkspace(id, { description });
    set({ workspaces: updated });
  },

  deleteWorkspace: (id: string) => {
    const updated = workspaceService.deleteWorkspace(id);
    const { activeWorkspaceId } = get();
    const nextId = updated.length > 0 ? updated[0].id : 'ws-1';
    set({
      workspaces: updated,
      activeWorkspaceId: activeWorkspaceId === id ? nextId : activeWorkspaceId,
    });
  },
}));
