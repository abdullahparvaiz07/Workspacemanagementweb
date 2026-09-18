'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { X, FolderPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateProjectModal() {
  const isOpen = useUIStore((state) => state.isCreateProjectModalOpen);
  const setCreateProjectModalOpen = useUIStore((state) => state.setCreateProjectModalOpen);

  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const currentUser = useAuthStore((state) => state.user);
  const createProject = useProjectStore((state) => state.createProject);
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const logActivity = useActivityStore((state) => state.logActivity);
  const createTask = useTaskStore((state) => state.createTask);
  const router = useRouter();

  const permissions = usePermissions();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Product & Engineering');
  const [color, setColor] = useState('#D97706');
  const [template, setTemplate] = useState('blank');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const colorOptions = [
    { label: 'Amber', value: '#D97706' },
    { label: 'Emerald', value: '#059669' },
    { label: 'Indigo', value: '#4F46E5' },
    { label: 'Rose', value: '#E11D48' },
    { label: 'Sky', value: '#0284C7' },
    { label: 'Stone', value: '#57534E' },
  ];

  const templateConfigs: Record<string, { name: string; category: string; description: string; tasks: { title: string; description: string; priority: 'low' | 'medium' | 'high' | 'urgent' }[] }> = {
    website: {
      name: 'Website Launch & Marketing',
      category: 'Web Development',
      description: 'End-to-end planning, copywriting, design, and deployment of modern web experience.',
      tasks: [
        { title: 'Design Homepage & Responsive Mockups', description: 'Create high-fidelity designs for desktop and mobile viewports', priority: 'high' },
        { title: 'Setup Next.js & Styling Infrastructure', description: 'Initialize repository with Next.js 16 and Tailwind CSS', priority: 'high' },
        { title: 'Write Landing Page Marketing Copy', description: 'Draft compelling headline copy, feature bullet points, and CTA labels', priority: 'medium' },
        { title: 'QA & Cross-Browser Testing', description: 'Verify responsiveness, accessibility, and form validation across browsers', priority: 'medium' },
      ],
    },
    sprint: {
      name: 'Engineering Sprint Q4',
      category: 'Software Engineering',
      description: 'Feature development, database schema migration, and staging verification.',
      tasks: [
        { title: 'Define API Contracts & Database Schema', description: 'Finalize TypeScript interfaces and PostgreSQL migration scripts', priority: 'urgent' },
        { title: 'Implement Core Feature Endpoints', description: 'Build backend handlers with authentication and error handling', priority: 'high' },
        { title: 'Connect Frontend State & Realtime Listeners', description: 'Wire up Zustand stores with WebSocket sync and optimistic updates', priority: 'high' },
        { title: 'Unit Tests & Code Review', description: 'Run test suite and perform peer review before merging to main branch', priority: 'medium' },
      ],
    },
    marketing: {
      name: 'Q4 Product Launch Campaign',
      category: 'Marketing',
      description: 'Multi-channel marketing initiative including email sequences and social announcements.',
      tasks: [
        { title: 'Campaign Strategy & Audience Segmentation', description: 'Identify target persona cohorts and key value propositions', priority: 'high' },
        { title: 'Design Social Media & Ad Creative Assets', description: 'Create visual banners, promo motion graphics, and video teasers', priority: 'medium' },
        { title: 'Draft Product Announcement Blog Post', description: 'Write in-depth walkthrough of new features and customer benefits', priority: 'medium' },
      ],
    },
    design: {
      name: 'Design System & UI Kit',
      category: 'Product & Design',
      description: 'Unified color palettes, typography scales, component library, and Figma tokens.',
      tasks: [
        { title: 'Audit Existing Component Inconsistencies', description: 'Catalog all buttons, inputs, modals, and colors across the app', priority: 'high' },
        { title: 'Establish Color & Typography Tokens', description: 'Define primary, neutral, warning, and dark mode palette variables', priority: 'high' },
        { title: 'Build Reusable Component Specs', description: 'Document state variants (hover, active, disabled, focus) in Figma', priority: 'medium' },
      ],
    },
  };

  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate);
    if (newTemplate !== 'blank' && templateConfigs[newTemplate]) {
      const cfg = templateConfigs[newTemplate];
      if (!name || Object.values(templateConfigs).some(t => t.name === name)) {
        setName(cfg.name);
      }
      setCategory(cfg.category);
      if (!description || Object.values(templateConfigs).some(t => t.description === description)) {
        setDescription(cfg.description);
      }
    }
  };

  const applyTemplateTasks = async (projectId: string, templateType: string) => {
    const cfg = templateConfigs[templateType];
    if (!cfg || !cfg.tasks) return;

    for (const t of cfg.tasks) {
      try {
        await createTask({
          project_id: projectId,
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: 'todo',
          assignee_id: currentUser?.id || null,
          created_by: currentUser?.id,
        });
      } catch (e) {
        console.warn('Failed to insert template task:', e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Project name is required.');
      return;
    }

    if (!permissions.canCreateProject) {
      toast.error('Your role does not allow creating projects.');
      return;
    }

    if (!activeWorkspaceId || !currentUser) return;

    setLoading(true);
    try {
      const fullDesc = description ? `${description}\n\nCategory: ${category}` : `Category: ${category}`;
      const newProject = await createProject(activeWorkspaceId, name.trim(), fullDesc, color, currentUser.id);

      // Generate template tasks if a template was selected
      if (template !== 'blank') {
        await applyTemplateTasks(newProject.id, template);
      }

      // Refresh projects in workspace store
      await loadProjects(activeWorkspaceId);

      logActivity(
        activeWorkspaceId,
        currentUser.id,
        currentUser.email || 'User',
        '', // avatar
        'created project',
        'project',
        name.trim()
      );

      toast.success(`Project "${name.trim()}" created successfully!`);
      setCreateProjectModalOpen(false);

      setName('');
      setDescription('');
      setTemplate('blank');
      
      // Navigate to new project page
      router.push(`/projects/${newProject.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animation-fade-in font-sans">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 flex-shrink-0">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm overflow-y-auto flex-1">
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
              Template
            </label>
            <select
              value={template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 bg-white cursor-pointer"
            >
              <option value="blank">Blank Project</option>
              <option value="website">🚀 Website Launch (4 tasks)</option>
              <option value="sprint">⚡ Engineering Sprint (4 tasks)</option>
              <option value="marketing">📣 Marketing Campaign (3 tasks)</option>
              <option value="design">🎨 Design System & UI (3 tasks)</option>
            </select>
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
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-stone-900 text-stone-50 font-medium text-xs hover:bg-stone-800 shadow-md transition-all flex items-center gap-1.5 disabled:opacity-70"
            >
              {loading ? <span>Creating...</span> : <><FolderPlus className="w-4 h-4" /> Create Project</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
