'use client';

import React from 'react';

export function OverviewHero() {
  return (
    <div className="relative bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-sm overflow-hidden select-none">
      
      {/* Top Section: Greeting Left, Illustration Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Greeting */}
        <div className="lg:col-span-8 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
            OVERVIEW
          </span>

          <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-normal text-zinc-950 tracking-tight leading-snug">
            Good morning, Abdullah 👋
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base font-normal">
            Here&apos;s what&apos;s happening in Acme Studio today.
          </p>
        </div>

        {/* Right Column: Hand-drawn Illustration */}
        <div className="lg:col-span-4 relative flex justify-center items-center pt-2 lg:pt-0">
          <div className="absolute inset-0 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <svg className="w-44 h-36 sm:w-48 sm:h-40 text-zinc-800" viewBox="0 0 200 160" fill="none">
              <circle cx="100" cy="50" r="24" fill="#FFFFFF" stroke="currentColor" strokeWidth="2.5" />
              <path d="M 80 45 C 80 20, 120 20, 120 45 Z" fill="#18181B" />
              <circle cx="92" cy="48" r="2" fill="currentColor" />
              <circle cx="108" cy="48" r="2" fill="currentColor" />
              <path d="M 95 56 Q 100 60 105 56" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M 60 110 C 60 80, 140 80, 140 110" fill="#18181B" />
              <rect x="40" y="110" width="120" height="12" rx="3" fill="#FFFFFF" stroke="currentColor" strokeWidth="2.5" />
              <rect x="75" y="90" width="40" height="22" rx="3" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" />
              <path d="M 145 95 L 147 110 C 147 112, 157 112, 157 110 L 159 95 Z" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" />
              <path d="M 152 80 Q 140 85 142 95 Q 152 95 152 80 Z" fill="#FDE047" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 152 80 Q 164 85 162 95 Q 152 95 152 80 Z" fill="#FDE047" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
}
