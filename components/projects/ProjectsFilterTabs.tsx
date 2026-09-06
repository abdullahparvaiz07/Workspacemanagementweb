'use client';

import React, { useState } from 'react';

interface ProjectsFilterTabsProps {
  onTabChange?: (tab: string) => void;
}

export function ProjectsFilterTabs({ onTabChange }: ProjectsFilterTabsProps) {
  const [activeTab, setActiveTab] = useState('All Projects');

  const tabs = [
    { id: 'All Projects', label: 'All Projects', count: 5 },
    { id: 'Active', label: 'Active', count: 4 },
    { id: 'Completed', label: 'Completed', count: 1 },
    { id: 'Archived', label: 'Archived', count: 0 },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  return (
    <div className="flex items-center gap-6 border-b border-zinc-200/80 pt-2 pb-0 select-none overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`pb-3 font-semibold text-xs sm:text-sm whitespace-nowrap relative transition-colors ${
              isActive ? 'text-blue-600 font-bold' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <span>
              {tab.label} <span className="text-xs text-zinc-400 font-normal">({tab.count})</span>
            </span>

            {/* Active Blue Underline Indicator */}
            {isActive && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
