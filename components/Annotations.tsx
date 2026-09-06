'use client';

import React from 'react';

export function Annotations() {
  return (
    <>
      {/* --- PROJECTS ANNOTATION (Top Left) --- */}
      <div className="absolute -top-10 left-8 sm:left-16 lg:left-24 z-20 pointer-events-none select-none flex flex-col items-center">
        <span className="font-handwriting text-3xl sm:text-4xl text-zinc-800 font-medium tracking-wide transform -rotate-6">
          Projects
        </span>
        {/* Curved Arrow Pointing Down-Right to Sidebar */}
        <svg
          className="w-16 h-12 text-zinc-800 transform translate-x-3 -translate-y-1"
          viewBox="0 0 70 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 15 5 C 25 25, 45 40, 55 35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Arrowhead */}
          <path
            d="M 48 38 L 56 36 L 53 28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* --- TASKS ANNOTATION (Top Right) --- */}
      <div className="absolute -top-12 right-24 sm:right-32 lg:right-48 z-20 pointer-events-none select-none flex flex-col items-center">
        {/* Sparkle Radiating Lines above title */}
        <div className="flex gap-1.5 mb-1 text-zinc-800">
          <svg className="w-8 h-5" viewBox="0 0 40 25" fill="none">
            <path d="M 8 20 L 4 5 M 20 20 L 20 2 M 32 20 L 36 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="font-handwriting text-3xl sm:text-4xl text-zinc-800 font-medium tracking-wide transform rotate-3">
          Tasks
        </span>
      </div>

      {/* --- TEAM ANNOTATION (Far Right) --- */}
      <div className="absolute top-44 -right-2 sm:-right-6 lg:-right-10 z-20 pointer-events-none select-none flex flex-col items-start">
        <span className="font-handwriting text-3xl sm:text-4xl text-zinc-800 font-medium tracking-wide transform rotate-6">
          Team
        </span>
        {/* Curved Arrow pointing down-left to avatars */}
        <svg
          className="w-14 h-10 text-zinc-800 transform -translate-x-4 -translate-y-1"
          viewBox="0 0 60 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 10 10 C 25 15, 35 25, 45 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 12 18 L 8 8 L 18 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
