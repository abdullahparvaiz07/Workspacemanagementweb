'use client';

import React, { useState } from 'react';
import { useSupportStore } from '@/store/useSupportStore';
import { useAuthStore } from '@/store/useAuthStore';
import { supportService } from '@/services/support.service';
import { toast } from 'sonner';
import {
  Search,
  BookOpen,
  Video,
  MessageSquare,
  Headphones,
  ArrowRight,
  FileText,
  ChevronRight,
  Mail,
  ExternalLink,
  CheckCircle2,
  X,
  Send,
} from 'lucide-react';

export function HelpSupportView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const tickets = useSupportStore((s) => s.tickets);
  const createTicketInStore = useSupportStore((s) => s.createTicket);
  const currentUser = useAuthStore((s) => s.currentUser);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Subject and message are required.');
      return;
    }
    if (!currentUser) return;

    createTicketInStore(
      currentUser.id,
      currentUser.name,
      currentUser.email,
      subject.trim(),
      'General',
      message.trim()
    );

    toast.success('Support ticket submitted successfully! We will get back to you soon.');
    setSubject('');
    setMessage('');
    setIsTicketModalOpen(false);
  };

  const quickCategories = [
    {
      title: 'Knowledge Base',
      subtitle: 'Browse guides, tutorials and documentation',
      icon: BookOpen,
      bg: 'bg-sky-100/80',
      color: 'text-sky-700'
    },
    {
      title: 'Video Tutorials',
      subtitle: 'Watch step-by-step tutorials',
      icon: Video,
      bg: 'bg-emerald-100/80',
      color: 'text-emerald-700'
    },
    {
      title: 'Community',
      subtitle: 'Get help from the Workroom community',
      icon: MessageSquare,
      bg: 'bg-amber-100/80',
      color: 'text-amber-700'
    },
    {
      title: 'Contact Support',
      subtitle: 'Reach out to our support team',
      icon: Headphones,
      bg: 'bg-purple-100/80',
      color: 'text-purple-700'
    }
  ];

  const popularArticles = [
    {
      title: 'Getting started with Workroom',
      description: 'Learn the basics and set up your workspace in minutes.'
    },
    {
      title: 'How to create and manage projects',
      description: 'Step-by-step guide to creating, organizing, and tracking projects.'
    },
    {
      title: 'Invite team members',
      description: 'Learn how to add members and manage permissions.'
    },
    {
      title: 'Understanding task statuses',
      description: 'A complete guide to task workflows and statuses.'
    },
    {
      title: 'Integrations and API',
      description: 'Connect Workroom with your favorite tools.'
    },
    {
      title: 'Billing and subscription',
      description: 'Manage your plan, payment methods, and invoices.'
    }
  ];

  const quickLinks = [
    'Product Updates',
    'Feature Requests',
    'Report a Bug',
    'Community Forum',
    'Terms of Service',
    'Privacy Policy'
  ];

  const filteredArticles = popularArticles.filter((article) =>
    searchQuery
      ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto w-full select-none">
      
      {/* 1. Page Header Section */}
      <div>
        <h1 className="font-serif-title font-bold text-3xl sm:text-4xl text-zinc-950 tracking-tight">
          Help & Support
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-1">
          Find answers, learn how to get the most out of Workroom, or reach out to our support team.
        </p>
      </div>

      {/* 2. Search Hero Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles, guides, or topics..."
            className="w-full pl-11 pr-4 py-3 bg-white/90 border border-zinc-200/90 rounded-2xl text-xs sm:text-sm font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
          />
        </div>

        <button className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95">
          Search
        </button>
      </div>

      {/* 3. Top Quick Category Cards Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 group-hover:translate-x-0.5 transition-all" />
              </div>

              <div>
                <h3 className="font-bold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-1">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Main Split View: Left Popular Articles (8 Cols) + Right Sidebar Widgets (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Popular Help Articles List (8 Columns) */}
        <div className="lg:col-span-8 bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title font-extrabold text-xl text-zinc-950 tracking-tight">
              Popular Help Articles
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
              View all articles
            </button>
          </div>

          {/* List of Help Articles */}
          <div className="space-y-2">
            {filteredArticles.map((article, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-2xl bg-zinc-100 text-zinc-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                      {article.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-colors flex-shrink-0 ml-2" />
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Widgets (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: Still Need Help Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-serif-title font-extrabold text-lg text-zinc-950 tracking-tight">
                Still need help?
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Our support team is here to help you.
              </p>
            </div>

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Send us a message</span>
            </button>

            <p className="text-[11px] text-zinc-400 font-medium text-center">
              We typically respond within 24 hours.
            </p>
          </div>

          {/* Submitted Tickets Card */}
          {tickets.length > 0 && (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 shadow-xs space-y-3">
              <h3 className="font-serif-title font-extrabold text-base text-zinc-950 tracking-tight">
                Your Submitted Tickets ({tickets.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tickets.map((t) => (
                  <div key={t.id} className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-zinc-900">{t.subject}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 capitalize">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[11px] line-clamp-1">{t.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Widget 2: System Status Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-title font-extrabold text-lg text-zinc-950 tracking-tight">
                System Status
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-xs text-zinc-800">
                  All systems operational
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                Workroom is running smoothly.
              </p>
            </div>

            <button className="bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 font-bold px-3 py-1.5 rounded-full text-xs shadow-2xs whitespace-nowrap transition-all cursor-pointer">
              View status
            </button>
          </div>

          {/* Widget 3: Quick Links Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
            <h3 className="font-serif-title font-extrabold text-lg text-zinc-950 tracking-tight">
              Quick Links
            </h3>

            <div className="space-y-2.5">
              {quickLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1 text-xs font-semibold text-zinc-700 hover:text-blue-600 transition-colors cursor-pointer group"
                >
                  <span>{link}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden animation-fade-in">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">Submit Support Ticket</h3>
                <p className="text-xs text-stone-500">We'll assist you as soon as possible.</p>
              </div>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Issue with task drag and drop"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-medium text-xs hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-4 h-4" /> Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
