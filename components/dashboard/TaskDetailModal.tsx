'use client';

import React, { useState, useRef } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { useActivityStore } from '@/store/useActivityStore';
import { usePermissions } from '@/hooks/usePermissions';
import { TaskStatus } from '@/features/tasks/types';
import { toast } from 'sonner';
import {
  X,
  Clock,
  User as UserIcon,
  Tag,
  MessageSquare,
  Send,
  Trash2,
  Calendar,
  Plus,
  Copy,
  Edit3,
  Check,
  Paperclip,
  Download,
  Loader2,
} from 'lucide-react';

export default function TaskDetailModal() {
  const selectedTaskId = useUIStore((s) => s.selectedTaskIdForModal);
  const setSelectedTaskIdForModal = useUIStore((s) => s.setSelectedTaskIdForModal);
  
  const tasks = useTaskStore((s) => s.tasks);
  const updateTaskStatusInStore = useTaskStore((s) => s.updateTaskStatus);
  const toggleSubtaskInStore = useTaskStore((s) => s.toggleSubtask);
  const addSubtaskInStore = useTaskStore((s) => s.createSubtask);
  const deleteSubtaskInStore = useTaskStore((s) => s.deleteSubtask);
  const duplicateTaskInStore = useTaskStore((s) => s.duplicateTask);
  const updateTaskInStore = useTaskStore((s) => s.updateTask);
  const deleteTaskFromStore = useTaskStore((s) => s.deleteTask);
  const addComment = useTaskStore((s) => s.addComment);
  const deleteCommentStore = useTaskStore((s) => s.deleteComment);
  const uploadAttachment = useTaskStore((s) => s.uploadAttachment);
  const deleteAttachment = useTaskStore((s) => s.deleteAttachment);

  const projects = useProjectStore((s) => s.projects);
  const workspaceMembers = useWorkspaceStore((s) => s.members);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const currentUser = useAuthStore((s) => s.user);
  
  const activities = useActivityStore((s) => s.activities);
  const logActivity = useActivityStore((s) => s.logActivity);
  const permissions = usePermissions();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [commentInput, setCommentInput] = useState('');
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!selectedTaskId) return null;

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return null;

  const project = projects.find((p) => p.id === task.project_id);
  const taskComments = task.comments || [];
  const taskActivities = activities.filter((a) => a.entityName === task.title || a.action.includes(task.title));
  const assignee = workspaceMembers.find(m => m.user_id === task.assignee_id)?.profile;

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    updateTaskInStore(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
    setIsEditing(false);
    toast.success('Task details updated.');
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!permissions.canEditTask) {
      toast.error('Your role does not allow status changes.');
      return;
    }
    const previousStatus = task.status;
    updateTaskStatusInStore(task.id, newStatus);
    if (activeWorkspaceId && currentUser) {
      logActivity(
        activeWorkspaceId,
        currentUser.id,
        currentUser.email || 'User',
        '',
        `changed status of "${task.title}" to ${newStatus.replace('_', ' ')}`,
        'task',
        task.title
      );
    }
    toast.info(`Task moved from ${previousStatus.replace('_', ' ')} to ${newStatus.replace('_', ' ')}`);
  };

  const handleToggleSubtask = (subtaskId: string, currentCompleted: boolean) => {
    toggleSubtaskInStore(task.id, subtaskId, !currentCompleted);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    addSubtaskInStore(task.id, newSubtaskInput.trim());
    setNewSubtaskInput('');
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    deleteSubtaskInStore(task.id, subtaskId);
  };

  const handleDuplicateTask = () => {
    if (!currentUser) return;
    duplicateTaskInStore(task.id, `${task.title} (Copy)`, currentUser.id);
    if (activeWorkspaceId) {
      logActivity(
        activeWorkspaceId,
        currentUser.id,
        currentUser.email || 'User',
        '',
        `duplicated task "${task.title}"`,
        'task',
        `${task.title} (Copy)`
      );
    }
    toast.success(`Task duplicated.`);
    setSelectedTaskIdForModal(null);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text) return;
    if (!permissions.canComment) {
      toast.error('Your role does not allow commenting.');
      return;
    }
    if (!currentUser) return;

    addComment(task.id, currentUser.id, text);

    if (activeWorkspaceId) {
      logActivity(
        activeWorkspaceId,
        currentUser.id,
        currentUser.email || 'User',
        '',
        `commented on "${task.title}"`,
        'comment',
        task.title
      );
    }

    setCommentInput('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteCommentStore(task.id, commentId);
      toast.success('Comment deleted');
    }
  };

  const handleDeleteTask = () => {
    if (!permissions.canDeleteTask) {
      toast.error('Your role does not allow deleting tasks.');
      return;
    }
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      deleteTaskFromStore(task.id);
      if (activeWorkspaceId && currentUser) {
        logActivity(
          activeWorkspaceId,
          currentUser.id,
          currentUser.email || 'User',
          '',
          `deleted task "${task.title}"`,
          'task',
          task.title
        );
      }
      toast.success('Task deleted successfully.');
      setSelectedTaskIdForModal(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploading(true);
    try {
      await uploadAttachment(task.id, currentUser.id, file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = async (attachmentId: string, url: string) => {
    if (confirm('Are you sure you want to delete this attachment?')) {
      await deleteAttachment(task.id, attachmentId, url);
    }
  };

  const priorityColors = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-sky-50 text-sky-700 border-sky-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    urgent: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs transition-opacity animation-fade-in">
      {/* Right Drawer Panel */}
      <div className="bg-white border-l border-stone-200 w-full sm:max-w-xl lg:max-w-2xl h-full shadow-2xl flex flex-col animation-slide-left">
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
              {project?.name || 'General'}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDuplicateTask}
              className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-stone-100 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Duplicate task"
            >
              <Copy className="w-4 h-4" /> Duplicate
            </button>
            {permissions.canDeleteTask && (
              <button
                onClick={handleDeleteTask}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSelectedTaskIdForModal(null)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm font-sans flex-1">
          {/* Title & Status Bar */}
          <div>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full font-serif text-xl font-bold text-stone-900 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs text-stone-700 border border-stone-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight">{task.title}</h2>
                  <button
                    onClick={handleStartEdit}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-stone-100 transition-colors"
                    title="Edit Title / Description"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 flex-wrap text-xs text-stone-500 mt-3">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-stone-700">Status:</span>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white font-medium text-stone-800 focus:outline-none capitalize"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Due {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-stone-400" />
                <span>Assigned to {assignee?.full_name || assignee?.email || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Description</h4>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-stone-700 leading-relaxed whitespace-pre-wrap">
              {task.description || <span className="italic text-stone-400">No description</span>}
            </div>
          </div>

          {/* Attachments Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5" /> Attachments
              </h4>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs text-amber-600 font-medium hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3 h-3" />}
                {isUploading ? 'Uploading...' : 'Add File'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
                className="hidden" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {task.attachments.length === 0 ? (
                 <p className="text-xs text-stone-400 italic col-span-2">No attachments.</p>
              ) : (
                task.attachments.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl group relative overflow-hidden">
                    <div className="bg-stone-200 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                      <Paperclip className="w-4 h-4 text-stone-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-stone-800 truncate" title={a.file_name}>{a.file_name}</p>
                      <p className="text-[10px] text-stone-500 uppercase">{a.file_type || 'File'}</p>
                    </div>
                    
                    <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-stone-50 via-stone-50 to-transparent px-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <a href={a.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-stone-500 hover:text-amber-600 bg-white rounded-md shadow-xs">
                          <Download className="w-3.5 h-3.5" />
                       </a>
                       {(a.uploaded_by === currentUser?.id || permissions.canDeleteTask) && (
                         <button onClick={() => handleRemoveAttachment(a.id, a.file_url)} className="p-1.5 text-stone-500 hover:text-rose-600 bg-white rounded-md shadow-xs">
                            <Trash2 className="w-3.5 h-3.5" />
                         </button>
                       )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Subtasks ({task.subtasks?.filter((st) => st.completed).length || 0} / {task.subtasks?.length || 0})
              </h4>
            </div>
            <div className="space-y-2 mb-3">
              {task.subtasks?.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100/80 border border-stone-100 transition-colors group"
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id, st.completed)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer accent-amber-600"
                    />
                    <span
                      className={`text-xs font-medium flex-1 ${
                        st.completed ? 'line-through text-stone-400' : 'text-stone-700'
                      }`}
                    >
                      {st.title}
                    </span>
                  </label>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleDeleteSubtask(st.id)}
                      className="text-stone-300 hover:text-rose-600 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                placeholder="Add subtask step..."
                className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <button
                onClick={handleAddSubtask}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Activity History */}
          {taskActivities.length > 0 && (
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Activity History
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {taskActivities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50">
                    <span className="text-stone-700 font-medium">{act.userName} {act.action}</span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Comments ({taskComments.length})
            </h4>

            {/* List */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {taskComments.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No comments yet. Start the conversation!</p>
              ) : (
                taskComments.map((cmt) => (
                  <div key={cmt.id} className="flex gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 group">
                    <img
                      src={cmt.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={cmt.profile?.full_name || 'User'}
                      className="w-7 h-7 rounded-full object-cover mt-1"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-stone-800">{cmt.profile?.full_name || cmt.profile?.email}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-400">
                            {new Date(cmt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {(cmt.user_id === currentUser?.id || permissions.canDeleteTask) && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteComment(cmt.id)}
                                className="text-stone-400 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{cmt.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            {permissions.canComment && (
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Post
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
