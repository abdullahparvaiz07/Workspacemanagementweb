'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setResourcesOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-4 flex items-center justify-between relative z-30">
      {/* Brand Logo */}
      <a href="#product" onClick={(e) => scrollToSection(e, 'product')} className="flex items-center gap-1 group">
        <span className="font-serif-title font-extrabold text-2xl lg:text-3xl tracking-tight text-zinc-900 group-hover:text-zinc-700 transition-colors">
          WORKROOM.
        </span>
      </a>

      {/* Center Nav Links - Desktop with Glassmorphism Effect */}
      <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/90 dark:border-zinc-700/80 shadow-xs hover:shadow-md hover:border-amber-300/60 transition-all duration-300">
        <a 
          href="#product" 
          onClick={(e) => scrollToSection(e, 'product')} 
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800 transition-all duration-200"
        >
          Product
        </a>
        <a 
          href="#solution" 
          onClick={(e) => scrollToSection(e, 'solution')} 
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800 transition-all duration-200"
        >
          Solutions
        </a>
        <a 
          href="#workflow" 
          onClick={(e) => scrollToSection(e, 'workflow')} 
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800 transition-all duration-200"
        >
          Workflow
        </a>
        <a 
          href="#features" 
          onClick={(e) => scrollToSection(e, 'features')} 
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800 transition-all duration-200"
        >
          Features
        </a>
        
        {/* Resources Dropdown */}
        <div className="relative">
          <button
            onClick={() => setResourcesOpen(!resourcesOpen)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-zinc-800 flex items-center gap-1 transition-all duration-200 focus:outline-none cursor-pointer"
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
                className="absolute top-full left-0 mt-2.5 w-52 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl p-2 z-50"
              >
                <a 
                  href="#features" 
                  onClick={(e) => scrollToSection(e, 'features')} 
                  className="block px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Documentation & Features
                </a>
                <a 
                  href="#workflow" 
                  onClick={(e) => scrollToSection(e, 'workflow')} 
                  className="block px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Workflow & Guides
                </a>
                <a 
                  href="#resources" 
                  onClick={(e) => scrollToSection(e, 'resources')} 
                  className="block px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Community & Support
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
            <a href="#product" onClick={(e) => scrollToSection(e, 'product')} className="text-base font-medium text-zinc-800 py-1">
              Product
            </a>
            <a href="#solution" onClick={(e) => scrollToSection(e, 'solution')} className="text-base font-medium text-zinc-800 py-1">
              Solutions
            </a>
            <a href="#workflow" onClick={(e) => scrollToSection(e, 'workflow')} className="text-base font-medium text-zinc-800 py-1">
              Workflow
            </a>
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-base font-medium text-zinc-800 py-1">
              Features
            </a>
            <a href="#resources" onClick={(e) => scrollToSection(e, 'resources')} className="text-base font-medium text-zinc-800 py-1">
              Resources
            </a>
            <hr className="border-zinc-200 my-1" />
            <div className="flex flex-col gap-3 pt-1">
              <a href="/login" className="w-full py-2.5 text-center font-medium text-zinc-800 hover:bg-zinc-100 rounded-lg block">
                Sign in
              </a>
              <a href="/dashboard" className="w-full bg-zinc-900 text-white rounded-full py-3 font-medium flex items-center justify-center gap-2 block">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
