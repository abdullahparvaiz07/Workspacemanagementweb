import { create } from 'zustand';
import { Activity } from '@/types';
import { activityService } from '@/services/activity.service';

interface ActivityStore {
  activities: Activity[];
  logActivity: (
    workspaceId: string,
    userId: string,
    userName: string,
    userAvatar: string,
    action: string,
    entityType: Activity['entityType'],
    entityName: string
  ) => Activity;
  clearActivities: (workspaceId: string) => void;
  refresh: () => void;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: activityService.getActivities(),

  logActivity: (workspaceId, userId, userName, userAvatar, action, entityType, entityName) => {
    const newLog = activityService.logActivity(
      workspaceId,
      userId,
      userName,
      userAvatar,
      action,
      entityType,
      entityName
    );
    set({ activities: activityService.getActivities() });
    return newLog;
  },

  clearActivities: (workspaceId: string) => {
    const updated = activityService.clearActivities(workspaceId);
    set({ activities: updated });
  },

  refresh: () => {
    set({ activities: activityService.getActivities() });
  },
}));
