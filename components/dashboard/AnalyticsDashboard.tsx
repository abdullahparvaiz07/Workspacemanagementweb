'use client';

import React, { useMemo } from 'react';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { useWorkspaceStore } from '@/features/workspaces/store/useWorkspaceStore';
import { BarChart3, CheckCircle2, Circle, Clock, TrendingUp } from 'lucide-react';

export function AnalyticsDashboard() {
  const tasks = useTaskStore((s) => s.tasks);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    
    const highPriority = tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length;
    
    // Simple completion percentage
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, todo, completionRate, highPriority };
  }, [tasks]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl text-stone-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-stone-400" />
          Analytics & Insights
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Tasks</p>
              <h3 className="text-3xl font-bold text-stone-900 mt-2">{stats.total}</h3>
            </div>
            <div className="p-2 bg-stone-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-stone-600" />
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Completion Rate</p>
              <h3 className="text-3xl font-bold text-stone-900 mt-2">{stats.completionRate}%</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 w-full bg-stone-100 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${stats.completionRate}%` }}></div>
          </div>
        </div>

        {/* High Priority */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">High/Urgent</p>
              <h3 className="text-3xl font-bold text-rose-600 mt-2">{stats.highPriority}</h3>
            </div>
            <div className="p-2 bg-rose-100 rounded-lg">
              <Circle className="w-5 h-5 text-rose-600" />
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">In Progress</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h3 className="font-bold text-stone-900 mb-6">Task Status Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-stone-700">Done</span>
              </div>
              <span className="text-sm font-bold">{stats.completed}</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${stats.total ? (stats.completed/stats.total)*100 : 0}%` }}></div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-stone-700">In Progress</span>
              </div>
              <span className="text-sm font-bold">{stats.inProgress}</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.total ? (stats.inProgress/stats.total)*100 : 0}%` }}></div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-stone-700">To Do</span>
              </div>
              <span className="text-sm font-bold">{stats.todo}</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${stats.total ? (stats.todo/stats.total)*100 : 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
