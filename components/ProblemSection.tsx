'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

export function ProblemSection() {
  return (
    <section className="w-full bg-[#FAF7F2] py-16 lg:py-24 px-6 lg:px-12 border-t border-zinc-200/60 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: THE PROBLEM HEADLINE, SUBTITLE & SCATTERED TOOLS */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-center items-start"
          >
            
            {/* Eyebrow label */}
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 px-2.5 py-1 rounded-full bg-zinc-200/60 border border-zinc-300/60">
              THE PROBLEM
            </span>

            {/* Headline */}
            <h2 className="font-serif-title text-5xl sm:text-6xl lg:text-7xl font-normal text-zinc-950 leading-[1.05] tracking-tight">
              Too many places. <br />
              <span className="block text-zinc-800 italic">Not enough clarity.</span>
            </h2>

            {/* Subtitle */}
            <p className="mt-6 text-zinc-600 text-base sm:text-lg font-normal leading-relaxed max-w-md">
              Jumping between tools, scattered files and endless threads slow down your team. It&apos;s time for a workspace that keeps everything together.
            </p>

            {/* SCATTERED TOOLS DIAGRAM */}
            <div className="mt-10 w-full max-w-md relative pt-2 pb-6">
              {/* Tool Icon Cards Row */}
              <div className="flex items-center justify-between gap-3 sm:gap-4 relative z-10">
                
                {/* Tool 1: Slack */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-center p-3 transform group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:shadow-md group-hover:border-zinc-300 transition-all duration-300">
                    <svg viewBox="0 0 127.14 127.14" className="w-8 h-8 transform group-hover:rotate-6 transition-transform duration-300">
                      <path fill="#E01E5A" d="M27.28 72.82a13.64 13.64 0 1 1-13.64-13.64h13.64v13.64zm6.82 0a13.64 13.64 0 1 1 27.28 0v34.1a13.64 13.64 0 1 1-27.28 0V72.82z" />
                      <path fill="#36C5F0" d="M54.32 27.28a13.64 13.64 0 1 1 13.64-13.64v13.64H54.32zm0 6.82a13.64 13.64 0 1 1 0 27.28H20.22a13.64 13.64 0 1 1 0-27.28h34.1z" />
                      <path fill="#2EB67D" d="M99.86 54.32a13.64 13.64 0 1 1 13.64 13.64H99.86V54.32zm-6.82 0a13.64 13.64 0 1 1-27.28 0V20.22a13.64 13.64 0 1 1 27.28 0v34.1z" />
                      <path fill="#ECB22E" d="M72.82 99.86a13.64 13.64 0 1 1-13.64 13.64V99.86h13.64zm0-6.82a13.64 13.64 0 1 1 0-27.28h34.1a13.64 13.64 0 1 1 0 27.28H72.82z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">Slack</span>
                </div>

                {/* Tool 2: Figma */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-center p-3 transform group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:shadow-md group-hover:border-zinc-300 transition-all duration-300">
                    <svg viewBox="0 0 38 57" className="w-8 h-8 transform group-hover:rotate-6 transition-transform duration-300">
                      <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
                      <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 0 9.5 57 9.5 9.5 0 0 0 19 47.5V38H9.5A9.5 9.5 0 0 0 0 47.5z" />
                      <path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
                      <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
                      <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">Figma</span>
                </div>

                {/* Tool 3: Google Sheets */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-center p-3 transform group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:shadow-md group-hover:border-zinc-300 transition-all duration-300">
                    <svg viewBox="0 0 48 48" className="w-8 h-8 transform group-hover:rotate-6 transition-transform duration-300">
                      <path fill="#4CAF50" d="M41 41H7V7h22l12 12v22z" />
                      <path fill="#FFF" d="M29 7v12h12" />
                      <path fill="#FFF" d="M14 22h20v4H14zm0 8h20v4H14z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">Sheets</span>
                </div>

                {/* Tool 4: Google Drive */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-center p-3 transform group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:shadow-md group-hover:border-zinc-300 transition-all duration-300">
                    <svg viewBox="0 0 87.3 78" className="w-8 h-8 transform group-hover:rotate-6 transition-transform duration-300">
                      <path fill="#0066DA" d="M6 54.4l14.2 24.6h47.2L53.2 54.4H6z" />
                      <path fill="#00AC47" d="M29.6 13.6L6 54.4l14.2 24.6 23.6-40.8-14.2-24.6z" />
                      <path fill="#EA4335" d="M67.7 13.6H29.6l23.6 40.8h14.5L87.3 27.8 67.7 13.6z" />
                      <path fill="#FFBA00" d="M29.6 13.6l14.2 24.6H87.3L73.1 13.6H29.6z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">Drive</span>
                </div>

              </div>

              {/* Hand-drawn Curved Arrows & Centered Annotation Below */}
              <div className="relative w-full h-28 mt-2">
                <svg
                  className="w-full h-full text-zinc-800"
                  viewBox="0 0 320 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Left Curved Arrow pointing right towards center */}
                  <path
                    d="M 35 10 C 45 35, 65 52, 98 55"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 90 49 L 100 55 L 92 62"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Right Curved Arrow pointing left towards center */}
                  <path
                    d="M 285 10 C 275 35, 255 52, 222 55"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 230 49 L 220 55 L 228 62"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Handwritten Annotation "Scattered work." Centered Between Arrows */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[38px] pointer-events-none select-none text-center">
                  <span className="font-handwriting text-2xl sm:text-3xl text-amber-900 font-medium tracking-wide leading-tight block transform hover:scale-110 transition-transform">
                    Scattered work.
                  </span>
                </div>
              </div>

            </div>

          </motion.div>

          {/* RIGHT COLUMN: PROBLEM MOCKUP IMAGE */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7 flex justify-center items-center -mt-8 lg:-mt-20 group"
          >
            <Image
              src="/assets/problemmockupimg.png"
              alt="Problem Section Workspace Mockup"
              width={1200}
              height={800}
              priority
              className="w-full h-auto object-contain transform group-hover:scale-[1.015] transition-transform duration-500 ease-out"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
