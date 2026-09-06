'use client';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function KeyboardShortcutsMount() {
  useKeyboardShortcuts();
  return null;
}
