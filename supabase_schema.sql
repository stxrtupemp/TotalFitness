-- ─────────────────────────────────────────────
-- TotalFitness — Supabase Schema
-- Run this in: Supabase > SQL Editor > New query
-- ─────────────────────────────────────────────

-- Enable UUID extension (usually enabled by default)
create extension if not exists "uuid-ossp";

-- ── USERS TABLE ──────────────────────────────
create table if not exists public.users (
  id    uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role  text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

-- ── SUBSCRIPTIONS TABLE ───────────────────────
create table if not exists public.subscriptions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  status     text not null default 'inactive' check (status in ('active', 'inactive')),
  plan       text not null default 'monthly'  check (plan   in ('monthly', 'annual')),
  start_date timestamptz,
  end_date   timestamptz,
  created_at timestamptz not null default now(),
  -- Only one subscription record per user (upserted on conflict)
  unique (user_id)
);

-- ── ROW LEVEL SECURITY ────────────────────────
alter table public.users         enable row level security;
alter table public.subscriptions enable row level security;

-- Users: read own row
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

-- Users: insert own row (triggered on signup)
create policy "users_insert_own"
  on public.users for insert
  with check (auth.uid() = id);

-- Users: admins can read all
create policy "users_admin_select_all"
  on public.users for select
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- Users: admins can update all
create policy "users_admin_update_all"
  on public.users for update
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- Users: admins can delete
create policy "users_admin_delete"
  on public.users for delete
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- Subscriptions: read own
create policy "subs_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Subscriptions: insert own
create policy "subs_insert_own"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

-- Subscriptions: update own
create policy "subs_update_own"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- Subscriptions: admin full access
create policy "subs_admin_all"
  on public.subscriptions for all
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- ── OPTIONAL: create first admin manually ─────
-- After registering via the app, run this to promote your account:
--
-- update public.users set role = 'admin' where email = 'tu@email.com';
