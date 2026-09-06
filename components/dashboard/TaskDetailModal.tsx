'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useActivityStore } from '@/store/useActivityStore';
import { taskService } from '@/services/task.service';
import { activityService } from '@/services/activity.service';
import { storageService } from '@/services/storage.service';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { TaskStatus, Comment, Activity } from '@/types';
import {
  X,
  CheckSquare,
  Clock,
  User as UserIcon,
  Tag,
  MessageSquare,
  Send,
  Trash2,
  Calendar,
  AlertCircle,
  Plus,
  Copy,
  Edit3,
  Check,
} from 'lucide-react';

export default function TaskDetailModal() {
  const selectedTaskId = useUIStore((s) => s.selectedTaskIdForModal);
  const setSelectedTaskIdForModal = useUIStore((s) => s.setSelectedTaskIdForModal);
  const tasks = useTaskStore((s) => s.tasks);
  const projects = useProjectStore((s) => s.projects);
  const members = useAuthStore((s) => s.members);
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateTaskStatusInStore = useTaskStore((s) => s.updateTaskStatus);
  const toggleSubtaskInStore = useTaskStore((s) => s.toggleSubtask);
  const addSubtaskInStore = useTaskStore((s) => s.addSubtask);
  const deleteSubtaskInStore = useTaskStore((s) => s.deleteSubtask);
  const duplicateTaskInStore = useTaskStore((s) => s.duplicateTask);
  const updateTaskInStore = useTaskStore((s) => s.updateTask);
  const deleteTaskFromStore = useTaskStore((s) => s.deleteTask);
  const activities = useActivityStore((s) => s.activities);
  const permissions = usePermissions();

  const [commentInput, setCommentInput] = useState('');
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  if (!selectedTaskId) return null;

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const allComments: Comment[] = storageService.getTable('comments') || [];
  const taskComments = allComments.filter((c) => c.taskId === task.id);
  const taskActivities = activities.filter((a) => a.entityName === task.title || a.action.includes(task.title));

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    updateTaskInStore(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      updatedAt: new Date().toISOString(),
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
    if (currentUser) {
      activityService.logActivity({
        workspaceId: task.workspaceId,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        action: `changed status of "${task.title}" to ${newStatus.replace('-', ' ')}`,
        entityType: 'task',
        entityName: task.title,
      });
    }
    toast.info(`Task moved from ${previousStatus.replace('-', ' ')} to ${newStatus.replace('-', ' ')}`);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    toggleSubtaskInStore(task.id, subtaskId);
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
    const dup = duplicateTaskInStore(task.id);
    if (dup) {
      if (currentUser) {
        activityService.logActivity({
          workspaceId: task.workspaceId,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          action: `duplicated task "${task.title}"`,
          entityType: 'task',
          entityName: dup.title,
        });
      }
      toast.success(`Task duplicated: "${dup.title}"`);
      setSelectedTaskIdForModal(dup.id);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    if (!permissions.canComment) {
      toast.error('Your role does not allow commenting.');
      return;
    }
    if (!currentUser) return;

    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      taskId: task.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text: commentInput.trim(),
      createdAt: new Date().toISOString(),
    };

    storageService.updateTable('comments', (list) => [...list, newComment]);
    updateTaskInStore(task.id, {
      commentsCount: (task.commentsCount || 0) + 1,
    });

    activityService.logActivity({
      workspaceId: task.workspaceId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: `commented on "${task.title}"`,
      entityType: 'comment',
      entityName: task.title,
    });

    setCommentInput('');
  };

  const handleDeleteTask = () => {
    if (!permissions.canDeleteTask) {
      toast.error('Your role does not allow deleting tasks.');
      return;
    }
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      taskService.deleteTask(task.id);
      deleteTaskFromStore(task.id);
      if (currentUser) {
        activityService.logActivity({
          workspaceId: task.workspaceId,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          action: `deleted task "${task.title}"`,
          entityType: 'task',
          entityName: task.title,
        });
      }
      toast.success('Task deleted successfully.');
      setSelectedTaskIdForModal(null);
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
      <div className="bg-white border-l border-stone-200 w-full max-w-2xl h-full shadow-2xl flex flex-col animation-slide-left">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
              {project?.name || 'General Project'}
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
                  value={task.status === 'completed' ? 'done' : task.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white font-medium text-stone-800 focus:outline-none capitalize"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Due {task.dueDate}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-stone-400" />
                <span>Assigned to {members.find((m) => m.id === task.assigneeId)?.name || (task as any).assignee?.name || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Description</h4>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-stone-700 leading-relaxed">
              {task.description}
            </div>
          </div>

          {/* Tags */}
          {(task.tags?.length > 0 || task.labels?.length) && (
            <div>
              <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Tags & Labels</h4>
              <div className="flex gap-2 flex-wrap">
                {(task.tags || task.labels || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium"
                  >
                    <Tag className="w-3 h-3 text-stone-400" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

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
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100/80 border border-stone-100 transition-colors"
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer accent-amber-600"
                    />
                    <span
                      className={`text-xs font-medium ${
                        st.completed ? 'line-through text-stone-400' : 'text-stone-700'
                      }`}
                    >
                      {st.title}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="text-stone-300 hover:text-rose-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {taskComments.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No comments yet. Start the conversation!</p>
              ) : (
                taskComments.map((cmt) => (
                  <div key={cmt.id} className="flex gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <img
                      src={cmt.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={cmt.authorName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-stone-800">{cmt.authorName}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(cmt.createdAt || (cmt as any).timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-stone-600">{cmt.text}</p>
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
