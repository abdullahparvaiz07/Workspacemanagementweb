import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import activityReducer from './slices/activitySlice';
import notificationReducer from './slices/notificationSlice';
import commentReducer from './slices/commentSlice';
import uiReducer from './slices/uiSlice';
import { localStorageMiddleware, loadStateFromLocalStorage } from './localStorageMiddleware';

const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  project: projectReducer,
  task: taskReducer,
  activity: activityReducer,
  notification: notificationReducer,
  comment: commentReducer,
  ui: uiReducer,
});

const preloadedState = loadStateFromLocalStorage();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadedState as any,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
