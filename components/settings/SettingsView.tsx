'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { Building2, Save, Trash2, Download, Upload, Check, RefreshCw, FileJson } from 'lucide-react';
import { storageService } from '@/services/storage.service';
import { DatabaseSchema } from '@/types';

export function SettingsView() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const updateWorkspace = useWorkspaceStore((s) => s.updateWorkspace);
  const currentUser = useAuthStore((s) => s.user);

  const permissions = usePermissions();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const [name, setName] = useState(activeWorkspace?.name || '');
  const [description, setDescription] = useState(activeWorkspace?.description || '');
  const [saved, setSaved] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canManageWorkspace) {
      toast.error('Only Workspace Owner can edit workspace settings.');
      return;
    }

    if (name.trim() && activeWorkspaceId) {
      try {
        await updateWorkspace(activeWorkspaceId, {
          name: name.trim(),
          description: description.trim(),
        });
        setSaved(true);
        toast.success('Workspace settings saved successfully!');
        setTimeout(() => setSaved(false), 2000);
      } catch (err: any) {
        toast.error('Failed to update workspace.');
      }
    }
  };

  const handleResetAllData = () => {
    if (!permissions.canManageWorkspace) {
      toast.error('Only Workspace Owner can reset application data.');
      return;
    }
    if (confirm('Are you sure you want to reset all LocalStorage data back to factory defaults?')) {
      storageService.resetToDefaults();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    try {
      const data = storageService.getDatabase();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workroom-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully.');
    } catch (err) {
      toast.error('Failed to export data.');
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsed = JSON.parse(result) as Partial<DatabaseSchema>;
        
        // Basic validation
        if (parsed && typeof parsed === 'object') {
          const db = storageService.getDatabase();
          const merged = { ...db, ...parsed } as DatabaseSchema;
          storageService.saveDatabase(merged);
          toast.success('Data imported successfully! Reloading...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error('Invalid backup file format.');
        }
      } catch (err) {
        toast.error('Failed to parse the backup file. Ensure it is a valid JSON.');
      }
    };
    reader.readAsText(file);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full select-none font-sans">
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-3xl text-stone-900 tracking-tight">Workspace Settings</h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">Manage branding, defaults, and data retention.</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-2xl shadow-xs">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900">{activeWorkspace?.name} Profile</h3>
            <p className="text-xs text-stone-500 font-mono">ID: {activeWorkspace?.id}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!permissions.canManageWorkspace}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 focus:outline-none disabled:bg-stone-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!permissions.canManageWorkspace}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 focus:outline-none disabled:bg-stone-50"
            />
          </div>

          {permissions.canManageWorkspace && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-sm"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Saved!' : 'Save Settings'}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Reset & Storage */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-xl text-rose-900">Danger Zone</h3>
        <p className="text-xs text-stone-600">
          Reset all browser LocalStorage data back to factory mock state. Useful for evaluating fresh state rehydration.
        </p>

        {permissions.canManageWorkspace && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" /> Export Data (JSON)
              </button>
              
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleImportData}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Upload className="w-4 h-4 text-stone-500" /> Import Data (JSON)
              </button>
            </div>
            
            <div className="pt-4 border-t border-rose-100">
              <button
                onClick={handleResetAllData}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Reset Factory LocalStorage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
