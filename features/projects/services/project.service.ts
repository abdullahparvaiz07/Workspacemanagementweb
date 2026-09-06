import { createClient } from '@/lib/supabase/client';
import { Project, ProjectMemberWithProfile, ProjectRole } from '../types';

class ProjectService {
  private get supabase() {
    return createClient();
  }

  async getWorkspaceProjects(workspaceId: string): Promise<Project[]> {
    const { data, error } = await (this.supabase.from('projects') as any)
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Project[];
  }

  async getProject(projectId: string): Promise<Project> {
    const { data, error } = await (this.supabase.from('projects') as any)
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (error) throw error;
    return data as Project;
  }

  async createProject(
    workspaceId: string,
    name: string,
    description: string,
    color: string,
    userId: string
  ): Promise<Project> {
    const { data: project, error: projectError } = await (this.supabase.from('projects') as any)
      .insert([{
        workspace_id: workspaceId,
        name,
        description,
        color,
        created_by: userId
      }])
      .select()
      .single();

    if (projectError) throw projectError;

    const { error: memberError } = await (this.supabase.from('project_members') as any)
      .insert([{
        project_id: project.id,
        user_id: userId,
        role: 'admin'
      }]);

    if (memberError) throw memberError;

    return project;
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await (this.supabase.from('projects') as any)
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await (this.supabase.from('projects') as any)
      .delete()
      .eq('id', projectId);
      
    if (error) throw error;
  }

  async getProjectMembers(projectId: string): Promise<ProjectMemberWithProfile[]> {
    const { data, error } = await (this.supabase.from('project_members') as any)
      .select(`
        id,
        project_id,
        user_id,
        role,
        created_at,
        profiles (
          id,
          full_name,
          avatar_url,
          email
        )
      `)
      .eq('project_id', projectId);
      
    if (error) throw error;
    
    return data.map((d: any) => ({
      ...d,
      profile: d.profiles
    }));
  }

  async addProjectMember(projectId: string, userId: string, role: ProjectRole = 'member'): Promise<void> {
    const { error } = await (this.supabase.from('project_members') as any)
      .insert([{
        project_id: projectId,
        user_id: userId,
        role
      }]);
      
    if (error) throw error;
  }

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    const { error } = await (this.supabase.from('project_members') as any)
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);
      
    if (error) throw error;
  }

  async updateProjectMemberRole(projectId: string, userId: string, role: ProjectRole): Promise<void> {
    const { error } = await (this.supabase.from('project_members') as any)
      .update({ role })
      .eq('project_id', projectId)
      .eq('user_id', userId);
      
    if (error) throw error;
  }
}

export const projectService = new ProjectService();
