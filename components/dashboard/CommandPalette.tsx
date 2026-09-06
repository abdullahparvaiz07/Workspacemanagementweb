'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { searchService, SearchResult } from '@/features/search/services/search.service';
import { Search, CheckSquare, FolderKanban, Users, Plus, Calendar, Settings, Sparkles, X, Building2, Loader2 } from 'lucide-react';

export default function CommandPalette() {
  const { isOpen, setOpen } = useCommandPalette();
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const setActiveTab = useWorkspaceStore((state) => state.setActiveTab);
  const setSelectedProjectFilter = useWorkspaceStore((state) => state.setSelectedProjectFilter);

  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);
  const setCreateProjectModalOpen = useUIStore((state) => state.setCreateProjectModalOpen);
  const setInviteMemberModalOpen = useUIStore((state) => state.setInviteMemberModalOpen);
  const setCreateWorkspaceModalOpen = useUIStore((state) => state.setCreateWorkspaceModalOpen);
  const setSelectedTaskIdForModal = useUIStore((state) => state.setSelectedTaskIdForModal);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || !activeWorkspaceId) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchService.globalSearch(activeWorkspaceId, query);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeWorkspaceId]);

  if (!isOpen) return null;

  const closeAndExecute = (action: () => void) => {
    setOpen(false);
    setQuery('');
    setResults([]);
    action();
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckSquare className="w-4 h-4 text-stone-400 flex-shrink-0" />;
      case 'project': return <FolderKanban className="w-4 h-4 text-stone-400 flex-shrink-0" />;
      case 'member': return <Users className="w-4 h-4 text-stone-400 flex-shrink-0" />;
      default: return <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />;
    }
  };

  const executeResult = (r: SearchResult) => {
    if (r.type === 'task') {
      setSelectedTaskIdForModal(r.id);
    } else if (r.type === 'project') {
      setSelectedProjectFilter(r.id);
      setActiveTab('Tasks');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-stone-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animation-fade-in">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-100 gap-3 relative">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks, projects, members... (Esc to close)"
            className="flex-1 text-sm bg-transparent outline-none text-stone-800 placeholder-stone-400 font-medium"
            autoFocus
          />
          {loading && <Loader2 className="w-4 h-4 text-stone-400 animate-spin absolute right-12" />}
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs font-sans">
          
          {query.trim().length > 0 ? (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 tracking-wider uppercase">
                Search Results ({results.length})
              </div>
              <div className="space-y-1 mt-1">
                {results.length === 0 && !loading && (
                  <div className="px-3 py-4 text-stone-500 text-center">No results found for "{query}"</div>
                )}
                {results.map((r) => (
                  <button
                    key={`${r.type}-${r.id}`}
                    onClick={() => closeAndExecute(() => executeResult(r))}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      {renderIcon(r.type)}
                      <span className="text-sm font-medium truncate max-w-md">{r.title}</span>
                    </div>
                    {r.subtitle && (
                      <span className="text-[11px] text-stone-400 capitalize px-2 py-0.5 rounded-full bg-stone-100">
                        {r.subtitle}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Quick Actions */}
              <div>
                <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 tracking-wider uppercase">
                  Quick Actions
                </div>
                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => closeAndExecute(() => setCreateTaskModalOpen(true))}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100/80 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Create New Task</span>
                  </button>

                  <button
                    onClick={() => closeAndExecute(() => setCreateProjectModalOpen(true))}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100/80 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Create New Project</span>
                  </button>

                  <button
                    onClick={() => closeAndExecute(() => setCreateWorkspaceModalOpen(true))}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100/80 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Create New Workspace</span>
                  </button>

                  <button
                    onClick={() => closeAndExecute(() => setInviteMemberModalOpen(true))}
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
                    { label: 'Analytics Dashboard', tab: 'Analytics', icon: Sparkles },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.tab}
                        onClick={() => closeAndExecute(() => setActiveTab(item.tab))}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors text-left"
                      >
                        <IconComponent className="w-4 h-4 text-stone-400" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
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
