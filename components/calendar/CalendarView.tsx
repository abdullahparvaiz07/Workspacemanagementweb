'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  CheckSquare,
  Users,
  Video,
  PlusCircle,
  ArrowRight
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  category: string;
  time: string;
  dayIndex: number; // 0 for Mon, 1 for Tue, etc.
  startHour: number; // 9 for 9 AM, 10.5 for 10:30 AM, etc.
  durationHours: number; // 1 = 1 hr, 1.5 = 1.5 hr
  cardStyle: string;
  badgeColor: string;
  assignees: string[];
}

export function CalendarView() {
  const setCreateTaskModalOpen = useUIStore((s) => s.setCreateTaskModalOpen);
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [currentMonth, setCurrentMonth] = useState('September 2026');
  const [selectedMiniDate, setSelectedMiniDate] = useState<number>(15);

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
  ];

  // Week days array for Sep 14 - 20, 2026
  const weekDays = [
    { day: 'Mon', date: 14 },
    { day: 'Tue', date: 15, isToday: true },
    { day: 'Wed', date: 16 },
    { day: 'Thu', date: 17 },
    { day: 'Fri', date: 18 },
    { day: 'Sat', date: 19 },
    { day: 'Sun', date: 20 },
  ];

  // Time slots for time axis
  const timeSlots = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
    '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'
  ];

  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const tasks = useTaskStore((s) => s.tasks);
  const projects = useProjectStore((s) => s.projects);
  const members = useAuthStore((s) => s.members);
  const setSelectedTaskIdForModal = useUIStore((s) => s.setSelectedTaskIdForModal);

  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId && t.status !== 'completed');

  // Dynamically map tasks to calendar events
  const events: CalendarEvent[] = workspaceTasks.map((task, idx) => {
    const project = projects.find(p => p.id === task.projectId);
    const assignee = members.find(m => m.id === task.assigneeId);
    
    // Pseudo-random but consistent time scheduling based on task ID length
    const startHour = 9 + ((task.id.length + idx) % 7); // Distribute between 9 AM and 4 PM
    
    let dayIndex = 0;
    if (task.dueDate === 'Today') {
      dayIndex = 1;
    } else if (task.dueDate === 'Tomorrow') {
      dayIndex = 2;
    } else {
      const parsedDate = new Date(task.dueDate);
      if (!isNaN(parsedDate.getTime())) {
        dayIndex = parsedDate.getDay() === 0 ? 6 : parsedDate.getDay() - 1;
      }
    }

    // Determine colors based on priority
    let cardStyle = 'bg-blue-50/90 border-l-4 border-blue-500 text-blue-950 hover:bg-blue-100/90';
    let badgeColor = 'text-blue-700';

    if (task.priority === 'urgent' || task.priority === 'high') {
      cardStyle = 'bg-rose-50/90 border-l-4 border-rose-500 text-rose-950 hover:bg-rose-100/90';
      badgeColor = 'text-rose-700';
    } else if (task.priority === 'medium') {
      cardStyle = 'bg-amber-50/90 border-l-4 border-amber-500 text-amber-950 hover:bg-amber-100/90';
      badgeColor = 'text-amber-700';
    } else if (task.priority === 'low') {
      cardStyle = 'bg-emerald-50/90 border-l-4 border-emerald-500 text-emerald-950 hover:bg-emerald-100/90';
      badgeColor = 'text-emerald-700';
    }

    return {
      id: task.id,
      title: task.title,
      category: project?.name || 'General',
      time: `${startHour}:00 - ${startHour + 1}:00`,
      dayIndex,
      startHour,
      durationHours: 1,
      cardStyle,
      badgeColor,
      assignees: assignee ? [assignee.avatar] : []
    };
  });

  // Helper calculation for vertical grid placement
  // Each hour block has a height of 72px (h-18)
  const calculateTopOffset = (startHour: number) => {
    return (startHour - 8) * 72; // 8 AM is 0px
  };

  const calculateCardHeight = (durationHours: number) => {
    return durationHours * 72 - 6; // Subtract 6px for margin gap
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-[1500px] mx-auto w-full min-w-0 select-none">
      
      {/* 1. Page Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title font-bold text-3xl sm:text-4xl text-zinc-950 tracking-tight">
            Calendar
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-1">
            Plan your time, stay in sync, and never miss what matters.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateTaskModalOpen(true)}
            className="bg-zinc-950 text-white rounded-full px-4 sm:px-5 py-2.5 font-semibold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>

          <button className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border border-zinc-200/90 bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Navigation Controls Bar (Date range, Navigation, View Toggles) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left Side: Today Button, Prev/Next Arrows, Current Month Title */}
        <div className="flex items-center gap-3 flex-wrap">
          <button className="bg-white border border-zinc-200/90 hover:bg-zinc-50 text-zinc-800 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-2xs cursor-pointer">
            Today
          </button>

          <div className="flex items-center bg-white border border-zinc-200/90 rounded-xl overflow-hidden shadow-2xs">
            <button className="p-2 hover:bg-zinc-50 text-zinc-600 border-r border-zinc-200/80 transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-zinc-50 text-zinc-600 transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="font-serif-title font-extrabold text-xl text-zinc-950 ml-1 tracking-tight">
            {currentMonth}
          </h2>
        </div>

        {/* Right Side: View Switcher (Day, Week, Month) & Filter Button */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Day / Week / Month Toggle Group */}
          <div className="flex items-center gap-1 bg-white border border-zinc-200/90 p-1 rounded-2xl shadow-2xs">
            {(['Day', 'Week', 'Month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-blue-600/10 text-blue-700 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 bg-white border border-zinc-200/90 hover:bg-zinc-50 px-4 py-2 rounded-2xl text-xs font-semibold text-zinc-700 transition-all shadow-2xs cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span>Filter</span>
          </button>
        </div>

      </div>

      {/* 3. Main Split View: Left Schedule Grid (2/3) + Right Widgets Column (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: Main Schedule Viewport (8 Columns on lg) */}
        <div className="lg:col-span-8 bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
          
          {/* Schedule Subheader Date Range */}
          <div className="px-6 py-4 border-b border-zinc-200/80 bg-zinc-50/40 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
              Sep 14 – 20, 2026
            </h3>
          </div>

          {/* Schedule Week Viewport Container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[850px] relative">
            <div className="min-w-[700px]">
              
              {/* Days Header Bar */}
              <div className="grid grid-cols-8 border-b border-zinc-200/80 sticky top-0 bg-white/95 backdrop-blur-md z-10">
                {/* Empty corner cell above time column */}
                <div className="p-3 border-r border-zinc-200/60 text-center text-xs font-semibold text-zinc-400" />

                {/* 7 Day Column Headers */}
                {weekDays.map((d, index) => (
                  <div
                    key={index}
                    className={`p-3 text-center border-r border-zinc-200/60 last:border-r-0 ${
                      d.isToday ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <span className="text-[11px] font-bold text-zinc-400 uppercase block">
                      {d.day}
                    </span>
                    <div className="mt-1 flex items-center justify-center">
                      {d.isToday ? (
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            {d.date}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1" />
                        </div>
                      ) : (
                        <span className="font-bold text-sm text-zinc-800">
                          {d.date}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots & Event Placement Grid */}
              <div className="relative grid grid-cols-8">
                
                {/* Column 1: Time Labels */}
                <div className="divide-y divide-zinc-100 border-r border-zinc-200/60 bg-zinc-50/30">
                  {timeSlots.map((time, idx) => (
                    <div key={idx} className="h-[72px] pr-3 text-right text-[11px] font-semibold text-zinc-400 pt-1">
                      {time}
                    </div>
                  ))}
                </div>

                {/* Columns 2-8: 7 Day Slots Grid Background Lines */}
                <div className="col-span-7 grid grid-cols-7 relative divide-x divide-zinc-200/60">
                  {weekDays.map((d, idx) => (
                    <div key={idx} className="relative divide-y divide-zinc-100 min-h-[792px]">
                      {timeSlots.map((_, timeIdx) => (
                        <div key={timeIdx} className="h-[72px] hover:bg-zinc-50/50 transition-colors" />
                      ))}
                    </div>
                  ))}

                  {/* Absolute Positioned Events Layer */}
                  <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
                    {weekDays.map((d, dayIdx) => {
                      const dayEvents = events.filter((e) => e.dayIndex === dayIdx);
                      return (
                        <div key={dayIdx} className="relative h-full px-1">
                          {dayEvents.map((event) => {
                            const topOffset = calculateTopOffset(event.startHour);
                            const cardHeight = calculateCardHeight(event.durationHours);

                            return (
                              <div
                                key={event.id}
                                onClick={() => setSelectedTaskIdForModal(event.id)}
                                style={{
                                  top: `${topOffset}px`,
                                  height: `${cardHeight}px`
                                }}
                                className={`absolute left-1 right-1 rounded-xl p-2.5 shadow-2xs pointer-events-auto transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${event.cardStyle}`}
                              >
                                <div>
                                  <div className="flex items-center justify-between text-[10px] font-bold tracking-tight opacity-80 mb-0.5">
                                    <span>{event.time}</span>
                                  </div>
                                  <h4 className="font-bold text-xs leading-snug line-clamp-1">
                                    {event.title}
                                  </h4>
                                  <p className={`text-[10px] font-semibold line-clamp-1 ${event.badgeColor}`}>
                                    {event.category}
                                  </p>
                                </div>

                                {/* Assignee Avatars */}
                                {event.assignees.length > 0 && (
                                  <div className="flex items-center -space-x-1.5 pt-1">
                                    {event.assignees.map((img, imgIdx) => (
                                      <img
                                        key={imgIdx}
                                        src={img}
                                        alt="Assignee"
                                        className="w-5 h-5 rounded-full ring-1 ring-white object-cover"
                                      />
                                    ))}
                                    {event.assignees.length > 2 && (
                                      <span className="text-[9px] font-bold text-zinc-600 pl-1">
                                        +2
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Widgets Column (4 Columns on lg) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: Mini Month Datepicker Widget */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 shadow-xs select-none">
            {/* Widget Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-title font-extrabold text-lg text-zinc-950 tracking-tight">
                September 2026
              </h3>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-zinc-400 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            {/* Dates Grid (September 2026) */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-zinc-700">
              {/* Previous month days: 31 */}
              <span className="p-2 text-zinc-300">31</span>

              {/* September Days 1 - 30 */}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((dateNum) => {
                const isSelected = dateNum === selectedMiniDate;
                return (
                  <button
                    key={dateNum}
                    onClick={() => setSelectedMiniDate(dateNum)}
                    className={`p-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center mx-auto w-7 h-7 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'hover:bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    {dateNum}
                  </button>
                );
              })}

              {/* Next month days: 1 - 4 */}
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className="p-2 text-zinc-300">
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Widget 2: Today's Schedule Widget */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="font-serif-title font-extrabold text-lg text-zinc-950 tracking-tight">
                Today's Schedule
              </h3>
              <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-200/60">
                Tue, Sep 15
              </span>
            </div>

            {/* List of Today's Timeline Events */}
            <div className="space-y-4 pt-1">
              
              {/* Timeline Item 1 */}
              <div className="flex items-start justify-between p-3 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 transition-all cursor-pointer group">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 block">
                      10:00 - 11:00
                    </span>
                    <h4 className="font-bold text-xs text-zinc-900 group-hover:text-blue-600 transition-colors">
                      Product Sync
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Mobile Application
                    </p>
                  </div>
                </div>

                <div className="flex items-center -space-x-1.5">
                  <img src={avatars[0]} alt="Member" className="w-6 h-6 rounded-full ring-1 ring-white object-cover" />
                  <img src={avatars[2]} alt="Member" className="w-6 h-6 rounded-full ring-1 ring-white object-cover" />
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex items-start justify-between p-3 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 transition-all cursor-pointer group">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-blue-700 block">
                      1:00 - 2:00
                    </span>
                    <h4 className="font-bold text-xs text-zinc-900 group-hover:text-blue-600 transition-colors">
                      UX Workshop
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Design System
                    </p>
                  </div>
                </div>

                <div className="flex items-center -space-x-1.5">
                  <img src={avatars[1]} alt="Member" className="w-6 h-6 rounded-full ring-1 ring-white object-cover" />
                  <img src={avatars[3]} alt="Member" className="w-6 h-6 rounded-full ring-1 ring-white object-cover" />
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="flex items-start justify-between p-3 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 transition-all cursor-pointer group">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 block">
                      3:30 - 5:00
                    </span>
                    <h4 className="font-bold text-xs text-zinc-900 group-hover:text-blue-600 transition-colors">
                      Development Review
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Mobile Application
                    </p>
                  </div>
                </div>

                <div className="flex items-center -space-x-1.5">
                  <img src={avatars[0]} alt="Member" className="w-6 h-6 rounded-full ring-1 ring-white object-cover" />
                  <img src={avatars[1]} alt="Member" className="w-6 h-6 rounded-full ring-1 ring-white object-cover" />
                </div>
              </div>

            </div>

          </div>

          {/* Widget 3: Quick Actions Menu Widget */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
            <h3 className="font-serif-title font-extrabold text-lg text-zinc-950 tracking-tight">
              Quick Actions
            </h3>

            <div className="space-y-2">
              
              <button className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:shadow-2xs text-xs font-semibold text-zinc-800 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white border border-zinc-200/80 text-zinc-600 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <span>Schedule a meeting</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
              </button>

              <button
                onClick={() => setCreateTaskModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:shadow-2xs text-xs font-semibold text-zinc-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white border border-zinc-200/80 text-zinc-600 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <span>Create a task</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:shadow-2xs text-xs font-semibold text-zinc-800 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white border border-zinc-200/80 text-zinc-600 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>View upcoming deadlines</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
              </button>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
