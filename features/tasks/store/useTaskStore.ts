import { create } from 'zustand';
import { Task, Subtask, CommentWithProfile, Attachment, TaskWithRelations, TaskStatus } from '../types';
import { taskService } from '../services/task.service';
import { toast } from 'sonner';
import { useCommandHistoryStore } from '@/store/useCommandHistoryStore';
import { useOfflineStore } from '@/features/offline/store/useOfflineStore';

export interface TaskState {
  tasks: TaskWithRelations[];
  selectedTask: TaskWithRelations | null;
  loading: boolean;
  
  loadTasks: (projectId: string) => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  duplicateTask: (taskId: string, newTitle: string, createdBy: string) => Promise<void>;
  setSelectedTask: (taskId: string | null) => void;

  createSubtask: (taskId: string, title: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string, completed: boolean) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;

  addComment: (taskId: string, userId: string, content: string) => Promise<void>;
  deleteComment: (taskId: string, commentId: string) => Promise<void>;

  uploadAttachment: (taskId: string, userId: string, file: File) => Promise<void>;
  deleteAttachment: (taskId: string, attachmentId: string, fileUrl: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  loading: false,

  loadTasks: async (projectId: string) => {
    set({ loading: true });
    try {
      const tasks = await taskService.getProjectTasks(projectId);
      set({ tasks, loading: false });
    } catch (error: any) {
      toast.error('Failed to load tasks');
      set({ loading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const isOnline = useOfflineStore.getState().isOnline;
      if (!isOnline) {
        const id = crypto.randomUUID();
        const newTaskWithRelations: TaskWithRelations = {
          id,
          project_id: taskData.project_id!,
          title: taskData.title || '',
          description: taskData.description || '',
          status: taskData.status || 'todo',
          priority: taskData.priority || 'medium',
          assignee_id: taskData.assignee_id || null,
          created_by: taskData.created_by || '',
          due_date: taskData.due_date || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subtasks: [],
          comments: [],
          attachments: [],
          commentsCount: 0
        };
        useOfflineStore.getState().addMutation({
          type: 'CREATE_TASK',
          payload: { ...taskData, id }
        });
        set((state) => ({ tasks: [newTaskWithRelations, ...state.tasks] }));
        toast.info('Task created locally (offline)');
        return newTaskWithRelations;
      }

      const newTask = await taskService.createTask(taskData);
      const newTaskWithRelations: TaskWithRelations = {
        ...newTask,
        subtasks: [],
        comments: [],
        attachments: [],
        commentsCount: 0
      };
      set((state) => ({ tasks: [newTaskWithRelations, ...state.tasks] }));
      return newTask;
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  },

  updateTask: async (taskId, updates) => {
    const previousTask = get().tasks.find(t => t.id === taskId);
    if (!previousTask) return;

    // Optimistic Update
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t),
      selectedTask: state.selectedTask?.id === taskId ? { ...state.selectedTask, ...updates } : state.selectedTask
    }));

    try {
      const isOnline = useOfflineStore.getState().isOnline;
      if (!isOnline) {
        useOfflineStore.getState().addMutation({
          type: 'UPDATE_TASK',
          payload: { taskId, updates }
        });
        toast.info('Task updated locally (offline)');
        return;
      }

      await taskService.updateTask(taskId, updates);
      
      // Add to Undo History
      useCommandHistoryStore.getState().setUndoAction(() => {
        // Revert by doing another update with previous state fields
        const revertUpdates: Partial<Task> = {};
        Object.keys(updates).forEach(key => {
          (revertUpdates as any)[key] = (previousTask as any)[key];
        });
        get().updateTask(taskId, revertUpdates);
        toast.info('Reverted task update');
      });

    } catch (error) {
      // Rollback
      toast.error('Failed to update task. Reverting...');
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? previousTask : t),
        selectedTask: state.selectedTask?.id === taskId ? previousTask : state.selectedTask
      }));
      throw error;
    }
  },

  updateTaskStatus: async (taskId, status) => {
    const previousTask = get().tasks.find(t => t.id === taskId);
    if (!previousTask) return;
    
    // Optimistic UI Update
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));

    try {
      const isOnline = useOfflineStore.getState().isOnline;
      if (!isOnline) {
        useOfflineStore.getState().addMutation({
          type: 'UPDATE_TASK_STATUS',
          payload: { taskId, status }
        });
        toast.info(`Moved to ${status.replace('_', ' ')} locally (offline)`);
        return;
      }

      await taskService.updateTaskStatus(taskId, status);

      // Add to Undo History
      useCommandHistoryStore.getState().setUndoAction(() => {
        get().updateTaskStatus(taskId, previousTask.status);
        toast.info(`Moved back to ${previousTask.status.replace('_', ' ')}`);
      });

    } catch (error) {
      // Rollback
      toast.error('Failed to move task. Reverting...');
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? previousTask : t)
      }));
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    const taskToDelete = get().tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    // Optimistically remove from list
    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== taskId),
      selectedTask: state.selectedTask?.id === taskId ? null : state.selectedTask
    }));

    try {
      const isOnline = useOfflineStore.getState().isOnline;
      if (!isOnline) {
        useOfflineStore.getState().addMutation({
          type: 'DELETE_TASK',
          payload: { taskId }
        });
        toast.info('Task deleted locally (offline)');
        return;
      }

      await taskService.deleteTask(taskId);

      useCommandHistoryStore.getState().setUndoAction(async () => {
        // Soft-delete isn't supported in this schema by default,
        // so to truly "undo" a delete we'd recreate the task, but relations (subtasks, comments) are lost unless backed up.
        // For now, we will create a new task with the same properties.
        try {
          const restoredTask = await taskService.createTask({
            title: taskToDelete.title,
            description: taskToDelete.description,
            project_id: taskToDelete.project_id,
            status: taskToDelete.status,
            priority: taskToDelete.priority,
            assignee_id: taskToDelete.assignee_id,
            due_date: taskToDelete.due_date,
          });
          const newTaskWithRelations: TaskWithRelations = {
            ...restoredTask,
            subtasks: [],
            comments: [],
            attachments: [],
            commentsCount: 0
          };
          set((state) => ({ tasks: [newTaskWithRelations, ...state.tasks] }));
          toast.success('Task restored');
        } catch (e) {
          toast.error('Could not restore task.');
        }
      });
    } catch (error) {
      // Rollback
      toast.error('Failed to delete task');
      set((state) => ({
        tasks: [...state.tasks, taskToDelete]
      }));
      throw error;
    }
  },

  duplicateTask: async (taskId, newTitle, createdBy) => {
    try {
      const dup = await taskService.duplicateTask(taskId, newTitle, createdBy);
      const dupWithRelations: TaskWithRelations = {
        ...dup,
        subtasks: [],
        comments: [],
        attachments: [],
        commentsCount: 0
      };
      set((state) => ({ tasks: [dupWithRelations, ...state.tasks] }));
    } catch (error) {
      toast.error('Failed to duplicate task');
      throw error;
    }
  },

  setSelectedTask: (taskId) => {
    if (!taskId) {
      set({ selectedTask: null });
    } else {
      const task = get().tasks.find(t => t.id === taskId) || null;
      set({ selectedTask: task });
    }
  },

  createSubtask: async (taskId, title) => {
    try {
      const subtask = await taskService.createSubtask(taskId, title);
      set((state) => {
        const updateTask = (t: TaskWithRelations) => ({
          ...t,
          subtasks: [...t.subtasks, subtask]
        });
        return {
          tasks: state.tasks.map(t => t.id === taskId ? updateTask(t) : t),
          selectedTask: state.selectedTask?.id === taskId ? updateTask(state.selectedTask) : state.selectedTask
        };
      });
    } catch (error) {
      toast.error('Failed to create subtask');
      throw error;
    }
  },

  toggleSubtask: async (taskId, subtaskId, completed) => {
    try {
      await taskService.toggleSubtask(subtaskId, completed);
      set((state) => {
        const updateTask = (t: TaskWithRelations) => ({
          ...t,
          subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, completed } : st)
        });
        return {
          tasks: state.tasks.map(t => t.id === taskId ? updateTask(t) : t),
          selectedTask: state.selectedTask?.id === taskId ? updateTask(state.selectedTask) : state.selectedTask
        };
      });
    } catch (error) {
      toast.error('Failed to update subtask');
      throw error;
    }
  },

  deleteSubtask: async (taskId, subtaskId) => {
    try {
      await taskService.deleteSubtask(subtaskId);
      set((state) => {
        const updateTask = (t: TaskWithRelations) => ({
          ...t,
          subtasks: t.subtasks.filter(st => st.id !== subtaskId)
        });
        return {
          tasks: state.tasks.map(t => t.id === taskId ? updateTask(t) : t),
          selectedTask: state.selectedTask?.id === taskId ? updateTask(state.selectedTask) : state.selectedTask
        };
      });
    } catch (error) {
      toast.error('Failed to delete subtask');
      throw error;
    }
  },

  addComment: async (taskId, userId, content) => {
    try {
      const comment = await taskService.addComment(taskId, userId, content);
      set((state) => {
        const updateTask = (t: TaskWithRelations) => ({
          ...t,
          comments: [...t.comments, comment],
          commentsCount: t.commentsCount + 1
        });
        return {
          tasks: state.tasks.map(t => t.id === taskId ? updateTask(t) : t),
          selectedTask: state.selectedTask?.id === taskId ? updateTask(state.selectedTask) : state.selectedTask
        };
      });
    } catch (error) {
      toast.error('Failed to post comment');
      throw error;
    }
  },

  deleteComment: async (taskId, commentId) => {
    try {
      await taskService.deleteComment(commentId);
      set((state) => {
        const updateTask = (t: TaskWithRelations) => ({
          ...t,
          comments: t.comments.filter(c => c.id !== commentId),
          commentsCount: t.commentsCount - 1
        });
        return {
          tasks: state.tasks.map(t => t.id === taskId ? updateTask(t) : t),
          selectedTask: state.selectedTask?.id === taskId ? updateTask(state.selectedTask) : state.selectedTask
        };
      });
    } catch (error) {
      toast.error('Failed to delete comment');
      throw error;
    }
  },

  uploadAttachment: async (taskId, userId, file) => {
    try {
      const attachment = await taskService.uploadAttachment(taskId, userId, file);
      set((state) => {
        const updateTask = (t: TaskWithRelations) => ({
          ...t,
          attachments: [...t.attachments, attachment]
        });
        return {
          tasks: state.tasks.map(t => t.id === taskId ? updateTask(t) : t),
          selectedTask: state.selectedTask?.id === taskId ? updateTask(state.selectedTask) : state.selectedTask
        };
      });
      toast.success('Attachment uploaded');
    } catch (error) {
      toast.error('Failed to upload attachment');
      throw error;
    }
  },

  deleteAttachment: async (taskId, attachmentId, fileUrl) => {
    try {
      await taskService.deleteAttachment(attachmentId, fileUrl);
      set((state) => {
        const updateTask = (t: TaskWithRelations) => ({
          ...t,
          attachments: t.attachments.filter(a => a.id !== attachmentId)
        });
        return {
          tasks: state.tasks.map(t => t.id === taskId ? updateTask(t) : t),
          selectedTask: state.selectedTask?.id === taskId ? updateTask(state.selectedTask) : state.selectedTask
        };
      });
      toast.success('Attachment removed');
    } catch (error) {
      toast.error('Failed to remove attachment');
      throw error;
    }
  },
}));
