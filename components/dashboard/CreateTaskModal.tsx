'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { usePermissions } from '@/hooks/usePermissions';
import { Task, TaskStatus } from '@/types';
import { toast } from 'sonner';
import { X, Plus, Trash2 } from 'lucide-react';

export default function CreateTaskModal() {
  const isOpen = useUIStore((state) => state.isCreateTaskModalOpen);
  const createTaskDefaultStatus = useUIStore((state) => state.createTaskDefaultStatus);
  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);

  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const selectedProjectFilter = useWorkspaceStore((state) => state.selectedProjectFilter);
  const projects = useProjectStore((state) => state.projects);
  const members = useAuthStore((state) => state.members);
  const currentUser = useAuthStore((state) => state.currentUser);

  const createTask = useTaskStore((state) => state.createTask);
  const logActivity = useActivityStore((state) => state.logActivity);
  const createNotification = useNotificationStore((state) => state.createNotification);

  const permissions = usePermissions();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectFilter || projects[0]?.id || 'p-1');
  const [status, setStatus] = useState<TaskStatus>(createTaskDefaultStatus || 'todo');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [category, setCategory] = useState('Design');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [assigneeId, setAssigneeId] = useState(currentUser?.id || 'u-1');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['UI/UX']);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; taskId: string; title: string; completed: boolean }[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStatus(createTaskDefaultStatus || 'todo');
    }
  }, [isOpen, createTaskDefaultStatus]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          taskId: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required.');
      return;
    }

    if (!permissions.canCreateTask) {
      toast.error('Your role (Viewer) cannot create tasks.');
      return;
    }

    const newTask = createTask({
      workspaceId: activeWorkspaceId,
      projectId,
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      status,
      priority,
      category,
      dueDate,
      assigneeId,
      tags: tags.length > 0 ? tags : ['General'],
      labels: tags,
      subtasks,
    });

    logActivity(
      activeWorkspaceId,
      currentUser.id,
      currentUser.name,
      currentUser.avatar,
      'created task',
      'task',
      title.trim()
    );

    if (assigneeId && assigneeId !== currentUser.id) {
      createNotification(
        assigneeId,
        'New Task Assignment',
        `${currentUser.name} assigned you to "${title.trim()}"`,
        'assignment'
      );
    }

    toast.success(`Task "${title.trim()}" created successfully!`);
    setCreateTaskModalOpen(false);

    setTitle('');
    setDescription('');
    setSubtasks([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden my-8 animation-fade-in font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 bg-white"
              >
                {projects
                  .filter((p) => p.workspaceId === activeWorkspaceId)
                  .map((p) => (
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
                <option value="in-progress">In Progress</option>
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
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
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
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
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
              Tags
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium"
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag (e.g. Frontend)"
                className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
              >
                Add Tag
              </button>
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
              className="px-5 py-2 rounded-xl bg-stone-900 text-stone-50 font-medium text-xs hover:bg-stone-800 shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
