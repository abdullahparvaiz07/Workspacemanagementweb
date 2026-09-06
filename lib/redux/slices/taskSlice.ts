import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate: string;
  assignee?: { id: string; name: string; avatar: string };
  tags: string[];
  subtasks: { id: string; title: string; completed: boolean }[];
  commentsCount: number;
}

interface TaskState {
  tasks: Task[];
}

const initialTasks: Task[] = [
  {
    id: 'task-1',
    workspaceId: 'ws-1',
    projectId: 'p-1',
    title: 'Design System Tokens Update',
    description: 'Refine color tokens, typography scales, and dark mode palette variables in Figma.',
    status: 'in-progress',
    priority: 'high',
    category: 'Design',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
    assignee: {
      id: 'u-2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    tags: ['UI/UX', 'Design System'],
    subtasks: [
      { id: 'st-1', title: 'Export color variables', completed: true },
      { id: 'st-2', title: 'Verify contrast ratio compliance', completed: false },
    ],
    commentsCount: 2,
  },
  {
    id: 'task-2',
    workspaceId: 'ws-1',
    projectId: 'p-1',
    title: 'User Authentication Flow',
    description: 'Implement client-side Redux auth state persistence and role switching.',
    status: 'todo',
    priority: 'urgent',
    category: 'Engineering',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString().split('T')[0],
    assignee: {
      id: 'u-1',
      name: 'Abdullah Parvaiz',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    tags: ['Frontend', 'Redux'],
    subtasks: [
      { id: 'st-3', title: 'Write Auth slice reducers', completed: true },
      { id: 'st-4', title: 'Connect LocalStorage middleware', completed: false },
    ],
    commentsCount: 1,
  },
  {
    id: 'task-3',
    workspaceId: 'ws-1',
    projectId: 'p-2',
    title: 'Mobile Navigation Drawer',
    description: 'Build smooth gesture-driven slide-out navigation for small viewports.',
    status: 'review',
    priority: 'medium',
    category: 'Mobile',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0],
    assignee: {
      id: 'u-3',
      name: 'Karan Mehta',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    tags: ['Mobile', 'React'],
    subtasks: [],
    commentsCount: 0,
  },
  {
    id: 'task-4',
    workspaceId: 'ws-1',
    projectId: 'p-1',
    title: 'Q3 Marketing Landing Page Copy',
    description: 'Draft conversion-focused hero headlines and feature benefits.',
    status: 'completed',
    priority: 'low',
    category: 'Marketing',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
    assignee: {
      id: 'u-2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    tags: ['Marketing', 'Copywriting'],
    subtasks: [{ id: 'st-5', title: 'Review with product lead', completed: true }],
    commentsCount: 3,
  },
];

const initialState: TaskState = {
  tasks: initialTasks,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Omit<Task, 'id'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
      state.tasks.unshift(newTask);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: Task['status'] }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    addSubtaskToTask: (state, action: PayloadAction<{ taskId: string; title: string }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.subtasks.push({
          id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          title: action.payload.title,
          completed: false,
        });
      }
    },
    toggleSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        const sub = task.subtasks.find((s) => s.id === action.payload.subtaskId);
        if (sub) {
          sub.completed = !sub.completed;
        }
      }
    },
    bulkDeleteTasks: (state, action: PayloadAction<string[]>) => {
      state.tasks = state.tasks.filter((t) => !action.payload.includes(t.id));
    },
    bulkUpdateTaskStatus: (state, action: PayloadAction<{ ids: string[]; status: Task['status'] }>) => {
      state.tasks.forEach((t) => {
        if (action.payload.ids.includes(t.id)) {
          t.status = action.payload.status;
        }
      });
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addSubtaskToTask,
  toggleSubtask,
  bulkDeleteTasks,
  bulkUpdateTaskStatus,
} = taskSlice.actions;

export default taskSlice.reducer;
