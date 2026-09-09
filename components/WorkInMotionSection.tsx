'use client';

import React, { useState } from 'react';
import { ArrowRight, MousePointer } from 'lucide-react';
import { motion } from 'motion/react';

export function WorkInMotionSection() {
  const [activeColumn, setActiveColumn] = useState<'todo' | 'in-progress' | 'review' | 'done'>('review');
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger an animated drag-and-drop demo when clicking "See it in action"
  const handleRunDemo = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Sequence: start at in-progress -> move to review -> move to done
    setTimeout(() => {
      setActiveColumn('review');
      setTimeout(() => {
        setActiveColumn('done');
        setIsAnimating(false);
      }, 1800);
    }, 1200);
  };

  const handleManualMove = (col: 'todo' | 'in-progress' | 'review' | 'done') => {
    setActiveColumn(col);
  };

  return (
    <section id="workflow" className="w-full bg-zinc-950 text-white py-20 lg:py-28 px-6 lg:px-12 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: TEXT CONTENT & ACTION */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center">
            
            {/* Eyebrow */}
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
              WORK IN MOTION
            </span>

            {/* Headline */}
            <h2 className="font-serif-title text-5xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.05] tracking-tight relative">
              <span className="relative inline-block">
                Watch
                {/* Hand-drawn Underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-zinc-400/80 pointer-events-none"
                  viewBox="0 0 160 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 3 8 C 30 3, 100 2, 155 8"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              work move.
            </h2>

            {/* Body */}
            <p className="mt-6 text-zinc-400 text-base sm:text-lg font-normal leading-relaxed max-w-md">
              Drag, drop, update and see your team&apos;s progress in real time. It&apos;s simple, fast and satisfying.
            </p>

            {/* Button */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleRunDemo}
                disabled={isAnimating}
                className="bg-transparent hover:bg-zinc-800/80 text-white font-medium rounded-full px-6 py-3 border border-zinc-700 hover:border-zinc-500 transition-all duration-200 flex items-center gap-2.5 text-sm sm:text-base group active:scale-95 disabled:opacity-50"
              >
                <span>{isAnimating ? 'Moving task...' : 'See it in action'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Sparkle burst decoration */}
              <div className="text-zinc-600 hidden sm:block">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <path d="M 16 4 L 16 10 M 16 22 L 16 28 M 4 16 L 10 16 M 22 16 L 28 16 M 8 8 L 12 12 M 20 20 L 24 24 M 24 8 L 20 12 M 12 20 L 8 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: KANBAN COLUMNS & FLOATING DRAG CARD */}
          <div className="lg:col-span-7 relative">
            
            {/* Sparkle burst lines on left of columns */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-zinc-600 hidden lg:block pointer-events-none">
              <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                <path d="M 10 10 L 20 20 M 5 20 L 18 20 M 10 30 L 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Grid of 4 Off-White Column Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
              
              {/* --- COLUMN 1: TODO --- */}
              <div
                onClick={() => handleManualMove('todo')}
                className={`bg-[#FAF7F2] text-zinc-900 rounded-xl p-3 shadow-md border border-zinc-200/80 flex flex-col justify-between min-h-[280px] sm:min-h-[310px] cursor-pointer transition-all ${
                  activeColumn === 'todo' ? 'ring-2 ring-amber-400' : 'hover:border-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-bold text-xs text-zinc-800 mb-3 px-0.5">
                    <span>To Do</span>
                    <span className="w-4 h-4 rounded-full bg-zinc-200/80 text-zinc-600 flex items-center justify-center text-[10px]">2</span>
                  </div>

                  {/* Static Card 1 */}
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200/80 shadow-2xs space-y-2 mb-2">
                    <span className="text-[9px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md">Design</span>
                    <div className="text-[11px] font-medium text-zinc-800 leading-snug">Brand Guidelines V2</div>
                    <div className="flex -space-x-1 pt-0.5">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Avatar" referrerPolicy="no-referrer" className="w-4 h-4 rounded-full" />
                    </div>
                  </div>

                  {/* Static Card 2 */}
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200/80 shadow-2xs space-y-2">
                    <span className="text-[9px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md">Frontend</span>
                    <div className="text-[11px] font-medium text-zinc-800 leading-snug">Dark Theme Setup</div>
                    <div className="flex -space-x-1 pt-0.5">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Avatar" referrerPolicy="no-referrer" className="w-4 h-4 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 font-medium text-center pt-2">+ Add task</div>
              </div>

              {/* --- COLUMN 2: IN PROGRESS --- */}
              <div
                onClick={() => handleManualMove('in-progress')}
                className={`bg-[#FAF7F2] text-zinc-900 rounded-xl p-3 shadow-md border border-zinc-200/80 flex flex-col justify-between min-h-[280px] sm:min-h-[310px] cursor-pointer transition-all ${
                  activeColumn === 'in-progress' ? 'ring-2 ring-amber-400' : 'hover:border-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-bold text-xs text-zinc-800 mb-3 px-0.5">
                    <span>In Progress</span>
                    <span className="w-4 h-4 rounded-full bg-zinc-200/80 text-zinc-600 flex items-center justify-center text-[10px]">1</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200/80 shadow-2xs space-y-2">
                    <span className="text-[9px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">System</span>
                    <div className="text-[11px] font-medium text-zinc-800 leading-snug">Database Migration</div>
                    <div className="flex -space-x-1 pt-0.5">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Avatar" referrerPolicy="no-referrer" className="w-4 h-4 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 font-medium text-center pt-2">+ Add task</div>
              </div>

              {/* --- COLUMN 3: REVIEW --- */}
              <div
                onClick={() => handleManualMove('review')}
                className={`bg-[#FAF7F2] text-zinc-900 rounded-xl p-3 shadow-md border border-zinc-200/80 flex flex-col justify-between min-h-[280px] sm:min-h-[310px] cursor-pointer transition-all ${
                  activeColumn === 'review' ? 'ring-2 ring-amber-400' : 'hover:border-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-bold text-xs text-zinc-800 mb-3 px-0.5">
                    <span>Review</span>
                    <span className="w-4 h-4 rounded-full bg-zinc-200/80 text-zinc-600 flex items-center justify-center text-[10px]">1</span>
                  </div>

                  {activeColumn === 'review' && !isAnimating && (
                    <motion.div layoutId="active-task" className="bg-white p-2.5 rounded-lg border border-zinc-200/80 shadow-2xs space-y-2">
                      <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">UX Audit</span>
                      <div className="text-[11px] font-medium text-zinc-800 leading-snug">Navigation Component</div>
                      <div className="flex -space-x-1 pt-0.5">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="Avatar" referrerPolicy="no-referrer" className="w-4 h-4 rounded-full" />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="text-[10px] text-zinc-400 font-medium text-center pt-2">+ Add task</div>
              </div>

              {/* --- COLUMN 4: DONE --- */}
              <div
                onClick={() => handleManualMove('done')}
                className={`bg-[#FAF7F2] text-zinc-900 rounded-xl p-3 shadow-md border border-zinc-200/80 flex flex-col justify-between min-h-[280px] sm:min-h-[310px] cursor-pointer transition-all ${
                  activeColumn === 'done' ? 'ring-2 ring-amber-400' : 'hover:border-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-bold text-xs text-zinc-800 mb-3 px-0.5">
                    <span>Done</span>
                    <span className="w-4 h-4 rounded-full bg-zinc-200/80 text-zinc-600 flex items-center justify-center text-[10px]">2</span>
                  </div>

                  {activeColumn === 'done' && (
                    <motion.div layoutId="active-task" className="bg-white p-2.5 rounded-lg border border-zinc-200/80 shadow-2xs space-y-2 mb-2">
                      <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">UX Audit</span>
                      <div className="text-[11px] font-medium text-zinc-800 leading-snug">Navigation Component</div>
                      <div className="flex -space-x-1 pt-0.5">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="Avatar" referrerPolicy="no-referrer" className="w-4 h-4 rounded-full" />
                      </div>
                    </motion.div>
                  )}

                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200/80 shadow-2xs space-y-2 opacity-80">
                    <span className="text-[9px] font-semibold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded-md">Core</span>
                    <div className="text-[11px] font-medium text-zinc-400 line-through leading-snug">Project Kickoff Specs</div>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 font-medium text-center pt-2">+ Add task</div>
              </div>

            </div>

            {/* --- FLOATING DRAGGED CARD WITH MOUSE CURSOR POINTER --- */}
            {isAnimating && (
              <motion.div
                initial={{ x: 140, y: 80, rotate: 3, scale: 1.05 }}
                animate={{ x: 260, y: 70, rotate: -2, scale: 1.05 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute top-12 left-0 bg-white text-zinc-900 rounded-xl p-3 border border-zinc-300 shadow-2xl z-30 w-44 sm:w-48 space-y-2 cursor-grab"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                    UX Audit
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">1/2</span>
                </div>
                <div className="text-xs font-semibold text-zinc-900 leading-snug">
                  Navigation Component
                </div>
                <div className="flex items-center justify-between pt-1">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  {/* Mouse cursor icon grabbing card */}
                  <div className="bg-zinc-900 text-white p-1 rounded-full shadow-md transform translate-x-2 translate-y-2">
                    <MousePointer className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
