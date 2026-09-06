import { Task, TaskStatus } from '@/types';
import { storageService } from './storage.service';

class TaskService {
  public getTasks(workspaceId?: string): Task[] {
    const tasks = storageService.getTable('tasks');
    if (workspaceId) {
      return tasks.filter((t) => t.workspaceId === workspaceId);
    }
    return tasks;
  }

  public createTask(taskData: Omit<Task, 'id' | 'commentsCount' | 'createdAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };

    storageService.updateTable('tasks', (list) => [newTask, ...list]);
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): Task[] {
    return storageService.updateTable('tasks', (list) =>
      list.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  public updateTaskStatus(id: string, status: TaskStatus): Task[] {
    return storageService.updateTable('tasks', (list) =>
      list.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }

  public toggleSubtask(taskId: string, subtaskId: string): Task[] {
    return storageService.updateTable('tasks', (list) =>
      list.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  }

  public addSubtask(taskId: string, title: string): Task[] {
    const newSubtask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      taskId,
      title,
      completed: false,
    };

    return storageService.updateTable('tasks', (list) =>
      list.map((t) =>
        t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSubtask] } : t
      )
    );
  }

  public duplicateTask(id: string): Task | null {
    const tasks = storageService.getTable('tasks');
    const existing = tasks.find((t) => t.id === id);
    if (!existing) return null;

    const duplicated: Task = {
      ...existing,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${existing.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: existing.subtasks.map((st) => ({
        ...st,
        id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        completed: false,
      })),
    };

    storageService.updateTable('tasks', (list) => [duplicated, ...list]);
    return duplicated;
  }

  public deleteSubtask(taskId: string, subtaskId: string): Task[] {
    return storageService.updateTable('tasks', (list) =>
      list.map((t) => {
        if (t.id === taskId) {
          return { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId) };
        }
        return t;
      })
    );
  }

  public deleteTask(id: string): Task[] {
    return storageService.updateTable('tasks', (list) =>
      list.filter((t) => t.id !== id)
    );
  }

  public bulkDeleteTasks(ids: string[]): Task[] {
    return storageService.updateTable('tasks', (list) =>
      list.filter((t) => !ids.includes(t.id))
    );
  }

  public bulkUpdateStatus(ids: string[], status: TaskStatus): Task[] {
    return storageService.updateTable('tasks', (list) =>
      list.map((t) => (ids.includes(t.id) ? { ...t, status } : t))
    );
  }

  public bulkUpdateTaskStatus(ids: string[], status: TaskStatus): Task[] {
    return this.bulkUpdateStatus(ids, status);
  }
}

export const taskService = new TaskService();
