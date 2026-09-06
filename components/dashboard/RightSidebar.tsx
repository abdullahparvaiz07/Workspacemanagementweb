'use client';

import { useUIStore } from '@/store/useUIStore';
import {
  Bell,
  ArrowRight,
  UserPlus,
  FolderPlus,
  Building2,
  ChevronRight,
  MessageSquare,
  Clock,
  UserCheck
} from 'lucide-react';

export function RightSidebar() {
  const notifications = [
    {
      id: 1,
      type: 'assignment',
      text: 'You were assigned to a task',
      target: 'Mobile app UI',
      time: '12m ago',
      bgColor: 'bg-rose-100 text-rose-600',
      icon: UserCheck,
    },
    {
      id: 2,
      type: 'duedate',
      text: 'Due date approaching',
      target: 'API integration',
      time: '2h ago',
      bgColor: 'bg-amber-100 text-amber-700',
      icon: Clock,
    },
    {
      id: 3,
      type: 'mention',
      text: 'Sarah mentioned you',
      target: 'in a comment',
      time: '3h ago',
      bgColor: 'bg-purple-100 text-purple-700',
      icon: MessageSquare,
    },
  ];

  const teamAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
  ];

  const quickActions = [
    {
      title: 'Create new project',
      subtitle: 'Start a new project stream',
      icon: FolderPlus,
      action: () => useUIStore.getState().setCreateProjectModalOpen(true),
    },
    {
      title: 'Create new workspace',
      subtitle: 'Organize work into a new space',
      icon: Building2,
      action: () => useUIStore.getState().setCreateWorkspaceModalOpen(true),
    },
    {
      title: 'Invite members',
      subtitle: 'Add your team members',
      icon: UserPlus,
      action: () => useUIStore.getState().setInviteMemberModalOpen(true),
    },
  ];

  return (
    <aside className="w-full lg:w-80 space-y-6 select-none flex-shrink-0">
      
      {/* WIDGET 1: NOTIFICATIONS */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-zinc-800" />
            <h3 className="font-bold text-sm text-zinc-900 tracking-tight">Notifications</h3>
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </div>
          <a href="#notifications" className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-0.5 transition-colors">
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-zinc-50 transition-colors cursor-pointer group">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${n.bgColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs leading-snug">
                  <p className="text-zinc-600">
                    {n.text} <span className="font-bold text-zinc-900">{n.target}</span>
                  </p>
                  <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">
                    {n.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WIDGET 2: TEAM */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-zinc-900 tracking-tight">Team</h3>
          <a href="#members" className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-0.5 transition-colors">
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {teamAvatars.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Team member"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-2xs"
              />
            ))}
            <div className="w-8 h-8 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-600 shadow-2xs">
              +3
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>7 members online</span>
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
        </div>
      </div>

      {/* WIDGET 4: WORKSPACE SETTINGS PROMO */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-5 shadow-xs relative overflow-hidden flex items-center justify-between">
        <div className="space-y-2 max-w-[180px] relative z-10">
          <h3 className="font-bold text-sm text-zinc-900 tracking-tight">Workspace Settings</h3>
          <p className="text-[11px] text-zinc-500 font-normal leading-snug">
            Customize your workspace, manage members and permissions.
          </p>
          <a
            href="#settings"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 pt-1 transition-colors"
          >
            <span>Go to settings</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* Mini Line Art Illustration */}
        <div className="relative z-0 pointer-events-none">
          <svg className="w-20 h-20 text-zinc-800" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="30" r="12" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.8" />
            <path d="M 25 55 C 25 42, 55 42, 55 55" fill="#18181B" />
            <rect x="15" y="55" width="50" height="8" rx="2" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.8" />
            <path d="M 58 45 L 60 55" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="60" cy="40" rx="5" ry="8" fill="#FDE047" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

    </aside>
  );
}
