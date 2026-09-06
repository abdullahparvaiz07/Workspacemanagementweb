import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';

export interface Permissions {
  canManageWorkspace: boolean;
  canManageMembers: boolean;
  canInviteMembers: boolean;
  canCreateProject: boolean;
  canEditProject: boolean;
  canCreateTask: boolean;
  canEditTask: boolean;
  canDeleteTask: boolean;
  canComment: boolean;
}

export function usePermissions(): Permissions {
  const role: UserRole = useAuthStore((state) => state.currentUser?.role || 'member');

  switch (role) {
    case 'owner':
      return {
        canManageWorkspace: true,
        canManageMembers: true,
        canInviteMembers: true,
        canCreateProject: true,
        canEditProject: true,
        canCreateTask: true,
        canEditTask: true,
        canDeleteTask: true,
        canComment: true,
      };
    case 'admin':
      return {
        canManageWorkspace: false,
        canManageMembers: true,
        canInviteMembers: true,
        canCreateProject: true,
        canEditProject: true,
        canCreateTask: true,
        canEditTask: true,
        canDeleteTask: true,
        canComment: true,
      };
    case 'member':
      return {
        canManageWorkspace: false,
        canManageMembers: false,
        canInviteMembers: false,
        canCreateProject: false,
        canEditProject: false,
        canCreateTask: true,
        canEditTask: true,
        canDeleteTask: true,
        canComment: true,
      };
    case 'viewer':
    default:
      return {
        canManageWorkspace: false,
        canManageMembers: false,
        canInviteMembers: false,
        canCreateProject: false,
        canEditProject: false,
        canCreateTask: false,
        canEditTask: false,
        canDeleteTask: false,
        canComment: false,
      };
  }
}
