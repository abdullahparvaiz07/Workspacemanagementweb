export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  team: string;
  createdAt: string;
}

export interface WorkspaceSettings {
  defaultView: 'Overview' | 'Projects' | 'Tasks' | 'Calendar';
  startWeekOn: 'Monday' | 'Sunday';
  timezone: string;
  dateFormat: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  category: string;
  ownerId: string;
  settings: WorkspaceSettings;
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  category: string;
  color: string;
  status: 'active' | 'completed' | 'archived';
  starred: boolean;
  members: string[];
  createdAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  dueDate: string;
  assigneeId?: string;
  labels?: string[];
  tags: string[];
  subtasks: Subtask[];
  commentsCount: number;
  comments?: Comment[];
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  entityType: 'task' | 'project' | 'member' | 'workspace' | 'comment';
  entityName: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'assignment' | 'mention' | 'comment' | 'deadline' | 'invite' | 'system';
  link?: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  message: string;
  status: 'open' | 'in-review' | 'resolved';
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  workspaces: Workspace[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  activities: Activity[];
  notifications: Notification[];
  supportTickets: SupportTicket[];
}
