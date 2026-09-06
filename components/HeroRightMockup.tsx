'use client';

import React, { useState } from 'react';
import {
  Home,
  Folder,
  CheckSquare,
  Calendar,
  Activity,
  Users,
  Plus,
  Bell,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Search,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Annotations } from './Annotations';

export function HeroRightMockup() {
  // State for active sidebar workspace selection
  const [activeWorkspace, setActiveWorkspace] = useState('Product Launch');
  
  // State for task notification card
  const [notificationsVisible, setNotificationsVisible] = useState(true);

  // Sample tasks per workspace
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Brand Guidelines',
      column: 'todo',
      tag: 'Design',
      tagBg: 'bg-rose-100 text-rose-700',
      subtasks: '2/4',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      ]
    },
    {
      id: 2,
      title: 'Homepage Redesign',
      column: 'in-progress',
      tag: 'Product',
      tagBg: 'bg-blue-100 text-blue-700',
      subtasks: '5/8',
      avatars: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
      ]
    },
    {
      id: 3,
      title: 'Mobile Navigation',
      column: 'in-progress',
      tag: 'UX Wireframe',
      tagBg: 'bg-amber-100 text-amber-800',
      subtasks: '1/3',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
      ]
    },
    {
      id: 4,
      title: 'Design System V2',
      column: 'review',
      tag: 'System',
      tagBg: 'bg-emerald-100 text-emerald-800',
      subtasks: '3/3',
      avatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      ]
    },
    {
      id: 5,
      title: 'Q3 Goals & Milestones',
      column: 'done',
      tag: 'Planning',
      tagBg: 'bg-zinc-100 text-zinc-700',
      subtasks: '4/4',
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
      ]
    }
  ]);

  // Sidebar Workspace list
  const workspaces = [
    { name: 'Product Launch', color: 'bg-rose-500' },
    { name: 'Marketing', color: 'bg-amber-500' },
    { name: 'Design', color: 'bg-purple-500' },
    { name: 'Development', color: 'bg-emerald-500' },
  ];

  // Helper to add a quick interactive task
  const handleAddTask = (column: string) => {
    const title = prompt('Enter task name:');
    if (!title) return;
    const newTask = {
      id: Date.now(),
      title,
      column,
      tag: activeWorkspace,
      tagBg: 'bg-blue-100 text-blue-700',
      subtasks: '0/1',
      avatars: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80']
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-2xl lg:max-w-none mx-auto pt-6 pb-12 select-none"
    >
      {/* Handdrawn Script Annotations Overlay */}
      <Annotations />

      {/* Warm Yellow Backdrop Shape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[115%] bg-[#FEF0B2] rounded-[40%] blur-xl opacity-80 -z-20 pointer-events-none" />

      {/* MAIN WORKSPACE MOCKUP WINDOW */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-300 shadow-2xl overflow-hidden z-10 transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
        
        {/* WINDOW HEADER BAR */}
        <div className="bg-zinc-100/90 border-b border-zinc-200/80 px-4 py-2.5 flex items-center justify-between text-xs text-zinc-600">
          {/* Window dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          {/* Window Center Title & Logo */}
          <div className="flex items-center gap-2 font-medium text-zinc-700">
            <span className="font-serif-title font-bold text-zinc-900 tracking-tight text-xs">
              WORKROOM.
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-800 font-semibold">{activeWorkspace}</span>
          </div>

          {/* Right window icons */}
          <div className="flex items-center gap-2 text-zinc-400">
            <Search className="w-3.5 h-3.5 hover:text-zinc-700 cursor-pointer transition-colors" />
            <MoreHorizontal className="w-3.5 h-3.5 hover:text-zinc-700 cursor-pointer transition-colors" />
          </div>
        </div>

        {/* WINDOW BODY - TWO COLUMN LAYOUT */}
        <div className="flex min-h-[380px] sm:min-h-[420px] text-zinc-800 bg-white">
          
          {/* LEFT SIDEBAR */}
          <div className="w-40 sm:w-48 bg-zinc-50/80 border-r border-zinc-200/80 p-3 flex flex-col gap-5 text-xs">
            {/* Main Navigation List */}
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900 transition-colors">
                <Folder className="w-3.5 h-3.5" />
                <span>Projects</span>
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900 transition-colors">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tasks</span>
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900 transition-colors">
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900 transition-colors">
                <Activity className="w-3.5 h-3.5" />
                <span>Activity</span>
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900 transition-colors">
                <Users className="w-3.5 h-3.5" />
                <span>Members</span>
              </button>
            </div>

            {/* Workspaces Section */}
            <div>
              <div className="px-2.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Workspaces
              </div>
              <div className="space-y-1">
                {workspaces.map((ws) => {
                  const isActive = activeWorkspace === ws.name;
                  return (
                    <button
                      key={ws.name}
                      onClick={() => setActiveWorkspace(ws.name)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-zinc-600 hover:bg-zinc-200/40 hover:text-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full ${ws.color}`} />
                        <span className="truncate">{ws.name}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN KANBAN BOARD CONTENT */}
          <div className="flex-1 p-4 bg-white overflow-x-auto">
            {/* Board Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-serif-title font-bold text-lg text-zinc-900">
                  {activeWorkspace}
                </span>
                <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-medium">
                  {tasks.length} tasks
                </span>
              </div>
              
              <button
                onClick={() => handleAddTask('todo')}
                className="text-xs font-medium text-zinc-700 hover:text-zinc-950 flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200/70 px-2.5 py-1 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New task</span>
              </button>
            </div>

            {/* KANBAN COLUMNS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              
              {/* COLUMN 1: TO DO */}
              <div className="bg-zinc-50/70 rounded-xl p-2.5 border border-zinc-200/60 flex flex-col gap-2 min-h-[260px]">
                <div className="flex items-center justify-between font-medium text-zinc-500 pb-1 px-1">
                  <span>- To Do</span>
                  <button onClick={() => handleAddTask('todo')} className="hover:text-zinc-900">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {tasks
                  .filter((t) => t.column === 'todo')
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      className="bg-white p-2.5 rounded-lg border border-zinc-200/90 shadow-sm hover:shadow transition-shadow space-y-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${task.tagBg}`}>
                          {task.tag}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">{task.subtasks}</span>
                      </div>
                      <div className="font-medium text-zinc-800 text-xs leading-snug">{task.title}</div>
                      <div className="flex -space-x-1 pt-1">
                        {task.avatars.map((img, i) => (
                          <img key={i} src={img} alt="Assignee avatar" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full ring-1 ring-white object-cover" />
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* COLUMN 2: IN PROGRESS */}
              <div className="bg-zinc-50/70 rounded-xl p-2.5 border border-zinc-200/60 flex flex-col gap-2 min-h-[260px]">
                <div className="flex items-center justify-between font-medium text-zinc-500 pb-1 px-1">
                  <span>- In Progress</span>
                  <button onClick={() => handleAddTask('in-progress')} className="hover:text-zinc-900">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {tasks
                  .filter((t) => t.column === 'in-progress')
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      className="bg-white p-2.5 rounded-lg border border-zinc-200/90 shadow-sm hover:shadow transition-shadow space-y-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${task.tagBg}`}>
                          {task.tag}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">{task.subtasks}</span>
                      </div>
                      <div className="font-medium text-zinc-800 text-xs leading-snug">{task.title}</div>
                      <div className="flex -space-x-1 pt-1">
                        {task.avatars.map((img, i) => (
                          <img key={i} src={img} alt="Assignee avatar" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full ring-1 ring-white object-cover" />
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* COLUMN 3: REVIEW */}
              <div className="bg-zinc-50/70 rounded-xl p-2.5 border border-zinc-200/60 flex flex-col gap-2 min-h-[260px]">
                <div className="flex items-center justify-between font-medium text-zinc-500 pb-1 px-1">
                  <span>- Review</span>
                  <button onClick={() => handleAddTask('review')} className="hover:text-zinc-900">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {tasks
                  .filter((t) => t.column === 'review')
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      className="bg-white p-2.5 rounded-lg border border-zinc-200/90 shadow-sm hover:shadow transition-shadow space-y-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${task.tagBg}`}>
                          {task.tag}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">{task.subtasks}</span>
                      </div>
                      <div className="font-medium text-zinc-800 text-xs leading-snug">{task.title}</div>
                      <div className="flex -space-x-1 pt-1">
                        {task.avatars.map((img, i) => (
                          <img key={i} src={img} alt="Assignee avatar" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full ring-1 ring-white object-cover" />
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* COLUMN 4: DONE */}
              <div className="bg-zinc-50/70 rounded-xl p-2.5 border border-zinc-200/60 flex flex-col gap-2 min-h-[260px]">
                <div className="flex items-center justify-between font-medium text-zinc-500 pb-1 px-1">
                  <span>- Done</span>
                  <button onClick={() => handleAddTask('done')} className="hover:text-zinc-900">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {tasks
                  .filter((t) => t.column === 'done')
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      className="bg-white p-2.5 rounded-lg border border-zinc-200/90 shadow-sm hover:shadow transition-shadow space-y-2 cursor-pointer opacity-90"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${task.tagBg}`}>
                          {task.tag}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div className="font-medium text-zinc-800 text-xs leading-snug line-through text-zinc-400">
                        {task.title}
                      </div>
                    </motion.div>
                  ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- FLOATING NOTIFICATION CARD (Top Right) --- */}
      <AnimatePresence>
        {notificationsVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="absolute top-2 -right-2 sm:-right-6 lg:-right-8 bg-white/95 backdrop-blur-md rounded-xl border border-zinc-200/90 p-3 shadow-xl z-30 w-56 sm:w-64 space-y-2.5"
          >
            {/* Close button */}
            <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Notifications
              </span>
              <button
                onClick={() => setNotificationsVisible(false)}
                className="text-zinc-400 hover:text-zinc-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Notification Item 1 */}
            <div className="flex items-start gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Sarah avatar"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 text-xs">
                <div className="font-semibold text-zinc-900 leading-tight">Sarah mentioned you</div>
                <div className="text-[11px] text-zinc-500 leading-tight">in a comment</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">2m ago</div>
              </div>
            </div>

            {/* Notification Item 2 */}
            <div className="flex items-start gap-2.5 pt-1.5 border-t border-zinc-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Alex avatar"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 text-xs">
                <div className="font-semibold text-zinc-900 leading-tight">New task assigned</div>
                <div className="text-[11px] text-zinc-500 leading-tight">&quot;Design system&quot;</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">12m ago</div>
              </div>
            </div>

            {/* Notification Item 3 */}
            <div className="flex items-center gap-2 pt-1.5 border-t border-zinc-100 text-xs text-zinc-600 font-medium">
              <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center flex-shrink-0">
                <Bell className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-medium text-zinc-700">3 more notifications</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FLOATING TEAM CHIP (Far Right) --- */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute top-52 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md rounded-full border border-zinc-200/90 p-1.5 pr-3 shadow-lg z-30 flex items-center gap-2"
      >
        <div className="flex -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Team member 1"
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full ring-2 ring-white object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
            alt="Team member 2"
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full ring-2 ring-white object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
            alt="Team member 3"
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full ring-2 ring-white object-cover"
          />
        </div>
        <span className="text-xs font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded-full">
          +3
        </span>
      </motion.div>

      {/* --- SVG VECTOR LINE ART ILLUSTRATION AT BOTTOM OF MOCKUP --- */}
      <div className="mt-4 w-full h-48 sm:h-64 relative">
        <IllustrationGraphicSvg />
      </div>
    </motion.div>
  );
}

// Crisp Vector Ink Line Art Illustration
function IllustrationGraphicSvg() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 900 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Floor Line */}
      <path
        d="M 20 300 L 880 300"
        stroke="#18181B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* --- LEFT MONSTERA PLANT --- */}
      <g id="left-plant">
        {/* Pot */}
        <path
          d="M 120 230 L 130 295 C 130 298, 170 298, 170 295 L 180 230 Z"
          fill="#FFFFFF"
          stroke="#18181B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Pot Rim */}
        <ellipse cx="150" cy="230" rx="30" ry="6" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />

        {/* Stems & Leaves */}
        <path d="M 150 225 Q 120 160 80 140" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M 80 140 C 50 120, 40 160, 65 200 C 80 220, 120 210, 110 170 Z"
          fill="#FFFFFF"
          stroke="#18181B"
          strokeWidth="2.5"
        />
        <path d="M 80 160 L 60 155 M 85 175 L 65 180" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />

        {/* Middle Stem */}
        <path d="M 150 225 Q 140 120 110 80" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M 110 80 C 90 50, 130 40, 150 70 C 165 90, 150 130, 120 110 Z"
          fill="#FFFFFF"
          stroke="#18181B"
          strokeWidth="2.5"
        />

        {/* Right Stem */}
        <path d="M 150 225 Q 180 160 215 150" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M 215 150 C 240 140, 245 180, 210 210 C 180 225, 180 180, 215 150 Z"
          fill="#FFFFFF"
          stroke="#18181B"
          strokeWidth="2.5"
        />
      </g>

      {/* --- DESK AND LAPTOP --- */}
      <g id="desk-and-person">
        {/* Desk Surface */}
        <path d="M 320 270 L 780 270" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />

        {/* Coffee Mug */}
        <rect x="360" y="235" width="22" height="35" rx="3" fill="#18181B" stroke="#18181B" strokeWidth="2" />
        <path d="M 360 245 C 350 245, 350 260, 360 260" stroke="#18181B" strokeWidth="2.5" fill="none" />

        {/* Laptop */}
        <path d="M 400 270 L 480 270 L 470 210 L 400 210 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
        <circle cx="435" cy="235" r="5" fill="none" stroke="#18181B" strokeWidth="2" />
        <path d="M 432 237 Q 435 240 438 237" stroke="#18181B" strokeWidth="1.5" fill="none" />

        {/* Person Sitting */}
        <path
          d="M 420 270 C 400 280, 380 300, 480 300 C 530 300, 600 280, 610 250 Z"
          fill="#18181B"
          stroke="#18181B"
          strokeWidth="2"
        />

        {/* Shoes */}
        <path
          d="M 330 295 C 325 280, 360 265, 370 290 C 365 298, 335 300, 330 295 Z"
          fill="#FFFFFF"
          stroke="#18181B"
          strokeWidth="2.5"
        />

        {/* Torso */}
        <path
          d="M 480 250 C 480 190, 500 150, 545 150 C 580 150, 600 190, 590 250 Z"
          fill="#FFFFFF"
          stroke="#18181B"
          strokeWidth="2.5"
        />

        {/* Arm to cheek */}
        <path d="M 500 210 Q 515 225 530 170" stroke="#18181B" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Head */}
        <circle cx="535" cy="135" r="22" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
        <path
          d="M 520 125 C 520 105, 555 105, 550 130 C 560 120, 555 100, 535 100 C 515 100, 515 120, 520 125 Z"
          fill="#18181B"
        />
        <circle cx="527" cy="133" r="2" fill="#18181B" />
        <path d="M 523 141 Q 528 145 533 141" stroke="#18181B" strokeWidth="1.5" fill="none" />
      </g>

      {/* --- SLEEPING CAT --- */}
      <g id="sleeping-cat-scene">
        <path
          d="M 530 290 C 520 265, 570 250, 600 270 C 615 280, 610 300, 570 300 C 540 300, 535 295, 530 290 Z"
          fill="#FFFFFF"
          stroke="#18181B"
          strokeWidth="2.5"
        />
        <path d="M 600 285 C 620 290, 625 270, 610 265" stroke="#18181B" strokeWidth="2.5" fill="none" />
        <path d="M 540 270 L 545 260 L 552 268" stroke="#18181B" strokeWidth="2" fill="#18181B" />
      </g>

      {/* --- RIGHT PLANT ON BOOKS --- */}
      <g id="right-plant">
        <rect x="710" y="270" width="50" height="12" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
        <rect x="705" y="282" width="60" height="14" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
        <path d="M 720 235 L 725 270 L 745 270 L 750 235 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
        <path d="M 735 235 Q 710 210 700 225 Q 725 235 735 235 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
        <path d="M 735 235 Q 760 205 770 220 Q 745 235 735 235 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
      </g>
    </svg>
  );
}
