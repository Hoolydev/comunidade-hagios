create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text,
  email text,
  company_role text,
  company_name text,
  company_sector text,
  phone text,
  city_state text,
  urgent_operation_1 text,
  urgent_operation_2 text,
  urgent_operation_3 text,
  role text not null default 'member' check (role in ('admin', 'member')),
  stripe_customer_id text unique,
  subscription_status text not null default 'none',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists company_role text;
alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists company_sector text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists city_state text;
alter table public.profiles add column if not exists urgent_operation_1 text;
alter table public.profiles add column if not exists urgent_operation_2 text;
alter table public.profiles add column if not exists urgent_operation_3 text;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  thumbnail_url text,
  category text not null,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  content_type text not null default 'video' check (content_type in ('video', 'text')),
  body text,
  youtube_url text,
  youtube_video_id text,
  video_format text not null default 'desktop' check (video_format in ('desktop', 'vertical')),
  order_index integer not null default 1,
  available_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete set null,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  description text,
  file_url text not null,
  category text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null default 'none',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.movement_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  subtitle text,
  body text not null,
  category text not null default 'Atualizações',
  tags text[] not null default '{}',
  source_name text,
  source_url text,
  cover_url text,
  status text not null default 'draft' check (status in ('published', 'draft', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assistant_drafts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  body text not null,
  category text not null default 'Atualizações',
  tags text[] not null default '{}',
  source_name text,
  source_url text,
  cover_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  review_token text not null unique,
  whatsapp_recipient text,
  whatsapp_sent_at timestamptz,
  approved_at timestamptz,
  rejected_at timestamptz,
  published_post_id uuid references public.movement_posts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_courses_updated_at on public.courses;
create trigger touch_courses_updated_at
before update on public.courses
for each row execute function public.touch_updated_at();

drop trigger if exists touch_lessons_updated_at on public.lessons;
create trigger touch_lessons_updated_at
before update on public.lessons
for each row execute function public.touch_updated_at();

drop trigger if exists touch_materials_updated_at on public.materials;
create trigger touch_materials_updated_at
before update on public.materials
for each row execute function public.touch_updated_at();

drop trigger if exists touch_settings_updated_at on public.settings;
create trigger touch_settings_updated_at
before update on public.settings
for each row execute function public.touch_updated_at();

drop trigger if exists touch_subscriptions_updated_at on public.subscriptions;
create trigger touch_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.touch_updated_at();

drop trigger if exists touch_movement_posts_updated_at on public.movement_posts;
create trigger touch_movement_posts_updated_at
before update on public.movement_posts
for each row execute function public.touch_updated_at();

drop trigger if exists touch_assistant_drafts_updated_at on public.assistant_drafts;
create trigger touch_assistant_drafts_updated_at
before update on public.assistant_drafts
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, name)
  values (new.id, new.email, split_part(new.email, '@', 1))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.materials enable row level security;
alter table public.settings enable row level security;
alter table public.subscriptions enable row level security;
alter table public.movement_posts enable row level security;
alter table public.assistant_drafts enable row level security;

drop policy if exists "profiles_read_own_or_admin" on public.profiles;
create policy "profiles_read_own_or_admin"
on public.profiles for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles for update
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "published_courses_read" on public.courses;
create policy "published_courses_read"
on public.courses for select
using (is_published = true or public.is_admin());

drop policy if exists "published_lessons_read" on public.lessons;
create policy "published_lessons_read"
on public.lessons for select
using (is_published = true or public.is_admin());

drop policy if exists "published_materials_read" on public.materials;
create policy "published_materials_read"
on public.materials for select
using (is_published = true or public.is_admin());

drop policy if exists "settings_read_admin" on public.settings;
create policy "settings_read_admin"
on public.settings for select
using (public.is_admin());

drop policy if exists "subscriptions_read_own_or_admin" on public.subscriptions;
create policy "subscriptions_read_own_or_admin"
on public.subscriptions for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "published_movement_posts_read" on public.movement_posts;
create policy "published_movement_posts_read"
on public.movement_posts for select
using (status = 'published' or public.is_admin());

drop policy if exists "assistant_drafts_read_admin" on public.assistant_drafts;
create policy "assistant_drafts_read_admin"
on public.assistant_drafts for select
using (public.is_admin());

insert into public.settings (key, value)
values ('whatsapp_group_url', 'https://chat.whatsapp.com/LrjCUbrxG3HAcqQKbn2Ejv')
on conflict (key) do nothing;
