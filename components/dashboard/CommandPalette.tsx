'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { Search, CheckSquare, FolderKanban, Users, Plus, Calendar, Settings, Sparkles, X, Building2 } from 'lucide-react';

export default function CommandPalette() {
  const { isOpen, setOpen } = useCommandPalette();
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const setActiveTab = useWorkspaceStore((state) => state.setActiveTab);
  const setSelectedProjectFilter = useWorkspaceStore((state) => state.setSelectedProjectFilter);

  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const members = useAuthStore((state) => state.members);

  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);
  const setCreateProjectModalOpen = useUIStore((state) => state.setCreateProjectModalOpen);
  const setInviteMemberModalOpen = useUIStore((state) => state.setInviteMemberModalOpen);
  const setCreateWorkspaceModalOpen = useUIStore((state) => state.setCreateWorkspaceModalOpen);
  const setSelectedTaskIdForModal = useUIStore((state) => state.setSelectedTaskIdForModal);

  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const workspaceTasks = tasks.filter((t) => t.workspaceId === activeWorkspaceId);
  const workspaceProjects = projects.filter((p) => p.workspaceId === activeWorkspaceId);

  const filteredTasks = query.trim()
    ? workspaceTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : workspaceTasks.slice(0, 3);

  const filteredProjects = query.trim()
    ? workspaceProjects.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : workspaceProjects.slice(0, 3);

  const closeAndExecute = (action: () => void) => {
    setOpen(false);
    setQuery('');
    action();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-stone-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animation-fade-in">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-100 gap-3">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks, projects, members... (Esc to close)"
            className="flex-1 text-sm bg-transparent outline-none text-stone-800 placeholder-stone-400 font-medium"
            autoFocus
          />
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs font-sans">
          {/* Quick Actions */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 tracking-wider uppercase">
              Quick Actions
            </div>
            <div className="space-y-1 mt-1">
              <button
                onClick={() =>
                  closeAndExecute(() => {
                    setCreateTaskModalOpen(true);
                  })
                }
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100/80 transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">Create New Task</span>
              </button>

              <button
                onClick={() =>
                  closeAndExecute(() => {
                    setCreateProjectModalOpen(true);
                  })
                }
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100/80 transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">Create New Project</span>
              </button>

              <button
                onClick={() =>
                  closeAndExecute(() => {
                    setCreateWorkspaceModalOpen(true);
                  })
                }
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100/80 transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">Create New Workspace</span>
              </button>

              <button
                onClick={() =>
                  closeAndExecute(() => {
                    setInviteMemberModalOpen(true);
                  })
                }
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100/80 transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">Invite Team Member</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 tracking-wider uppercase">
              Navigation
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {[
                { label: 'Overview Dashboard', tab: 'Overview', icon: Sparkles },
                { label: 'Projects Grid', tab: 'Projects', icon: FolderKanban },
                { label: 'Tasks Board', tab: 'Tasks', icon: CheckSquare },
                { label: 'Calendar View', tab: 'Calendar', icon: Calendar },
                { label: 'Team Members', tab: 'Members', icon: Users },
                { label: 'Workspace Settings', tab: 'Settings', icon: Settings },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() =>
                      closeAndExecute(() => {
                        setActiveTab(item.tab);
                      })
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors text-left"
                  >
                    <IconComponent className="w-4 h-4 text-stone-400" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 tracking-wider uppercase">
                Tasks ({filteredTasks.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      closeAndExecute(() => {
                        setSelectedTaskIdForModal(t.id);
                      })
                    }
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckSquare className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <span className="text-sm font-medium truncate max-w-md">{t.title}</span>
                    </div>
                    <span className="text-[11px] text-stone-400 capitalize px-2 py-0.5 rounded-full bg-stone-100">
                      {t.status.replace('-', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 tracking-wider uppercase">
                Projects ({filteredProjects.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      closeAndExecute(() => {
                        setSelectedProjectFilter(p.id);
                        setActiveTab('Tasks');
                      })
                    }
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderKanban className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{p.name}</span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">{p.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>
            Press <kbd className="px-1.5 py-0.5 bg-white border rounded text-stone-600 font-mono shadow-xs">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
