import { create } from 'zustand';
import { Task, TaskStatus, Comment } from '@/types';
import { taskService } from '@/services/task.service';

interface TaskStore {
  tasks: Task[];
  past: Task[][];
  future: Task[][];
  undo: () => void;
  redo: () => void;
  createTask: (taskData: Omit<Task, 'id' | 'commentsCount' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  duplicateTask: (id: string) => Task | null;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  editSubtask: (taskId: string, subtaskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (id: string) => void;
  bulkDeleteTasks: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: TaskStatus) => void;
  bulkUpdateTaskStatus: (ids: string[], status: TaskStatus) => void;
  
  addComment: (taskId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => void;
  editComment: (taskId: string, commentId: string, text: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;
  
  refresh: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => {
  const saveSnapshot = () => {
    set((state) => ({
      past: [...state.past, state.tasks],
      future: [],
    }));
  };

  return {
    tasks: taskService.getTasks(),
    past: [],
    future: [],

    undo: () => {
      const { past, tasks, future } = get();
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      
      const restored = taskService.restoreTasks(previous);
      set({ past: newPast, tasks: restored, future: [tasks, ...future] });
    },

    redo: () => {
      const { past, tasks, future } = get();
      if (future.length === 0) return;
      const next = future[0];
      const newFuture = future.slice(1);
      
      const restored = taskService.restoreTasks(next);
      set({ past: [...past, tasks], tasks: restored, future: newFuture });
    },

    createTask: (taskData) => {
      saveSnapshot();
      const newTask = taskService.createTask(taskData);
      set({ tasks: taskService.getTasks() });
      return newTask;
    },

    updateTask: (id, updates) => {
      saveSnapshot();
      const updated = taskService.updateTask(id, updates);
      set({ tasks: updated });
    },

    updateTaskStatus: (id, status) => {
      saveSnapshot();
      const updated = taskService.updateTaskStatus(id, status);
      set({ tasks: updated });
    },

    duplicateTask: (id) => {
      saveSnapshot();
      const dup = taskService.duplicateTask(id);
      set({ tasks: taskService.getTasks() });
      return dup;
    },

    toggleSubtask: (taskId, subtaskId) => {
      saveSnapshot();
      const updated = taskService.toggleSubtask(taskId, subtaskId);
      set({ tasks: updated });
    },

    addSubtask: (taskId, title) => {
      saveSnapshot();
      const updated = taskService.addSubtask(taskId, title);
      set({ tasks: updated });
    },

    editSubtask: (taskId, subtaskId, title) => {
      saveSnapshot();
      const updated = taskService.editSubtask(taskId, subtaskId, title);
      set({ tasks: updated });
    },

    deleteSubtask: (taskId, subtaskId) => {
      saveSnapshot();
      const updated = taskService.deleteSubtask(taskId, subtaskId);
      set({ tasks: updated });
    },

    deleteTask: (id) => {
      saveSnapshot();
      const updated = taskService.deleteTask(id);
      set({ tasks: updated });
    },

    bulkDeleteTasks: (ids) => {
      saveSnapshot();
      const updated = taskService.bulkDeleteTasks(ids);
      set({ tasks: updated });
    },

    bulkUpdateStatus: (ids, status) => {
      saveSnapshot();
      const updated = taskService.bulkUpdateStatus(ids, status);
      set({ tasks: updated });
    },

    bulkUpdateTaskStatus: (ids, status) => {
      saveSnapshot();
      const updated = taskService.bulkUpdateTaskStatus(ids, status);
      set({ tasks: updated });
    },

    addComment: (taskId, commentData) => {
      saveSnapshot();
      const updated = taskService.addComment(taskId, commentData);
      set({ tasks: updated });
    },

    editComment: (taskId, commentId, text) => {
      saveSnapshot();
      const updated = taskService.editComment(taskId, commentId, text);
      set({ tasks: updated });
    },

    deleteComment: (taskId, commentId) => {
      saveSnapshot();
      const updated = taskService.deleteComment(taskId, commentId);
      set({ tasks: updated });
    },

    refresh: () => {
      set({ tasks: taskService.getTasks() });
    },
  };
});
