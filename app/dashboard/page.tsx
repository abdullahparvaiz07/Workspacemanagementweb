'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OverviewHero } from '@/components/dashboard/OverviewHero';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { DashboardKanban } from '@/components/dashboard/DashboardKanban';
import { RightSidebar } from '@/components/dashboard/RightSidebar';
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

// Interactive Modals
import CommandPalette from '@/components/dashboard/CommandPalette';
import CreateTaskModal from '@/components/dashboard/CreateTaskModal';
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';
import InviteMemberModal from '@/components/dashboard/InviteMemberModal';
import TaskDetailModal from '@/components/dashboard/TaskDetailModal';
import CreateWorkspaceModal from '@/components/dashboard/CreateWorkspaceModal';

export default function DashboardPage() {
  const activeTabRaw = useWorkspaceStore((s) => s.activeTab);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const activeTab = (activeTabRaw || 'overview').toLowerCase();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 flex overflow-x-hidden selection:bg-amber-200">
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
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <DashboardHeader />

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-[1600px] mx-auto">
              {/* Center Content Column */}
              <div className="flex-1 min-w-0 space-y-8 w-full">
                <OverviewHero />
                <DashboardGrid />
                <DashboardKanban />
              </div>
              <RightSidebar />
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8 max-w-7xl mx-auto w-full">
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

          {/* TAB 9: HELP & SUPPORT */}
          {(activeTab === 'help' || activeTab === 'help & support') && <HelpSupportView />}
        </main>
      </div>
    </div>
  );
}
