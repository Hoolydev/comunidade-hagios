alter table public.movement_posts
add column if not exists cover_url text;

alter table public.assistant_drafts
add column if not exists cover_url text;
