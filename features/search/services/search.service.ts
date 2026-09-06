import { createClient } from '@/lib/supabase/client';

export type SearchResult = {
  id: string;
  type: 'task' | 'project' | 'member';
  title: string;
  subtitle?: string;
  url?: string;
};

export const searchService = {
  async globalSearch(workspaceId: string, query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const searchTerm = `%${query.trim()}%`;
    const results: SearchResult[] = [];

    try {
      const supabase = createClient();

      // 1. Search Projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, category, status')
        .eq('workspace_id', workspaceId)
        .ilike('name', searchTerm)
        .limit(5);

      if (!projectsError && projects) {
        projects.forEach((p: any) => {
          results.push({
            id: p.id,
            type: 'project',
            title: p.name,
            subtitle: `Project • ${p.category || p.status}`,
          });
        });
      }

      // 2. Search Tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          id, 
          title, 
          status,
          projects!inner(workspace_id)
        `)
        .eq('projects.workspace_id', workspaceId)
        .ilike('title', searchTerm)
        .limit(5);

      if (!tasksError && tasks) {
        tasks.forEach((t: any) => {
          results.push({
            id: t.id,
            type: 'task',
            title: t.title,
            subtitle: `Task • ${t.status.replace('_', ' ')}`,
          });
        });
      }

      // 3. Search Members (Profiles in workspace)
      const { data: members, error: membersError } = await supabase
        .from('workspace_members')
        .select(`
          user_id,
          role,
          profiles!inner(full_name, email)
        `)
        .eq('workspace_id', workspaceId)
        .ilike('profiles.full_name', searchTerm)
        .limit(5);

      if (!membersError && members) {
        members.forEach((m: any) => {
          if (m.profiles) {
            results.push({
              id: m.user_id,
              type: 'member',
              title: m.profiles.full_name || 'Unknown User',
              subtitle: `Member • ${m.profiles.email}`,
            });
          }
        });
      }

      return results;
    } catch (error) {
      console.error('Global search error:', error);
      return [];
    }
  },
};
