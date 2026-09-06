'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Activity,
  Users,
  Settings,
  Bell,
  HelpCircle,
  ChevronDown,
  CheckCircle,
  Plus,
} from 'lucide-react';

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DashboardSidebar({ activeTab: propsActiveTab, onTabChange }: DashboardSidebarProps) {
  const storeActiveTab = useWorkspaceStore((s) => s.activeTab);
  const setActiveTabInStore = useWorkspaceStore((s) => s.setActiveTab);
  const switchWorkspaceInStore = useWorkspaceStore((s) => s.switchWorkspace);

  const activeTab = propsActiveTab || storeActiveTab || 'overview';

  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const tasks = useTaskStore((s) => s.tasks);
  const notifications = useNotificationStore((s) => s.notifications);

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);

  const openTasksCount = tasks.filter(
    (t) => t.workspaceId === activeWorkspaceId && t.status !== 'completed'
  ).length;

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const mainNav = [
    { name: 'Overview', key: 'overview', icon: LayoutDashboard },
    { name: 'Projects', key: 'projects', icon: FolderKanban },
    { name: 'Tasks', key: 'tasks', icon: CheckSquare, badge: openTasksCount > 0 ? openTasksCount : null },
    { name: 'Calendar', key: 'calendar', icon: Calendar },
    { name: 'Activity', key: 'activity', icon: Activity },
    { name: 'Members', key: 'members', icon: Users },
  ];

  const workspaceNav = [
    { name: 'Settings', key: 'settings', icon: Settings },
    { name: 'Notifications', key: 'notifications', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null },
    { name: 'Help & Support', key: 'help', icon: HelpCircle },
  ];

  const handleNavClick = (key: string) => {
    setActiveTabInStore(key);
    if (onTabChange) {
      onTabChange(key);
    }
  };

  return (
    <aside className="w-64 bg-[#FAF7F2] border-r border-zinc-200/80 p-5 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto select-none flex-shrink-0">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="px-2 pt-1">
          <Link href="/" className="font-serif font-extrabold text-2xl tracking-tight text-zinc-950 block">
            WORKROOM.
          </Link>
        </div>

        {/* Workspace Switcher Card */}
        <div className="relative">
          <div
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="bg-white/80 backdrop-blur-sm border border-zinc-200/90 rounded-2xl p-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
                <span className="w-5 h-5 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-700 text-xs">
                  ❖
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-900 leading-tight group-hover:text-sky-700 transition-colors">
                  {activeWorkspace?.name || 'Acme Studio'}
                </h4>
                <p className="text-[11px] text-zinc-500 font-medium leading-tight">
                  {activeWorkspace?.description || 'Product & Design'}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>

          {/* Switcher Dropdown */}
          {isWorkspaceMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animation-fade-in text-xs space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Workspaces ({workspaces.length})
              </div>
              {workspaces.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    switchWorkspaceInStore(w.id);
                    setIsWorkspaceMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                    w.id === activeWorkspaceId
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="truncate">{w.name}</span>
                  {w.id === activeWorkspaceId && <span className="text-amber-600">✓</span>}
                </button>
              ))}

              <button
                onClick={() => {
                  setIsWorkspaceMenuOpen(false);
                  useUIStore.getState().setCreateWorkspaceModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 mt-1 border-t border-stone-100 rounded-xl text-amber-900 font-bold hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>Create Workspace</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab.toLowerCase() === item.key.toLowerCase() || activeTab.toLowerCase() === item.name.toLowerCase();
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-600/10 text-amber-900 font-bold shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-700' : 'text-zinc-500'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Workspace Settings Category */}
        <div className="pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 block mb-2">
            WORKSPACE
          </span>
          <nav className="space-y-1">
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab.toLowerCase() === item.key.toLowerCase() || activeTab.toLowerCase() === item.name.toLowerCase();
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-600/10 text-amber-900 font-bold shadow-2xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-zinc-400" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer Connection Status */}
      <div className="pt-4">
        <div className="pt-3 border-t border-zinc-200/80 flex items-center justify-between text-[11px] font-medium text-zinc-500 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Online</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>LocalStorage</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
