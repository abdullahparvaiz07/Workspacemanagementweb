'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useActivityStore } from '@/store/useActivityStore';
import { usePermissions } from '@/hooks/usePermissions';
import { TaskStatus, TaskPriority } from '@/features/tasks/types';
import { toast } from 'sonner';
import { X, Plus, Trash2 } from 'lucide-react';

export default function CreateTaskModal() {
  const isOpen = useUIStore((state) => state.isCreateTaskModalOpen);
  const createTaskDefaultStatus = useUIStore((state) => state.createTaskDefaultStatus) as TaskStatus | null;
  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);

  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const selectedProjectFilter = useWorkspaceStore((state) => state.selectedProjectFilter);
  const projects = useProjectStore((state) => state.projects);
  const workspaceMembers = useWorkspaceStore((state) => state.members);
  const currentUser = useAuthStore((state) => state.user);

  const createTask = useTaskStore((state) => state.createTask);
  const createSubtask = useTaskStore((state) => state.createSubtask);
  const logActivity = useActivityStore((state) => state.logActivity);

  const permissions = usePermissions();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectFilter || projects[0]?.id || '');
  const [status, setStatus] = useState<TaskStatus>(createTaskDefaultStatus || 'todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [assigneeId, setAssigneeId] = useState(currentUser?.id || '');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus(createTaskDefaultStatus || 'todo');
      if (!projectId && projects.length > 0) {
        setProjectId(selectedProjectFilter || projects[0].id);
      }
      if (!assigneeId && currentUser) {
        setAssigneeId(currentUser.id);
      }
    }
  }, [isOpen, createTaskDefaultStatus, projects, selectedProjectFilter, currentUser, projectId, assigneeId]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          title: subtaskInput.trim(),
          completed: false,
        },
      ]);
      setSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required.');
      return;
    }

    if (!projectId) {
      toast.error('Please select a project.');
      return;
    }

    if (!permissions.canCreateTask) {
      toast.error('Your role (Viewer) cannot create tasks.');
      return;
    }

    setLoading(true);
    try {
      const newTask = await createTask({
        project_id: projectId,
        title: title.trim(),
        description: description.trim() || 'No description provided.',
        status,
        priority,
        due_date: dueDate,
        assignee_id: assigneeId || null,
        created_by: currentUser?.id,
      });

      // Create subtasks sequentially
      for (const st of subtasks) {
        await createSubtask(newTask.id, st.title);
      }

      if (activeWorkspaceId && currentUser) {
        logActivity(
          activeWorkspaceId,
          currentUser.id,
          currentUser.email || 'User',
          '',
          'created task',
          'task',
          title.trim()
        );
      }

      toast.success(`Task "${title.trim()}" created successfully!`);
      setCreateTaskModalOpen(false);

      setTitle('');
      setDescription('');
      setSubtasks([]);
    } catch (err: any) {
      // toast is handled in the store usually, but we can log
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col my-8 animation-fade-in font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 flex-shrink-0">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Create New Task</h3>
            <p className="text-xs text-stone-500">Add a new item to your project kanban board.</p>
          </div>
          <button
            onClick={() => setCreateTaskModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Dark Mode UI Palette"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, acceptance criteria, or design notes..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 bg-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 bg-white capitalize"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 bg-white"
              >
                <option value="">Unassigned</option>
                {workspaceMembers.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.profile?.full_name || m.profile?.email} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Subtasks Checklist
            </label>
            <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-100 text-xs"
                >
                  <span className="text-stone-700 font-medium">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                placeholder="Add subtask title..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
              >
                Add Subtask
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateTaskModalOpen(false)}
              className="px-4 py-2 rounded-xl text-stone-600 font-medium text-xs hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-stone-900 text-stone-50 font-medium text-xs hover:bg-stone-800 shadow-md transition-all flex items-center gap-1.5 disabled:opacity-70"
            >
              {loading ? <span>Creating...</span> : <><Plus className="w-4 h-4" /> Create Task</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
