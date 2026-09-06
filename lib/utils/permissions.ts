export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Permissions {
  canManageWorkspace: boolean; // rename workspace, delete workspace
  canManageMembers: boolean; // change member roles, remove members
  canInviteMembers: boolean; // invite new members
  canCreateProject: boolean; // create project
  canEditProject: boolean; // edit project details, delete project
  canCreateTask: boolean; // create tasks
  canEditTask: boolean; // edit tasks, move task status
  canDeleteTask: boolean; // delete task
  canComment: boolean; // add comments
}

export function getRolePermissions(role: UserRole): Permissions {
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
