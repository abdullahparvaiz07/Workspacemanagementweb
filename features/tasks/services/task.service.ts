import { createClient } from '@/lib/supabase/client';
import { Task, Subtask, CommentWithProfile, Attachment, TaskWithRelations, TaskStatus } from '../types';

class TaskService {
  private get supabase() {
    return createClient();
  }

  async getProjectTasks(projectId: string): Promise<TaskWithRelations[]> {
    const { data: tasks, error: taskError } = await (this.supabase.from('tasks') as any)
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (taskError) throw taskError;

    if (!tasks || tasks.length === 0) return [];

    const taskIds = tasks.map((t: Task) => t.id);

    // Fetch relations
    const { data: subtasks } = await (this.supabase.from('subtasks') as any)
      .select('*')
      .in('task_id', taskIds);

    const { data: comments } = await (this.supabase.from('comments') as any)
      .select(`*, profiles(id, full_name, avatar_url, email)`)
      .in('task_id', taskIds)
      .order('created_at', { ascending: true });

    const { data: attachments } = await (this.supabase.from('attachments') as any)
      .select('*')
      .in('task_id', taskIds);

    return tasks.map((task: Task) => {
      const taskComments = comments?.filter((c: any) => c.task_id === task.id).map((c: any) => ({
        ...c,
        profile: c.profiles
      })) || [];

      return {
        ...task,
        subtasks: subtasks?.filter((st: any) => st.task_id === task.id) || [],
        comments: taskComments,
        attachments: attachments?.filter((a: any) => a.task_id === task.id) || [],
        commentsCount: taskComments.length
      };
    });
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    const { data, error } = await (this.supabase.from('tasks') as any)
      .insert([taskData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await (this.supabase.from('tasks') as any)
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await (this.supabase.from('tasks') as any)
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  }

  async duplicateTask(taskId: string, newTitle: string, createdBy: string): Promise<Task> {
    const { data: original, error: getError } = await (this.supabase.from('tasks') as any)
      .select('*')
      .eq('id', taskId)
      .single();

    if (getError) throw getError;

    const { id, created_at, updated_at, ...taskData } = original;
    
    return this.createTask({
      ...taskData,
      title: newTitle,
      created_by: createdBy,
    });
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(taskId, { status });
  }

  // --- Subtasks ---

  async createSubtask(taskId: string, title: string): Promise<Subtask> {
    const { data, error } = await (this.supabase.from('subtasks') as any)
      .insert([{ task_id: taskId, title }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async toggleSubtask(subtaskId: string, completed: boolean): Promise<void> {
    const { error } = await (this.supabase.from('subtasks') as any)
      .update({ completed })
      .eq('id', subtaskId);
    if (error) throw error;
  }

  async deleteSubtask(subtaskId: string): Promise<void> {
    const { error } = await (this.supabase.from('subtasks') as any)
      .delete()
      .eq('id', subtaskId);
    if (error) throw error;
  }

  // --- Comments ---

  async addComment(taskId: string, userId: string, content: string): Promise<CommentWithProfile> {
    const { data, error } = await (this.supabase.from('comments') as any)
      .insert([{ task_id: taskId, user_id: userId, content }])
      .select(`*, profiles(id, full_name, avatar_url, email)`)
      .single();
    if (error) throw error;
    return {
      ...data,
      profile: data.profiles
    };
  }

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await (this.supabase.from('comments') as any)
      .delete()
      .eq('id', commentId);
    if (error) throw error;
  }

  // --- Attachments ---

  async uploadAttachment(taskId: string, userId: string, file: File): Promise<Attachment> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${taskId}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `tasks/${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from('task-attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = this.supabase.storage
      .from('task-attachments')
      .getPublicUrl(filePath);

    const { data, error } = await (this.supabase.from('attachments') as any)
      .insert([{
        task_id: taskId,
        uploaded_by: userId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: file.type
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteAttachment(attachmentId: string, fileUrl: string): Promise<void> {
    // Delete from storage
    try {
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `tasks/${fileName}`;
      await this.supabase.storage.from('task-attachments').remove([filePath]);
    } catch (e) {
      console.error('Failed to delete file from storage:', e);
    }

    // Delete record
    const { error } = await (this.supabase.from('attachments') as any)
      .delete()
      .eq('id', attachmentId);
    
    if (error) throw error;
  }
}

export const taskService = new TaskService();
