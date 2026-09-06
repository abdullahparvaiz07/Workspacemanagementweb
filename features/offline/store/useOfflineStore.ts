import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { taskService } from '@/features/tasks/services/task.service';

export type OfflineMutation = {
  id: string;
  type: 'CREATE_TASK' | 'UPDATE_TASK' | 'UPDATE_TASK_STATUS' | 'DELETE_TASK';
  payload: any;
  timestamp: number;
};

export interface OfflineState {
  isOnline: boolean;
  mutations: OfflineMutation[];
  setOnlineStatus: (status: boolean) => void;
  addMutation: (mutation: Omit<OfflineMutation, 'id' | 'timestamp'>) => void;
  removeMutation: (id: string) => void;
  clearMutations: () => void;
  sync: () => Promise<void>;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
      mutations: [],
      
      setOnlineStatus: (status) => set({ isOnline: status }),
      
      addMutation: (mutation) => set((state) => ({
        mutations: [...state.mutations, { ...mutation, id: crypto.randomUUID(), timestamp: Date.now() }]
      })),
      
      removeMutation: (id) => set((state) => ({
        mutations: state.mutations.filter(m => m.id !== id)
      })),
      
      clearMutations: () => set({ mutations: [] }),
      
      sync: async () => {
        const { mutations, removeMutation, isOnline } = get();
        if (!isOnline || mutations.length === 0) return;

        // Sort by timestamp
        const sorted = [...mutations].sort((a, b) => a.timestamp - b.timestamp);

        for (const mut of sorted) {
          try {
            switch (mut.type) {
              case 'CREATE_TASK':
                await taskService.createTask(mut.payload);
                break;
              case 'UPDATE_TASK':
                await taskService.updateTask(mut.payload.taskId, mut.payload.updates);
                break;
              case 'UPDATE_TASK_STATUS':
                await taskService.updateTaskStatus(mut.payload.taskId, mut.payload.status);
                break;
              case 'DELETE_TASK':
                await taskService.deleteTask(mut.payload.taskId);
                break;
            }
            removeMutation(mut.id);
          } catch (e) {
            console.error('Failed to sync mutation:', mut, e);
            // Optionally leave it in the queue, or remove it if it's a hard error (e.g., 400).
            // For now, if we get here and it failed, we'll keep it to retry later unless it's explicitly non-retryable.
          }
        }
      }
    }),
    {
      name: 'workroom-offline'
    }
  )
);
