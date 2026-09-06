import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useCommandHistoryStore } from '@/store/useCommandHistoryStore';

export function useKeyboardShortcuts() {
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const setCreateTaskModalOpen = useUIStore((s) => s.setCreateTaskModalOpen);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or contenteditable
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement as HTMLElement).isContentEditable
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          setCreateTaskModalOpen(true);
          break;
        case 'p':
          e.preventDefault();
          setActiveTab('Projects');
          break;
        case 't':
          e.preventDefault();
          setActiveTab('Tasks');
          break;
        case '/':
          e.preventDefault();
          setCommandPaletteOpen(true);
          break;
        case 'escape':
          // Close modals logic is mostly handled inside the modals themselves,
          // but we can close the command palette here if we want to.
          // CommandPalette already has an Esc listener, but this is a fallback.
          useUIStore.getState().setCommandPaletteOpen(false);
          // Modals controlled by UIStore
          useUIStore.getState().setCreateTaskModalOpen(false);
          useUIStore.getState().setCreateProjectModalOpen(false);
          useUIStore.getState().setInviteMemberModalOpen(false);
          useUIStore.getState().setCreateWorkspaceModalOpen(false);
          useUIStore.getState().setSelectedTaskIdForModal(null);
          break;
        case 'k':
          // Ctrl+K or Cmd+K
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setCommandPaletteOpen(true);
          }
          break;
        case 'z':
          // Ctrl+Z or Cmd+Z
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            useCommandHistoryStore.getState().executeUndo();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen, setCreateTaskModalOpen, setActiveTab]);
}
