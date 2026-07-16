-- MAPC study-progress profiles and revision entries
-- Run this once in: Supabase Dashboard → SQL Editor → New query.

create table if not exists public.study_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.study_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null,
  status text not null default 'not-started'
    check (status in ('not-started', 'in-progress', 'done', 'revise', 'ignored')),
  note text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, item_key)
);

alter table public.study_profiles enable row level security;
alter table public.study_progress enable row level security;

drop policy if exists "Students can manage their own profile" on public.study_profiles;
create policy "Students can manage their own profile"
  on public.study_profiles for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Students can manage their own progress" on public.study_progress;
create policy "Students can manage their own progress"
  on public.study_progress for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
