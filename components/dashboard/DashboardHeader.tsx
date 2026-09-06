'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { UserRole } from '@/types';
import { Search, Bell, ChevronDown, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';

export function DashboardHeader() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const switchRole = useAuthStore((s) => s.switchRole);
  const notifications = useNotificationStore((s) => s.notifications);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: { label: string; role: UserRole }[] = [
    { label: 'Owner (Full Access)', role: 'owner' },
    { label: 'Admin (Manage Projects & Members)', role: 'admin' },
    { label: 'Member (Create & Edit Tasks)', role: 'member' },
    { label: 'Viewer (Read Only)', role: 'viewer' },
  ];

  if (!currentUser) return null;

  return (
    <header className="w-full bg-[#FAF7F2] border-b border-zinc-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Global Search Input */}
      <div className="relative w-full max-w-md">
        <div
          onClick={() => setCommandPaletteOpen(true)}
          className="relative bg-white/90 border border-zinc-200/90 rounded-full px-4 py-2 flex items-center gap-2.5 shadow-2xs hover:border-zinc-300 cursor-pointer transition-colors"
        >
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, projects, members... (⌘K)"
            className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none cursor-pointer"
            readOnly
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-zinc-400 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md select-none">
            ⌘ K
          </kbd>
        </div>
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

        {/* Notification Bell Icon with Red Badge */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative w-10 h-10 rounded-full bg-white border border-zinc-200/90 flex items-center justify-center text-zinc-700 hover:text-zinc-950 hover:border-zinc-300 transition-all shadow-2xs"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Badge & Role Switcher */}
        <div className="relative">
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 pl-2 cursor-pointer group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="hidden md:block text-left">
              <h4 className="text-xs font-bold text-zinc-900 leading-tight group-hover:text-blue-600 transition-colors">
                {currentUser.name}
              </h4>
              <p className="text-[11px] text-zinc-500 font-medium leading-tight capitalize">
                Role: <span className="text-amber-700 font-semibold">{currentUser.role}</span>
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>

          {/* Profile & Role Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animation-fade-in text-xs">
              <div className="px-4 py-2 border-b border-stone-100">
                <p className="font-bold text-stone-900">{currentUser.name}</p>
                <p className="text-stone-500 font-mono text-[11px]">{currentUser.email}</p>
              </div>

              <div className="py-1">
                <div className="px-4 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Switch Simulated Role
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-1.5 font-medium transition-colors flex items-center justify-between ${
                      currentUser.role === r.role
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{r.label}</span>
                    {currentUser.role === r.role && <span className="text-amber-600">✓</span>}
                  </button>
                ))}
              </div>

              <div className="pt-1 border-t border-stone-100 mt-1">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
