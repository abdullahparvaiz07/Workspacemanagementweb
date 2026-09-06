import { taskService } from '@/features/tasks/services/task.service';
import { TaskStatus, TaskPriority } from '@/features/tasks/types';

export const importService = {
  async importTasksFromCSV(file: File, projectId: string, currentUserId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          if (!text) throw new Error('Empty file');

          // Very simple CSV parser
          const lines = text.split('\n').filter(line => line.trim() !== '');
          if (lines.length < 2) throw new Error('No data rows');

          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          let importedCount = 0;

          const titleIdx = headers.findIndex(h => h.includes('title'));
          const descIdx = headers.findIndex(h => h.includes('description'));
          const statusIdx = headers.findIndex(h => h.includes('status'));
          const priorityIdx = headers.findIndex(h => h.includes('priority'));

          if (titleIdx === -1) throw new Error('CSV must contain a Title column');

          for (let i = 1; i < lines.length; i++) {
            // handle quotes roughly
            const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (!row) continue;

            const cleanStr = (s: string) => s ? s.replace(/^"|"$/g, '').replace(/""/g, '"') : '';

            const title = cleanStr(row[titleIdx]);
            if (!title) continue;

            const description = descIdx !== -1 ? cleanStr(row[descIdx]) : '';
            const statusStr = statusIdx !== -1 ? cleanStr(row[statusIdx]).toLowerCase() : 'todo';
            const priorityStr = priorityIdx !== -1 ? cleanStr(row[priorityIdx]).toLowerCase() : 'medium';

            const status = ['todo', 'in_progress', 'review', 'done'].includes(statusStr) ? statusStr as TaskStatus : 'todo';
            const priority = ['low', 'medium', 'high', 'urgent'].includes(priorityStr) ? priorityStr as TaskPriority : 'medium';

            await taskService.createTask({
              title,
              description,
              status,
              priority,
              project_id: projectId,
              created_by: currentUserId,
            });
            
            importedCount++;
          }
          resolve(importedCount);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
};
