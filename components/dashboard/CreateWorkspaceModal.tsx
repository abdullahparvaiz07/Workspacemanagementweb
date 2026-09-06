'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useActivityStore } from '@/store/useActivityStore';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { X, Building2, Plus } from 'lucide-react';

export default function CreateWorkspaceModal() {
  const isOpen = useUIStore((state) => state.isCreateWorkspaceModalOpen);
  const setCreateWorkspaceModalOpen = useUIStore((state) => state.setCreateWorkspaceModalOpen);

  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const currentUser = useAuthStore((state) => state.user);
  const logActivity = useActivityStore((state) => state.logActivity);

  const permissions = usePermissions();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Workspace name is required.');
      return;
    }
    
    if (!currentUser) return;

    setLoading(true);
    try {
      const newWs = await createWorkspace(name.trim(), description.trim(), category, currentUser.id);

      logActivity(
        newWs.id,
        currentUser.id,
        currentUser.email || 'User',
        '', // avatar
        'created workspace',
        'workspace',
        name.trim()
      );

      toast.success(`Workspace "${name.trim()}" created successfully!`);
      setCreateWorkspaceModalOpen(false);
      setName('');
      setDescription('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create workspace.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animation-fade-in font-sans">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Create New Workspace</h3>
              <p className="text-xs text-stone-500">Organize projects, members, and tasks in a new space.</p>
            </div>
          </div>
          <button
            onClick={() => setCreateWorkspaceModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Workspace Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Global Studio"
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
              placeholder="Brief description of this workspace..."
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
              placeholder="e.g. Product & Design, Marketing, Engineering"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateWorkspaceModalOpen(false)}
              className="px-4 py-2 rounded-xl text-stone-600 font-medium text-xs hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-stone-900 text-stone-50 font-medium text-xs hover:bg-stone-800 shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <span>Creating...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Create Workspace
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
