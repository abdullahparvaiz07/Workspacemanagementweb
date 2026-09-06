'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, FolderKanban, CheckSquare, Users } from 'lucide-react';
import Image from 'next/image';

export function LoginPage() {
  const router = useRouter();
  const loginInStore = useAuthStore((s) => s.login);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('abdullah@acme.studio');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const user = authService.login(email);
      loginInStore(email);
      toast.success(`Welcome back, ${user.name}!`);
      setLoading(false);
      router.push('/dashboard');
    }, 400);
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-70 mt-1"
            >
              <span>{loading ? 'Signing in...' : isSignUp ? 'Create account →' : 'Sign in →'}</span>
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
