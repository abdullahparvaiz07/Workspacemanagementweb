'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CloudOff } from 'lucide-react';
import { toast } from 'sonner';
import { useOfflineStore } from '@/features/offline/store/useOfflineStore';

export default function OfflineIndicator() {
  const [isSyncing, setIsSyncing] = useState(false);
  const isOnline = useOfflineStore((s) => s.isOnline);
  const setOnlineStatus = useOfflineStore((s) => s.setOnlineStatus);
  const mutations = useOfflineStore((s) => s.mutations);
  const sync = useOfflineStore((s) => s.sync);

  useEffect(() => {
    // Initial state
    setOnlineStatus(navigator.onLine);

    const handleOnline = () => {
      setOnlineStatus(true);
      toast.success('Connection restored. You are back online.');
      handleManualSync(); // auto sync when coming back online
    };

    const handleOffline = () => {
      setOnlineStatus(false);
      toast.error('You are offline. Changes will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    if (!useOfflineStore.getState().isOnline) {
      toast.error('Cannot sync while offline.');
      return;
    }
    
    if (useOfflineStore.getState().mutations.length === 0) {
      return; // nothing to sync
    }

    setIsSyncing(true);
    try {
      await sync();
      toast.success('Sync complete. All local changes are synced.');
    } catch (error) {
      toast.error('Failed to sync some changes.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (isOnline) {
    if (mutations.length === 0) return null;
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="bg-white/90 backdrop-blur border border-stone-200 text-stone-600 shadow-md rounded-full px-4 py-2 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 cursor-pointer font-medium text-xs"
          title="Manual Sync"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:right-auto z-50 flex items-center gap-4 bg-rose-500 text-white px-5 py-3.5 rounded-2xl shadow-xl animation-fade-in">
      <div className="p-2 bg-white/20 rounded-xl">
        <CloudOff className="w-5 h-5" />
      </div>
      <div className="flex-1 pr-4">
        <p className="text-sm font-bold">You are offline</p>
        <p className="text-xs text-rose-100 font-medium">
          Working locally. {mutations.length > 0 ? `${mutations.length} pending changes.` : 'Changes will sync later.'}
        </p>
      </div>
      <button
        onClick={handleManualSync}
        className="px-4 py-2 bg-rose-700/60 hover:bg-rose-700 rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
      >
        Sync
      </button>
    </div>
  );
}
