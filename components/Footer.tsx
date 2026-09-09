'use client';

import React from 'react';
import { Twitter, Github, Linkedin, MessageSquare, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="resources" className="w-full bg-[#FAF7F2] border-t border-zinc-200/80 text-zinc-900 pt-16 pb-12 px-6 lg:px-12 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 pb-16 border-b border-zinc-200/80">
          
          {/* Brand Info (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <a href="#" className="font-serif-title font-extrabold text-2xl lg:text-3xl tracking-tight text-zinc-950 block">
                WORKROOM.
              </a>

              {/* Tagline */}
              <p className="mt-4 text-zinc-600 text-sm sm:text-base leading-relaxed max-w-sm">
                The digital studio for modern teams. Projects, tasks, people and ideas — brought together in one beautifully organized workspace.
              </p>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href="#"
                aria-label="Twitter / X"
                className="w-10 h-10 rounded-full bg-white border border-zinc-200/90 text-zinc-700 hover:text-zinc-950 hover:border-zinc-400 flex items-center justify-center transition-all shadow-2xs hover:scale-105"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-10 h-10 rounded-full bg-white border border-zinc-200/90 text-zinc-700 hover:text-zinc-950 hover:border-zinc-400 flex items-center justify-center transition-all shadow-2xs hover:scale-105"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-white border border-zinc-200/90 text-zinc-700 hover:text-zinc-950 hover:border-zinc-400 flex items-center justify-center transition-all shadow-2xs hover:scale-105"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Discord"
                className="w-10 h-10 rounded-full bg-white border border-zinc-200/90 text-zinc-700 hover:text-zinc-950 hover:border-zinc-400 flex items-center justify-center transition-all shadow-2xs hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Product</h4>
            <ul className="space-y-2.5 text-sm font-medium text-zinc-600">
              <li><a href="#features" className="hover:text-zinc-950 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Changelog</a></li>
              <li>
                <a href="#" className="hover:text-zinc-950 transition-colors flex items-center gap-1">
                  <span>Roadmap</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Solutions</h4>
            <ul className="space-y-2.5 text-sm font-medium text-zinc-600">
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Design Studios</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Engineering Teams</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Product Managers</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Marketing Teams</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Remote Teams</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Resources</h4>
            <ul className="space-y-2.5 text-sm font-medium text-zinc-600">
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Community Hub</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Customer Stories</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Blog & Guides</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Company</h4>
            <ul className="space-y-2.5 text-sm font-medium text-zinc-600">
              <li><a href="#" className="hover:text-zinc-950 transition-colors">About Us</a></li>
              <li>
                <a href="#" className="hover:text-zinc-950 transition-colors flex items-center gap-1.5">
                  <span>Careers</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                    Hiring
                  </span>
                </a>
              </li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Contact Sales</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition-colors">Trust & Security</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & System Status Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500">
          
          {/* Copyright */}
          <div>
            &copy; {currentYear} Workroom Inc. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Cookie Settings</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Security</a>
          </div>

          {/* Live System Status Indicator */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-zinc-200/90 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-zinc-700">All systems operational</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
