'use client';

import React from 'react';
import { Plus } from 'lucide-react';

export function WorkspacePromoBanner() {
  return (
    <div className="relative bg-[#FAF7F2] border border-zinc-200/90 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden select-none">
      
      {/* Left Line Art Person Illustration */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 relative flex-shrink-0">
          <svg className="w-full h-full text-zinc-800" viewBox="0 0 100 100" fill="none">
            {/* Person reading book */}
            <circle cx="50" cy="35" r="14" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" />
            <path d="M 35 30 C 35 15, 65 15, 65 30 Z" fill="#18181B" />
            {/* Glasses */}
            <circle cx="45" cy="35" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="55" cy="35" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            {/* Body & Arms holding book */}
            <path d="M 28 75 C 28 55, 72 55, 72 75" fill="#18181B" />
            <rect x="35" y="52" width="30" height="20" rx="3" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" />
            <line x1="50" y1="52" x2="50" y2="72" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Center Text & CTA */}
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-bold text-base sm:text-lg text-zinc-950 tracking-tight">
            Need a new workspace?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal max-w-md leading-relaxed">
            Create a workspace to better organize your teams, projects and tasks.
          </p>
          <div className="pt-2">
            <button className="bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300/90 font-semibold rounded-full px-5 py-2 text-xs sm:text-sm transition-all flex items-center gap-2 shadow-2xs active:scale-95 mx-auto md:mx-0">
              <Plus className="w-4 h-4 text-zinc-700" />
              <span>Create Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Plant & Handwritten Annotation */}
      <div className="relative flex items-center gap-4 hidden lg:flex">
        {/* Handwritten Annotation */}
        <div className="transform -rotate-6 pointer-events-none select-none text-right">
          <span className="font-handwriting text-2xl text-zinc-800 font-medium leading-tight block">
            Good <br /> projects <br /> create <br /> great <br /> things.
          </span>
        </div>

        {/* Plant Illustration SVG */}
        <div className="w-20 h-28 relative">
          <svg className="w-full h-full text-zinc-800" viewBox="0 0 80 110" fill="none">
            <path d="M 30 80 L 32 100 C 32 102, 48 102, 48 100 L 50 80 Z" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.8" />
            <path d="M 40 78 Q 20 50 15 60 Q 30 72 40 78 Z" fill="#BBF7D0" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 40 78 Q 60 45 65 55 Q 50 70 40 78 Z" fill="#BBF7D0" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 40 78 Q 35 30 25 20 Q 42 38 40 78 Z" fill="#BBF7D0" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 40 78 Q 50 35 58 25 Q 48 45 40 78 Z" fill="#BBF7D0" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

    </div>
  );
}
