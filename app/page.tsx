'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroLeft } from '@/components/HeroLeft';
import { HeroImage } from '@/components/HeroImage';
import { ScrollExplore } from '@/components/ScrollExplore';
import { ProblemSection } from '@/components/ProblemSection';
import { SolutionSection } from '@/components/SolutionSection';
import { WorkInMotionSection } from '@/components/WorkInMotionSection';
import { FinalCTASection } from '@/components/FinalCTASection';
import { Footer } from '@/components/Footer';
import { Layers, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-zinc-900 overflow-x-hidden selection:bg-amber-200 selection:text-zinc-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Hero Container */}
      <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-0 pb-6 lg:pt-2 lg:pb-12 flex flex-col justify-between">
        
        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-2 lg:mt-4">
          
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-5">
            <HeroLeft />
          </div>

          {/* Right Column: Hero Image */}
          <div className="lg:col-span-7">
            <HeroImage />
          </div>
        </div>

        {/* Bottom Annotation Scroll Indicator */}
        <div className="mt-8 lg:mt-4">
          <ScrollExplore />
        </div>
      </section>

      {/* "THE PROBLEM: Too many places. Not enough clarity." Section */}
      <ProblemSection />

      {/* "THE SOLUTION: One workspace. Every moving part." Section */}
      <SolutionSection />

      {/* "WORK IN MOTION: Watch work move." Section */}
      <WorkInMotionSection />

      {/* Below-the-fold Feature Preview Section */}
      <section id="features" className="w-full bg-white/60 border-t border-zinc-200/80 py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-handwriting text-3xl text-zinc-800 font-medium">
              Everything in one workspace
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl text-zinc-950 mt-2 font-normal">
              Built for how modern teams actually work.
            </h2>
            <p className="mt-4 text-zinc-600 text-base sm:text-lg">
              Streamline project workflows, centralize team communication, and automate task management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-2xl text-zinc-900 font-normal mb-2">Unified Workspaces</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Organize projects, docs, tasks, and members into dedicated workspace boards without context switching.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-2xl text-zinc-900 font-normal mb-2">Real-time Sync</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Instant comments, mentions, and task status updates keep everyone aligned in real time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-2xl text-zinc-900 font-normal mb-2">Enterprise Security</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Role-based access controls, automated data backups, and SOC-2 compliance for complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <FinalCTASection />

      {/* Main Footer */}
      <Footer />
    </main>
  );
}
