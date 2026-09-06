'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-4 flex items-center justify-between relative z-30">
      {/* Brand Logo */}
      <a href="#" className="flex items-center gap-1 group">
        <span className="font-serif-title font-extrabold text-2xl lg:text-3xl tracking-tight text-zinc-900 group-hover:text-zinc-700 transition-colors">
          WORKROOM.
        </span>
      </a>

      {/* Center Nav Links - Desktop */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-700">
        <a href="#product" className="hover:text-zinc-900 transition-colors">
          Product
        </a>
        <a href="#features" className="hover:text-zinc-900 transition-colors">
          Features
        </a>
        
        {/* Resources Dropdown */}
        <div className="relative">
          <button
            onClick={() => setResourcesOpen(!resourcesOpen)}
            className="flex items-center gap-1 hover:text-zinc-900 transition-colors focus:outline-none"
          >
            <span>Resources</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {resourcesOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl border border-zinc-200/80 shadow-lg p-2 z-50"
              >
                <a href="#docs" className="block px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg">
                  Documentation
                </a>
                <a href="#templates" className="block px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg">
                  Templates & Guides
                </a>
                <a href="#community" className="block px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg">
                  Community Hub
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Right Side Actions */}
      <div className="hidden md:flex items-center gap-5">
        <a href="/login" className="text-sm font-medium text-zinc-800 hover:text-zinc-950 transition-colors">
          Sign in
        </a>
        <a href="/dashboard" className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow active:scale-95">
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-zinc-800 hover:bg-zinc-200/50 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-zinc-200/80 shadow-xl px-6 py-6 flex flex-col gap-4 z-50 overflow-hidden"
          >
            <a href="#product" className="text-base font-medium text-zinc-800 py-1">
              Product
            </a>
            <a href="#features" className="text-base font-medium text-zinc-800 py-1">
              Features
            </a>
            <a href="#resources" className="text-base font-medium text-zinc-800 py-1">
              Resources
            </a>
            <hr className="border-zinc-200 my-1" />
            <div className="flex flex-col gap-3 pt-1">
              <a href="/login" className="w-full py-2.5 text-center font-medium text-zinc-800 hover:bg-zinc-100 rounded-lg block">
                Sign in
              </a>
              <a href="/dashboard" className="w-full bg-zinc-900 text-white rounded-full py-3 font-medium flex items-center justify-center gap-2 block">
                <span>Get started</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
