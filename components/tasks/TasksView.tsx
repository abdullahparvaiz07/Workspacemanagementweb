'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { taskService } from '@/services/task.service';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { DashboardKanban } from '@/components/dashboard/DashboardKanban';
import { CalendarView } from '@/components/calendar/CalendarView';
import {
  Plus,
  MoreHorizontal,
  Search,
  ChevronDown,
  List,
  LayoutGrid,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  RefreshCw,
  AlertCircle,
  ArrowUpDown,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export function TasksView() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const tasks = useTaskStore((s) => s.tasks);
  const bulkDeleteTasksInStore = useTaskStore((s) => s.bulkDeleteTasks);
  const bulkUpdateTaskStatusInStore = useTaskStore((s) => s.bulkUpdateTaskStatus);
  const projects = useProjectStore((s) => s.projects);
  const members = useAuthStore((s) => s.members);
  const currentUser = useAuthStore((s) => s.currentUser);
  const setCreateTaskModalOpen = useUIStore((s) => s.setCreateTaskModalOpen);
  const setSelectedTaskIdForModal = useUIStore((s) => s.setSelectedTaskIdForModal);

  const permissions = usePermissions();

  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'My Tasks' | 'Assigned' | 'Due Soon' | 'Completed'>('All');
  const [activeViewMode, setActiveViewMode] = useState<'list' | 'board' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  
  // Selection state for checkboxes
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const workspaceTasks = tasks.filter((t) => t.workspaceId === activeWorkspaceId);

  // Tab count metrics
  const tabCounts = {
    All: workspaceTasks.length,
    'My Tasks': workspaceTasks.filter((t) => (t.assigneeId || (t as any).assignee?.id) === currentUser?.id).length,
    Assigned: workspaceTasks.filter((t) => {
      const aId = t.assigneeId || (t as any).assignee?.id;
      return aId && aId !== currentUser?.id;
    }).length,
    'Due Soon': workspaceTasks.filter((t) => t.status !== 'completed').length,
    Completed: workspaceTasks.filter((t) => t.status === 'completed').length,
  };

  // Stat Cards values
  const stats = [
    { title: 'Total Tasks', value: workspaceTasks.length, color: 'bg-blue-50 text-blue-600', icon: CheckSquare },
    { title: 'In Progress', value: workspaceTasks.filter((t) => t.status === 'in-progress').length, color: 'bg-emerald-50 text-emerald-600', icon: ArrowUpDown },
    { title: 'Review', value: workspaceTasks.filter((t) => t.status === 'review').length, color: 'bg-amber-50 text-amber-600', icon: RefreshCw },
    { title: 'Completed', value: workspaceTasks.filter((t) => t.status === 'completed').length, color: 'bg-rose-50 text-rose-600', icon: AlertCircle },
  ];

  // Helper function to toggle individual selection
  const toggleSelectTask = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all handler
  const toggleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map((t) => t.id));
    }
  };

  // Bulk actions
  const handleBulkDelete = () => {
    if (!permissions.canDeleteTask) {
      toast.error('Your role does not allow task deletion.');
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedTaskIds.length} selected tasks?`)) {
      taskService.bulkDeleteTasks(selectedTaskIds);
      bulkDeleteTasksInStore(selectedTaskIds);
      toast.success(`${selectedTaskIds.length} tasks deleted.`);
      setSelectedTaskIds([]);
    }
  };

  const handleBulkComplete = () => {
    if (!permissions.canEditTask) {
      toast.error('Your role does not allow editing tasks.');
      return;
    }
    taskService.bulkUpdateTaskStatus(selectedTaskIds, 'completed');
    bulkUpdateTaskStatusInStore(selectedTaskIds, 'completed');
    toast.success(`${selectedTaskIds.length} tasks marked as completed.`);
    setSelectedTaskIds([]);
  };

  // Filter tasks logic
  const filteredTasks = workspaceTasks.filter((t) => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTabFilter === 'My Tasks' && (t.assigneeId || (t as any).assignee?.id) !== currentUser?.id) return false;
    if (activeTabFilter === 'Completed' && t.status !== 'completed') return false;
    if (selectedProject !== 'All' && t.projectId !== selectedProject) return false;
    if (selectedStatus !== 'All' && t.status !== selectedStatus) return false;
    if (selectedPriority !== 'All' && t.priority !== selectedPriority) return false;
    if (selectedAssignee !== 'All' && (t.assigneeId || (t as any).assignee?.id) !== selectedAssignee) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full select-none">
      {/* 1. Header Section: Title, Subtitle, Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-zinc-950 tracking-tight">
            Tasks
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-1">
            Stay focused and get work done across your workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {permissions.canCreateTask && (
            <button
              onClick={() => setCreateTaskModalOpen(true)}
              className="bg-zinc-950 text-white rounded-full px-4 sm:px-5 py-2.5 font-semibold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedTaskIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animation-fade-in">
          <span className="text-xs font-bold text-amber-900">
            {selectedTaskIds.length} tasks selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkComplete}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Filter Navigation Tabs */}
      <div className="flex items-center gap-2 sm:gap-4 border-b border-zinc-200/80 pb-1 overflow-x-auto no-scrollbar">
        {(['All', 'My Tasks', 'Assigned', 'Due Soon', 'Completed'] as const).map((tab) => {
          const isActive = activeTabFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTabFilter(tab)}
              className={`flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-600/10 text-amber-900 shadow-2xs font-bold border-b-2 border-amber-600 rounded-b-none'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-amber-700 text-white' : 'bg-zinc-200/70 text-zinc-600'
                }`}
              >
                {tabCounts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200/80 p-5 flex items-center gap-4 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className={`p-3 rounded-xl ${stat.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-serif font-extrabold text-2xl text-zinc-950 leading-none">
                  {stat.value}
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-1">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Controls & Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left Side: Search & Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-4 py-2 bg-white/90 border border-zinc-200/90 rounded-full text-xs font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="appearance-none bg-white border border-zinc-200/90 rounded-full px-4 py-2 pr-8 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs focus:outline-none"
            >
              <option value="All">All Projects</option>
              {projects
                .filter((p) => p.workspaceId === activeWorkspaceId)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="appearance-none bg-white border border-zinc-200/90 rounded-full px-4 py-2 pr-8 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs focus:outline-none"
            >
              <option value="All">All Assignees</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-white border border-zinc-200/90 rounded-full px-4 py-2 pr-8 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="appearance-none bg-white border border-zinc-200/90 rounded-full px-4 py-2 pr-8 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-white border border-zinc-200/90 p-1 rounded-2xl shadow-2xs self-start lg:self-auto">
          <button
            onClick={() => setActiveViewMode('board')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'board' ? 'bg-amber-600/10 text-amber-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>

          <button
            onClick={() => setActiveViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'list' ? 'bg-amber-600/10 text-amber-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>

          <button
            onClick={() => setActiveViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'calendar' ? 'bg-amber-600/10 text-amber-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeViewMode === 'board' ? (
        <DashboardKanban />
      ) : activeViewMode === 'calendar' ? (
        <CalendarView />
      ) : (
        /* LIST VIEW TABLE */
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50/50">
                  <th className="py-4 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500/20 cursor-pointer accent-amber-600"
                    />
                  </th>
                  <th className="py-4 px-4 font-bold text-zinc-500">Task</th>
                  <th className="py-4 px-4 font-bold text-zinc-500">Project</th>
                  <th className="py-4 px-4 font-bold text-zinc-500">Assignee</th>
                  <th className="py-4 px-4 font-bold text-zinc-500">Priority</th>
                  <th className="py-4 px-4 font-bold text-zinc-500">Due Date</th>
                  <th className="py-4 px-4 font-bold text-zinc-500">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100 text-xs font-medium">
                {filteredTasks.map((task) => {
                  const isSelected = selectedTaskIds.includes(task.id);
                  const proj = projects.find((p) => p.id === task.projectId);

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTaskIdForModal(task.id)}
                      className={`transition-colors group hover:bg-amber-50/40 cursor-pointer ${
                        isSelected ? 'bg-amber-50/60' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectTask(task.id)}
                          className="w-4 h-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500/20 cursor-pointer accent-amber-600"
                        />
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-bold text-zinc-900 text-xs sm:text-sm group-hover:text-amber-700 transition-colors">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-normal truncate mt-0.5">
                          {task.description}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: proj?.color || '#D97706' }}
                          />
                          <span className="font-semibold text-zinc-700 text-xs">
                            {proj?.name || 'General'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {(() => {
                          const assignedMember = members.find((m) => m.id === task.assigneeId) || (task as any).assignee;
                          return assignedMember ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={assignedMember.avatar}
                                alt={assignedMember.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="text-zinc-700 font-medium">{assignedMember.name}</span>
                            </div>
                          ) : null;
                        })()}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-stone-100 text-stone-700">
                          {task.priority}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-semibold text-zinc-600">
                        {task.dueDate}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold capitalize bg-amber-100/80 text-amber-900">
                          {task.status.replace('-', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
