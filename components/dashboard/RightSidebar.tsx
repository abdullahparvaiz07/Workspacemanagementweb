'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useActivityStore } from '@/features/activities/store/useActivityStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { exportService } from '@/features/workspaces/services/export.service';
import { importService } from '@/features/workspaces/services/import.service';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { toast } from 'sonner';
import {
  Bell,
  ArrowRight,
  UserPlus,
  FolderPlus,
  Building2,
  ChevronRight,
  MessageSquare,
  Clock,
  UserCheck,
  Activity as ActivityIcon,
  CheckSquare,
  Plus,
  FolderKanban,
  Download,
  Upload
} from 'lucide-react';

export function RightSidebar() {
  const activities = useActivityStore(s => s.activities);
  const loadActivities = useActivityStore(s => s.loadActivities);
  const activeWorkspaceId = useWorkspaceStore(s => s.activeWorkspaceId);
  const onlineUsers = useWorkspaceStore(s => s.onlineUsers);
  const workspaceMembers = useWorkspaceStore(s => s.members);
  const [importing, setImporting] = useState(false);
  const setCreateProjectModalOpen = useUIStore(s => s.setCreateProjectModalOpen);
  const setCreateTaskModalOpen = useUIStore(s => s.setCreateTaskModalOpen);
  const setCreateWorkspaceModalOpen = useUIStore(s => s.setCreateWorkspaceModalOpen);
  const setInviteMemberModalOpen = useUIStore(s => s.setInviteMemberModalOpen);
  
  const tasks = useTaskStore(s => s.tasks);
  const loadTasks = useTaskStore(s => s.loadTasks);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (activeWorkspaceId) {
      loadActivities(activeWorkspaceId);
    }
  }, [activeWorkspaceId, loadActivities]);

  const handleExport = async () => {
    if (tasks.length === 0) {
      toast.error('No tasks to export in the current view.');
      return;
    }
    exportService.exportTasksToCSV(tasks, `tasks-export-${Date.now()}.csv`);
    toast.success('Tasks exported to CSV successfully.');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const projectFilter = useWorkspaceStore.getState().selectedProjectFilter;
    if (!projectFilter) {
      toast.error('Please select a specific project filter in the Kanban view to import tasks.');
      return;
    }

    if (!user) return;

    setImporting(true);
    try {
      const count = await importService.importTasksFromCSV(file, projectFilter, user.id);
      toast.success(`Successfully imported ${count} tasks.`);
      loadTasks(projectFilter);
    } catch (error) {
      toast.error('Failed to import tasks from CSV.');
    } finally {
      setImporting(false);
      if (e.target) e.target.value = '';
    }
  };

  const quickActions = [
    {
      title: 'Create new project',
      subtitle: 'Start a new project stream',
      icon: FolderPlus,
      action: () => setCreateProjectModalOpen(true),
    },
    {
      title: 'Create new workspace',
      subtitle: 'Organize work into a new space',
      icon: Building2,
      action: () => setCreateWorkspaceModalOpen(true),
    },
    {
      title: 'Invite members',
      subtitle: 'Add your team members',
      icon: UserPlus,
      action: () => setInviteMemberModalOpen(true),
    },
  ];

  return (
    <aside className="w-full lg:w-80 space-y-6 select-none flex-shrink-0">
      
      {/* WIDGET 1: ACTIVITIES */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ActivityIcon className="w-4 h-4 text-zinc-800" />
            <h3 className="font-bold text-sm text-zinc-900 tracking-tight">Recent Activity</h3>
          </div>
        </div>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No activity yet.</p>
          ) : (
            activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-zinc-50 transition-colors cursor-pointer group">
                <img 
                  src={act.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                  alt={act.profile?.full_name || 'User'}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 text-xs leading-snug">
                  <p className="text-zinc-600">
                    <span className="font-bold text-zinc-900">{act.profile?.full_name || 'User'}</span> {act.action}{' '}
                    <span className="font-bold text-zinc-900">{act.entity_type}</span>
                  </p>
                  <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* WIDGET 2: TEAM */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-zinc-900 tracking-tight">Team Presence</h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {workspaceMembers.slice(0, 5).map((m, i) => (
              <div key={m.id} className="relative">
                <img
                  src={m.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={m.profile?.full_name || 'Member'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-2xs"
                  title={m.profile?.full_name || 'Member'}
                />
                {onlineUsers.includes(m.user_id) && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </div>
            ))}
            {workspaceMembers.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-600 shadow-2xs">
                +{workspaceMembers.length - 5}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{onlineUsers.length} online</span>
          </div>
        </div>
      </div>

      {/* WIDGET 3: QUICK ACTIONS */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-zinc-900 tracking-tight">Quick Actions</h3>

        <div className="space-y-2.5">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.title}
                onClick={act.action}
                className="p-3 rounded-2xl border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/80 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {act.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-medium leading-tight mt-0.5">
                      {act.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
              </div>
            );
          })}
          
          <div className="space-y-1 mt-1 border-t border-zinc-100 pt-4">
            <button
              onClick={() => setCreateTaskModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-600 hover:bg-zinc-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-100/50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold">New Task</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500" />
            </button>
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-600 hover:bg-zinc-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-blue-100/50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold">Export Tasks (CSV)</span>
              </div>
            </button>
            
            <label className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-600 hover:bg-zinc-50 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-purple-100/50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold">{importing ? 'Importing...' : 'Import Tasks (CSV)'}</span>
              </div>
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={importing} />
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
