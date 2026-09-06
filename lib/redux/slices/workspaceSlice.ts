import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkspaceSettings {
  defaultView: 'Overview' | 'Projects' | 'Tasks' | 'Calendar';
  startWeekOn: 'Monday' | 'Sunday';
  timezone: string;
  dateFormat: string;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  iconColor: string;
  memberCount: number;
  projectCount: number;
  settings: WorkspaceSettings;
}

export interface WorkspaceState {
  activeWorkspaceId: string;
  activeTab: string;
  selectedProjectFilter: string | null;
  workspaces: WorkspaceItem[];
}

const initialWorkspaces: WorkspaceItem[] = [
  {
    id: 'ws-1',
    name: 'Acme Studio',
    description: 'Product & Design Studio',
    category: 'Product & Design',
    iconColor: 'bg-sky-500',
    memberCount: 12,
    projectCount: 8,
    settings: {
      defaultView: 'Overview',
      startWeekOn: 'Monday',
      timezone: '(GMT+5:00) Karachi',
      dateFormat: 'Jan 24, 2026',
    },
  },
  {
    id: 'ws-2',
    name: 'Starlight Inc',
    description: 'Marketing & Brand Agency',
    category: 'Marketing & Brand',
    iconColor: 'bg-purple-500',
    memberCount: 6,
    projectCount: 4,
    settings: {
      defaultView: 'Projects',
      startWeekOn: 'Monday',
      timezone: '(GMT+5:00) Karachi',
      dateFormat: 'Jan 24, 2026',
    },
  },
];

const initialState: WorkspaceState = {
  activeWorkspaceId: 'ws-1',
  activeTab: 'Overview',
  selectedProjectFilter: null,
  workspaces: initialWorkspaces,
};

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setSelectedProjectFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectFilter = action.payload;
    },
    switchWorkspace: (state, action: PayloadAction<string>) => {
      state.activeWorkspaceId = action.payload;
    },
    setActiveWorkspace: (state, action: PayloadAction<string>) => {
      state.activeWorkspaceId = action.payload;
    },
    createWorkspace: (state, action: PayloadAction<{ name: string; category: string }>) => {
      const newWs: WorkspaceItem = {
        id: `ws-${Date.now()}`,
        name: action.payload.name,
        category: action.payload.category || 'Product & Design',
        iconColor: 'bg-amber-500',
        memberCount: 1,
        projectCount: 0,
        settings: {
          defaultView: 'Overview',
          startWeekOn: 'Monday',
          timezone: '(GMT+5:00) Karachi',
          dateFormat: 'Jan 24, 2026',
        },
      };
      state.workspaces.push(newWs);
      state.activeWorkspaceId = newWs.id;
    },
    updateWorkspaceName: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const ws = state.workspaces.find((w) => w.id === action.payload.id);
      if (ws) ws.name = action.payload.name;
    },
    updateWorkspaceDescription: (state, action: PayloadAction<{ id: string; description: string }>) => {
      const ws = state.workspaces.find((w) => w.id === action.payload.id);
      if (ws) ws.description = action.payload.description;
    },
    updateWorkspaceSettings: (
      state,
      action: PayloadAction<{ id: string; name?: string; category?: string; settings?: Partial<WorkspaceSettings> }>
    ) => {
      const ws = state.workspaces.find((w) => w.id === action.payload.id);
      if (ws) {
        if (action.payload.name) ws.name = action.payload.name;
        if (action.payload.category) ws.category = action.payload.category;
        if (action.payload.settings) ws.settings = { ...ws.settings, ...action.payload.settings };
      }
    },
    deleteWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
      if (state.activeWorkspaceId === action.payload && state.workspaces.length > 0) {
        state.activeWorkspaceId = state.workspaces[0].id;
      }
    },
  },
});

export const {
  setActiveTab,
  setSelectedProjectFilter,
  switchWorkspace,
  setActiveWorkspace,
  createWorkspace,
  updateWorkspaceName,
  updateWorkspaceDescription,
  updateWorkspaceSettings,
  deleteWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
