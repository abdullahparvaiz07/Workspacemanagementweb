import { create } from 'zustand';
import { Project, ProjectMemberWithProfile, ProjectRole } from '../types';
import { projectService } from '../services/project.service';

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  projectMembers: ProjectMemberWithProfile[];
  loading: boolean;
  
  loadProjects: (workspaceId: string) => Promise<void>;
  createProject: (workspaceId: string, name: string, description: string, color: string, userId: string) => Promise<Project>;
  setCurrentProject: (projectId: string) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  archiveProject: (projectId: string) => Promise<void>;

  addProjectMember: (projectId: string, userId: string, role: ProjectRole) => Promise<void>;
  removeProjectMember: (projectId: string, userId: string) => Promise<void>;
  updateProjectMemberRole: (projectId: string, userId: string, role: ProjectRole) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  projectMembers: [],
  loading: false,

  loadProjects: async (workspaceId: string) => {
    set({ loading: true });
    try {
      const projects = await projectService.getWorkspaceProjects(workspaceId);
      set({ projects, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  createProject: async (workspaceId, name, description, color, userId) => {
    set({ loading: true });
    try {
      const newProject = await projectService.createProject(workspaceId, name, description, color, userId);
      set((state) => ({ projects: [newProject, ...state.projects], loading: false }));
      return newProject;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  setCurrentProject: async (projectId: string) => {
    set({ loading: true });
    try {
      const project = await projectService.getProject(projectId);
      const members = await projectService.getProjectMembers(projectId);
      set({ currentProject: project, projectMembers: members, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  updateProject: async (projectId, updates) => {
    const updated = await projectService.updateProject(projectId, updates);
    set((state) => ({
      projects: state.projects.map(p => p.id === projectId ? updated : p),
      currentProject: state.currentProject?.id === projectId ? updated : state.currentProject
    }));
  },

  deleteProject: async (projectId) => {
    await projectService.deleteProject(projectId);
    set((state) => ({
      projects: state.projects.filter(p => p.id !== projectId),
      currentProject: state.currentProject?.id === projectId ? null : state.currentProject
    }));
  },

  archiveProject: async (projectId) => {
    const updated = await projectService.updateProject(projectId, { status: 'archived' });
    set((state) => ({
      projects: state.projects.map(p => p.id === projectId ? updated : p),
      currentProject: state.currentProject?.id === projectId ? updated : state.currentProject
    }));
  },

  addProjectMember: async (projectId, userId, role) => {
    await projectService.addProjectMember(projectId, userId, role);
    const members = await projectService.getProjectMembers(projectId);
    set({ projectMembers: members });
  },

  removeProjectMember: async (projectId, userId) => {
    await projectService.removeProjectMember(projectId, userId);
    const members = await projectService.getProjectMembers(projectId);
    set({ projectMembers: members });
  },

  updateProjectMemberRole: async (projectId, userId, role) => {
    await projectService.updateProjectMemberRole(projectId, userId, role);
    const members = await projectService.getProjectMembers(projectId);
    set({ projectMembers: members });
  }
}));
