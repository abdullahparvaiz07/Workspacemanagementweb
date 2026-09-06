import { createClient } from '@/lib/supabase/client';
import { Notification } from '../types';

class NotificationService {
  private get supabase() {
    return createClient();
  }

  async getMyNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await (this.supabase.from('notifications') as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createNotification(
    userId: string,
    type: string,
    title: string,
    message?: string
  ): Promise<void> {
    const { error } = await (this.supabase.from('notifications') as any)
      .insert([{
        user_id: userId,
        type,
        title,
        message: message || null
      }]);

    if (error) {
      console.error('Failed to create notification:', error);
    }
  }

  async markAsRead(id: string): Promise<void> {
    const { error } = await (this.supabase.from('notifications') as any)
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await (this.supabase.from('notifications') as any)
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  }

  async deleteNotification(id: string): Promise<void> {
    const { error } = await (this.supabase.from('notifications') as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const notificationService = new NotificationService();
