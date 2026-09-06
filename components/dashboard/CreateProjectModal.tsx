'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useActivityStore } from '@/store/useActivityStore';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { X, FolderPlus } from 'lucide-react';

export default function CreateProjectModal() {
  const isOpen = useUIStore((state) => state.isCreateProjectModalOpen);
  const setCreateProjectModalOpen = useUIStore((state) => state.setCreateProjectModalOpen);

  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const currentUser = useAuthStore((state) => state.currentUser);
  const createProject = useProjectStore((state) => state.createProject);
  const logActivity = useActivityStore((state) => state.logActivity);

  const permissions = usePermissions();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Product & Engineering');
  const [color, setColor] = useState('#D97706');

  if (!isOpen) return null;

  const colorOptions = [
    { label: 'Amber', value: '#D97706' },
    { label: 'Emerald', value: '#059669' },
    { label: 'Indigo', value: '#4F46E5' },
    { label: 'Rose', value: '#E11D48' },
    { label: 'Sky', value: '#0284C7' },
    { label: 'Stone', value: '#57534E' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Project name is required.');
      return;
    }

    if (!permissions.canCreateProject) {
      toast.error('Your role does not allow creating projects.');
      return;
    }

    createProject(activeWorkspaceId, name.trim(), description.trim(), category, color);

    logActivity(
      activeWorkspaceId,
      currentUser.id,
      currentUser.name,
      currentUser.avatar,
      'created project',
      'project',
      name.trim()
    );

    toast.success(`Project "${name.trim()}" created successfully!`);
    setCreateProjectModalOpen(false);

    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animation-fade-in font-sans">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Create New Project</h3>
            <p className="text-xs text-stone-500">Group tasks into a dedicated workspace stream.</p>
          </div>
          <button
            onClick={() => setCreateProjectModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Mobile App Redesign"
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
              placeholder="Goal of this project..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Design, Engineering, Marketing"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Accent Color
            </label>
            <div className="flex gap-3 items-center">
              {colorOptions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    color === c.value
                      ? 'scale-110 border-stone-900 shadow-md'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateProjectModalOpen(false)}
              className="px-4 py-2 rounded-xl text-stone-600 font-medium text-xs hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-stone-900 text-stone-50 font-medium text-xs hover:bg-stone-800 shadow-md transition-all flex items-center gap-1.5"
            >
              <FolderPlus className="w-4 h-4" /> Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
