import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'mention' | 'assignment';
  link?: string;
}

interface NotificationState {
  notifications: NotificationItem[];
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Task Assigned',
    message: 'Sarah Chen assigned you to "Design System Update"',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    type: 'assignment',
  },
  {
    id: 'notif-2',
    title: 'New Comment',
    message: 'David Kim mentioned you in "Mobile App Onboarding"',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'mention',
  },
  {
    id: 'notif-3',
    title: 'Project Update',
    message: 'Q3 Product Redesign was moved to In Progress',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    type: 'info',
  },
];

const initialState: NotificationState = {
  notifications: initialNotifications,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<NotificationItem, 'id' | 'read' | 'timestamp'>>
    ) => {
      const newNotif: NotificationItem = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        read: false,
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(newNotif);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) {
        notif.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
