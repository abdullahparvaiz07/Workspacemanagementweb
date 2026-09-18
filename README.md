<div align="center">

# 🏛️ WORKROOM
### *The Digital Studio for Modern Teams*

**Projects, tasks, people, and ideas — brought together in one beautifully organized, real-time collaborative workspace.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_15-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-764ABC?style=for-the-badge)](https://github.com/pmndrs/zustand)

</div>

---

## 📖 Table of Contents
1. [Overview & Vision](#-overview--vision)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [System Architecture](#-system-architecture)
5. [Database Schema & Security (RLS)](#-database-schema--security-rls)
6. [Real-time & Offline-First Engine](#-real-time--offline-first-engine)
7. [Project Structure](#-project-structure)
8. [Getting Started](#-getting-started)
9. [Available Scripts](#-available-scripts)
10. [License](#-license)

---

## 🌟 Overview & Vision

**Workroom** is a full-stack, enterprise-ready collaborative project management platform built from the ground up for modern product, engineering, design, and marketing teams. It combines the power of real-time WebSocket synchronization, role-based multi-tenancy, interactive drag-and-drop physics, and offline-first data caching into a bespoke **warm editorial user experience**.

---

## ✨ Key Features

### 🏢 1. Multi-Tenant Workspaces & RBAC
- Create, manage, and switch seamlessly between multiple organization workspaces.
- Fine-grained **Role-Based Access Control (RBAC)**: `Owner`, `Admin`, `Member`, `Viewer`.
- Real-time team presence indicator showing who is currently online in the workspace.

### 📋 2. Interactive Drag-and-Drop Kanban Board
- Powered by `@dnd-kit` with touch & pointer sensors for smooth drag physics.
- Categorized status lanes: **To Do**, **In Progress**, **Review**, and **Done**.
- Real-time column metrics, priority badges (`Low`, `Medium`, `High`, `Urgent`), due date tags, and assignee avatars.

### 📁 3. Project Hub & Instant Templates
- Project categorization, progress metrics calculated in real-time, custom hex color badges, and starring.
- **5 Built-in Workflow Templates**:
  - 📄 **Blank Project**: Clean canvas for custom workflows.
  - 🚀 **Website Launch (4 Starter Tasks)**: Design mockups, Next.js setup, copywriting, QA testing.
  - ⚡ **Engineering Sprint (4 Starter Tasks)**: API contracts, backend endpoints, state listeners, code reviews.
  - 📣 **Marketing Campaign (3 Starter Tasks)**: Audience segmentation, creative assets, launch announcements.
  - 🎨 **Design System & UI Kit (3 Starter Tasks)**: Component audits, token definitions, Figma guidelines.
- Dedicated dynamic route `/projects/[projectId]` with project-level membership assignment and role delegation.

### 🔍 4. Global Command Palette (`⌘K` / `Ctrl+K`)
- Instant fuzzy search across Projects, Tasks, and Workspace Members.
- Quick navigation shortcuts and executable actions (Create Task, Create Project, Toggle Dark/Light Mode).

### 📅 5. Interactive Calendar & Timeline View
- Month, Week, and Day views mapping scheduled project tasks and milestones.
- Direct click-to-view task inspector modal.

### 📜 6. Activity Audit Logs & Personal Notifications
- Real-time workspace activity feed recording all creations, status changes, and comments.
- Notification bell inbox with unread badges, mark-all-as-read, and real-time push alerts.

### 💬 7. Task Inspector, Subtasks & File Attachments
- Nested subtasks checklist with instant progress computation.
- Collaborative comment threads with author profiles and relative timestamps (`date-fns`).
- File attachments stored securely in Supabase Storage (`attachments` bucket).

### 📶 8. Offline-First Synchronization
- Detects network disconnects and maintains full UI reactivity.
- Queues offline mutations (`CREATE_TASK`, `UPDATE_TASK`, `DELETE_TASK`) in indexed `localStorage`.
- Automatically synchronizes and reconciles queued data when the network is restored.

### 🎨 9. Editorial Warm Aesthetic & Dark Mode
- Curated aesthetic featuring warm bone tones (`#FAF7F2`), crisp typography, and stone/amber palettes.
- Flawless zero-flicker light and dark mode switching via `next-themes`.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** | Server & Client Components, Route Guards, SSR. |
| **UI Library** | **React 19** | Concurrent rendering, modern hooks, server integration. |
| **Language** | **TypeScript 5.9** | Strict end-to-end type safety & shared interfaces. |
| **Styling** | **Tailwind CSS v4 + PostCSS** | Modern utility-first design with custom CSS variables. |
| **State Management** | **Zustand + Redux Toolkit** | Reactive stores (`useTaskStore`, `useWorkspaceStore`, `useProjectStore`, `useOfflineStore`). |
| **Drag and Drop** | **@dnd-kit (Core, Sortable)** | Physics-based, accessible drag-and-drop Kanban engine. |
| **Database & Auth** | **Supabase (PostgreSQL 15)** | Relational DB, Auth Cookies (`@supabase/ssr`), Storage Buckets. |
| **Realtime Engine** | **Supabase Realtime (WebSockets)** | Presence channels, PostgreSQL Change Broadcasts, Notifications. |
| **Animations** | **Framer Motion / Motion** | Smooth modal animations, tab transitions, and layout micro-interactions. |
| **Icons & Toasts** | **Lucide React & Sonner** | Pixel-perfect icons and rich accessible toasts. |

---

## 🏗️ System Architecture

```
                                  [ CLIENT BROWSER ]
                                          │
                 ┌────────────────────────┴────────────────────────┐
                 ▼                                                 ▼
        [ Next.js Middleware ]                         [ Zustand / Redux Stores ]
   (Cookie-based Session Guard)                       (UI, Tasks, Auth, Offline)
                 │                                                 │
                 ▼                                                 │
      [ Next.js App Router ]                                       │
  ├── / (Landing Page)                                             │
  ├── /login (Auth Flow)                                           │
  ├── /dashboard (Overview, Kanban, Tasks,                         │
  │               Calendar, Activity, Members,                     │
  │               Settings, Analytics, Help)                       │
  └── /projects/[projectId] (Project Detail)                       │
                 │                                                 │
                 └────────────────────────┬────────────────────────┘
                                          │
                        ┌─────────────────┴─────────────────┐
                        ▼                                   ▼
              [ Supabase REST API ]               [ Supabase Realtime ]
              (CRUD, Auth, Storage)               (WebSockets Channels)
                        │                                   │
                        └─────────────────┬─────────────────┘
                                          ▼
                             [ PostgreSQL 15 + RLS ]
                   (Tables, Enum Types, Security Definers)
```

---

## 🗄️ Database Schema & Security (RLS)

### PostgreSQL Tables:
- **`profiles`**: Linked 1:1 to `auth.users` with `full_name`, `avatar_url`, and `email`.
- **`workspaces`**: Workspace root created by users (`owner_id`).
- **`workspace_members`**: Join table mapping `workspace_id` + `user_id` with `workspace_role` (`owner`, `admin`, `member`, `viewer`).
- **`projects`**: Project streams within a workspace (`status`, `color`, `icon`, `created_by`).
- **`project_members`**: Join table mapping `project_id` + `user_id` with `project_role` (`admin`, `member`, `viewer`).
- **`tasks`**: Work items (`status`, `priority`, `assignee_id`, `due_date`, `created_by`).
- **`subtasks`**: Checklist items linked 1:N to `tasks.id`.
- **`comments`**: Comment threads linked 1:N to `tasks.id`.
- **`activities`**: Workspace audit log recording events (`action`, `entity_type`, `entity_id`, `metadata`).
- **`notifications`**: Personal notifications linked to `user_id`.
- **`attachments`**: File metadata linked to `tasks.id` stored in Supabase Storage.

### 🛡️ Row Level Security (RLS):
Row Level Security is enabled on **all tables**. Security Definer functions (`is_workspace_member`, `is_workspace_admin`, `is_workspace_owner`) prevent infinite recursion and ensure zero unauthorized access across workspace tenants.

---

## ⚡ Real-Time & Offline-First Engine

1. **Presence Channel (`workspace_presence:{workspaceId}`)**:
   Tracks live active users in the current workspace.
2. **Database Change Stream (`db_changes:{workspaceId}`)**:
   Subscribes to PostgreSQL `INSERT`/`UPDATE`/`DELETE` triggers on `tasks`, `comments`, and `activities`.
3. **Personal Alert Channel (`notifications:{userId}`)**:
   Delivers live push notifications when mentioned or assigned a task.
4. **Offline Queue Sync (`useOfflineStore.ts`)**:
   Automatically intercepts disconnections, buffers mutations, and synchronizes with Supabase on reconnection.

---

## 📁 Project Structure

```text
workroom/
├── app/
│   ├── dashboard/
│   │   └── page.tsx            # Main authenticated dashboard (10 Views)
│   ├── login/
│   │   └── page.tsx            # Authentication page
│   ├── projects/
│   │   └── [projectId]/        # Dynamic project details & team management
│   ├── globals.css             # Tailwind v4 configuration & tokens
│   ├── layout.tsx              # Root layout with providers & preloader
│   └── page.tsx                # Marketing landing page
├── components/
│   ├── activity/               # Activity audit log components
│   ├── calendar/               # Interactive calendar view
│   ├── dashboard/              # Kanban board, Command Palette, Modals
│   ├── members/                # Workspace member management
│   ├── notifications/          # Notification inbox components
│   ├── projects/               # Projects grid, filter tabs, hero banner
│   ├── providers/              # Realtime & Keyboard shortcuts providers
│   ├── tasks/                  # Task view & table list
│   └── ui/                     # Preloader, Theme switcher, Toast containers
├── features/                   # Feature-sliced domain architecture
│   ├── auth/
│   ├── projects/
│   ├── tasks/
│   ├── workspaces/
│   ├── activities/
│   ├── notifications/
│   └── offline/
├── lib/
│   ├── redux/                  # Redux slices and local caching
│   ├── supabase/               # Client, server, and middleware helpers
│   └── utils.ts                # Class merging utilities
├── store/                      # Zustand reactive stores
├── supabase/
│   └── migrations/             # PostgreSQL migrations & RLS SQL scripts
└── types/                      # TypeScript schemas and database types
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.18.0` or higher
- **npm** or **pnpm** or **yarn**
- A **[Supabase](https://supabase.com/)** Project

### 1. Clone the Repository
```bash
git clone https://github.com/abdullahparvaiz07/Workspacemanagementweb.git
cd Workspacemanagementweb
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key_optional
```

### 4. Setup Database
Run the migration scripts located in `supabase/migrations/` sequentially in your **Supabase SQL Editor** to establish all tables, triggers, and Row Level Security policies.

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience Workroom!

---

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the production bundle.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint for code analysis.

---

## 👤 Author
- **Abdullah Parvaiz** — [@abdullahparvaiz07](https://github.com/abdullahparvaiz07)

---

<div align="center">
Built with ❤️ for modern agile teams.
</div>
