alter table if exists public.community_posts
  rename to movement_posts;

alter table if exists public.community_events
  rename to movement_events;

alter table if exists public.community_questions
  rename to movement_questions;
