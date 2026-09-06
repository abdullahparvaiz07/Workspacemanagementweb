import { create } from 'zustand';
import { Notification } from '@/types';
import { notificationService } from '@/services/notification.service';

interface NotificationStore {
  notifications: Notification[];
  createNotification: (
    userId: string,
    title: string,
    message: string,
    type: Notification['type'],
    link?: string
  ) => Notification;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  clearAllNotifications: () => void;
  refresh: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: notificationService.getNotifications(),

  createNotification: (userId, title, message, type, link) => {
    const newNotif = notificationService.createNotification(userId, title, message, type, link);
    set({ notifications: notificationService.getNotifications() });
    return newNotif;
  },

  markAsRead: (id: string) => {
    const updated = notificationService.markAsRead(id);
    set({ notifications: updated });
  },

  markAllAsRead: () => {
    const updated = notificationService.markAllAsRead();
    set({ notifications: updated });
  },

  deleteNotification: (id: string) => {
    const updated = notificationService.deleteNotification(id);
    set({ notifications: updated });
  },

  clearAll: () => {
    const updated = notificationService.clearAll();
    set({ notifications: updated });
  },

  clearAllNotifications: () => {
    const updated = notificationService.clearAllNotifications();
    set({ notifications: updated });
  },

  refresh: () => {
    set({ notifications: notificationService.getNotifications() });
  },
}));
