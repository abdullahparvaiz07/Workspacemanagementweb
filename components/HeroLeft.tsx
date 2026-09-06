'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export function HeroLeft() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left pt-0 lg:pt-1 pb-8 z-10 w-full max-w-2xl mx-auto lg:mx-0"
    >
      {/* Eyebrow Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-6 shadow-xs hover:bg-amber-100 transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
        <span>Next-Generation Team Workspace</span>
      </motion.div>

      {/* Main Headline */}
      <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight text-zinc-950 leading-[1.08]">
        <span className="whitespace-nowrap block">Work deserves</span>
        <span className="block">a place.</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-zinc-600 text-base sm:text-lg lg:text-xl font-normal max-w-lg leading-relaxed">
        Projects, tasks, people and ideas — brought together in one beautifully organized workspace.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
        {/* Primary CTA */}
        <Link 
          href="/login" 
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-full px-6 py-3 sm:px-7 sm:py-3 text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2.5 group active:scale-95 border border-zinc-900"
        >
          <span>Create your workspace</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>

        {/* Secondary CTA */}
        <Link 
          href="/dashboard" 
          className="bg-transparent hover:bg-zinc-200/40 text-zinc-800 hover:text-zinc-950 font-medium rounded-full px-6 py-3 sm:px-7 sm:py-3 text-sm sm:text-base border border-zinc-400/80 hover:border-zinc-500 transition-all duration-200 active:scale-95 flex items-center justify-center"
        >
          Explore workspace
        </Link>
      </div>
    </motion.div>
  );
}
