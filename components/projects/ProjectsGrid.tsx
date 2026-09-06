'use client';

import React, { useEffect } from 'react';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useActivityStore } from '@/store/useActivityStore';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { Star, MoreHorizontal, Calendar, Code, Trash2, Plus, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProjectsGrid() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const setSelectedProjectFilter = useWorkspaceStore((s) => s.setSelectedProjectFilter);
  
  const projects = useProjectStore((s) => s.projects);
  const loadProjects = useProjectStore((s) => s.loadProjects);
  const deleteProject = useProjectStore((s) => s.deleteProject);
  
  const tasks = useTaskStore((s) => s.tasks);
  const currentUser = useAuthStore((s) => s.user);
  const setCreateProjectModalOpen = useUIStore((s) => s.setCreateProjectModalOpen);
  const logActivity = useActivityStore((state) => state.logActivity);

  const permissions = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (activeWorkspaceId) {
      loadProjects(activeWorkspaceId);
    }
  }, [activeWorkspaceId, loadProjects]);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectFilter(projectId);
    setActiveTab('tasks');
  };

  const handleViewProjectDetails = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    router.push(`/projects/${projectId}`);
  };

  const handleDelete = async (e: React.MouseEvent, pId: string, pName: string) => {
    e.stopPropagation();
    if (!permissions.canEditProject) {
      toast.error('Your role does not allow deleting projects.');
      return;
    }
    if (confirm(`Are you sure you want to delete project "${pName}"?`)) {
      try {
        await deleteProject(pId);
        if (currentUser && activeWorkspaceId) {
          logActivity(
            activeWorkspaceId,
            currentUser.id,
            currentUser.email || 'User',
            '', // avatar
            'deleted project',
            'project',
            pName
          );
        }
        toast.success('Project deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <div className="space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Projects ({projects.length})</h2>
          <p className="text-xs text-stone-500">Manage streams and monitor overall completion progress.</p>
        </div>
        {permissions.canCreateProject && (
          <button
            onClick={() => setCreateProjectModalOpen(true)}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const projectTasks = tasks.filter((t) => t.projectId === proj.id);
          const completedTasks = projectTasks.filter((t) => t.status === 'completed' || t.status === 'done').length;
          const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
          
          // Extract category from description if we injected it
          const categoryMatch = proj.description?.match(/Category: (.+)$/);
          const category = categoryMatch ? categoryMatch[1] : 'Project';
          const cleanDescription = proj.description ? proj.description.replace(/\n\nCategory: .+$/, '') : '';

          return (
            <div
              key={proj.id}
              onClick={() => handleSelectProject(proj.id)}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200/90 p-5 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer border-l-4"
              style={{ borderLeftColor: proj.color || '#D97706' }}
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-xs"
                      style={{ backgroundColor: proj.color || '#D97706' }}
                    >
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 
                        onClick={(e) => handleViewProjectDetails(e, proj.id)}
                        className="font-bold text-base text-zinc-950 hover:underline group-hover:text-amber-700 transition-colors leading-tight"
                      >
                        {proj.name}
                      </h3>
                      <span className="text-[11px] text-zinc-400 font-medium block mt-0.5">
                        {category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {permissions.canEditProject && (
                      <button
                        onClick={(e) => handleDelete(e, proj.id, proj.name)}
                        className="text-zinc-300 hover:text-rose-600 transition-colors p-1"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-zinc-600 text-xs leading-relaxed font-normal mb-5 line-clamp-2">
                  {cleanDescription || 'No description provided.'}
                </p>
              </div>

              {/* Progress & Footer */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-600 mb-1">
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden mr-3">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, backgroundColor: proj.color || '#D97706' }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-700">{progress}%</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px] font-medium text-zinc-400">
                  <div className="flex items-center gap-1.5 text-zinc-600">
                    <span className="font-semibold text-zinc-800">{projectTasks.length}</span> Tasks ({completedTasks} done)
                  </div>

                  <div 
                    onClick={(e) => handleViewProjectDetails(e, proj.id)}
                    className="flex items-center gap-1 text-amber-700 hover:underline font-semibold group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
