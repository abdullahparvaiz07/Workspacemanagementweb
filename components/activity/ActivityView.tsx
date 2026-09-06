'use client';

import React, { useState } from 'react';
import { useActivityStore } from '@/store/useActivityStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { activityService } from '@/services/activity.service';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { Activity as ActivityIcon, MessageSquare, Plus, CheckCircle2, UserPlus, Trash2 } from 'lucide-react';

export function ActivityView() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const activities = useActivityStore((s) => s.activities);
  const clearActivitiesInStore = useActivityStore((s) => s.clearActivities);
  const currentUser = useAuthStore((s) => s.currentUser);

  const permissions = usePermissions();
  const [activeCategoryTab, setActiveCategoryTab] = useState<'All' | 'Tasks' | 'Projects' | 'Members' | 'Comments'>('All');

  const workspaceLogs = activities.filter((log) => {
    if (log.workspaceId !== activeWorkspaceId) return false;
    if (activeCategoryTab === 'Tasks' && log.entityType !== 'task') return false;
    if (activeCategoryTab === 'Projects' && log.entityType !== 'project') return false;
    if (activeCategoryTab === 'Members' && log.entityType !== 'member') return false;
    if (activeCategoryTab === 'Comments' && log.entityType !== 'comment') return false;
    return true;
  });

  const handleClearLogs = () => {
    if (!permissions.canManageWorkspace) {
      toast.error('Only Workspace Owner can clear activity logs.');
      return;
    }
    if (confirm('Are you sure you want to clear all activity logs for this workspace?')) {
      activityService.clearActivities(activeWorkspaceId);
      clearActivitiesInStore(activeWorkspaceId);
      toast.success('Activity logs cleared.');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <ActivityIcon className="w-4 h-4 text-blue-600" />;
      case 'project':
        return <Plus className="w-4 h-4 text-amber-600" />;
      case 'member':
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto w-full select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-stone-900 tracking-tight">Activity Audit Log</h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">Real-time audit stream of all actions performed in this workspace.</p>
        </div>
        {permissions.canManageWorkspace && workspaceLogs.length > 0 && (
          <button
            onClick={handleClearLogs}
            className="px-4 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear Logs
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-1">
        {(['All', 'Tasks', 'Projects', 'Members', 'Comments'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategoryTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeCategoryTab === tab
                ? 'bg-stone-900 text-stone-50 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Audit Feed */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
        {workspaceLogs.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <ActivityIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No activity recorded for this filter yet.</p>
          </div>
        ) : (
          workspaceLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-stone-50 transition-colors border border-stone-100"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={log.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={log.userName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-100"
                />
                <div>
                  <p className="text-xs text-stone-800 font-medium">
                    <span className="font-bold text-stone-900">{log.userName}</span> {log.action}{' '}
                    <span className="font-semibold text-amber-900">"{log.entityName}"</span>
                  </p>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-stone-100">{getIcon(log.entityType)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
