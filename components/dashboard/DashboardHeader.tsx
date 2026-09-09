'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useNotificationStore } from '@/features/notifications/store/useNotificationStore';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { Search, Bell, ChevronDown, LogOut, Plus, CheckSquare, FolderKanban, Building2, Menu, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export function DashboardHeader() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const currentProfile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push('/login');
    }
  };
  
  const notifications = useNotificationStore((s) => s.notifications);
  const loadNotifications = useNotificationStore((s) => s.loadNotifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const setCreateTaskModalOpen = useUIStore((s) => s.setCreateTaskModalOpen);
  const setCreateProjectModalOpen = useUIStore((s) => s.setCreateProjectModalOpen);
  const setCreateWorkspaceModalOpen = useUIStore((s) => s.setCreateWorkspaceModalOpen);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      loadNotifications(currentUser.id);
    }
  }, [currentUser?.id, loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!currentUser) return null;

  return (
    <header className="w-full bg-[#FAF7F2] dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20 select-none">
      
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div
            onClick={() => setCommandPaletteOpen(true)}
          className="relative bg-white/90 dark:bg-zinc-800/90 border border-zinc-200/90 dark:border-zinc-700/90 rounded-full px-4 py-2 flex items-center gap-2.5 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer transition-colors"
        >
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, projects, members... (⌘K)"
            className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none cursor-pointer"
            readOnly
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 px-2 py-0.5 rounded-md select-none">
            ⌘ K
          </kbd>
        </div>
      </div>
      
      {/* Mobile Search Icon (visible when input is hidden) */}
      <button 
        className="sm:hidden p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="w-5 h-5" />
      </button>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Live Online Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-zinc-200/80 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-zinc-700">Online</span>
        </div>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Notification Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-700/90 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 py-3 z-50 animation-fade-in">
              <div className="px-4 pb-2 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAllAsRead(currentUser.id)}
                    className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto px-2 pt-2 space-y-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3 rounded-xl transition-colors cursor-pointer ${n.read ? 'bg-transparent hover:bg-stone-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}
                      onClick={() => {
                        if (!n.read) markAsRead(n.id);
                      }}
                    >
                      <h4 className={`text-xs ${n.read ? 'font-medium text-stone-700' : 'font-bold text-stone-900'}`}>{n.title}</h4>
                      {n.message && <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">{n.message}</p>}
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        {new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Create Button */}
        <div className="relative">
          <button
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="flex items-center gap-1.5 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
          </button>
          
          {isCreateMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animation-fade-in">
              <button 
                onClick={() => { setCreateTaskModalOpen(true); setIsCreateMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <div className="p-1 rounded bg-emerald-100 text-emerald-700">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                New Task
              </button>
              <button 
                onClick={() => { setCreateProjectModalOpen(true); setIsCreateMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <div className="p-1 rounded bg-amber-100 text-amber-700">
                  <FolderKanban className="w-3.5 h-3.5" />
                </div>
                New Project
              </button>
              <div className="h-px bg-stone-100 my-1" />
              <button 
                onClick={() => { setCreateWorkspaceModalOpen(true); setIsCreateMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <div className="p-1 rounded bg-sky-100 text-sky-700">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                New Workspace
              </button>
            </div>
          )}
        </div>

        {/* User Profile Badge & Role Switcher */}
        <div className="relative">
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 pl-2 cursor-pointer group"
          >
            <img
              src={currentProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentProfile?.full_name || 'User'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="hidden md:block text-left">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {currentProfile?.full_name || 'User'}
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-tight">
                Role: <span className="text-amber-700 dark:text-amber-500 font-semibold">Member</span>
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animation-fade-in text-xs">
              <div className="px-4 py-2 border-b border-stone-100">
                <p className="font-bold text-stone-900">{currentProfile?.full_name || 'User'}</p>
                <p className="text-stone-500 font-mono text-[11px]">{currentUser.email}</p>
              </div>

              <div className="pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
