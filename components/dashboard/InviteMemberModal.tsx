'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/auth.service';
import { activityService } from '@/services/activity.service';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { UserRole } from '@/types';
import { X, UserPlus, Mail } from 'lucide-react';

export default function InviteMemberModal() {
  const isInviteMemberModalOpen = useUIStore((s) => s.isInviteMemberModalOpen);
  const setInviteMemberModalOpen = useUIStore((s) => s.setInviteMemberModalOpen);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const currentUser = useAuthStore((s) => s.currentUser);
  const inviteMemberInStore = useAuthStore((s) => s.inviteMember);
  const permissions = usePermissions();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('member');

  if (!isInviteMemberModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required.');
      return;
    }

    if (!permissions.canInviteMembers) {
      toast.error('Your role does not allow inviting members.');
      return;
    }

    const newMember = inviteMemberInStore(name.trim(), email.trim(), role);

    if (currentUser) {
      activityService.logActivity({
        workspaceId: activeWorkspaceId,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        action: `invited ${name.trim()} as ${role}`,
        entityType: 'member',
        entityName: name.trim(),
      });
    }

    toast.success(`Invitation sent to ${email.trim()}!`);
    setInviteMemberModalOpen(false);

    setName('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden animation-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Invite Team Member</h3>
            <p className="text-xs text-stone-500">Grant workspace access to a colleague.</p>
          </div>
          <button
            onClick={() => setInviteMemberModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm font-sans">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Miller"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Workspace Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 bg-white"
            >
              <option value="admin">Admin (Can manage projects, tasks & members)</option>
              <option value="member">Member (Can create & edit tasks)</option>
              <option value="viewer">Viewer (Read-only access)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setInviteMemberModalOpen(false)}
              className="px-4 py-2 rounded-xl text-stone-600 font-medium text-xs hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-stone-900 text-stone-50 font-medium text-xs hover:bg-stone-800 shadow-md transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
