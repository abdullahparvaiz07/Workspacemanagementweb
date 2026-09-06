import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  category: string;
  description: string;
  color: string;
  status: 'active' | 'completed' | 'archived';
  starred?: boolean;
  membersCount: number;
}

export interface ProjectState {
  projects: Project[];
}

const initialProjects: Project[] = [
  {
    id: 'p-1',
    workspaceId: 'ws-1',
    name: 'Website Redesign',
    category: 'Design & Development',
    description: 'Complete overhaul of company landing page, component system, and responsive layouts.',
    color: '#0284C7', // Sky
    status: 'active',
    starred: true,
    membersCount: 4,
  },
  {
    id: 'p-2',
    workspaceId: 'ws-1',
    name: 'Mobile Application',
    category: 'Engineering',
    description: 'Cross-platform mobile client build using React Native and automated CI/CD pipelines.',
    color: '#059669', // Emerald
    status: 'active',
    starred: true,
    membersCount: 5,
  },
  {
    id: 'p-3',
    workspaceId: 'ws-1',
    name: 'Marketing Launch',
    category: 'Marketing',
    description: 'Q3 product release campaign, social media assets, and influencer marketing launch.',
    color: '#E11D48', // Rose
    status: 'active',
    starred: false,
    membersCount: 3,
  },
  {
    id: 'p-4',
    workspaceId: 'ws-1',
    name: 'Brand Guidelines',
    category: 'Design & Branding',
    description: 'Create a comprehensive brand guideline for consistent visual identity across channels.',
    color: '#D97706', // Amber
    status: 'active',
    starred: false,
    membersCount: 2,
  },
];

const initialState: ProjectState = {
  projects: initialProjects,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Omit<Project, 'id'>>) => {
      const newProj: Project = {
        ...action.payload,
        id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      };
      state.projects.unshift(newProj);
    },
    createProject: (state, action: PayloadAction<Omit<Project, 'id'>>) => {
      const newProj: Project = {
        ...action.payload,
        id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      };
      state.projects.unshift(newProj);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    toggleStarProject: (state, action: PayloadAction<string>) => {
      const proj = state.projects.find((p) => p.id === action.payload);
      if (proj) {
        proj.starred = !proj.starred;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setProjects, addProject, createProject, updateProject, toggleStarProject, deleteProject } =
  projectSlice.actions;

export default projectSlice.reducer;
