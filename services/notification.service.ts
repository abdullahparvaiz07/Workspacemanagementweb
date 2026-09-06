import { Notification } from '@/types';
import { storageService } from './storage.service';

class NotificationService {
  public getNotifications(userId?: string): Notification[] {
    const notifications = storageService.getTable('notifications');
    if (userId) {
      return notifications.filter((n) => n.userId === userId || !n.userId);
    }
    return notifications;
  }

  public createNotification(
    userId: string,
    title: string,
    message: string,
    type: Notification['type'],
    link?: string
  ): Notification {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      message,
      read: false,
      type,
      link,
      timestamp: new Date().toISOString(),
    };

    storageService.updateTable('notifications', (list) => [newNotif, ...list]);
    return newNotif;
  }

  public markAsRead(id: string): Notification[] {
    return storageService.updateTable('notifications', (list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  public markAllAsRead(userId?: string): Notification[] {
    return storageService.updateTable('notifications', (list) =>
      list.map((n) => (!userId || n.userId === userId ? { ...n, read: true } : n))
    );
  }

  public deleteNotification(id: string): Notification[] {
    return storageService.updateTable('notifications', (list) =>
      list.filter((n) => n.id !== id)
    );
  }

  public clearAll(): Notification[] {
    return storageService.updateTable('notifications', () => []);
  }

  public clearAllNotifications(): Notification[] {
    return this.clearAll();
  }
}

export const notificationService = new NotificationService();
