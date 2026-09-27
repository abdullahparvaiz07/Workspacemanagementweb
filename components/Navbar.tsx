'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    // If the popup is closed / not visible, bring it back after 3 seconds
    if (!showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

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

      {/* Right Side Actions: GitHub Link + Popup & Auth Links */}
      <div className="hidden md:flex items-center gap-4 lg:gap-5">
        {/* GitHub Link with periodic / immediate Popup */}
        <div className="relative flex items-center">
          {/* Animated Popup: Shows immediately on website load and reappears 3s after dismiss */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 shadow-2xl rounded-xl border border-amber-200/80 dark:border-zinc-700 bg-white/98 dark:bg-zinc-900/98 backdrop-blur-md px-3 py-2 text-zinc-900 dark:text-zinc-100 whitespace-nowrap"
              >
                {/* Tooltip triangle arrow */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/98 dark:bg-zinc-900/98 rotate-45 border-t border-l border-amber-200/80 dark:border-zinc-700" />

                <a
                  href="https://github.com/abdullahparvaiz07/Workspacemanagementweb.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group cursor-pointer"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>View Website code / github repo</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-amber-600 dark:text-amber-400" />
                </a>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPopup(false);
                  }}
                  className="ml-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-0.5 rounded"
                  aria-label="Close notification"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Uiverse.io adapted for GitHub */}
          <section className="flex justify-center items-center">
            <a
              href="https://github.com/abdullahparvaiz07/Workspacemanagementweb.git"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Website code on GitHub"
              className="group relative flex justify-center items-center p-2 rounded-md drop-shadow-xl bg-[#24292e] text-white font-semibold hover:translate-y-2 hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413] hover:bg-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.15em"
                height="1.15em"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span
                className="absolute opacity-0 group-hover:opacity-100 group-hover:text-zinc-800 dark:group-hover:text-zinc-100 group-hover:text-xs font-semibold group-hover:-translate-y-9 duration-500 whitespace-nowrap bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-md shadow-md border border-zinc-200 dark:border-zinc-700 pointer-events-none"
              >
                GitHub
              </span>
            </a>
          </section>
        </div>

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
              <a
                href="https://github.com/abdullahparvaiz07/Workspacemanagementweb.git"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-zinc-900 text-white rounded-xl flex items-center justify-between text-sm font-medium shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>View Website code / github repo</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </a>
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

