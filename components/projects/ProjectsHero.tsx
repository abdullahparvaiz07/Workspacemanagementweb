'use client';

import React from 'react';
import { Plus, Upload, Folder, CheckCircle2, ChevronDown, Clock, Filter, SlidersHorizontal } from 'lucide-react';

export function ProjectsHero() {
  return (
    <div className="relative bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 sm:p-8 lg:p-10 shadow-xs overflow-hidden select-none">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Title, Subtitle, Stats & Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Handwritten Eyebrow Annotation */}
          <div className="inline-block -rotate-2 origin-left">
            <span className="font-handwriting text-3xl text-zinc-800 font-medium tracking-wide">
              Your projects
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 tracking-tight leading-[1.06]">
            Big ideas. Well organized.
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-600 text-sm sm:text-base font-normal leading-relaxed max-w-xl">
            Create, manage and track your projects — all in one place. <br className="hidden sm:inline" />
            Keep your team aligned and your work moving forward.
          </p>

          {/* Stats Row & Actions Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            
            {/* 3 Stat Pills */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Stat 1: Total Projects */}
              <div className="bg-[#FAF7F2] px-3.5 py-2.5 rounded-2xl border border-zinc-200/80 flex items-center gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Folder className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-serif-title font-bold text-lg text-zinc-950 leading-none block">
                    5
                  </span>
                  <span className="text-[11px] font-medium text-zinc-500 block">
                    Total projects
                  </span>
                </div>
              </div>

              {/* Stat 2: Active Tasks */}
              <div className="bg-[#FAF7F2] px-3.5 py-2.5 rounded-2xl border border-zinc-200/80 flex items-center gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-zinc-200 text-zinc-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-serif-title font-bold text-lg text-zinc-950 leading-none block">
                    12
                  </span>
                  <span className="text-[11px] font-medium text-zinc-500 block">
                    Active tasks
                  </span>
                </div>
              </div>

              {/* Stat 3: Completed */}
              <div className="bg-[#FAF7F2] px-3.5 py-2.5 rounded-2xl border border-zinc-200/80 flex items-center gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-serif-title font-bold text-lg text-zinc-950 leading-none block">
                    3
                  </span>
                  <span className="text-[11px] font-medium text-zinc-500 block">
                    Completed
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Right Column: Actions & Line Art Illustration */}
        <div className="lg:col-span-5 relative flex flex-col items-end justify-between space-y-6">
          
          {/* Top Right Action & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 justify-end w-full">
            {/* Primary New Project Button */}
            <button className="bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-full px-5 py-2.5 text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95">
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>

            {/* Secondary Import Button */}
            <button className="bg-white hover:bg-zinc-100 border border-zinc-300/90 text-zinc-900 font-semibold rounded-full px-4 py-2.5 text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95 shadow-2xs">
              <Upload className="w-4 h-4 text-zinc-600" />
              <span>Import</span>
            </button>
          </div>

          {/* Filter Dropdowns Bar */}
          <div className="flex items-center gap-2 justify-end w-full pt-1">
            <button className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 text-zinc-700 font-semibold rounded-full px-3.5 py-1.5 text-xs flex items-center gap-1.5 transition-colors">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <span>All Projects</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 text-zinc-700 font-semibold rounded-full px-3.5 py-1.5 text-xs flex items-center gap-1.5 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
              <span>Sort: Recent</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          {/* Line Art Desk Worker & Cat Illustration with Annotation */}
          <div className="relative w-full flex justify-center lg:justify-end pt-4">
            {/* Yellow Glow Aura */}
            <div className="absolute inset-0 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-2">
              {/* Handwritten Note "Plan Create Build Grow" */}
              <div className="transform -rotate-6 pointer-events-none select-none text-right">
                <span className="font-handwriting text-2xl text-zinc-800 font-medium leading-tight block">
                  Plan <br /> Create <br /> Build <br /> Grow
                </span>
                <svg className="w-8 h-6 text-zinc-800 ml-auto mt-1" viewBox="0 0 30 20" fill="none">
                  <path d="M 5 5 C 15 15, 20 15, 25 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 18 16 L 26 18 L 22 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Line Art Illustration SVG */}
              <svg className="w-56 h-44 text-zinc-800" viewBox="0 0 220 160" fill="none">
                {/* Board Wall on background */}
                <rect x="130" y="20" width="65" height="90" rx="4" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" />
                <rect x="140" y="30" width="18" height="20" rx="2" fill="#FDE047" stroke="currentColor" strokeWidth="1.5" />
                <rect x="165" y="30" width="22" height="15" rx="2" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" />
                {/* Person at Desk */}
                <circle cx="95" cy="65" r="22" fill="#FFFFFF" stroke="currentColor" strokeWidth="2.5" />
                <path d="M 75 60 C 75 35, 115 35, 115 60 Z" fill="#18181B" />
                <circle cx="88" cy="63" r="2" fill="currentColor" />
                <circle cx="102" cy="63" r="2" fill="currentColor" />
                <path d="M 90 72 Q 95 76 100 72" stroke="currentColor" strokeWidth="2" fill="none" />
                {/* Body */}
                <path d="M 60 125 C 60 95, 130 95, 130 125" fill="#18181B" />
                {/* Desk */}
                <rect x="35" y="125" width="140" height="12" rx="3" fill="#FFFFFF" stroke="currentColor" strokeWidth="2.5" />
                {/* Laptop */}
                <rect x="75" y="105" width="42" height="22" rx="3" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" />
                {/* Sleeping Cat under desk */}
                <ellipse cx="160" cy="120" rx="14" ry="8" fill="#FDE047" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="170" cy="116" r="6" fill="#FDE047" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
