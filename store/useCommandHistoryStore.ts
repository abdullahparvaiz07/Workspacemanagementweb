import { create } from 'zustand';

export interface CommandHistoryState {
  canUndo: boolean;
  undoAction: (() => void) | null;
  setUndoAction: (action: () => void) => void;
  clearUndo: () => void;
  executeUndo: () => void;
}

export const useCommandHistoryStore = create<CommandHistoryState>((set, get) => ({
  canUndo: false,
  undoAction: null,
  setUndoAction: (action) => set({ undoAction: action, canUndo: true }),
  clearUndo: () => set({ undoAction: null, canUndo: false }),
  executeUndo: () => {
    const action = get().undoAction;
    if (action) {
      action();
      set({ undoAction: null, canUndo: false });
    }
  }
}));
