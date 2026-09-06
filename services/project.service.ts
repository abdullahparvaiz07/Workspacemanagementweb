import { Project } from '@/types';
import { storageService } from './storage.service';

class ProjectService {
  public getProjects(workspaceId?: string): Project[] {
    const projects = storageService.getTable('projects');
    if (workspaceId) {
      return projects.filter((p) => p.workspaceId === workspaceId);
    }
    return projects;
  }

  public createProject(
    workspaceId: string,
    name: string,
    description: string,
    category: string,
    color: string
  ): Project {
    const newProj: Project = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      workspaceId,
      name,
      description: description || 'No description provided.',
      category: category || 'Product & Engineering',
      color: color || '#D97706',
      status: 'active',
      starred: false,
      members: ['u-1'],
      createdAt: new Date().toISOString(),
    };

    storageService.updateTable('projects', (list) => [newProj, ...list]);
    return newProj;
  }

  public updateProject(id: string, updates: Partial<Project>): Project[] {
    return storageService.updateTable('projects', (list) =>
      list.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }

  public toggleStar(id: string): Project[] {
    return storageService.updateTable('projects', (list) =>
      list.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p))
    );
  }

  public toggleStarProject(id: string): Project[] {
    return this.toggleStar(id);
  }

  public deleteProject(id: string): Project[] {
    return storageService.updateTable('projects', (list) =>
      list.filter((p) => p.id !== id)
    );
  }
}

export const projectService = new ProjectService();
