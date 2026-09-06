'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/store/useTaskStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useUIStore } from '@/store/useUIStore';
import { taskService } from '@/services/task.service';
import { activityService } from '@/services/activity.service';
import { toast } from 'sonner';
import { ArrowRight, Folder, CheckCircle2, Clock } from 'lucide-react';

function formatTimestamp(isoString: string): string {
  if (!isoString) return 'Just now';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function DashboardGrid() {
  const router = useRouter();

  // Workspace & Auth Stores
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const setSelectedProjectFilter = useWorkspaceStore((s) => s.setSelectedProjectFilter);
  const currentUser = useAuthStore((s) => s.currentUser);
  const members = useAuthStore((s) => s.members);

  // Entity Stores
  const tasks = useTaskStore((s) => s.tasks);
  const updateTaskStatusInStore = useTaskStore((s) => s.updateTaskStatus);
  const projects = useProjectStore((s) => s.projects);
  const activities = useActivityStore((s) => s.activities);
  const logActivityInStore = useActivityStore((s) => s.logActivity);

  // UI Modal Stores
  const setCreateTaskModalOpen = useUIStore((s) => s.setCreateTaskModalOpen);
  const setCreateProjectModalOpen = useUIStore((s) => s.setCreateProjectModalOpen);
  const setSelectedTaskIdForModal = useUIStore((s) => s.setSelectedTaskIdForModal);

  // 1. TODAY'S TASKS DYNAMIC DATA
  const workspaceTasks = tasks.filter((t) => t.workspaceId === activeWorkspaceId);
  
  // Filter for currentUser, status != completed, and assigned/due today
  const todayTasks = workspaceTasks.filter((t) => {
    if (t.status === 'completed') return false;
    const isAssignedToUser = !t.assigneeId || t.assigneeId === currentUser?.id || (t as any).assignee?.id === currentUser?.id;
    return isAssignedToUser;
  });

  const handleToggleTaskCompletion = (e: React.MouseEvent, taskId: string, taskTitle: string) => {
    e.stopPropagation();
    
    // 1. Update task completion in service & store
    taskService.updateTaskStatus(taskId, 'completed');
    updateTaskStatusInStore(taskId, 'completed');

    // 2. Create activity event
    if (currentUser) {
      activityService.logActivity({
        workspaceId: activeWorkspaceId,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        action: `completed task "${taskTitle}"`,
        entityType: 'task',
        entityName: taskTitle,
      });
      logActivityInStore(
        activeWorkspaceId,
        currentUser.id,
        currentUser.name,
        currentUser.avatar,
        `completed task "${taskTitle}"`,
        'task',
        taskTitle
      );
    }

    // 3. Show success toast
    toast.success(`Completed "${taskTitle}"!`);
  };

  // 2. YOUR PROJECTS DYNAMIC DATA
  const workspaceProjects = projects.filter((p) => p.workspaceId === activeWorkspaceId);

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectFilter(projectId);
    setActiveTab('tasks');
    router.push('/dashboard');
  };

  // 3. RECENT ACTIVITY DYNAMIC DATA
  const workspaceActivities = activities
    .filter((a) => !a.workspaceId || a.workspaceId === activeWorkspaceId)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 select-none w-full">
      
      {/* CARD 1: TODAY'S TASKS */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 shadow-xs flex flex-col justify-between min-w-0 overflow-hidden">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="font-bold text-base text-zinc-900 tracking-tight whitespace-nowrap">Today</h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] font-semibold text-zinc-400 block mb-4">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

          {/* Task Checklist Items */}
          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="py-8 text-center text-zinc-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">No pending tasks for today!</p>
              </div>
            ) : (
              todayTasks.slice(0, 4).map((task) => {
                const proj = projects.find((p) => p.id === task.projectId);
                const assignedUser = members.find((m) => m.id === task.assigneeId) || currentUser;

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskIdForModal(task.id)}
                    className="p-3.5 rounded-2xl border bg-white border-zinc-200/80 hover:border-zinc-300 shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-3 overflow-hidden min-w-0"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={(e) => handleToggleTaskCompletion(e, task.id, task.title)}
                        className="w-5 h-5 rounded-md border border-zinc-300 bg-white hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                        title="Mark completed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-transparent hover:text-emerald-600 transition-colors" />
                      </button>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold leading-snug truncate text-zinc-900">
                          {task.title}
                        </h4>
                        <span className="text-[11px] text-zinc-400 font-medium block mt-0.5 truncate">
                          {proj?.name || 'General Project'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0 ml-2">
                      <span className="text-[11px] font-medium text-zinc-400 whitespace-nowrap">
                        {task.dueDate || 'Today'}
                      </span>
                      {assignedUser && (
                        <img
                          src={assignedUser.avatar}
                          alt={assignedUser.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-200 flex-shrink-0"
                          title={assignedUser.name}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <button
          onClick={() => setCreateTaskModalOpen(true)}
          className="w-full mt-5 py-2.5 border border-dashed border-zinc-200 hover:border-zinc-400 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          + Add today&apos;s task
        </button>
      </div>

      {/* CARD 2: YOUR PROJECTS */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 shadow-xs flex flex-col justify-between min-w-0 overflow-hidden">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-5">
            <h3 className="font-bold text-base text-zinc-900 tracking-tight whitespace-nowrap">Your Projects</h3>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Project Items */}
          <div className="space-y-4">
            {workspaceProjects.length === 0 ? (
              <div className="py-8 text-center text-zinc-400">
                <Folder className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">No active projects found.</p>
              </div>
            ) : (
              workspaceProjects.map((proj) => {
                const projectTasks = tasks.filter((t) => t.projectId === proj.id);
                const completedTasks = projectTasks.filter((t) => t.status === 'completed').length;
                const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

                return (
                  <div
                    key={proj.id}
                    onClick={() => handleProjectClick(proj.id)}
                    className="flex items-center gap-3 group cursor-pointer min-w-0"
                  >
                    {/* Project Icon */}
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold shadow-2xs"
                      style={{ backgroundColor: proj.color || '#D97706' }}
                    >
                      <Folder className="w-4.5 h-4.5" />
                    </div>

                    {/* Project Details & Progress */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-amber-700 transition-colors truncate flex-1 min-w-0">
                          {proj.name}
                        </h4>
                        <span className="text-xs font-bold text-zinc-800 flex-shrink-0 ml-2">
                          {progress}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium mb-1.5 min-w-0">
                        <span className="truncate flex-1 min-w-0 mr-2">{proj.category}</span>
                        <span className="whitespace-nowrap flex-shrink-0">{projectTasks.length} tasks</span>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%`, backgroundColor: proj.color || '#D97706' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <button
          onClick={() => setCreateProjectModalOpen(true)}
          className="w-full mt-5 py-2.5 border border-dashed border-zinc-200 hover:border-zinc-400 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          + Create new project
        </button>
      </div>

      {/* CARD 3: RECENT ACTIVITY */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 shadow-xs flex flex-col justify-between min-w-0 overflow-hidden">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-5">
            <h3 className="font-bold text-base text-zinc-900 tracking-tight whitespace-nowrap">Recent Activity</h3>
            <button
              onClick={() => setActiveTab('activity')}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeline Feed */}
          <div className="space-y-3.5">
            {workspaceActivities.length === 0 ? (
              <div className="py-8 text-center text-zinc-400">
                <p className="text-xs font-medium">No recent activities logged.</p>
              </div>
            ) : (
              workspaceActivities.map((item) => (
                <div key={item.id} className="flex items-start gap-3 min-w-0">
                  <img
                    src={item.userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                    alt={item.userName}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-zinc-200 flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0 text-xs leading-snug">
                    <p className="text-zinc-600">
                      <strong className="text-zinc-900 font-semibold">{item.userName || 'User'}</strong>{' '}
                      <span className="text-zinc-600">{item.action}</span>{' '}
                      <span className="font-semibold text-zinc-900">{item.entityName}</span>
                    </p>
                    <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-3 text-center">
          <span className="text-[11px] font-medium text-zinc-400">
            Real-time feed updated
          </span>
        </div>
      </div>

    </div>
  );
}
