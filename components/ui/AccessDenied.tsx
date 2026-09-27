'use client';

import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, Mail, Sparkles, KeyRound } from 'lucide-react';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useActivityStore } from '@/store/useActivityStore';
import { toast } from 'sonner';

interface AccessDeniedProps {
  title?: string;
  description?: string;
  requiredRole?: 'Owner' | 'Admin' | 'Member';
  actionName?: string;
  onBack?: () => void;
  inline?: boolean;
}

export function AccessDenied({
  title = 'Access Restricted',
  description = 'You do not have permission to access or modify this workspace resource.',
  requiredRole = 'Admin',
  actionName = 'manage workspace settings',
  onBack,
  inline = false,
}: AccessDeniedProps) {
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const currentUser = useAuthStore((s) => s.user);
  const currentProfile = useAuthStore((s) => s.profile);
  const logActivity = useActivityStore((s) => s.logActivity);

  const handleRequestAccess = () => {
    if (activeWorkspaceId && currentUser) {
      logActivity(
        activeWorkspaceId,
        currentUser.id,
        currentProfile?.full_name || currentUser.email || 'User',
        currentProfile?.avatar_url || '',
        `requested ${requiredRole} access to ${actionName}`,
        'workspace',
        'Workspace'
      );
    }
    toast.success(`Access request submitted to workspace admins.`);
  };

  const handleGoHome = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveTab('Overview');
    }
  };

  if (inline) {
    return (
      <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-2xs">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-serif font-bold text-xl text-zinc-950 dark:text-zinc-50">{title}</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            {description} Requires <span className="font-bold text-rose-700 dark:text-rose-300">{requiredRole}</span> privilege.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRequestAccess}
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <KeyRound className="w-3.5 h-3.5" /> Request {requiredRole} Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6 sm:p-12 text-center select-none animation-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900/90 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-8 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 rounded-b-full" />

        {/* Lock Icon Emblem */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <span>Role Restricted</span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-zinc-950 dark:text-white">
            {title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
            {description}
          </p>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 mt-3">
            <p>
              Required Role:{' '}
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {requiredRole} or higher
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleGoHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </button>
          <button
            onClick={handleRequestAccess}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
          >
            <Mail className="w-4 h-4" /> Request Access
          </button>
        </div>
      </div>
    </div>
  );
}
