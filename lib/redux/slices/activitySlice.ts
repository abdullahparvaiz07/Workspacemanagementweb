import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ActivityLog {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  entityType: 'task' | 'project' | 'member' | 'workspace' | 'comment';
  entityName: string;
  timestamp: string;
}

interface ActivityState {
  logs: ActivityLog[];
}

const initialLogs: ActivityLog[] = [
  {
    id: 'act-1',
    workspaceId: 'ws-1',
    userId: 'u-1',
    userName: 'Alex Morgan',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    action: 'created task',
    entityType: 'task',
    entityName: 'Design System Update',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'act-2',
    workspaceId: 'ws-1',
    userId: 'u-2',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    action: 'updated status to Completed',
    entityType: 'task',
    entityName: 'Landing Page Copywriter Brief',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'act-3',
    workspaceId: 'ws-1',
    userId: 'u-1',
    userName: 'Alex Morgan',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    action: 'created project',
    entityType: 'project',
    entityName: 'Q3 Product Redesign',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const initialState: ActivityState = {
  logs: initialLogs,
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivities: (state, action: PayloadAction<ActivityLog[]>) => {
      state.logs = action.payload;
    },
    addActivity: (state, action: PayloadAction<Omit<ActivityLog, 'id' | 'timestamp'>>) => {
      const newLog: ActivityLog = {
        ...action.payload,
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
      };
      state.logs.unshift(newLog);
    },
    clearActivities: (state, action: PayloadAction<string>) => {
      state.logs = state.logs.filter((log) => log.workspaceId !== action.payload);
    },
  },
});

export const { setActivities, addActivity, clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
