'use client';

import React from 'react';

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-200/70 dark:bg-zinc-800/60 rounded-2xl ${className}`} />
  );
}

export function TasksListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-white/90 dark:bg-zinc-900/90 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="w-32 h-4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="w-20 h-4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="w-24 h-4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-100/80 dark:border-zinc-800/60 animate-pulse"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
              <div className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-700 shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-sm">
                <div className="w-3/4 h-4 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="w-1/2 h-3 rounded bg-zinc-200/60 dark:bg-zinc-750" />
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="w-20 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="w-16 h-3.5 rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
              <div className="w-16 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="w-20 h-3.5 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KanbanSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar">
      {Array.from({ length: columns }).map((_, colIdx) => (
        <div
          key={colIdx}
          className="bg-[#FAF7F2] dark:bg-zinc-900/60 rounded-2xl p-3 sm:p-3.5 border border-zinc-200/80 dark:border-zinc-800 w-[280px] sm:min-w-[300px] sm:max-w-[360px] flex-shrink-0 min-h-[460px] flex flex-col space-y-3.5 animate-pulse"
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="w-24 h-4 rounded bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div className="w-6 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>

          <div className="space-y-3 flex-1">
            {Array.from({ length: 3 }).map((_, cardIdx) => (
              <div
                key={cardIdx}
                className="bg-white dark:bg-zinc-800/80 p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-700/60 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-16 h-3.5 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="w-12 h-3.5 rounded bg-zinc-200 dark:bg-zinc-700" />
                </div>
                <div className="w-full h-4 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="w-3/4 h-3.5 rounded bg-zinc-200/70 dark:bg-zinc-750" />
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-700/50">
                  <div className="w-12 h-3 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                </div>
              </div>
            ))}
          </div>

          <div className="w-full h-9 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-200/40 dark:bg-zinc-800/40" />
        </div>
      ))}
    </div>
  );
}

export function DashboardGridSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="h-44 rounded-3xl bg-zinc-200/70 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800" />

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-20 h-3.5 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-750" />
            </div>
            <div className="w-16 h-7 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="w-28 h-3 rounded bg-zinc-200/60 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: cards }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 space-y-4 shadow-xs"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-750" />
            <div className="w-14 h-5 rounded-full bg-zinc-200 dark:bg-zinc-750" />
          </div>
          <div className="space-y-2">
            <div className="w-3/4 h-5 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="w-full h-3.5 rounded bg-zinc-200/70 dark:bg-zinc-800" />
          </div>
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between">
              <div className="w-16 h-3 rounded bg-zinc-200 dark:bg-zinc-750" />
              <div className="w-8 h-3 rounded bg-zinc-200 dark:bg-zinc-750" />
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900" />
              <div className="w-7 h-7 rounded-full bg-zinc-300 dark:bg-zinc-650 border-2 border-white dark:border-zinc-900" />
            </div>
            <div className="w-16 h-4 rounded bg-zinc-200 dark:bg-zinc-750" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 space-y-6 animate-pulse shadow-xs">
      <div className="flex items-center justify-between">
        <div className="w-40 h-6 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex gap-2">
          <div className="w-20 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
          <div className="w-20 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div key={idx} className="h-6 rounded bg-zinc-200/60 dark:bg-zinc-800" />
        ))}
        {Array.from({ length: 35 }).map((_, idx) => (
          <div
            key={idx}
            className="h-24 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/50 p-2 space-y-1.5"
          >
            <div className="w-4 h-3 rounded bg-zinc-200 dark:bg-zinc-700" />
            {idx % 3 === 0 && (
              <div className="w-full h-4 rounded bg-amber-200/60 dark:bg-amber-900/40" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
