'use client';

import { useSimulatedEvents } from '@/hooks/useSimulatedEvents';
import { useTaskStore } from '@/store/useTaskStore';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function SimulatedEventsProvider() {
  useSimulatedEvents(true);
  
  const undo = useTaskStore(s => s.undo);
  const redo = useTaskStore(s => s.redo);
  const past = useTaskStore(s => s.past);
  const future = useTaskStore(s => s.future);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA'
      ) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (future.length > 0) {
            redo();
            toast.success('Redo successful');
          }
        } else {
          if (past.length > 0) {
            undo();
            toast.success('Undo successful');
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, past, future]);

  return null;
}
