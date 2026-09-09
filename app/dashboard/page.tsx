'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { DashboardKanban } from '@/components/dashboard/DashboardKanban';
import { ProjectsHero } from '@/components/projects/ProjectsHero';
import { ProjectsFilterTabs } from '@/components/projects/ProjectsFilterTabs';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { WorkspacePromoBanner } from '@/components/projects/WorkspacePromoBanner';
import { TasksView } from '@/components/tasks/TasksView';
import { CalendarView } from '@/components/calendar/CalendarView';
import { ActivityView } from '@/components/activity/ActivityView';
import { MembersView } from '@/components/members/MembersView';
import { SettingsView } from '@/components/settings/SettingsView';
import { NotificationsView } from '@/components/notifications/NotificationsView';
import { HelpSupportView } from '@/components/help/HelpSupportView';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { useUIStore } from '@/store/useUIStore';

// Interactive Modals
import CommandPalette from '@/components/dashboard/CommandPalette';
import CreateTaskModal from '@/components/dashboard/CreateTaskModal';
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';
import InviteMemberModal from '@/components/dashboard/InviteMemberModal';
import TaskDetailModal from '@/components/dashboard/TaskDetailModal';
import CreateWorkspaceModal from '@/components/dashboard/CreateWorkspaceModal';

export default function DashboardPage() {
  const router = useRouter();
  const activeTabRaw = useWorkspaceStore((s) => s.activeTab);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const activeTab = (activeTabRaw || 'overview').toLowerCase();

  const currentUser = useAuthStore((s) => s.user);
  const currentProfile = useAuthStore((s) => s.profile);
  const authLoading = useAuthStore((s) => s.loading);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const loadWorkspaces = useWorkspaceStore((s) => s.loadWorkspaces);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const workspaceLoading = useWorkspaceStore((s) => s.loading);
  const setCreateWorkspaceModalOpen = useUIStore((s) => s.setCreateWorkspaceModalOpen);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [authLoading, currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      loadWorkspaces(currentUser.id);
    }
  }, [currentUser, loadWorkspaces]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Show welcome screen if no workspaces exist
  if (!workspaceLoading && workspaces.length === 0 && currentUser) {
    const firstName = currentProfile?.full_name?.split(' ')[0] || currentUser.email?.split('@')[0] || '';
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center selection:bg-amber-200 font-sans">
        <CreateWorkspaceModal />
        
        <div className="text-center space-y-6 max-w-md w-full px-6 animation-fade-in">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <span className="text-3xl">👋</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-serif text-stone-900 dark:text-white">
              Welcome to WORKROOM{firstName ? `, ${firstName}` : ''}!
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              It looks like you don't belong to any workspaces yet. A workspace is your team's home for projects, tasks, and collaboration.
            </p>
          </div>

          <button 
            onClick={() => setCreateWorkspaceModalOpen(true)}
            className="w-full py-3.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-100 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Create your first workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex selection:bg-amber-200">
      {/* Interactive Global Modals */}
      <CommandPalette />
      <CreateTaskModal />
      <CreateProjectModal />
      <InviteMemberModal />
      <TaskDetailModal />
      <CreateWorkspaceModal />

      {/* Left Navigation Sidebar */}
      <DashboardSidebar activeTab={activeTabRaw} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Main Dashboard Body Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen w-full">
        {/* Top Header Bar */}
        <DashboardHeader />

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-y-auto min-w-0">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-[1600px] mx-auto min-w-0">
              <DashboardGrid />
              <DashboardKanban />
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full min-w-0">
              <ProjectsHero />
              <ProjectsFilterTabs />
              <ProjectsGrid />
              <WorkspacePromoBanner />
            </div>
          )}

          {/* TAB 3: TASKS */}
          {activeTab === 'tasks' && <TasksView />}

          {/* TAB 4: CALENDAR */}
          {activeTab === 'calendar' && <CalendarView />}

          {/* TAB 5: ACTIVITY */}
          {activeTab === 'activity' && <ActivityView />}

          {/* TAB 6: MEMBERS */}
          {activeTab === 'members' && <MembersView />}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && <SettingsView />}

          {/* TAB 8: NOTIFICATIONS */}
          {activeTab === 'notifications' && <NotificationsView />}

          {/* TAB 9: ANALYTICS */}
          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {/* TAB 10: HELP & SUPPORT */}
          {(activeTab === 'help' || activeTab === 'help & support') && <HelpSupportView />}
        </main>
      </div>
    </div>
  );
}
