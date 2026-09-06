-- Fix infinite recursion in RLS by using SECURITY DEFINER functions across all workspace policies

-- 1. Create/Update SECURITY DEFINER functions (bypass RLS inside the function)
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

-- 2. Drop all old policies on workspace_members and workspaces
drop policy if exists "Users can view members of their workspaces" on public.workspace_members;
drop policy if exists "Workspace admins can manage members" on public.workspace_members;
drop policy if exists "View workspace members" on public.workspace_members;
drop policy if exists "Insert workspace members" on public.workspace_members;
drop policy if exists "Update workspace members" on public.workspace_members;
drop policy if exists "Delete workspace members" on public.workspace_members;

drop policy if exists "Users can view their workspaces" on public.workspaces;
drop policy if exists "Workspace owners can update workspace" on public.workspaces;
drop policy if exists "Any user can create a workspace" on public.workspaces;
drop policy if exists "Workspace owners can delete workspace" on public.workspaces;

-- 3. Re-create policies for workspaces
create policy "Users can view their workspaces" on public.workspaces 
for select using (
  owner_id = auth.uid() or public.is_workspace_member(id)
);

create policy "Any user can create a workspace" on public.workspaces 
for insert with check (
  auth.uid() = owner_id
);

create policy "Workspace owners can update workspace" on public.workspaces 
for update using (
  owner_id = auth.uid() or public.is_workspace_admin(id)
);

create policy "Workspace owners can delete workspace" on public.workspaces 
for delete using (
  owner_id = auth.uid()
);

-- 4. Re-create policies for workspace_members
create policy "View workspace members" on public.workspace_members 
for select using (
  user_id = auth.uid() or public.is_workspace_member(workspace_id) or public.is_workspace_owner(workspace_id)
);

create policy "Insert workspace members" on public.workspace_members 
for insert with check (
  user_id = auth.uid() or public.is_workspace_admin(workspace_id) or public.is_workspace_owner(workspace_id)
);

create policy "Update workspace members" on public.workspace_members 
for update using (
  public.is_workspace_admin(workspace_id) or public.is_workspace_owner(workspace_id)
);

create policy "Delete workspace members" on public.workspace_members 
for delete using (
  user_id = auth.uid() or public.is_workspace_admin(workspace_id) or public.is_workspace_owner(workspace_id)
);
