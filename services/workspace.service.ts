import { Workspace } from '@/types';
import { storageService } from './storage.service';

class WorkspaceService {
  public getWorkspaces(): Workspace[] {
    return storageService.getTable('workspaces');
  }

  public getWorkspaceById(id: string): Workspace | undefined {
    return this.getWorkspaces().find((w) => w.id === id);
  }

  public createWorkspace(name: string, description?: string, category?: string, ownerId?: string): Workspace {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      description: description || 'New workspace stream.',
      category: category || 'Product & Design',
      ownerId: ownerId || 'u-1',
      settings: {
        defaultView: 'Overview',
        startWeekOn: 'Monday',
        timezone: '(GMT+5:00) Karachi',
        dateFormat: 'Jan 24, 2026',
      },
      createdAt: new Date().toISOString(),
    };

    storageService.updateTable('workspaces', (list) => [...list, newWs]);
    return newWs;
  }

  public updateWorkspace(id: string, updates: Partial<Workspace>): Workspace[] {
    return storageService.updateTable('workspaces', (list) =>
      list.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  }

  public deleteWorkspace(id: string): Workspace[] {
    return storageService.updateTable('workspaces', (list) =>
      list.filter((w) => w.id !== id)
    );
  }
}

export const workspaceService = new WorkspaceService();
