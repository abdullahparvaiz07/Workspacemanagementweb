import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FilterState {
  projectFilter: string | null;
  priorityFilter: string;
  assigneeFilter: string | null;
  dateFilter: string | null; // 'today', 'this_week', 'overdue'
  searchFilter: string;
  
  setProjectFilter: (id: string | null) => void;
  setPriorityFilter: (priority: string) => void;
  setAssigneeFilter: (id: string | null) => void;
  setDateFilter: (date: string | null) => void;
  setSearchFilter: (query: string) => void;
  clearFilters: () => void;

  savedPresets: FilterPreset[];
  savePreset: (preset: Omit<FilterPreset, 'id'>) => void;
  deletePreset: (id: string) => void;
  applyPreset: (preset: FilterPreset) => void;
}

export interface FilterPreset {
  id: string;
  name: string;
  projectFilter: string | null;
  priorityFilter: string;
  assigneeFilter: string | null;
  dateFilter: string | null;
  searchFilter: string;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      projectFilter: null,
      priorityFilter: 'all',
      assigneeFilter: null,
      dateFilter: null,
      searchFilter: '',

      setProjectFilter: (id) => set({ projectFilter: id }),
      setPriorityFilter: (priority) => set({ priorityFilter: priority }),
      setAssigneeFilter: (id) => set({ assigneeFilter: id }),
      setDateFilter: (date) => set({ dateFilter: date }),
      setSearchFilter: (query) => set({ searchFilter: query }),
      clearFilters: () => set({
        projectFilter: null,
        priorityFilter: 'all',
        assigneeFilter: null,
        dateFilter: null,
        searchFilter: ''
      }),

      savedPresets: [],
      savePreset: (preset) => set((state) => ({
        savedPresets: [...state.savedPresets, { ...preset, id: crypto.randomUUID() }]
      })),
      deletePreset: (id) => set((state) => ({
        savedPresets: state.savedPresets.filter(p => p.id !== id)
      })),
      applyPreset: (preset) => set({
        projectFilter: preset.projectFilter,
        priorityFilter: preset.priorityFilter,
        assigneeFilter: preset.assigneeFilter,
        dateFilter: preset.dateFilter,
        searchFilter: preset.searchFilter
      })
    }),
    {
      name: 'workroom-filters'
    }
  )
);
