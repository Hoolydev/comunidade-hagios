-- Aulas com conteúdo escrito (texto) além de vídeo do YouTube.
-- Seguro para rodar em bancos já existentes.

alter table public.lessons
  add column if not exists content_type text not null default 'video',
  add column if not exists body text,
  -- Gotejamento opcional: a aula só fica liberada para o membro a partir desta data.
  add column if not exists available_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'lessons_content_type_check'
  ) then
    alter table public.lessons
    add constraint lessons_content_type_check
    check (content_type in ('video', 'text'));
  end if;
end $$;

-- Aulas de texto não têm vídeo: permitir vazio nas colunas do YouTube.
alter table public.lessons alter column youtube_url drop not null;
alter table public.lessons alter column youtube_video_id drop not null;
