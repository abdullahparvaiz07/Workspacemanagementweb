import { TaskWithRelations } from '@/features/tasks/types';

export const exportService = {
  exportTasksToCSV(tasks: TaskWithRelations[], filename: string = 'tasks.csv') {
    if (!tasks || tasks.length === 0) {
      return;
    }

    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Created At'];
    
    const rows = tasks.map((task) => [
      task.id,
      `"${task.title.replace(/"/g, '""')}"`,
      `"${(task.description || '').replace(/"/g, '""')}"`,
      task.status,
      task.priority,
      task.due_date || '',
      task.created_at
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
