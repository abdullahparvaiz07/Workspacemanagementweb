-- Add missing INSERT policy for profiles to allow new users to create their profile
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
