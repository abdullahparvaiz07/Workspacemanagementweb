'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { activityService } from '@/services/activity.service';

const SIMULATION_INTERVAL = 45000; // 45 seconds

const MOCK_EVENTS = [
  {
    type: 'notification',
    title: 'Task Assigned',
    message: '{user} assigned a new task to you.',
    notifType: 'assignment' as const,
  },
  {
    type: 'notification',
    title: 'Project Update',
    message: '{user} updated the project timeline.',
    notifType: 'system' as const,
  },
  {
    type: 'activity',
    action: 'completed task "Update Landing Page copy"',
    entityType: 'task',
    entityName: 'Update Landing Page copy',
  },
  {
    type: 'activity',
    action: 'moved "Design System Assets" to Review',
    entityType: 'task',
    entityName: 'Design System Assets',
  },
  {
    type: 'notification',
    title: 'New Comment',
    message: '{user} mentioned you in a comment.',
    notifType: 'mention' as const,
  }
];

export function useSimulatedEvents(enabled: boolean = true) {
  const currentUser = useAuthStore(s => s.currentUser);
  const activeWorkspaceId = useWorkspaceStore(s => s.activeWorkspaceId);
  const members = useAuthStore((s) => s.members);
  const createNotification = useNotificationStore(s => s.createNotification);

  useEffect(() => {
    if (!enabled || !currentUser || !activeWorkspaceId) return;

    const otherMembers = members.filter((m: any) => m.id !== currentUser.id);
    if (otherMembers.length === 0) return;

    const interval = setInterval(() => {
      // 30% chance to trigger an event every interval
      if (Math.random() > 0.3) return;

      const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
      const randomEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];

      if (randomEvent.type === 'notification') {
        createNotification(
          currentUser.id,
          randomEvent.title!,
          randomEvent.message!.replace('{user}', randomMember.name),
          randomEvent.notifType!
        );
      } else if (randomEvent.type === 'activity') {
        activityService.logActivity({
          workspaceId: activeWorkspaceId,
          userId: randomMember.id,
          userName: randomMember.name,
          userAvatar: randomMember.avatar,
          action: randomEvent.action!,
          entityType: randomEvent.entityType as any,
          entityName: randomEvent.entityName!,
        });
      }
    }, SIMULATION_INTERVAL);

    return () => clearInterval(interval);
  }, [enabled, currentUser, activeWorkspaceId, members, createNotification]);
}
