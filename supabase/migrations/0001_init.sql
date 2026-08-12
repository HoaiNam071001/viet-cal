-- Nhật Ký Lịch — initial schema
-- Run this once in the Supabase SQL Editor (or `supabase db push` if the
-- project is linked via the CLI).

-- ── users (profile, 1:1 with auth.users) ────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name varchar(100),
  avatar_url text,
  timezone varchar(50) not null default 'Asia/Ho_Chi_Minh',
  theme text not null default 'auto' check (theme in ('light', 'dark', 'auto')),
  language text not null default 'vi' check (language in ('vi', 'en')),
  default_mood_emoji varchar(10) not null default '😊',
  show_calendar_on_diary boolean not null default true,
  diary_sort_order text not null default 'newest' check (diary_sort_order in ('newest', 'oldest')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── diary_categories ─────────────────────────────────────────────────────
create table if not exists public.diary_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name varchar(100) not null,
  color varchar(20),
  emoji varchar(10),
  icon_name varchar(50),
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

-- ── diary_entries ─────────────────────────────────────────────────────────
create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  date date not null,
  title varchar(200),
  content text,
  mood_emoji varchar(10),
  mood_intensity int check (mood_intensity between 1 and 5),
  color_tag varchar(20),
  location varchar(150),
  weather varchar(50),
  temperature int,
  category_id uuid references public.diary_categories (id) on delete set null,
  tags text[] not null default '{}',
  images jsonb not null default '[]',
  is_private boolean not null default true,
  shared_with uuid[] not null default '{}',
  share_link text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── diary_templates ───────────────────────────────────────────────────────
create table if not exists public.diary_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name varchar(100) not null,
  prompt_questions text[] not null default '{}',
  default_category_id uuid references public.diary_categories (id) on delete set null,
  default_mood_emoji varchar(10),
  is_favorite boolean not null default false,
  usage_count int not null default 0,
  created_at timestamptz not null default now()
);

-- ── diary_stats (cached analytics) ──────────────────────────────────────
create table if not exists public.diary_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  year int not null,
  month int not null,
  total_entries int not null default 0,
  avg_mood_score decimal(3, 2),
  most_common_mood varchar(10),
  most_active_category_id uuid references public.diary_categories (id) on delete set null,
  streak_current int not null default 0,
  streak_longest int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, year, month)
);

-- ── indexes ──────────────────────────────────────────────────────────────
create index if not exists idx_diary_entries_user_date on public.diary_entries (user_id, date);
create index if not exists idx_diary_entries_user_created on public.diary_entries (user_id, created_at desc);
create index if not exists idx_diary_categories_user on public.diary_categories (user_id);
create index if not exists idx_diary_templates_user on public.diary_templates (user_id);

-- ── auto-create a profile row when a new auth user signs up ────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- keep `updated_at` current on update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.users;
create trigger set_updated_at before update on public.users
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.diary_entries;
create trigger set_updated_at before update on public.diary_entries
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.diary_stats;
create trigger set_updated_at before update on public.diary_stats
  for each row execute function public.set_updated_at();

-- ── row level security ───────────────────────────────────────────────────
alter table public.users enable row level security;
alter table public.diary_categories enable row level security;
alter table public.diary_entries enable row level security;
alter table public.diary_templates enable row level security;
alter table public.diary_stats enable row level security;

create policy "Users see own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users manage own categories" on public.diary_categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Diary entries: owner always; others only via explicit share (link or shared_with)
create policy "Users read own or shared entries" on public.diary_entries
  for select using (
    auth.uid() = user_id
    or auth.uid() = any (shared_with)
    or share_link is not null
  );
create policy "Users insert own entries" on public.diary_entries
  for insert with check (auth.uid() = user_id);
create policy "Users update own entries" on public.diary_entries
  for update using (auth.uid() = user_id);
create policy "Users delete own entries" on public.diary_entries
  for delete using (auth.uid() = user_id);

create policy "Users manage own templates" on public.diary_templates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own stats" on public.diary_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
