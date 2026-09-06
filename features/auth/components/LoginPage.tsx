'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, FolderKanban, CheckSquare, Users, User } from 'lucide-react';
import Image from 'next/image';

export function LoginPage() {
  const router = useRouter();
  const { login, signup } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, fullName);
        toast.success(`Account created successfully!`);
      } else {
        await login(email, password);
        toast.success(`Welcome back!`);
      }
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#FAF7F2] text-zinc-900 flex flex-col lg:flex-row selection:bg-amber-200 select-none overflow-x-hidden lg:overflow-hidden font-sans">
      {/* LEFT COLUMN */}
      <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative bg-[#FAF7F2] border-r border-zinc-200/80 overflow-y-auto">
        <div>
          <Link href="/" className="font-serif font-extrabold text-2xl lg:text-3xl tracking-tight text-zinc-950 block">
            WORKROOM.
          </Link>
        </div>

        <div className="my-6 lg:my-4 space-y-4 max-w-xl mx-auto lg:mx-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
            A BETTER WAY TO WORK
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-950 leading-[1.1] tracking-tight">
            Organize.<br />
            Collaborate.<br />
            Make progress.
          </h1>

          <p className="text-zinc-600 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
            Workroom helps modern teams plan, track and achieve their biggest ideas — all in one place.
          </p>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="bg-white/80 backdrop-blur-sm border border-zinc-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center flex-shrink-0">
                <FolderKanban className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-[11px] text-zinc-900 truncate">Projects</h4>
                <p className="text-[9px] text-zinc-500 font-medium truncate">Keep work organized</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-zinc-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-amber-100/80 text-amber-800 flex items-center justify-center flex-shrink-0">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-[11px] text-zinc-900 truncate">Tasks</h4>
                <p className="text-[9px] text-zinc-500 font-medium truncate">Turn ideas into action</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-zinc-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-purple-100/80 text-purple-700 flex items-center justify-center flex-shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-[11px] text-zinc-900 truncate">Teams</h4>
                <p className="text-[9px] text-zinc-500 font-medium truncate">Do more together</p>
              </div>
            </div>
          </div>

          <div className="pt-2 relative max-w-md mx-auto flex items-center justify-center">
            <Image
              src="/assets/loginpageimg.png"
              alt="Workroom Login Mockup"
              width={500}
              height={300}
              priority
              className="w-full h-auto object-contain max-h-48 sm:max-h-56"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-1 rounded-full bg-zinc-950" />
            <span className="w-2.5 h-1 rounded-full bg-zinc-300" />
            <span className="w-2.5 h-1 rounded-full bg-zinc-300" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            TRUSTED BY CREATIVE AND PRODUCT TEAMS WORLDWIDE
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto">
        <div className="flex items-center justify-end gap-2.5">
          <span className="text-xs text-zinc-500 font-medium">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 font-bold px-3.5 py-1.5 rounded-full text-xs shadow-2xs transition-all cursor-pointer"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>

        <div className="max-w-sm mx-auto w-full my-auto py-6 space-y-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-zinc-500 text-xs font-medium mt-1">
              {isSignUp
                ? 'Start your 14-day free trial. No credit card required.'
                : 'Sign in to your Workroom account to continue.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-zinc-900">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-zinc-200/90 rounded-xl text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-zinc-900">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-zinc-200/90 rounded-xl text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-zinc-900">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-zinc-200/90 rounded-xl text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* S.M.I.T Hackathon Evaluator Credentials Card */}
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider">
                  Use for S.M.I.T only
                </span>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Verified Evaluator Logins</span>
              </div>

              <div className="space-y-2">
                {/* Primary Account: SMIT Evaluator (Guaranteed Working) */}
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border-2 border-amber-400 text-[11px] shadow-2xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-extrabold text-amber-950 flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                      smit.evaluator@workroom.space
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600 truncate font-semibold">Testing@workspace321</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('smit.evaluator@workroom.space');
                      setPassword('Testing@workspace321');
                      setIsSignUp(false);
                      toast.success('Primary S.M.I.T evaluator filled! Ready to sign in.');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
                  >
                    Fill & Use
                  </button>
                </div>

              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-70 mt-1"
            >
              <span>{loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : isSignUp ? 'Create account →' : 'Sign in →'}</span>
            </button>
          </form>
        </div>

        <div className="text-center text-[10px] font-medium text-zinc-400 pt-2">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
