'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useUIStore } from '@/store/useUIStore';
import { usePermissions } from '@/hooks/usePermissions';
import { useFilterStore } from '@/features/workspaces/store/useFilterStore';
import { useCommandHistoryStore } from '@/store/useCommandHistoryStore';
import { TaskStatus, TaskWithRelations } from '@/features/tasks/types';
import { KanbanSkeleton } from '@/components/ui/LoadingSkeletons';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  MessageSquare,
  CheckSquare,
  Bookmark,
  Trash2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit2,
  RotateCcw,
  Eye,
  EyeOff,
  X,
  Check,
  Palette,
} from 'lucide-react';

export interface KanbanColumnConfig {
  id: TaskStatus | string;
  title: string;
  color: string;
  visible: boolean;
}

const DEFAULT_KANBAN_COLUMNS: KanbanColumnConfig[] = [
  { id: 'todo', title: 'To Do', color: 'bg-zinc-400', visible: true },
  { id: 'in_progress', title: 'In Progress', color: 'bg-amber-500', visible: true },
  { id: 'review', title: 'Review', color: 'bg-purple-500', visible: true },
  { id: 'done', title: 'Done', color: 'bg-emerald-500', visible: true },
];

const COLOR_OPTIONS = [
  { name: 'Amber', class: 'bg-amber-500' },
  { name: 'Blue', class: 'bg-blue-500' },
  { name: 'Purple', class: 'bg-purple-500' },
  { name: 'Emerald', class: 'bg-emerald-500' },
  { name: 'Rose', class: 'bg-rose-500' },
  { name: 'Zinc', class: 'bg-zinc-400' },
];

