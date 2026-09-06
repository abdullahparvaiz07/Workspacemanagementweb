import { useMemo } from 'react';
import { useTaskStore } from '@/store/useTaskStore';

export function useProjectProgress(projectId: string) {
  const tasks = useTaskStore((state) => state.tasks);

  return useMemo(() => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const total = projectTasks.length;
    const completed = projectTasks.filter((t) => t.status === 'completed').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      percentage,
      tasks: projectTasks,
    };
  }, [tasks, projectId]);
}
