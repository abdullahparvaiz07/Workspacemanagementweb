'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export function HeroLeft() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left pt-0 lg:pt-1 pb-8 z-10 w-full max-w-2xl mx-auto lg:mx-0"
    >
      {/* Main Headline */}
      <h1 className="font-serif-title text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-zinc-950 leading-[1.05] sm:leading-[1.02]">
        Work deserves <br className="hidden lg:inline" />
        <span className="inline-block">a place.</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-zinc-600 text-base sm:text-lg lg:text-xl font-normal max-w-lg leading-relaxed">
        Projects, tasks, people and ideas — brought together in one beautifully organized workspace.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
        {/* Primary CTA */}
        <Link href="/login" className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-full px-7 py-3.5 text-base sm:text-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2.5 group active:scale-95">
          <span>Create your workspace</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Secondary CTA */}
        <Link href="/dashboard" className="bg-transparent hover:bg-zinc-200/50 text-zinc-900 font-medium rounded-full px-7 py-3.5 text-base sm:text-lg border border-zinc-300 hover:border-zinc-400 transition-all duration-200 active:scale-95 flex items-center justify-center">
          Explore workspace
        </Link>
      </div>
    </motion.div>
  );
}
