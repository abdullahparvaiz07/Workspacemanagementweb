'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useUIStore } from '@/store/useUIStore';
import { authService } from '@/services/auth.service';
import { activityService } from '@/services/activity.service';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { UserRole } from '@/types';
import {
  UserPlus,
  Search,
  Users,
  UserCheck,
  Mail,
  Shield,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';

export function MembersView() {
  const members = useAuthStore((s) => s.members);
  const removeMemberFromStore = useAuthStore((s) => s.removeMember);
  const updateMemberRoleInStore = useAuthStore((s) => s.updateMemberRole);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const currentUser = useAuthStore((s) => s.currentUser);
  const setInviteMemberModalOpen = useUIStore((s) => s.setInviteMemberModalOpen);

  const permissions = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!currentUser) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + '/invite?ws=' + activeWorkspaceId);
    setCopiedLink(true);
    toast.success('Invite link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleRoleChange = (memberId: string, memberName: string, newRole: UserRole) => {
    if (!permissions.canManageMembers) {
      toast.error('Your role does not allow changing member roles.');
      return;
    }
    updateMemberRoleInStore(memberId, newRole);

    activityService.logActivity({
      workspaceId: activeWorkspaceId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: `changed role of ${memberName} to ${newRole}`,
      entityType: 'member',
      entityName: memberName,
    });

    toast.info(`${memberName}'s role updated to ${newRole}.`);
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (!permissions.canManageMembers) {
      toast.error('Your role does not allow removing members.');
      return;
    }
    if (memberId === currentUser.id) {
      toast.error('You cannot remove yourself from the workspace.');
      return;
    }
    if (confirm(`Are you sure you want to remove ${memberName} from this workspace?`)) {
      removeMemberFromStore(memberId);

      activityService.logActivity({
        workspaceId: activeWorkspaceId,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        action: `removed member ${memberName}`,
        entityType: 'member',
        entityName: memberName,
      });

      toast.success(`${memberName} removed.`);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { title: 'Total Members', value: members.length, color: 'bg-blue-50 text-blue-600', icon: Users },
    { title: 'Admins & Owners', value: members.filter((m) => m.role === 'owner' || m.role === 'admin').length, color: 'bg-emerald-50 text-emerald-600', icon: UserCheck },
    { title: 'Members', value: members.filter((m) => m.role === 'member').length, color: 'bg-amber-50 text-amber-600', icon: Mail },
    { title: 'Viewers', value: members.filter((m) => m.role === 'viewer').length, color: 'bg-purple-50 text-purple-600', icon: Shield },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-zinc-950 tracking-tight">Members</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-1">
            Manage workspace roles, permissions, and invite team members.
          </p>
        </div>

        {permissions.canInviteMembers && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setInviteMemberModalOpen(true)}
              className="bg-stone-900 text-white rounded-full px-5 py-2.5 font-semibold text-xs sm:text-sm flex items-center gap-2 hover:bg-stone-800 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4" /> Invite Member
            </button>
            <button
              onClick={handleCopyLink}
              className="bg-white border border-stone-200 text-stone-700 rounded-full px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-50 transition-colors shadow-2xs"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-400" />}
              <span>{copiedLink ? 'Copied' : 'Invite Link'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-zinc-200 p-5 flex items-center gap-4 shadow-2xs">
              <div className={`p-3 rounded-xl ${stat.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-extrabold text-2xl text-zinc-950 leading-none">{stat.value}</h3>
                <p className="text-xs text-zinc-500 font-medium mt-1">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter members by name or email..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-400 bg-stone-50/50">
                <th className="py-4 px-6">Member</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white" />
                      <div>
                        <span className="font-bold text-stone-900 block">{m.name}</span>
                        {m.id === currentUser.id && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-semibold">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-stone-600 font-mono">{m.email}</td>
                  <td className="py-4 px-6">
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.id, m.name, e.target.value as UserRole)}
                      disabled={!permissions.canManageMembers || m.role === 'owner'}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-800 capitalize focus:outline-none disabled:opacity-75"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {permissions.canManageMembers && m.id !== currentUser.id && m.role !== 'owner' && (
                      <button
                        onClick={() => handleRemoveMember(m.id, m.name)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
