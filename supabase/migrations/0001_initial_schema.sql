-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. WORKSPACES
create table public.workspaces (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  icon text,
  color text,
  owner_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. WORKSPACE MEMBERS
create type workspace_role as enum ('owner', 'admin', 'member', 'viewer');

create table public.workspace_members (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role workspace_role default 'viewer'::workspace_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(workspace_id, user_id)
);

-- 4. PROJECTS
create type project_status as enum ('active', 'archived', 'completed');

create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  description text,
  icon text,
  color text,
  status project_status default 'active'::project_status not null,
  created_by uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PROJECT MEMBERS
create type project_role as enum ('admin', 'member', 'viewer');

create table public.project_members (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role project_role default 'member'::project_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, user_id)
);

-- 6. TASKS
create type task_status as enum ('todo', 'in_progress', 'review', 'done');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');

create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  status task_status default 'todo'::task_status not null,
  priority task_priority default 'medium'::task_priority not null,
  assignee_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) not null,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. SUBTASKS
create table public.subtasks (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  title text not null,
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. COMMENTS
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. ACTIVITIES
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. NOTIFICATIONS
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  message text,
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. ATTACHMENTS
create table public.attachments (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  file_name text not null,
  file_url text not null,
  file_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. SETTINGS
create table public.workspace_settings (
  workspace_id uuid references public.workspaces(id) on delete cascade not null primary key,
  settings jsonb default '{}'::jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_settings (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  settings jsonb default '{}'::jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- SECURITY DEFINER FUNCTIONS (Prevents Infinite Recursion)
-- ==========================================
create or replace function public.is_workspace_member(ws_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.workspace_members 
    where workspace_id = ws_id 
    and user_id = auth.uid()
  );
end;
$$;

create or replace function public.is_workspace_admin(ws_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.workspace_members 
    where workspace_id = ws_id 
    and user_id = auth.uid()
    and role in ('owner', 'admin')
  );
end;
$$;

create or replace function public.is_workspace_owner(ws_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.workspaces 
    where id = ws_id 
    and owner_id = auth.uid()
  );
end;
$$;


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.subtasks enable row level security;
alter table public.comments enable row level security;
alter table public.activities enable row level security;
alter table public.notifications enable row level security;
alter table public.attachments enable row level security;
alter table public.workspace_settings enable row level security;
alter table public.user_settings enable row level security;

-- PROFILES
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- WORKSPACES
create policy "Users can view their workspaces" on public.workspaces for select using (
  owner_id = auth.uid() or public.is_workspace_member(id)
);
create policy "Any user can create a workspace" on public.workspaces for insert with check (auth.uid() = owner_id);
create policy "Workspace owners can update workspace" on public.workspaces for update using (owner_id = auth.uid() or public.is_workspace_admin(id));

-- WORKSPACE MEMBERS
create policy "View workspace members" on public.workspace_members for select using (
  user_id = auth.uid() or public.is_workspace_member(workspace_id) or public.is_workspace_owner(workspace_id)
);
create policy "Insert workspace members" on public.workspace_members for insert with check (
  user_id = auth.uid() or public.is_workspace_admin(workspace_id) or public.is_workspace_owner(workspace_id)
);
create policy "Update workspace members" on public.workspace_members for update using (
  public.is_workspace_admin(workspace_id) or public.is_workspace_owner(workspace_id)
);
create policy "Delete workspace members" on public.workspace_members for delete using (
  user_id = auth.uid() or public.is_workspace_admin(workspace_id) or public.is_workspace_owner(workspace_id)
);

-- PROJECTS
create policy "Users can view projects in their workspaces" on public.projects for select using (
  exists (select 1 from public.workspace_members where workspace_id = public.projects.workspace_id and user_id = auth.uid())
);
create policy "Users can create projects in their workspaces" on public.projects for insert with check (
  exists (select 1 from public.workspace_members where workspace_id = public.projects.workspace_id and user_id = auth.uid())
);

-- PROJECT MEMBERS
create policy "Users can view project members in their workspaces" on public.project_members for select using (
  exists (select 1 from public.projects p join public.workspace_members wm on p.workspace_id = wm.workspace_id where p.id = public.project_members.project_id and wm.user_id = auth.uid())
);

-- TASKS
create policy "Users can view tasks in their workspaces" on public.tasks for select using (
  exists (select 1 from public.projects p join public.workspace_members wm on p.workspace_id = wm.workspace_id where p.id = public.tasks.project_id and wm.user_id = auth.uid())
);
create policy "Users can manage tasks in their workspaces" on public.tasks for all using (
  exists (select 1 from public.projects p join public.workspace_members wm on p.workspace_id = wm.workspace_id where p.id = public.tasks.project_id and wm.user_id = auth.uid())
);

-- SUBTASKS
create policy "Users can view/manage subtasks in their workspaces" on public.subtasks for all using (
  exists (select 1 from public.tasks t join public.projects p on t.project_id = p.id join public.workspace_members wm on p.workspace_id = wm.workspace_id where t.id = public.subtasks.task_id and wm.user_id = auth.uid())
);

-- COMMENTS
create policy "Users can view/manage comments in their workspaces" on public.comments for all using (
  exists (select 1 from public.tasks t join public.projects p on t.project_id = p.id join public.workspace_members wm on p.workspace_id = wm.workspace_id where t.id = public.comments.task_id and wm.user_id = auth.uid())
);

-- ACTIVITIES
create policy "Users can view activities in their workspaces" on public.activities for select using (
  exists (select 1 from public.workspace_members wm where wm.workspace_id = public.activities.workspace_id and wm.user_id = auth.uid())
);

-- NOTIFICATIONS
create policy "Users can view their own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their own notifications" on public.notifications for update using (auth.uid() = user_id);

-- ATTACHMENTS
create policy "Users can view/manage attachments in their workspaces" on public.attachments for all using (
  exists (select 1 from public.tasks t join public.projects p on t.project_id = p.id join public.workspace_members wm on p.workspace_id = wm.workspace_id where t.id = public.attachments.task_id and wm.user_id = auth.uid())
);

-- WORKSPACE SETTINGS
create policy "Users can view settings of their workspaces" on public.workspace_settings for select using (
  exists (select 1 from public.workspace_members wm where wm.workspace_id = public.workspace_settings.workspace_id and wm.user_id = auth.uid())
);
create policy "Admins can update workspace settings" on public.workspace_settings for update using (
  exists (select 1 from public.workspace_members wm where wm.workspace_id = public.workspace_settings.workspace_id and wm.user_id = auth.uid() and wm.role in ('owner', 'admin'))
);

-- USER SETTINGS
create policy "Users can view/update their own settings" on public.user_settings for all using (auth.uid() = user_id);
