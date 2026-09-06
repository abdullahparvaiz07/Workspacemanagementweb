import { create } from 'zustand';
import { Project } from '@/types';
import { projectService } from '@/services/project.service';

interface ProjectStore {
  projects: Project[];
  createProject: (
    workspaceId: string,
    name: string,
    description: string,
    category: string,
    color: string
  ) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  toggleStar: (id: string) => void;
  toggleStarProject: (id: string) => void;
  deleteProject: (id: string) => void;
  refresh: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: projectService.getProjects(),

  createProject: (
    workspaceId: string,
    name: string,
    description: string,
    category: string,
    color: string
  ) => {
    const newProj = projectService.createProject(workspaceId, name, description, category, color);
    set({ projects: projectService.getProjects() });
    return newProj;
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    const updated = projectService.updateProject(id, updates);
    set({ projects: updated });
  },

  toggleStar: (id: string) => {
    const updated = projectService.toggleStar(id);
    set({ projects: updated });
  },

  toggleStarProject: (id: string) => {
    const updated = projectService.toggleStarProject(id);
    set({ projects: updated });
  },

  deleteProject: (id: string) => {
    const updated = projectService.deleteProject(id);
    set({ projects: updated });
  },

  refresh: () => {
    set({ projects: projectService.getProjects() });
  },
}));
