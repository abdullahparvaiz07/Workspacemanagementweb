import { createClient } from '@/lib/supabase/client';
import { Activity, ActivityWithProfile } from '../types';

class ActivityService {
  private get supabase() {
    return createClient();
  }

  async getWorkspaceActivities(workspaceId: string, limit = 50): Promise<ActivityWithProfile[]> {
    const { data, error } = await (this.supabase.from('activities') as any)
      .select('*, profiles(id, full_name, avatar_url, email)')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data.map((act: any) => ({
      ...act,
      profile: act.profiles
    }));
  }

  async logActivity(
    workspaceId: string,
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const { error } = await (this.supabase.from('activities') as any)
      .insert([{
        workspace_id: workspaceId,
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        metadata: metadata || {}
      }]);

    if (error) {
      console.error('Failed to log activity:', error);
    }
  }
}

export const activityService = new ActivityService();
