import { Profile } from '@/features/auth/types';

export type ProjectStatus = 'active' | 'archived' | 'completed';
export type ProjectRole = 'admin' | 'member' | 'viewer';

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  status: ProjectStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  created_at: string;
}

export interface ProjectMemberWithProfile extends ProjectMember {
  profile: Profile;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  tasks: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }[];
}
