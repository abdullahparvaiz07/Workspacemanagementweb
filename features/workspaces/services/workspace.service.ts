import { createClient } from '@/lib/supabase/client';
import { Workspace, WorkspaceMemberWithProfile } from '../types';
import { UserRole } from '@/types';

class WorkspaceService {
  private get supabase() {
    return createClient();
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const { data, error } = await (this.supabase.from('workspaces') as any)
      .select('*, workspace_members!inner(user_id)')
      .eq('workspace_members.user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Workspace[];
  }

  async createWorkspace(name: string, description: string, category: string, userId: string): Promise<Workspace> {
    const { data: workspace, error: wsError } = await (this.supabase.from('workspaces') as any)
      .insert([{
        name,
        description,
        icon: null,
        color: null,
        owner_id: userId
      }])
      .select()
      .single();

    if (wsError) throw wsError;

    const { error: memberError } = await (this.supabase.from('workspace_members') as any)
      .insert([{
        workspace_id: workspace.id,
        user_id: userId,
        role: 'owner'
      }]);

    if (memberError) throw memberError;

    return workspace;
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberWithProfile[]> {
    // Note: PostgREST allows nested selects across foreign keys. 
    // workspace_members has user_id foreign key to profiles.
    const { data, error } = await (this.supabase.from('workspace_members') as any)
      .select(`
        id,
        workspace_id,
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
      .eq('workspace_id', workspaceId);

    if (error) throw error;
    
    // Map 'profiles' payload to 'profile' for the UI structure
    return data.map((d: any) => ({
      ...d,
      profile: d.profiles
    }));
  }

  async updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Promise<Workspace> {
    const { data, error } = await (this.supabase.from('workspaces') as any)
      .update(updates)
      .eq('id', workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteWorkspace(workspaceId: string): Promise<void> {
    const { error } = await (this.supabase.from('workspaces') as any)
      .delete()
      .eq('id', workspaceId);

    if (error) throw error;
  }

  async updateMemberRole(workspaceId: string, userId: string, role: UserRole): Promise<void> {
    const { error } = await (this.supabase.from('workspace_members') as any)
      .update({ role })
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async removeMember(workspaceId: string, userId: string): Promise<void> {
    const { error } = await (this.supabase.from('workspace_members') as any)
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) throw error;
  }
}

export const workspaceService = new WorkspaceService();
