-- CMS da comunidade: torna editável o conteúdo que antes era fixo no código
-- (Próximo passo, Eventos, Mentorias, Desafios, Ferramentas, Dúvidas).
-- Seguro para rodar em bancos já existentes.

create table if not exists public.next_actions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  href text not null default '/comunidade',
  label text not null default 'Abrir',
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  order_index integer not null default 1,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_events (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'Mentoria',
  title text not null,
  description text not null,
  date timestamptz not null default now(),
  href text not null default '/comunidade',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentorships (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  teacher text not null default 'Time Hágios',
  date timestamptz not null default now(),
  recording_url text,
  materials text[] not null default '{}',
  related_challenge text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  theme text not null,
  description text not null,
  objective text not null default '',
  days jsonb not null default '[]'::jsonb,
  material_url text not null default '',
  expected_result text not null default '',
  participants integer not null default 0,
  completion_rate integer not null default 0,
  ranking jsonb not null default '[]'::jsonb,
  published_at timestamptz not null default now(),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null default 'Ferramentas recomendadas',
  url text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'Jornada',
  author text not null default 'Membro da comunidade',
  answered_by text not null default 'Time Hágios',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Gatilhos de updated_at
drop trigger if exists touch_next_actions_updated_at on public.next_actions;
create trigger touch_next_actions_updated_at
before update on public.next_actions
for each row execute function public.touch_updated_at();

drop trigger if exists touch_community_events_updated_at on public.community_events;
create trigger touch_community_events_updated_at
before update on public.community_events
for each row execute function public.touch_updated_at();

drop trigger if exists touch_mentorships_updated_at on public.mentorships;
create trigger touch_mentorships_updated_at
before update on public.mentorships
for each row execute function public.touch_updated_at();

drop trigger if exists touch_challenges_updated_at on public.challenges;
create trigger touch_challenges_updated_at
before update on public.challenges
for each row execute function public.touch_updated_at();

drop trigger if exists touch_tools_updated_at on public.tools;
create trigger touch_tools_updated_at
before update on public.tools
for each row execute function public.touch_updated_at();

drop trigger if exists touch_community_questions_updated_at on public.community_questions;
create trigger touch_community_questions_updated_at
before update on public.community_questions
for each row execute function public.touch_updated_at();

-- RLS: leitura pública do que está publicado; admin enxerga tudo.
alter table public.next_actions enable row level security;
alter table public.community_events enable row level security;
alter table public.mentorships enable row level security;
alter table public.challenges enable row level security;
alter table public.tools enable row level security;
alter table public.community_questions enable row level security;

drop policy if exists "next_actions_read" on public.next_actions;
create policy "next_actions_read" on public.next_actions for select
using (is_published = true or public.is_admin());

drop policy if exists "community_events_read" on public.community_events;
create policy "community_events_read" on public.community_events for select
using (is_published = true or public.is_admin());

drop policy if exists "mentorships_read" on public.mentorships;
create policy "mentorships_read" on public.mentorships for select
using (is_published = true or public.is_admin());

drop policy if exists "challenges_read" on public.challenges;
create policy "challenges_read" on public.challenges for select
using (is_published = true or public.is_admin());

drop policy if exists "tools_read" on public.tools;
create policy "tools_read" on public.tools for select
using (is_published = true or public.is_admin());

drop policy if exists "community_questions_read" on public.community_questions;
create policy "community_questions_read" on public.community_questions for select
using (is_published = true or public.is_admin());

-- Conteúdo do banner "Aula de boas-vindas" (settings key/value).
insert into public.settings (key, value) values
  ('hero_welcome_eyebrow', 'Centro de evolução empresarial'),
  ('hero_welcome_label', 'Aula de boas-vindas'),
  ('hero_welcome_title', 'Reassista quando precisar'),
  ('hero_welcome_description', 'Um guia rápido para entender a Jornada Hágios, conteúdos vivos, mentorias, desafios e ferramentas.'),
  ('hero_welcome_video_url', 'https://www.youtube.com/watch?v=M7lc1UVf-VE')
on conflict (key) do nothing;
