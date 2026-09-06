import { UserRole } from '@/types';
import { Profile } from '@/features/auth/types';

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface WorkspaceMemberWithProfile extends WorkspaceMember {
  profile: Profile;
}