function DraggableTaskCard({ task, onClick }: { task: TaskWithRelations; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const projects = useProjectStore((s) => s.projects);
  const workspaceMembers = useWorkspaceStore((s) => s.members);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const priorityBadges = {
    low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    urgent: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
  };

  const project = projects.find((p) => p.id === task.project_id);
  const assignee = workspaceMembers.find((m) => m.user_id === task.assignee_id)?.profile;
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const badgeLabel = project?.name || 'General';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`bg-white dark:bg-zinc-800/90 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700 shadow-2xs hover:shadow-md transition-all space-y-3 cursor-grab active:cursor-grabbing group ${
        task.status === 'done' ? 'opacity-70' : ''
      }`}
    >
      {/* TOP */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-md truncate max-w-[150px] shrink-0"
          title={badgeLabel}
        >
          {badgeLabel}
        </span>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${
            priorityBadges[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* CENTER */}
      <h4
        className={`text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-amber-900 dark:group-hover:text-amber-400 transition-colors break-words ${
          task.status === 'done' ? 'line-through text-zinc-400' : ''
        }`}
      >
        {task.title}
      </h4>

      {/* BOTTOM */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-700/60 text-zinc-500 dark:text-zinc-400 font-medium">
        <div className="flex items-center gap-1">
          {assignee ? (
            <img
              src={
                assignee.avatar_url ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
              }
              alt={assignee.full_name || 'User'}
              title={assignee.full_name || 'User'}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-700 border border-dashed border-zinc-300 dark:border-zinc-600 shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-zinc-400" />
              {completedSubtasks}/{task.subtasks.length}
            </span>
          )}
          {task.commentsCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
              {task.commentsCount}
            </span>
          )}
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" />
            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
          </span>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  id,
  title,
  color,
  tasks,
  onTaskClick,
  onAddTask,
  canCreateTask,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
}: {
  id: string;
  title: string;
  color: string;
  tasks: TaskWithRelations[];
  onTaskClick: (taskId: string) => void;
  onAddTask: () => void;
  canCreateTask: boolean;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-[#FAF7F2] dark:bg-zinc-900/60 rounded-2xl p-3 sm:p-3.5 border transition-colors flex flex-col w-[280px] sm:min-w-[300px] sm:max-w-[360px] flex-shrink-0 min-h-[400px] sm:min-h-[500px] ${
        isOver
          ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/20'
          : 'border-zinc-200/80 dark:border-zinc-800'
      }`}
    >
      <div className="flex items-center justify-between font-bold text-xs text-zinc-800 dark:text-zinc-200 px-1 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
          <span className="whitespace-nowrap font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {canMoveLeft && (
            <button
              onClick={onMoveLeft}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              title="Move column left"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
          )}
          {canMoveRight && (
            <button
              onClick={onMoveRight}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              title="Move column right"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-200/80 dark:bg-zinc-800 px-2 py-0.5 rounded-full shrink-0">
            {tasks.length}
          </span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl m-2 mt-4">
          <span className="text-zinc-400 dark:text-zinc-600 font-medium text-xs">Drop tasks here</span>
        </div>
      ) : (
        <div className="space-y-3 mt-4 flex-1">
          {tasks.map((t) => (
            <DraggableTaskCard key={t.id} task={t} onClick={() => onTaskClick(t.id)} />
          ))}
        </div>
      )}

      {canCreateTask && (
        <button
          onClick={onAddTask}
          className="w-full py-2 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors mt-3 shrink-0 cursor-pointer"
        >
          + Add task
        </button>
      )}
    </div>
  );
}

export function DashboardKanban() {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const setActiveTab = useWorkspaceStore((state) => state.setActiveTab);

  const projects = useProjectStore((state) => state.projects);
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const isTasksLoading = useTaskStore((state) => state.loading);

  const currentUser = useAuthStore((state) => state.user);
  const workspaceMembers = useWorkspaceStore((state) => state.members);
  const logActivity = useActivityStore((state) => state.logActivity);

  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);
  const setSelectedTaskIdForModal = useUIStore((state) => state.setSelectedTaskIdForModal);
  const filterState = useFilterStore();
  
  const permissions = usePermissions();

  const [activeView, setActiveView] = useState<'board' | 'list'>('board');
  const [activeDragTask, setActiveDragTask] = useState<TaskWithRelations | null>(null);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  // Column configuration per project / workspace
  const currentProjectId = filterState.projectFilter || 'all';
  const storageKey = `workroom_kanban_cols_v2_${activeWorkspaceId}_${currentProjectId}`;

  const [columns, setColumns] = useState<KanbanColumnConfig[]>(DEFAULT_KANBAN_COLUMNS);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnColor, setNewColumnColor] = useState('bg-amber-500');

  // Load column config from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setColumns(JSON.parse(saved));
      } else {
        setColumns(DEFAULT_KANBAN_COLUMNS);
      }
    } catch (e) {
      setColumns(DEFAULT_KANBAN_COLUMNS);
    }
  }, [storageKey]);

  const saveColumnsToStorage = (newCols: KanbanColumnConfig[]) => {
    setColumns(newCols);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newCols));
    } catch (e) {
      console.error('Failed to save kanban columns', e);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    if (filterState.projectFilter) {
      loadTasks(filterState.projectFilter);
    } else if (projects.length > 0) {
      loadTasks(projects[0].id);
    }
  }, [filterState.projectFilter, projects, loadTasks]);

  const workspaceTasks = tasks.filter((t) => {
    if (filterState.projectFilter && t.project_id !== filterState.projectFilter) return false;
    if (filterState.priorityFilter !== 'all' && t.priority !== filterState.priorityFilter) return false;
    if (filterState.assigneeFilter && t.assignee_id !== filterState.assigneeFilter) return false;
    
    if (filterState.dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const taskDate = t.due_date ? new Date(t.due_date) : null;
      if (taskDate) taskDate.setHours(0, 0, 0, 0);

      if (filterState.dateFilter === 'today') {
        if (!taskDate || taskDate.getTime() !== today.getTime()) return false;
      } else if (filterState.dateFilter === 'overdue') {
        if (!taskDate || taskDate.getTime() >= today.getTime()) return false;
      } else if (filterState.dateFilter === 'this_week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        if (!taskDate || taskDate.getTime() < today.getTime() || taskDate.getTime() > nextWeek.getTime()) return false;
      }
    }

    if (filterState.searchFilter.trim()) {
      return t.title.toLowerCase().includes(filterState.searchFilter.toLowerCase());
    }
    return true;
  });

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as TaskWithRelations;
    if (task) {
      setActiveDragTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    if (!permissions.canEditTask) {
      toast.error('Your role does not allow moving tasks.');
      return;
    }

    const previousStatus = task.status;
    updateTaskStatus(taskId, newStatus);

    // Audit Log Activity
    if (activeWorkspaceId && currentUser) {
      logActivity(
        activeWorkspaceId,
        currentUser.id,
        currentUser.email || 'User',
        '',
        `moved "${task.title}" to ${newStatus.replace('_', ' ')}`,
        'task',
        task.title
      );
    }

    toast.success(`Moved "${task.title}" to ${newStatus.replace('_', ' ')}`, {
      action: {
        label: 'Undo',
        onClick: () => {
          updateTaskStatus(taskId, previousStatus);
          toast.info(`Moved back to ${previousStatus.replace('_', ' ')}`);
        },
      },
      duration: 5000,
    });
  };

  // Reorder Columns
  const handleMoveColumn = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= columns.length) return;
    const updated = [...columns];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    saveColumnsToStorage(updated);
  };

  // Add Custom Column
  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) {
      toast.error('Please enter a column title.');
      return;
    }
    const id = newColumnTitle.trim().toLowerCase().replace(/\s+/g, '_');
    if (columns.some((c) => c.id === id)) {
      toast.error('A column with this name already exists.');
      return;
    }
    const newCol: KanbanColumnConfig = {
      id,
      title: newColumnTitle.trim(),
      color: newColumnColor,
      visible: true,
    };
    const updated = [...columns, newCol];
    saveColumnsToStorage(updated);
    setNewColumnTitle('');
    toast.success(`Added column "${newCol.title}"`);
  };

  // Toggle Visibility
  const handleToggleColumnVisibility = (index: number) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], visible: !updated[index].visible };
    saveColumnsToStorage(updated);
  };

  // Rename Column
  const handleRenameColumn = (index: number, title: string) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], title };
    saveColumnsToStorage(updated);
  };

  // Reset to Defaults
  const handleResetColumns = () => {
    saveColumnsToStorage(DEFAULT_KANBAN_COLUMNS);
    toast.success('Kanban columns reset to defaults.');
  };

  const visibleColumns = columns.filter((c) => c.visible !== false);

  return (
    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-4 sm:p-6 lg:p-8 shadow-xs select-none space-y-4 sm:space-y-6 min-w-0 w-full animation-fade-in">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-zinc-950 dark:text-zinc-50 tracking-tight">
            Task Board
          </h2>

          <div className="flex items-center gap-1 bg-zinc-100/90 dark:bg-zinc-800/90 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-750">
            <button
              onClick={() => setActiveView('board')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'board'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setActiveTab('Tasks')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer"
            >
              List / Table
            </button>
            <button
              onClick={() => setActiveTab('Calendar')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer"
            >
              Calendar
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => setShowCustomizeModal(true)}
            className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl px-3 py-1.5 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Reorder and customize columns for this project"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize Columns</span>
          </button>

          <select
            value={filterState.projectFilter || ''}
            onChange={(e) => filterState.setProjectFilter(e.target.value || null)}
            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 font-medium focus:outline-none"
          >
            <option value="">All Projects</option>
            {projects
              .filter((p) => p.workspace_id === activeWorkspaceId)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>

          <select
            value={filterState.priorityFilter}
            onChange={(e) => filterState.setPriorityFilter(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 font-medium focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Customize Columns Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animation-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  Customize Kanban Columns
                </h3>
              </div>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Reorder, rename, or add custom lanes for this project workspace.
            </p>

            {/* Columns List */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {columns.map((col, idx) => (
                <div
                  key={col.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700 gap-2"
                >
                  <div className="flex items-center gap-2.5 flex-1">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${col.color}`} />
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => handleRenameColumn(idx, e.target.value)}
                      className="bg-transparent text-xs font-bold text-zinc-900 dark:text-zinc-100 flex-1 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveColumn(idx, 'left')}
                      className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 disabled:opacity-30 cursor-pointer"
                      title="Move Left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === columns.length - 1}
                      onClick={() => handleMoveColumn(idx, 'right')}
                      className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 disabled:opacity-30 cursor-pointer"
                      title="Move Right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleColumnVisibility(idx)}
                      className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 cursor-pointer"
                      title={col.visible ? 'Hide column' : 'Show column'}
                    >
                      {col.visible ? (
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Column */}
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200/70 dark:border-amber-800/50 space-y-2">
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                + Add Custom Column
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="e.g. Blocked, In QA, Backlog..."
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-xl text-xs border border-amber-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
                <select
                  value={newColumnColor}
                  onChange={(e) => setNewColumnColor(e.target.value)}
                  className="px-2 py-1.5 bg-white dark:bg-zinc-800 rounded-xl text-xs border border-amber-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c.class} value={c.class}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddColumn}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={handleResetColumns}
                className="text-xs text-zinc-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to default lanes
              </button>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Board Rendering */}
      {isTasksLoading ? (
        <KanbanSkeleton columns={visibleColumns.length} />
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar min-w-0">
            {visibleColumns.map((col, idx) => {
              const colTasks = workspaceTasks.filter((t) => {
                const s = (t.status || 'todo') as string;
                if (col.id === 'todo') return s === 'todo';
                if (col.id === 'in_progress') return s === 'in_progress' || s === 'in-progress';
                if (col.id === 'review') return s === 'review';
                if (col.id === 'done') return s === 'done' || s === 'completed';
                return s === col.id;
              });

              return (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  color={col.color}
                  tasks={colTasks}
                  onTaskClick={(id) => setSelectedTaskIdForModal(id)}
                  onAddTask={() => setCreateTaskModalOpen(true)}
                  canCreateTask={permissions.canCreateTask}
                  onMoveLeft={() => handleMoveColumn(idx, 'left')}
                  onMoveRight={() => handleMoveColumn(idx, 'right')}
                  canMoveLeft={idx > 0}
                  canMoveRight={idx < visibleColumns.length - 1}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeDragTask ? (
              <div className="w-[280px] rotate-2 scale-105 shadow-2xl opacity-90 pointer-events-none">
                <DraggableTaskCard task={activeDragTask} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
