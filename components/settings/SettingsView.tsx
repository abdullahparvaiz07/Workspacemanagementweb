'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { User, Camera, Building2, Save, Download, Upload, Check, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { storageService } from '@/services/storage.service';
import { DatabaseSchema } from '@/types';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
];

export function SettingsView() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const updateWorkspace = useWorkspaceStore((s) => s.updateWorkspace);
  
  const currentUser = useAuthStore((s) => s.user);
  const currentProfile = useAuthStore((s) => s.profile);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const permissions = usePermissions();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  // User Profile State
  const [fullName, setFullName] = useState(currentProfile?.full_name || currentUser?.email?.split('@')[0] || '');
  const [avatarUrl, setAvatarUrl] = useState(currentProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300');
  const [profileSaved, setProfileSaved] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Workspace State
  const [name, setName] = useState(activeWorkspace?.name || '');
  const [description, setDescription] = useState(activeWorkspace?.description || '');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentProfile?.full_name) {
      setFullName(currentProfile.full_name);
    }
    if (currentProfile?.avatar_url) {
      setAvatarUrl(currentProfile.avatar_url);
    }
  }, [currentProfile]);

  useEffect(() => {
    if (activeWorkspace) {
      setName(activeWorkspace.name || '');
      setDescription(activeWorkspace.description || '');
    }
  }, [activeWorkspace]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Full name cannot be empty.');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
      });
      setProfileSaved(true);
      toast.success('User profile updated successfully!');
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err: any) {
      toast.error('Failed to update user profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarUrl(dataUrl);
      toast.info('New profile photo selected. Click "Save Profile" to apply changes.');
    };
    reader.readAsDataURL(file);
    if (avatarFileInputRef.current) avatarFileInputRef.current.value = '';
  };

  const handleSaveWorkspace = async (e: React.FormEvent) => {
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full select-none font-sans">
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-3xl text-stone-900 dark:text-white tracking-tight">Account & Workspace Settings</h1>
        <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">Manage your personal profile, workspace branding, and data settings.</p>
      </div>

      {/* SECTION 1: USER PROFILE SETTINGS */}
      <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-stone-200/90 dark:border-zinc-700/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-stone-100 dark:border-zinc-700/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold shadow-2xs">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900 dark:text-white">Personal Profile</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Update your profile picture and full name shown across Workroom.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Profile Picture
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar Preview with Camera Upload Button */}
              <div className="relative group">
                <img
                  src={avatarUrl}
                  alt={fullName || 'User'}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-500/20 shadow-md transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
                  title="Upload photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Upload Input & Actions */}
              <div className="space-y-3 flex-1">
                <input
                  type="file"
                  ref={avatarFileInputRef}
                  onChange={handleAvatarFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Custom Photo
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  PNG, JPG or WebP up to 5MB. Or choose one of the preset avatars below:
                </p>

                {/* Preset Avatars Gallery */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {PRESET_AVATARS.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatarUrl === url
                          ? 'border-amber-600 ring-2 ring-amber-500/30 scale-110'
                          : 'border-stone-200 dark:border-zinc-700 hover:border-stone-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full Name & Email Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700/60 bg-stone-50 dark:bg-zinc-900/60 text-xs font-medium text-stone-500 dark:text-stone-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Save Profile Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {profileSaved ? <Check className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4" />}
              <span>{profileSaved ? 'Profile Saved!' : isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: WORKSPACE SETTINGS */}
      <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-stone-200/90 dark:border-zinc-700/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-stone-100 dark:border-zinc-700/60">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-2xl shadow-2xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-white">{activeWorkspace?.name || 'Workspace'} Details</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">Workspace ID: {activeWorkspace?.id}</p>
          </div>
        </div>

        <form onSubmit={handleSaveWorkspace} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!permissions.canManageWorkspace}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:bg-stone-50 dark:disabled:bg-zinc-900/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!permissions.canManageWorkspace}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:bg-stone-50 dark:disabled:bg-zinc-900/50"
            />
          </div>

          {permissions.canManageWorkspace && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Saved!' : 'Save Workspace Settings'}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* SECTION 3: DANGER ZONE & LOCAL STORAGE */}
      <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-rose-200 dark:border-rose-900/50 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-xl text-rose-900 dark:text-rose-400">Danger Zone & Data Retention</h3>
        <p className="text-xs text-stone-600 dark:text-stone-400">
          Export application data to JSON backup or reset browser LocalStorage data back to factory mock state.
        </p>

        {permissions.canManageWorkspace && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleExportData}
                className="px-4 py-2.5 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
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
                className="px-4 py-2.5 bg-white dark:bg-zinc-900 hover:bg-stone-50 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-stone-500" /> Import Data (JSON)
              </button>
            </div>
            
            <div className="pt-4 border-t border-rose-100 dark:border-rose-900/40">
              <button
                onClick={handleResetAllData}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
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
