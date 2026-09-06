import { create } from 'zustand';
import { ActivityWithProfile } from '../types';
import { activityService } from '../services/activity.service';

export interface ActivityState {
  activities: ActivityWithProfile[];
  loading: boolean;
  
  loadActivities: (workspaceId: string) => Promise<void>;
  logActivity: (
    workspaceId: string,
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  
  // Used by realtime subscriptions to insert at the top
  addRealtimeActivity: (activity: ActivityWithProfile) => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  loading: false,

  loadActivities: async (workspaceId: string) => {
    set({ loading: true });
    try {
      const activities = await activityService.getWorkspaceActivities(workspaceId);
      set({ activities, loading: false });
    } catch (error) {
      console.error('Failed to load activities', error);
      set({ loading: false });
    }
  },

  logActivity: async (workspaceId, userId, action, entityType, entityId, metadata) => {
    // The actual DB call is fire-and-forget. The Realtime subscription will catch it and add to state.
    await activityService.logActivity(workspaceId, userId, action, entityType, entityId, metadata);
  },

  addRealtimeActivity: (activity) => {
    set((state) => {
      // Prevent duplicates
      if (state.activities.find(a => a.id === activity.id)) return state;
      return { activities: [activity, ...state.activities] };
    });
  },
}));
