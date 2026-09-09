'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { ArrowLeft, Code, UserPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();

  const currentProject = useProjectStore((s) => s.currentProject);
  const projectMembers = useProjectStore((s) => s.projectMembers);
  const loading = useProjectStore((s) => s.loading);
  const setCurrentProject = useProjectStore((s) => s.setCurrentProject);
  const addProjectMember = useProjectStore((s) => s.addProjectMember);
  const removeProjectMember = useProjectStore((s) => s.removeProjectMember);
  const updateProjectMemberRole = useProjectStore((s) => s.updateProjectMemberRole);

  const workspaceMembers = useWorkspaceStore((s) => s.members);
  const tasks = useTaskStore((s) => s.tasks);
  const currentUser = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const [selectedMember, setSelectedMember] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member' | 'viewer'>('member');

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [authLoading, currentUser, router]);

  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  if (loading || !currentProject) {
    return <div className="p-8 text-center text-zinc-500">Loading project...</div>;
  }

  const projectTasks = tasks.filter((t) => t.projectId === currentProject.id);
  const completedTasks = projectTasks.filter((t) => t.status === 'completed' || t.status === 'done').length;
  const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

  const handleAddMember = async () => {
    if (!selectedMember) return;
    try {
      await addProjectMember(currentProject.id, selectedMember, selectedRole);
      toast.success('Member added to project');
      setSelectedMember('');
    } catch (err: any) {
      toast.error('Failed to add member');
    }
  };

  const availableWorkspaceMembers = workspaceMembers.filter(
    (wm) => !projectMembers.find((pm) => pm.user_id === wm.user_id)
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-4 sm:p-8 font-sans">
      <button 
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors font-semibold text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-start gap-6">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md flex-shrink-0"
            style={{ backgroundColor: currentProject.color || '#D97706' }}
          >
            <Code className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-3xl font-bold">{currentProject.name}</h1>
            <p className="text-zinc-500 mt-2">{currentProject.description}</p>
            
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm font-bold text-zinc-600 mb-2">
                <span>Project Progress</span>
                <span className="text-zinc-900">{progress}%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, backgroundColor: currentProject.color || '#D97706' }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2 font-medium">
                {completedTasks} of {projectTasks.length} tasks completed
              </p>
            </div>
          </div>
        </div>

        {/* Members Management */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <h2 className="font-serif text-2xl font-bold mb-6">Project Members</h2>
          
          {/* Add Member Form */}
          <div className="flex flex-col sm:flex-row items-end gap-4 mb-8 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Add Workspace Member
              </label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none font-medium text-stone-800"
              >
                <option value="">Select a member...</option>
                {availableWorkspaceMembers.map(m => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.profile?.full_name || m.profile?.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none font-medium text-stone-800"
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button
              onClick={handleAddMember}
              disabled={!selectedMember}
              className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {projectMembers.map(pm => {
              const memberName = pm.profile?.full_name || pm.profile?.email || 'Unknown User';
              const isCurrentUser = pm.user_id === currentUser?.id;
              
              return (
                <div key={pm.user_id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={pm.profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} alt={memberName} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-bold flex items-center gap-2 text-stone-900">
                        {memberName}
                        {isCurrentUser && <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-semibold">You</span>}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">{pm.profile?.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <select
                      value={pm.role}
                      onChange={(e) => updateProjectMemberRole(currentProject.id, pm.user_id, e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold focus:outline-none text-stone-800"
                      disabled={isCurrentUser}
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    
                    {!isCurrentUser && (
                      <button 
                        onClick={() => removeProjectMember(currentProject.id, pm.user_id)}
                        className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
