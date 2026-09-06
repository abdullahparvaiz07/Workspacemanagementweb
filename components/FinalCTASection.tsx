'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Shield, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function FinalCTASection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="w-full bg-[#FAF7F2] py-20 lg:py-28 px-6 lg:px-12 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        {/* Main Floating Dark CTA Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 lg:p-20 shadow-2xl border border-zinc-800/90 overflow-hidden"
        >
          {/* Warm Ambient Glow Effects */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* Decorative Sparkle Accents */}
          <div className="absolute top-8 right-8 text-amber-300/40 hidden sm:block pointer-events-none">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            
            {/* Handwritten Eyebrow Annotation */}
            <div className="relative mb-3 sm:mb-4 inline-block -rotate-1 origin-center">
              <span className="font-handwriting text-3xl sm:text-4xl text-amber-300 font-medium tracking-wide">
                Start creating today
              </span>
              <svg
                className="absolute -bottom-1.5 left-0 w-full h-3 text-amber-300/80 pointer-events-none"
                viewBox="0 0 200 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 2 7 Q 100 3 198 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Main Headline */}
            <h2 className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.08]">
              Ready to give your team <br className="hidden sm:inline" />
              <span className="text-amber-200 italic font-normal">a place to create?</span>
            </h2>

            {/* Subtitle */}
            <p className="mt-6 text-zinc-400 text-base sm:text-xl font-normal leading-relaxed max-w-xl">
              Join thousands of studios, engineers, and product managers who bring their best ideas together in Workroom.
            </p>

            {/* Email Signup Form */}
            <div className="mt-10 w-full max-w-md">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 rounded-2xl p-4 flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Workspace created! Check your email to start.
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-amber-400 text-white placeholder-zinc-500 rounded-full px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto whitespace-nowrap bg-amber-300 hover:bg-amber-200 text-zinc-950 font-semibold rounded-full px-8 py-4 text-base transition-all duration-200 shadow-lg hover:shadow-amber-300/20 flex items-center justify-center gap-2 group active:scale-95"
                  >
                    <span>Get started free</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}

              {/* Trust Micro-copy */}
              <p className="mt-4 text-xs sm:text-sm text-zinc-400 font-medium">
                No credit card required &bull; Free 14-day trial &bull; Setup in 2 mins
              </p>
            </div>

            {/* Feature Guarantees Row */}
            <div className="mt-12 pt-10 border-t border-zinc-800/80 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-zinc-400 text-xs sm:text-sm font-medium">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Instant team onboarding</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-amber-300" />
                <span>Enterprise SOC-2 certified</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Unlimited workspaces</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
