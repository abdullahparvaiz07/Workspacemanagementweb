import { useMemo } from 'react';
import { Task } from '@/types';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useAuthStore } from '@/store/useAuthStore';

interface FilterOptions {
  searchQuery?: string;
  projectFilter?: string | null;
  priorityFilter?: string;
  statusFilter?: string;
  assigneeFilter?: string;
  tabFilter?: 'All' | 'My Tasks' | 'Assigned' | 'Due Soon' | 'Completed';
}

export function useTaskFilter(options: FilterOptions = {}) {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const selectedProjectFilter = useWorkspaceStore((state) => state.selectedProjectFilter);
  const tasks = useTaskStore((state) => state.tasks);
  const currentUser = useAuthStore((state) => state.currentUser);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.workspaceId !== activeWorkspaceId) return false;

      const projectTarget = options.projectFilter !== undefined ? options.projectFilter : selectedProjectFilter;
      if (projectTarget && t.projectId !== projectTarget) return false;

      if (options.priorityFilter && options.priorityFilter !== 'all' && options.priorityFilter !== 'All') {
        if (t.priority.toLowerCase() !== options.priorityFilter.toLowerCase()) return false;
      }

      if (options.statusFilter && options.statusFilter !== 'all' && options.statusFilter !== 'All') {
        if (t.status.toLowerCase() !== options.statusFilter.toLowerCase()) return false;
      }

      if (options.assigneeFilter && options.assigneeFilter !== 'all' && options.assigneeFilter !== 'All') {
        if (t.assigneeId !== options.assigneeFilter) return false;
      }

      if (options.tabFilter === 'My Tasks' && t.assigneeId !== currentUser?.id) return false;
      if (options.tabFilter === 'Completed' && t.status !== 'completed') return false;

      if (options.searchQuery && options.searchQuery.trim()) {
        const query = options.searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(query);
        const matchDesc = t.description.toLowerCase().includes(query);
        const matchCategory = t.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCategory) return false;
      }

      return true;
    });
  }, [tasks, activeWorkspaceId, selectedProjectFilter, currentUser?.id, options]);

  return filteredTasks;
}
