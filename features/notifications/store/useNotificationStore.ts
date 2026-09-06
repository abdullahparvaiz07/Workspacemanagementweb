import { create } from 'zustand';
import { Notification } from '../types';
import { notificationService } from '../services/notification.service';

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  
  loadNotifications: (userId: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  
  // Realtime hooks
  addRealtimeNotification: (notif: Notification) => void;
  updateRealtimeNotification: (notif: Notification) => void;
  removeRealtimeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  loading: false,

  loadNotifications: async (userId: string) => {
    set({ loading: true });
    try {
      const notifications = await notificationService.getMyNotifications(userId);
      set({ notifications, loading: false });
    } catch (error) {
      console.error('Failed to load notifications', error);
      set({ loading: false });
    }
  },

  markAsRead: async (id: string) => {
    // Optimistic UI update
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
    await notificationService.markAsRead(id);
  },

  markAllAsRead: async (userId: string) => {
    // Optimistic UI update
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
    await notificationService.markAllAsRead(userId);
  },

  deleteNotification: async (id: string) => {
    // Optimistic UI update
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
    await notificationService.deleteNotification(id);
  },

  addRealtimeNotification: (notif) => {
    set((state) => {
      if (state.notifications.find(n => n.id === notif.id)) return state;
      return { notifications: [notif, ...state.notifications] };
    });
  },

  updateRealtimeNotification: (notif) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === notif.id ? notif : n)
    }));
  },

  removeRealtimeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  }
}));
