'use client';

import React, { useState } from 'react';
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
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  MessageSquare,
  CheckSquare,
  Bookmark,
  Trash2,
} from 'lucide-react';

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
    low: 'bg-emerald-100 text-emerald-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-rose-100 text-rose-700',
    urgent: 'bg-purple-100 text-purple-700',
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
      className={`bg-white p-3.5 rounded-xl border border-zinc-200/80 shadow-2xs hover:shadow-md transition-all space-y-3 cursor-grab active:cursor-grabbing group ${
        task.status === 'done' ? 'opacity-70' : ''
      }`}
    >
      {/* TOP */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md truncate max-w-[150px] shrink-0" title={badgeLabel}>
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
        className={`text-sm font-bold text-zinc-900 leading-snug group-hover:text-amber-900 transition-colors break-words ${
          task.status === 'done' ? 'line-through text-zinc-400' : ''
        }`}
      >
        {task.title}
      </h4>

      {/* BOTTOM */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-zinc-500 font-medium">
        <div className="flex items-center gap-1">
          {assignee ? (
            <img
              src={assignee.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
              alt={assignee.full_name || 'User'}
              title={assignee.full_name || 'User'}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-white shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-100 border border-dashed border-zinc-300 shrink-0" />
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
}: {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: TaskWithRelations[];
  onTaskClick: (taskId: string) => void;
  onAddTask: () => void;
  canCreateTask: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-[#FAF7F2] rounded-2xl p-3 sm:p-3.5 border transition-colors flex flex-col w-[280px] sm:min-w-[300px] sm:max-w-[360px] flex-shrink-0 min-h-[400px] sm:min-h-[500px] ${
        isOver ? 'border-amber-400 bg-amber-50/30' : 'border-zinc-200/80'
      }`}
    >
      <div className="flex items-center justify-between font-bold text-xs text-zinc-800 px-1 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
          <span className="whitespace-nowrap font-bold text-xs text-zinc-900">{title}</span>
        </div>
        <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-200/80 px-2 py-0.5 rounded-full shrink-0">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl m-2 mt-4">
          <span className="text-zinc-400 font-medium text-xs">Drop tasks here</span>
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
          className="w-full py-2 border border-dashed border-zinc-200 hover:border-zinc-400 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mt-3 shrink-0"
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
  const undoStore = useCommandHistoryStore();

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  React.useEffect(() => {
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

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'todo', title: 'Todo', color: 'bg-amber-400' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'review', title: 'Review', color: 'bg-purple-500' },
    { id: 'done', title: 'Done', color: 'bg-emerald-500' },
  ];

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
      toast.error('Your role (Viewer) does not allow moving tasks.');
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
        '', // avatar
        `moved "${task.title}" from ${previousStatus.replace('_', ' ')} to ${newStatus.replace('_', ' ')}`,
        'task',
        task.title
      );
    }

    // Toast Notification with details
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

  const priorityBadges = {
    low: 'bg-emerald-100 text-emerald-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-rose-100 text-rose-700',
    urgent: 'bg-purple-100 text-purple-700',
  };

  const handleSavePreset = () => {
    const name = prompt('Enter a name for this filter preset:');
    if (name) {
      filterState.savePreset({
        name,
        projectFilter: filterState.projectFilter,
        priorityFilter: filterState.priorityFilter,
        assigneeFilter: filterState.assigneeFilter,
        dateFilter: filterState.dateFilter,
        searchFilter: filterState.searchFilter,
      });
      toast.success('Filter preset saved!');
    }
  };

  const handleApplyPreset = (preset: any) => {
    filterState.applyPreset(preset);
    setShowPresetsMenu(false);
    toast.success(`Applied preset: ${preset.name}`);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-4 sm:p-6 lg:p-8 shadow-xs select-none space-y-4 sm:space-y-6 min-w-0 w-full">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-zinc-950 tracking-tight">Task Board</h2>

          <div className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-xl border border-zinc-200/80">
            <button
              onClick={() => setActiveView('board')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'board' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'list' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setActiveTab('Calendar')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-all"
            >
              Calendar
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
          <select
            value={filterState.projectFilter || ''}
            onChange={(e) => filterState.setProjectFilter(e.target.value || null)}
            className="bg-zinc-50 border border-zinc-200/90 rounded-xl px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none"
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
            value={filterState.assigneeFilter || ''}
            onChange={(e) => filterState.setAssigneeFilter(e.target.value || null)}
            className="bg-zinc-50 border border-zinc-200/90 rounded-xl px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none"
          >
            <option value="">All Assignees</option>
            {workspaceMembers.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.profile?.full_name || m.profile?.email || 'User'}
              </option>
            ))}
          </select>

          <select
            value={filterState.dateFilter || ''}
            onChange={(e) => filterState.setDateFilter(e.target.value || null)}
            className="bg-zinc-50 border border-zinc-200/90 rounded-xl px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none"
          >
            <option value="">Any Date</option>
            <option value="today">Due Today</option>
            <option value="this_week">Due This Week</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={filterState.priorityFilter}
            onChange={(e) => filterState.setPriorityFilter(e.target.value)}
            className="bg-zinc-50 border border-zinc-200/90 rounded-xl px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="relative">
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="bg-zinc-50 border border-zinc-200/90 rounded-xl px-3 py-1.5 text-xs text-zinc-800 font-medium hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Presets
            </button>
            
            {showPresetsMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animation-fade-in text-xs">
                <div className="px-3 pb-2 mb-2 border-b border-stone-100 flex justify-between items-center">
                  <span className="font-bold text-stone-700">Saved Filters</span>
                  <button onClick={handleSavePreset} className="text-blue-600 font-semibold hover:underline">
                    Save Current
                  </button>
                </div>
                {filterState.savedPresets.length === 0 ? (
                  <div className="px-4 py-2 text-stone-400 text-center italic">No presets saved</div>
                ) : (
                  filterState.savedPresets.map(preset => (
                    <div key={preset.id} className="flex items-center justify-between hover:bg-stone-50 px-2 py-1 mx-1 rounded group cursor-pointer transition-colors">
                      <span onClick={() => handleApplyPreset(preset)} className="flex-1 font-medium text-stone-700 px-2 py-1">
                        {preset.name}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); filterState.deletePreset(preset.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="relative flex-1 min-w-[120px] sm:w-48">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterState.searchFilter}
              onChange={(e) => filterState.setSearchFilter(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-zinc-50 border border-zinc-200/90 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
            />
          </div>

          {permissions.canCreateTask && (
            <button
              onClick={() => setCreateTaskModalOpen(true)}
              className="bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl px-4 py-1.5 text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Task</span>
            </button>
          )}
        </div>
      </div>

      {activeView === 'board' ? (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto pb-4 custom-scrollbar -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 sm:gap-6 items-start pt-2 h-full min-h-[400px] sm:min-h-[600px] w-max">
            {columns.map((col) => {
              const colTasks = workspaceTasks.filter(
                (t) => t.status === col.id || (col.id === 'done' && t.status === 'completed' as any)
              );
              return (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  color={col.color}
                  tasks={colTasks}
                  onTaskClick={(id) => setSelectedTaskIdForModal(id)}
                  onAddTask={() => setCreateTaskModalOpen(true, col.id as any)}
                  canCreateTask={permissions.canCreateTask}
                />
              );
            })}
          </div>
        </div>

          <DragOverlay>
            {activeDragTask ? (
              <div className="bg-white p-3.5 rounded-xl border-2 border-amber-500 shadow-2xl space-y-2.5 opacity-90 w-[320px]">
                <h4 className="text-sm font-bold text-zinc-900">{activeDragTask.title}</h4>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        /* List View */
        <div className="w-full min-w-0 overflow-x-auto border border-zinc-200 rounded-2xl">
          <table className="w-full text-left text-xs font-sans min-w-[640px]">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">Task</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {workspaceTasks.map((t) => {
                const assigneeUser = workspaceMembers.find((m) => m.user_id === t.assignee_id)?.profile;
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTaskIdForModal(t.id)}
                    className="hover:bg-amber-50/50 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-bold text-stone-900">{t.title}</td>
                    <td className="p-3.5 capitalize">
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold">
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${priorityBadges[t.priority]}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-600 font-medium">General</td>
                    <td className="p-3.5 text-stone-500">{t.due_date}</td>
                    <td className="p-3.5 flex items-center gap-2">
                      {assigneeUser && (
                        <>
                          <img src={assigneeUser.avatar_url || ''} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-stone-700 font-medium">{assigneeUser.full_name}</span>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
