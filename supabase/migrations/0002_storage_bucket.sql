-- Create a storage bucket for task attachments
insert into storage.buckets (id, name, public)
values ('task-attachments', 'task-attachments', true)
on conflict (id) do nothing;

-- Set up RLS for the storage bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'task-attachments' );

create policy "Authenticated users can upload attachments"
  on storage.objects for insert
  with check ( bucket_id = 'task-attachments' and auth.role() = 'authenticated' );

create policy "Users can update own attachments"
  on storage.objects for update
  using ( auth.uid() = owner and bucket_id = 'task-attachments' );

create policy "Users can delete own attachments"
  on storage.objects for delete
  using ( auth.uid() = owner and bucket_id = 'task-attachments' );
