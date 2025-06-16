-- Create audit_logs table
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  event_type text not null,
  event_data jsonb not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.audit_logs enable row level security;

-- Create policies for RLS
create policy "Enable read access for authenticated users"
on public.audit_logs
for select
using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users"
on public.audit_logs
for insert
with check (auth.role() = 'authenticated');

-- Create index for better query performance
create index if not exists idx_audit_logs_user_id on public.audit_logs (user_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at);
create index if not exists idx_audit_logs_event_type on public.audit_logs (event_type);
