alter table public.lessons
add column if not exists video_format text not null default 'desktop';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'lessons_video_format_check'
  ) then
    alter table public.lessons
    add constraint lessons_video_format_check
    check (video_format in ('desktop', 'vertical'));
  end if;
end $$;
