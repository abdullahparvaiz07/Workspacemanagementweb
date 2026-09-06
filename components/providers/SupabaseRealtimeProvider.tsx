'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useActivityStore } from '@/features/activities/store/useActivityStore';
import { useNotificationStore } from '@/features/notifications/store/useNotificationStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';

export function SupabaseRealtimeProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const currentUser = useAuthStore((s) => s.user);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setOnlineUsers = useWorkspaceStore((s) => s.setOnlineUsers);
  
  const addRealtimeActivity = useActivityStore((s) => s.addRealtimeActivity);
  const addRealtimeNotification = useNotificationStore((s) => s.addRealtimeNotification);
  const updateRealtimeNotification = useNotificationStore((s) => s.updateRealtimeNotification);
  const removeRealtimeNotification = useNotificationStore((s) => s.removeRealtimeNotification);
  
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const tasks = useTaskStore((s) => s.tasks);

  // 1. Presence Sync
  useEffect(() => {
    if (!currentUser || !activeWorkspaceId) return;

    const channel = supabase.channel(`workspace_presence:${activeWorkspaceId}`);
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const onlineIds = Object.keys(state).map((key) => (state[key][0] as any).user_id as string);
        setOnlineUsers([...new Set(onlineIds)]);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: currentUser.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, activeWorkspaceId, supabase, setOnlineUsers]);

  // 2. Database Changes (Activities & Tasks & Comments)
  useEffect(() => {
    if (!activeWorkspaceId) return;

    const channel = supabase.channel(`db_changes:${activeWorkspaceId}`);

    // Activities
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'activities',
        filter: `workspace_id=eq.${activeWorkspaceId}`,
      },
      async (payload) => {
        // Fetch profile for the new activity to match state structure
        if (payload.new.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, email')
            .eq('id', payload.new.user_id)
            .single();
            
          addRealtimeActivity({ ...payload.new, profile } as any);
        } else {
          addRealtimeActivity(payload.new as any);
        }
      }
    );

    // Tasks (Refetch on any change to tasks in this workspace's projects)
    // For a highly optimized app, we would dispatch targeted updates.
    // For now, refreshing the current project's tasks ensures complete accuracy including relations.
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
      },
      (payload) => {
        // If a task changed, and we have tasks loaded for a project, reload them
        const newPayload = payload.new as any;
        const oldPayload = payload.old as any;
        const projectId = newPayload?.project_id || oldPayload?.project_id;
        if (projectId && tasks.some(t => t.project_id === projectId)) {
           loadTasks(projectId);
        }
      }
    );

    // Comments
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
      },
      (payload) => {
         const newPayload = payload.new as any;
         const oldPayload = payload.old as any;
         const taskId = newPayload?.task_id || oldPayload?.task_id;
         const task = tasks.find(t => t.id === taskId);
         if (task) {
            loadTasks(task.project_id); // Refresh task to get new comment relations
         }
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeWorkspaceId, supabase, addRealtimeActivity, loadTasks, tasks]);

  // 3. Notifications (Personal)
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase.channel(`notifications:${currentUser.id}`);

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${currentUser.id}`,
      },
      (payload) => {
        addRealtimeNotification(payload.new as any);
      }
    );

    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${currentUser.id}`,
      },
      (payload) => {
        updateRealtimeNotification(payload.new as any);
      }
    );

    channel.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${currentUser.id}`,
      },
      (payload) => {
        removeRealtimeNotification(payload.old.id as string);
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, supabase, addRealtimeNotification, updateRealtimeNotification, removeRealtimeNotification]);

  return <>{children}</>;
}
