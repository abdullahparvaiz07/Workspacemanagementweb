'use client';

import React from 'react';
import { motion } from 'motion/react';

export function ScrollExplore() {
  const scrollToExplore = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-12 select-none z-20">
      <button
        onClick={scrollToExplore}
        className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
      >
        <span className="font-handwriting text-2xl sm:text-3xl text-zinc-800 font-medium tracking-wide transition-colors group-hover:text-zinc-950">
          Scroll to explore
        </span>

        {/* Hand-drawn Down Arrow with Bounce Animation */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-zinc-800 group-hover:text-zinc-950"
        >
          <svg
            className="w-7 h-8"
            viewBox="0 0 30 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Vertical stem */}
            <path
              d="M 15 4 C 14 18, 16 28, 15 34"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Left arrowhead wing */}
            <path
              d="M 7 26 C 10 30, 13 33, 15 35"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Right arrowhead wing */}
            <path
              d="M 23 26 C 20 30, 17 33, 15 35"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </button>
    </div>
  );
}
