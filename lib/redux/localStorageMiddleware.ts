import { Middleware } from '@reduxjs/toolkit';

const STORAGE_KEY = 'workroom_app_state_v1';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  if (typeof window !== 'undefined') {
    try {
      const state = store.getState() as any;
      const stateToSave = {
        auth: state.auth,
        workspace: state.workspace,
        project: state.project,
        task: state.task,
        activity: state.activity,
        notification: state.notification,
        comment: state.comment,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }
  
  return result;
};

export const loadStateFromLocalStorage = () => {
  if (typeof window === 'undefined') return undefined;
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Could not load state from localStorage', e);
    return undefined;
  }
};
