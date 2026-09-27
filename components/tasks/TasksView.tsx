'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { taskService } from '@/services/task.service';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { DashboardKanban } from '@/components/dashboard/DashboardKanban';
import { CalendarView } from '@/components/calendar/CalendarView';
import { TasksListSkeleton } from '@/components/ui/LoadingSkeletons';
import {
  Plus,
  MoreHorizontal,
  Search,
  ChevronDown,
  ChevronRight,
  List,
  LayoutGrid,
  Calendar as CalendarIcon,
  CheckSquare,
  RefreshCw,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  CheckCircle2,
  Bookmark,
  BookmarkPlus,
  SlidersHorizontal,
  Layers,
  ArrowUpRight,
  Sparkles,
  X,
  Clock,
  User as UserIcon,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/types';

type SortColumn = 'title' | 'project' | 'assignee' | 'priority' | 'dueDate' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc' | null;
type GroupByOption = 'none' | 'status' | 'priority' | 'project' | 'assignee';

interface FilterPreset {
  id: string;
  name: string;
  icon?: string;
  searchQuery: string;
  tabFilter: 'All' | 'My Tasks' | 'Assigned' | 'Due Soon' | 'Completed';
  project: string;
  assignee: string;
  status: string;
  priority: string;
  groupBy: GroupByOption;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const DEFAULT_PRESETS: FilterPreset[] = [
  {
    id: 'preset-all',
    name: 'All Tasks',
    searchQuery: '',
    tabFilter: 'All',
    project: 'All',
    assignee: 'All',
    status: 'All',
    priority: 'All',
    groupBy: 'none',
    sortColumn: 'dueDate',
    sortDirection: 'asc',
  },
  {
    id: 'preset-active',
    name: '🔥 Active Tasks',
    searchQuery: '',
    tabFilter: 'All',
    project: 'All',
    assignee: 'All',
    status: 'All',
    priority: 'All',
    groupBy: 'status',
    sortColumn: 'priority',
    sortDirection: 'desc',
  },
  {
    id: 'preset-urgent',
    name: '🚨 High & Urgent',
    searchQuery: '',
    tabFilter: 'All',
    project: 'All',
    assignee: 'All',
    status: 'All',
    priority: 'high',
    groupBy: 'priority',
    sortColumn: 'dueDate',
    sortDirection: 'asc',
  },
  {
    id: 'preset-review',
    name: '👀 In Review',
    searchQuery: '',
    tabFilter: 'All',
    project: 'All',
    assignee: 'All',
    status: 'review',
    priority: 'All',
    groupBy: 'project',
    sortColumn: 'dueDate',
    sortDirection: 'asc',
  },
];

const PRESETS_STORAGE_KEY = 'workroom_custom_filter_presets_v1';

export function TasksView() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const tasks = useTaskStore((s) => s.tasks);
  const bulkDeleteTasksInStore = useTaskStore((s) => s.bulkDeleteTasks);
  const bulkUpdateTaskStatusInStore = useTaskStore((s) => s.bulkUpdateTaskStatus);
  const updateTaskStatusInStore = useTaskStore((s) => s.updateTaskStatus);
  const toggleSubtaskInStore = useTaskStore((s) => s.toggleSubtask);
  const convertSubtaskToTaskInStore = useTaskStore((s) => s.convertSubtaskToTask);
  const projects = useProjectStore((s) => s.projects);
  const workspaceMembers = useWorkspaceStore((s) => s.members);
  const currentUser = useAuthStore((s) => s.user);
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

  // Sorting & Grouping
  const [sortColumn, setSortColumn] = useState<SortColumn>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [groupBy, setGroupBy] = useState<GroupByOption>('none');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [expandedTaskSubtasks, setExpandedTaskSubtasks] = useState<Record<string, boolean>>({});

  // Saved Filter Presets
  const [customPresets, setCustomPresets] = useState<FilterPreset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string>('preset-all');
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Selection state for checkboxes
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Load custom presets from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (saved) {
        setCustomPresets(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load presets', e);
    }
  }, []);

  const allPresets = useMemo(() => [...DEFAULT_PRESETS, ...customPresets], [customPresets]);

  const workspaceTasks = useMemo(() => {
    return tasks.filter((t) => t.workspaceId === activeWorkspaceId);
  }, [tasks, activeWorkspaceId]);

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
    { title: 'Total Tasks', value: workspaceTasks.length, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckSquare },
    { title: 'In Progress', value: workspaceTasks.filter((t) => t.status === 'in-progress').length, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', icon: ArrowUpDown },
    { title: 'Review', value: workspaceTasks.filter((t) => t.status === 'review').length, color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', icon: RefreshCw },
    { title: 'Completed', value: workspaceTasks.filter((t) => t.status === 'completed').length, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', icon: AlertCircle },
  ];

  // Helper function to toggle individual selection
  const toggleSelectTask = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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

  // Sorting Handler
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Preset Handlers
  const applyPreset = (preset: FilterPreset) => {
    setActivePresetId(preset.id);
    setSearchQuery(preset.searchQuery);
    setActiveTabFilter(preset.tabFilter);
    setSelectedProject(preset.project);
    setSelectedAssignee(preset.assignee);
    setSelectedStatus(preset.status);
    setSelectedPriority(preset.priority);
    setGroupBy(preset.groupBy);
    setSortColumn(preset.sortColumn);
    setSortDirection(preset.sortDirection);
    toast.info(`Preset applied: ${preset.name}`);
  };

  const handleSaveCurrentPreset = () => {
    if (!newPresetName.trim()) {
      toast.error('Please enter a preset name.');
      return;
    }
    const newPreset: FilterPreset = {
      id: `custom-preset-${Date.now()}`,
      name: newPresetName.trim(),
      searchQuery,
      tabFilter: activeTabFilter,
      project: selectedProject,
      assignee: selectedAssignee,
      status: selectedStatus,
      priority: selectedPriority,
      groupBy,
      sortColumn,
      sortDirection,
    };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save preset', e);
    }
    setActivePresetId(newPreset.id);
    setNewPresetName('');
    setShowSavePresetModal(false);
    toast.success(`Saved filter preset "${newPreset.name}"!`);
  };

  const handleDeleteCustomPreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    if (activePresetId === id) {
      setActivePresetId('preset-all');
    }
    toast.success('Preset deleted.');
  };

  // Filter & Sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = workspaceTasks.filter((t) => {
      if (
        searchQuery &&
        !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
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

    if (sortDirection && sortColumn) {
      const priorityWeight: Record<TaskPriority, number> = {
        urgent: 4,
        high: 3,
        medium: 2,
        low: 1,
      };

      const statusWeight: Record<string, number> = {
        todo: 1,
        'in-progress': 2,
        review: 3,
        completed: 4,
        done: 4,
      };

      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortColumn === 'title') {
          cmp = a.title.localeCompare(b.title);
        } else if (sortColumn === 'priority') {
          cmp = (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
        } else if (sortColumn === 'status') {
          cmp = (statusWeight[a.status] || 0) - (statusWeight[b.status] || 0);
        } else if (sortColumn === 'dueDate') {
          cmp = new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
        } else if (sortColumn === 'project') {
          const pA = projects.find((p) => p.id === a.projectId)?.name || '';
          const pB = projects.find((p) => p.id === b.projectId)?.name || '';
          cmp = pA.localeCompare(pB);
        } else if (sortColumn === 'assignee') {
          const aName = a.assigneeId || '';
          const bName = b.assigneeId || '';
          cmp = aName.localeCompare(bName);
        } else if (sortColumn === 'createdAt') {
          cmp = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }

        return sortDirection === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [
    workspaceTasks,
    searchQuery,
    activeTabFilter,
    selectedProject,
    selectedStatus,
    selectedPriority,
    selectedAssignee,
    sortColumn,
    sortDirection,
    currentUser,
    projects,
  ]);

  // Grouping logic
  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Tasks': filteredAndSortedTasks };
    }

    const groups: Record<string, Task[]> = {};

    filteredAndSortedTasks.forEach((task) => {
      let key = 'Other';
      if (groupBy === 'status') {
        key = task.status ? task.status.replace('-', ' ').toUpperCase() : 'NO STATUS';
      } else if (groupBy === 'priority') {
        key = task.priority ? task.priority.toUpperCase() : 'NO PRIORITY';
      } else if (groupBy === 'project') {
        const proj = projects.find((p) => p.id === task.projectId);
        key = proj?.name || 'General';
      } else if (groupBy === 'assignee') {
        const member = workspaceMembers.find((m) => m.user_id === task.assigneeId || m.id === task.assigneeId);
        key = member?.profile?.full_name || 'Unassigned';
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    });

    return groups;
  }, [filteredAndSortedTasks, groupBy, projects, workspaceMembers]);

  // Select all handler
  const toggleSelectAll = () => {
    if (selectedTaskIds.length === filteredAndSortedTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredAndSortedTasks.map((t) => t.id));
    }
  };

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const toggleSubtasksExpand = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTaskSubtasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handlePromoteSubtask = (parentTaskId: string, subtaskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTask = convertSubtaskToTaskInStore(parentTaskId, subtaskId);
    if (newTask) {
      toast.success('Subtask promoted to full task!');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full select-none animation-fade-in">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-zinc-950 dark:text-zinc-50 tracking-tight">
            Tasks
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium mt-1">
            Sort, group, and manage every task and subtask in your workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {permissions.canCreateTask && (
            <button
              onClick={() => setCreateTaskModalOpen(true)}
              className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full px-4 sm:px-5 py-2.5 font-semibold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Saved Filter Presets Bar */}
      <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-3 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>Saved Filter Presets:</span>
          </div>
          <button
            onClick={() => setShowSavePresetModal(!showSavePresetModal)}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Save current filter</span>
          </button>
        </div>

        {/* Save Preset Inline Input */}
        {showSavePresetModal && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-amber-50/80 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 animation-fade-in">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Preset name (e.g. Design Sprint Tasks)..."
              className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg text-xs border border-amber-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveCurrentPreset();
              }}
            />
            <button
              onClick={handleSaveCurrentPreset}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => setShowSavePresetModal(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Presets Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {allPresets.map((preset) => {
            const isActive = activePresetId === preset.id;
            const isCustom = !DEFAULT_PRESETS.some((p) => p.id === preset.id);

            return (
              <div
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span>{preset.name}</span>
                {isCustom && (
                  <button
                    onClick={(e) => handleDeleteCustomPreset(preset.id, e)}
                    className="p-0.5 rounded-full hover:bg-black/20 text-current transition-colors"
                    title="Delete preset"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedTaskIds.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between shadow-sm animation-fade-in">
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
            {selectedTaskIds.length} tasks selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkComplete}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* 3. Filter Navigation Tabs */}
      <div className="flex items-center gap-2 sm:gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-1 overflow-x-auto no-scrollbar">
        {(['All', 'My Tasks', 'Assigned', 'Due Soon', 'Completed'] as const).map((tab) => {
          const isActive = activeTabFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTabFilter(tab)}
              className={`flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-600/10 text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-600 rounded-b-none'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-amber-700 text-white'
                    : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {tabCounts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 flex items-center gap-4 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className={`p-3 rounded-xl ${stat.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-serif font-extrabold text-2xl text-zinc-950 dark:text-zinc-50 leading-none">
                  {stat.value}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Controls, Filters & Grouping Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left Side: Search & Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[180px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-4 py-2 bg-white/90 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-full text-xs font-medium text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
            />
          </div>

          {/* Group-by Selector */}
          <div className="relative">
            <div className="flex items-center gap-1.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1.5 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200">Group:</span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
                className="bg-transparent text-xs font-bold text-amber-900 dark:text-amber-300 focus:outline-none cursor-pointer pr-4"
              >
                <option value="none">None</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="project">Project</option>
                <option value="assignee">Assignee</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-full px-4 py-2 pr-8 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs focus:outline-none"
            >
              <option value="All">All Projects</option>
              {projects
                .filter((p) => p.workspace_id === activeWorkspaceId || (p as any).workspaceId === activeWorkspaceId)
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
              className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-full px-4 py-2 pr-8 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs focus:outline-none"
            >
              <option value="All">All Assignees</option>
              {workspaceMembers.map((m) => (
                <option key={m.id} value={m.user_id}>
                  {m.profile?.full_name || 'Member'}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-full px-4 py-2 pr-8 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs focus:outline-none"
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
              className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-full px-4 py-2 pr-8 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs focus:outline-none"
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
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-1 rounded-2xl shadow-2xs self-start lg:self-auto">
          <button
            onClick={() => setActiveViewMode('board')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'board'
                ? 'bg-amber-600/10 text-amber-900 dark:text-amber-300 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>

          <button
            onClick={() => setActiveViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'list'
                ? 'bg-amber-600/10 text-amber-900 dark:text-amber-300 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List / Table</span>
          </button>

          <button
            onClick={() => setActiveViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'calendar'
                ? 'bg-amber-600/10 text-amber-900 dark:text-amber-300 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <TasksListSkeleton />
      ) : activeViewMode === 'board' ? (
        <DashboardKanban />
      ) : activeViewMode === 'calendar' ? (
        <CalendarView />
      ) : (
        /* SORTABLE & GROUPABLE LIST / TABLE VIEW */
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([groupTitle, groupTaskList]) => {
            const isCollapsed = collapsedGroups[groupTitle];

            return (
              <div
                key={groupTitle}
                className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs overflow-hidden"
              >
                {/* Group Header (if grouped) */}
                {groupBy !== 'none' && (
                  <div
                    onClick={() => toggleGroupCollapse(groupTitle)}
                    className="px-6 py-3.5 bg-zinc-50/80 dark:bg-zinc-800/60 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between cursor-pointer hover:bg-zinc-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-zinc-500">
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        {groupTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                        {groupTaskList.length} tasks
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400 font-medium">
                        {groupTaskList.filter((t) => t.status === 'completed').length} completed
                      </span>
                    </div>
                  </div>
                )}

                {/* Table Rows (when not collapsed) */}
                {!isCollapsed && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead>
                        <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-50/50 dark:bg-zinc-800/30">
                          <th className="py-4 px-4 w-12 text-center">
                            <input
                              type="checkbox"
                              checked={
                                selectedTaskIds.length === filteredAndSortedTasks.length &&
                                filteredAndSortedTasks.length > 0
                              }
                              onChange={toggleSelectAll}
                              className="w-4 h-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500/20 cursor-pointer accent-amber-600"
                            />
                          </th>
                          <th
                            onClick={() => handleSort('title')}
                            className="py-4 px-4 font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>Task</span>
                              {sortColumn === 'title' ? (
                                sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('project')}
                            className="py-4 px-4 font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>Project</span>
                              {sortColumn === 'project' ? (
                                sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('assignee')}
                            className="py-4 px-4 font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>Assignee</span>
                              {sortColumn === 'assignee' ? (
                                sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('priority')}
                            className="py-4 px-4 font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>Priority</span>
                              {sortColumn === 'priority' ? (
                                sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('dueDate')}
                            className="py-4 px-4 font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>Due Date</span>
                              {sortColumn === 'dueDate' ? (
                                sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('status')}
                            className="py-4 px-4 font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>Status</span>
                              {sortColumn === 'status' ? (
                                sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-amber-600" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                              )}
                            </div>
                          </th>
                          <th className="py-4 px-4 font-bold text-zinc-500 dark:text-zinc-400 text-right">
                            Subtasks
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs font-medium">
                        {groupTaskList.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-zinc-400 italic">
                              No tasks in this group.
                            </td>
                          </tr>
                        ) : (
                          groupTaskList.map((task) => {
                            const isSelected = selectedTaskIds.includes(task.id);
                            const proj = projects.find((p) => p.id === task.projectId);
                            const subtasksExpanded = expandedTaskSubtasks[task.id];
                            const completedSubtasksCount = task.subtasks?.filter((st) => st.completed).length || 0;
                            const totalSubtasksCount = task.subtasks?.length || 0;

                            return (
                              <React.Fragment key={task.id}>
                                <tr
                                  onClick={() => setSelectedTaskIdForModal(task.id)}
                                  className={`transition-colors group hover:bg-amber-50/40 dark:hover:bg-zinc-800/50 cursor-pointer ${
                                    isSelected ? 'bg-amber-50/60 dark:bg-amber-950/30' : ''
                                  }`}
                                >
                                  <td
                                    className="py-4 px-4 text-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => toggleSelectTask(task.id)}
                                      className="w-4 h-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500/20 cursor-pointer accent-amber-600"
                                    />
                                  </td>

                                  <td className="py-4 px-4 max-w-xs">
                                    <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                                      {task.title}
                                    </div>
                                    <div className="text-[11px] text-zinc-400 font-normal truncate mt-0.5">
                                      {task.description || 'No description'}
                                    </div>
                                  </td>

                                  <td className="py-4 px-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: proj?.color || '#D97706' }}
                                      />
                                      <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-xs">
                                        {proj?.name || 'General'}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="py-4 px-4 whitespace-nowrap">
                                    {(() => {
                                      const member = workspaceMembers.find(
                                        (m) => m.user_id === task.assigneeId || m.id === task.assigneeId
                                      );
                                      const assignedMember = member?.profile
                                        ? { name: member.profile.full_name, avatar: member.profile.avatar_url }
                                        : (task as any).assignee;
                                      return assignedMember ? (
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={
                                              assignedMember.avatar ||
                                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                                            }
                                            alt={assignedMember.name || 'Member'}
                                            className="w-6 h-6 rounded-full object-cover shrink-0"
                                          />
                                          <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                                            {assignedMember.name || 'Member'}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-zinc-400 italic text-[11px]">Unassigned</span>
                                      );
                                    })()}
                                  </td>

                                  <td className="py-4 px-4 whitespace-nowrap">
                                    <span
                                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                        task.priority === 'urgent'
                                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                                          : task.priority === 'high'
                                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                          : task.priority === 'medium'
                                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                      }`}
                                    >
                                      {task.priority}
                                    </span>
                                  </td>

                                  <td className="py-4 px-4 whitespace-nowrap font-semibold text-zinc-600 dark:text-zinc-400">
                                    {task.dueDate || 'No date'}
                                  </td>

                                  <td className="py-4 px-4 whitespace-nowrap">
                                    <select
                                      value={task.status}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => {
                                        if (!permissions.canEditTask) {
                                          toast.error('Permission denied.');
                                          return;
                                        }
                                        updateTaskStatusInStore(task.id, e.target.value as TaskStatus);
                                        toast.success('Task status updated.');
                                      }}
                                      className="px-2.5 py-1 rounded-lg text-xs font-bold capitalize bg-stone-100 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 border border-stone-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
                                    >
                                      <option value="todo">To Do</option>
                                      <option value="in-progress">In Progress</option>
                                      <option value="review">Review</option>
                                      <option value="completed">Completed</option>
                                    </select>
                                  </td>

                                  <td className="py-4 px-4 whitespace-nowrap text-right">
                                    {totalSubtasksCount > 0 ? (
                                      <button
                                        onClick={(e) => toggleSubtasksExpand(task.id, e)}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                                      >
                                        <span>
                                          {completedSubtasksCount}/{totalSubtasksCount}
                                        </span>
                                        {subtasksExpanded ? (
                                          <ChevronDown className="w-3.5 h-3.5" />
                                        ) : (
                                          <ChevronRight className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    ) : (
                                      <span className="text-zinc-400 text-xs">—</span>
                                    )}
                                  </td>
                                </tr>

                                {/* Nested Subtasks Accordion Row */}
                                {subtasksExpanded && totalSubtasksCount > 0 && (
                                  <tr className="bg-zinc-50/70 dark:bg-zinc-800/30">
                                    <td colSpan={8} className="py-3 px-8">
                                      <div className="space-y-2 pl-4 border-l-2 border-amber-300 dark:border-amber-600">
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                          Subtasks ({completedSubtasksCount} of {totalSubtasksCount} completed)
                                        </div>
                                        {task.subtasks.map((st) => (
                                          <div
                                            key={st.id}
                                            className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 text-xs"
                                          >
                                            <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                                              <input
                                                type="checkbox"
                                                checked={st.completed}
                                                onChange={(e) => {
                                                  e.stopPropagation();
                                                  toggleSubtaskInStore(task.id, st.id);
                                                }}
                                                className="w-3.5 h-3.5 rounded text-amber-600 accent-amber-600 cursor-pointer"
                                              />
                                              <span
                                                className={
                                                  st.completed
                                                    ? 'line-through text-zinc-400'
                                                    : 'text-zinc-800 dark:text-zinc-200 font-medium'
                                                }
                                              >
                                                {st.title}
                                              </span>
                                            </label>

                                            <button
                                              onClick={(e) => handlePromoteSubtask(task.id, st.id, e)}
                                              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 transition-colors cursor-pointer"
                                              title="Convert this subtask into a full independent task"
                                            >
                                              <ArrowUpRight className="w-3 h-3" />
                                              <span>Promote to Task</span>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
