'use client';

import React from 'react';
import { motion } from 'motion/react';

export function SolutionSection() {
  const features = [
    {
      title: 'Projects',
      description: 'Plan and organize your work',
      bgGlow: 'hover:border-amber-300',
      icon: (
        <svg className="w-14 h-14" viewBox="0 0 60 60" fill="none">
          {/* Yellow Blob backdrop */}
          <path
            d="M 12 18 C 10 32, 22 48, 38 46 C 50 44, 52 28, 42 16 C 30 8, 14 8, 12 18 Z"
            fill="#FDE047"
            fillOpacity="0.8"
          />
          {/* Board Outer Outline */}
          <rect x="18" y="14" width="28" height="28" rx="4" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.2" />
          {/* Grid Inner Dividers */}
          <line x1="18" y1="28" x2="46" y2="28" stroke="#18181B" strokeWidth="2" />
          <line x1="32" y1="14" x2="32" y2="42" stroke="#18181B" strokeWidth="2" />
          {/* Highlighted Yellow Card inside grid */}
          <rect x="34" y="30" width="10" height="10" rx="2" fill="#FDE047" stroke="#18181B" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      title: 'Tasks',
      description: 'Move from idea to done',
      bgGlow: 'hover:border-blue-300',
      icon: (
        <svg className="w-14 h-14" viewBox="0 0 60 60" fill="none">
          {/* Blue Blob backdrop */}
          <path
            d="M 10 24 C 8 38, 20 50, 36 48 C 50 46, 52 30, 44 18 C 34 8, 12 12, 10 24 Z"
            fill="#BFDBFE"
            fillOpacity="0.9"
          />
          {/* Sheet Outer */}
          <rect x="20" y="12" width="26" height="32" rx="4" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.2" />
          {/* Checkmark 1 & Line */}
          <path d="M 24 20 L 26 22 L 30 18" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="33" y1="20" x2="41" y2="20" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          {/* Checkmark 2 & Line */}
          <path d="M 24 28 L 26 30 L 30 26" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="33" y1="28" x2="41" y2="28" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          {/* Checkmark 3 & Line */}
          <path d="M 24 36 L 26 38 L 30 34" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="33" y1="36" x2="41" y2="36" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'People',
      description: 'Collaborate in real time',
      bgGlow: 'hover:border-rose-300',
      icon: (
        <svg className="w-14 h-14" viewBox="0 0 60 60" fill="none">
          {/* Coral / Pink Blob backdrop */}
          <path
            d="M 12 28 C 10 42, 28 52, 44 46 C 54 40, 52 24, 40 16 C 26 8, 14 14, 12 28 Z"
            fill="#FECDD3"
            fillOpacity="0.95"
          />
          {/* Person 1 (Center Front) */}
          <circle cx="30" cy="22" r="6" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
          <path d="M 20 38 C 20 31, 24 29, 30 29 C 36 29, 40 31, 40 38" fill="#FF8A65" stroke="#18181B" strokeWidth="2" />

          {/* Person 2 (Left Back) */}
          <circle cx="21" cy="24" r="4.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.8" />
          <path d="M 15 36 C 15 31, 18 30, 21 30" stroke="#18181B" strokeWidth="1.8" fill="none" />

          {/* Person 3 (Right Back) */}
          <circle cx="39" cy="24" r="4.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.8" />
          <path d="M 45 36 C 45 31, 42 30, 39 30" stroke="#18181B" strokeWidth="1.8" fill="none" />
        </svg>
      )
    },
    {
      title: 'Views',
      description: 'Board, list, calendar and more',
      bgGlow: 'hover:border-emerald-300',
      icon: (
        <svg className="w-14 h-14" viewBox="0 0 60 60" fill="none">
          {/* Emerald / Teal Blob backdrop */}
          <path
            d="M 12 20 C 8 36, 22 48, 40 46 C 52 44, 52 26, 42 14 C 28 4, 14 8, 12 20 Z"
            fill="#A7F3D0"
            fillOpacity="0.9"
          />
          {/* Calendar Body */}
          <rect x="18" y="16" width="28" height="28" rx="4" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.2" />
          {/* Top Ring Binder Loops */}
          <line x1="25" y1="12" x2="25" y2="18" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="39" y1="12" x2="39" y2="18" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
          {/* Calendar Header Line */}
          <line x1="18" y1="24" x2="46" y2="24" stroke="#18181B" strokeWidth="1.8" />
          {/* Grid Dots / Tasks inside Calendar */}
          <path d="M 24 30 H 28 M 34 30 H 38 M 24 36 H 28 M 34 36 H 38" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-[#FAF7F2] py-16 lg:py-24 px-6 lg:px-12 border-t border-zinc-200/60 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: THE SOLUTION HEADLINE & PARAGRAPH */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-center items-start"
          >
            
            {/* Eyebrow Label */}
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 px-2.5 py-1 rounded-full bg-zinc-200/60 border border-zinc-300/60">
              THE SOLUTION
            </span>

            {/* Headline */}
            <h2 className="font-serif-title text-5xl sm:text-6xl lg:text-7xl font-normal text-zinc-950 leading-[1.05] tracking-tight">
              One workspace. <br />
              <span className="block text-zinc-800 italic">Every moving part.</span>
            </h2>

            {/* Paragraph */}
            <p className="mt-6 text-zinc-600 text-base sm:text-lg font-normal leading-relaxed max-w-md">
              Organize your projects, manage tasks, collaborate with your team and keep track of everything — all in one place.
            </p>

          </motion.div>

          {/* RIGHT COLUMN: 4 FEATURE CARDS WITH HOVER LIFT */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 items-start pt-4 lg:pt-0">
            {features.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`p-5 rounded-2xl bg-white/60 border border-zinc-200/80 hover:bg-white ${item.bgGlow} hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group cursor-pointer transform hover:-translate-y-2`}
              >
                {/* Custom Vector Icon Container */}
                <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex items-center justify-center">
                  {item.icon}
                </div>

                {/* Feature Title */}
                <h3 className="font-bold text-base sm:text-lg text-zinc-900 tracking-tight group-hover:text-zinc-950">
                  {item.title}
                </h3>

                {/* Feature Description */}
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 font-normal leading-snug max-w-[140px]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
