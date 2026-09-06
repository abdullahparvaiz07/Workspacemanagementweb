import { create } from 'zustand';
import { Task, TaskStatus } from '@/types';
import { taskService } from '@/services/task.service';

interface TaskStore {
  tasks: Task[];
  createTask: (taskData: Omit<Task, 'id' | 'commentsCount' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteTask: (id: string) => void;
  bulkDeleteTasks: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: TaskStatus) => void;
  bulkUpdateTaskStatus: (ids: string[], status: TaskStatus) => void;
  refresh: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: taskService.getTasks(),

  createTask: (taskData) => {
    const newTask = taskService.createTask(taskData);
    set({ tasks: taskService.getTasks() });
    return newTask;
  },

  updateTask: (id, updates) => {
    const updated = taskService.updateTask(id, updates);
    set({ tasks: updated });
  },

  updateTaskStatus: (id, status) => {
    const updated = taskService.updateTaskStatus(id, status);
    set({ tasks: updated });
  },

  toggleSubtask: (taskId, subtaskId) => {
    const updated = taskService.toggleSubtask(taskId, subtaskId);
    set({ tasks: updated });
  },

  addSubtask: (taskId, title) => {
    const updated = taskService.addSubtask(taskId, title);
    set({ tasks: updated });
  },

  deleteTask: (id) => {
    const updated = taskService.deleteTask(id);
    set({ tasks: updated });
  },

  bulkDeleteTasks: (ids) => {
    const updated = taskService.bulkDeleteTasks(ids);
    set({ tasks: updated });
  },

  bulkUpdateStatus: (ids, status) => {
    const updated = taskService.bulkUpdateStatus(ids, status);
    set({ tasks: updated });
  },

  bulkUpdateTaskStatus: (ids, status) => {
    const updated = taskService.bulkUpdateTaskStatus(ids, status);
    set({ tasks: updated });
  },

  refresh: () => {
    set({ tasks: taskService.getTasks() });
  },
}));
