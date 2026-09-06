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
import { useTaskStore } from '@/store/useTaskStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useUIStore } from '@/store/useUIStore';
import { usePermissions } from '@/hooks/usePermissions';
import { Task, TaskStatus } from '@/types';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  MessageSquare,
  CheckSquare,
} from 'lucide-react';

function DraggableTaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const projects = useProjectStore((s) => s.projects);
  const members = useAuthStore((s) => s.members);

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

  const project = projects.find((p) => p.id === task.projectId);
  const assignee = members.find((m) => m.id === task.assigneeId) || (task as any).assignee;
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`bg-white p-3.5 rounded-xl border border-zinc-200/80 shadow-2xs hover:shadow-md transition-all space-y-2.5 cursor-grab active:cursor-grabbing group ${
        task.status === 'completed' || task.status === 'done' ? 'opacity-85' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md truncate max-w-[120px]">
          {project?.name || task.category || 'General'}
        </span>
        <span
          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
            priorityBadges[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      <h4
        className={`text-xs font-bold text-zinc-900 leading-snug group-hover:text-amber-900 transition-colors ${
          task.status === 'completed' || task.status === 'done' ? 'line-through text-zinc-400' : ''
        }`}
      >
        {task.title}
      </h4>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[10px] text-zinc-400 font-medium">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3 text-zinc-400" />
            {task.dueDate}
          </span>
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-zinc-400" />
              {completedSubtasks}/{task.subtasks.length}
            </span>
          )}
          {task.commentsCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-zinc-400" />
              {task.commentsCount}
            </span>
          )}
        </div>

        {assignee && (
          <img
            src={assignee.avatar}
            alt={assignee.name}
            title={assignee.name}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
          />
        )}
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
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onAddTask: () => void;
  canCreateTask: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-[#FAF7F2] rounded-2xl p-3.5 border transition-colors space-y-3 min-h-[440px] flex flex-col justify-between ${
        isOver ? 'border-amber-400 bg-amber-50/30' : 'border-zinc-200/80'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between font-bold text-xs text-zinc-800 px-1">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span>{title}</span>
          </div>
          <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-200/80 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>

        {tasks.map((t) => (
          <DraggableTaskCard key={t.id} task={t} onClick={() => onTaskClick(t.id)} />
        ))}
      </div>

      {canCreateTask && (
        <button
          onClick={onAddTask}
          className="w-full py-2 border border-dashed border-zinc-200 hover:border-zinc-400 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mt-2"
        >
          + Add task
        </button>
      )}
    </div>
  );
}

export function DashboardKanban() {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const selectedProjectFilter = useWorkspaceStore((state) => state.selectedProjectFilter);
  const setSelectedProjectFilter = useWorkspaceStore((state) => state.setSelectedProjectFilter);
  const setActiveTab = useWorkspaceStore((state) => state.setActiveTab);

  const projects = useProjectStore((state) => state.projects);
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  const currentUser = useAuthStore((state) => state.currentUser);
  const members = useAuthStore((state) => state.members);
  const logActivity = useActivityStore((state) => state.logActivity);

  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);
  const setSelectedTaskIdForModal = useUIStore((state) => state.setSelectedTaskIdForModal);

  const permissions = usePermissions();

  const [activeView, setActiveView] = useState<'board' | 'list'>('board');
  const [localSearch, setLocalSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const workspaceTasks = tasks.filter((t) => {
    if (t.workspaceId !== activeWorkspaceId) return false;
    if (selectedProjectFilter && t.projectId !== selectedProjectFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (localSearch.trim()) {
      return (
        t.title.toLowerCase().includes(localSearch.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(localSearch.toLowerCase()))
      );
    }
    return true;
  });

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'todo', title: 'Todo', color: 'bg-amber-400' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'review', title: 'Review', color: 'bg-purple-500' },
    { id: 'done', title: 'Done', color: 'bg-emerald-500' },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task;
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
    logActivity(
      activeWorkspaceId,
      currentUser.id,
      currentUser.name,
      currentUser.avatar,
      `moved "${task.title}" from ${previousStatus.replace('-', ' ')} to ${newStatus.replace('-', ' ')}`,
      'task',
      task.title
    );

    // Toast Notification with details
    toast.success(`Moved "${task.title}" from ${previousStatus.replace('-', ' ')} to ${newStatus.replace('-', ' ')}`, {
      action: {
        label: 'Undo',
        onClick: () => {
          updateTaskStatus(taskId, previousStatus);
          toast.info(`Moved back to ${previousStatus.replace('-', ' ')}`);
        },
      },
    });
  };

  const priorityBadges = {
    low: 'bg-emerald-100 text-emerald-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-rose-100 text-rose-700',
    urgent: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs select-none space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <h2 className="font-serif font-bold text-2xl text-zinc-950 tracking-tight">Task Board</h2>

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

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <select
            value={selectedProjectFilter || ''}
            onChange={(e) => setSelectedProjectFilter(e.target.value || null)}
            className="bg-zinc-50 border border-zinc-200/90 rounded-xl px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none"
          >
            <option value="">All Projects</option>
            {projects
              .filter((p) => p.workspaceId === activeWorkspaceId)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-zinc-50 border border-zinc-200/90 rounded-xl px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
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

      {/* Board View vs List View */}
      {activeView === 'board' ? (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start pt-2">
            {columns.map((col) => {
              const colTasks = workspaceTasks.filter(
                (t) => t.status === col.id || (col.id === 'done' && t.status === 'completed')
              );
              return (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  color={col.color}
                  tasks={colTasks}
                  onTaskClick={(id) => setSelectedTaskIdForModal(id)}
                  onAddTask={() => setCreateTaskModalOpen(true, col.id)}
                  canCreateTask={permissions.canCreateTask}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeDragTask ? (
              <div className="bg-white p-3.5 rounded-xl border-2 border-amber-500 shadow-2xl space-y-2.5 opacity-90">
                <h4 className="text-xs font-bold text-zinc-900">{activeDragTask.title}</h4>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        /* List View */
        <div className="overflow-hidden border border-zinc-200 rounded-2xl">
          <table className="w-full text-left text-xs font-sans">
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
                const assigneeUser = members.find((m) => m.id === t.assigneeId);
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTaskIdForModal(t.id)}
                    className="hover:bg-amber-50/50 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-bold text-stone-900">{t.title}</td>
                    <td className="p-3.5 capitalize">
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold">
                        {t.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${priorityBadges[t.priority]}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-600 font-medium">{t.category}</td>
                    <td className="p-3.5 text-stone-500">{t.dueDate}</td>
                    <td className="p-3.5 flex items-center gap-2">
                      {assigneeUser && (
                        <>
                          <img src={assigneeUser.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-stone-700 font-medium">{assigneeUser.name}</span>
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
