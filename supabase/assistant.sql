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

drop trigger if exists touch_movement_posts_updated_at on public.movement_posts;
create trigger touch_movement_posts_updated_at
before update on public.movement_posts
for each row execute function public.touch_updated_at();

drop trigger if exists touch_assistant_drafts_updated_at on public.assistant_drafts;
create trigger touch_assistant_drafts_updated_at
before update on public.assistant_drafts
for each row execute function public.touch_updated_at();

alter table public.movement_posts enable row level security;
alter table public.assistant_drafts enable row level security;

drop policy if exists "published_movement_posts_read" on public.movement_posts;
create policy "published_movement_posts_read"
on public.movement_posts for select
using (status = 'published' or public.is_admin());

drop policy if exists "assistant_drafts_read_admin" on public.assistant_drafts;
create policy "assistant_drafts_read_admin"
on public.assistant_drafts for select
using (public.is_admin());
