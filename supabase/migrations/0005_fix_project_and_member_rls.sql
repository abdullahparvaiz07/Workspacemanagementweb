-- Fix RLS Policies for projects and project_members

-- 1. PROJECTS: Allow update and delete for workspace members / project creators / admins
drop policy if exists "Users can update projects in their workspaces" on public.projects;
drop policy if exists "Users can delete projects in their workspaces" on public.projects;

create policy "Users can update projects in their workspaces" on public.projects
for update using (
  exists (
    select 1 from public.workspace_members wm 
    where wm.workspace_id = public.projects.workspace_id 
    and wm.user_id = auth.uid()
  )
);

create policy "Users can delete projects in their workspaces" on public.projects
for delete using (
  created_by = auth.uid() or 
  exists (
    select 1 from public.workspace_members wm 
    where wm.workspace_id = public.projects.workspace_id 
    and wm.user_id = auth.uid() 
    and wm.role in ('owner', 'admin')
  )
);

-- 2. PROJECT MEMBERS: Add complete SELECT, INSERT, UPDATE, DELETE policies
drop policy if exists "Users can view project members in their workspaces" on public.project_members;
drop policy if exists "Users can insert project members in their workspaces" on public.project_members;
drop policy if exists "Users can update project members in their workspaces" on public.project_members;
drop policy if exists "Users can delete project members in their workspaces" on public.project_members;

-- SELECT
create policy "Users can view project members in their workspaces" on public.project_members
for select using (
  exists (
    select 1 from public.projects p 
    join public.workspace_members wm on p.workspace_id = wm.workspace_id 
    where p.id = public.project_members.project_id 
    and wm.user_id = auth.uid()
  )
);

-- INSERT (Allow inserting project members if user is a member of the workspace)
create policy "Users can insert project members in their workspaces" on public.project_members
for insert with check (
  exists (
    select 1 from public.projects p 
    join public.workspace_members wm on p.workspace_id = wm.workspace_id 
    where p.id = public.project_members.project_id 
    and wm.user_id = auth.uid()
  )
);

-- UPDATE
create policy "Users can update project members in their workspaces" on public.project_members
for update using (
  exists (
    select 1 from public.projects p 
    join public.workspace_members wm on p.workspace_id = wm.workspace_id 
    where p.id = public.project_members.project_id 
    and wm.user_id = auth.uid()
  )
);

-- DELETE
create policy "Users can delete project members in their workspaces" on public.project_members
for delete using (
  user_id = auth.uid() or 
  exists (
    select 1 from public.projects p 
    join public.workspace_members wm on p.workspace_id = wm.workspace_id 
    where p.id = public.project_members.project_id 
    and wm.user_id = auth.uid()
  )
);
