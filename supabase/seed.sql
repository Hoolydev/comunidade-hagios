insert into public.courses
  (title, slug, description, thumbnail_url, category, is_published, is_featured)
values
  (
    'Marketing com IA do Zero',
    'marketing-com-ia-do-zero',
    'Aprenda como usar inteligência artificial para criar campanhas, conteúdos e estratégias de marketing.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    'Marketing com IA',
    true,
    true
  ),
  (
    'Automações para Vender Mais',
    'automacoes-para-vender-mais',
    'Crie fluxos inteligentes para atendimento, captação e vendas usando IA.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    'Automações',
    true,
    true
  ),
  (
    'Conteúdo e Criativos com IA',
    'conteudo-e-criativos-com-ia',
    'Use IA para criar posts, roteiros, anúncios, páginas e materiais comerciais.',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    'Criativos',
    true,
    false
  )
on conflict (slug) do nothing;

insert into public.lessons
  (course_id, title, description, youtube_url, youtube_video_id, video_format, order_index, is_published)
select
  c.id,
  'Como pensar campanhas com IA',
  'Uma primeira aula pratica para transformar briefing em campanha usando IA.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'desktop',
  1,
  true
from public.courses c
where c.slug = 'marketing-com-ia-do-zero'
on conflict do nothing;

insert into public.lessons
  (course_id, title, description, youtube_url, youtube_video_id, video_format, order_index, is_published)
select
  c.id,
  'Mapa simples de automação comercial',
  'Desenhe um fluxo de captação, atendimento e follow-up.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'desktop',
  1,
  true
from public.courses c
where c.slug = 'automacoes-para-vender-mais'
on conflict do nothing;

insert into public.materials
  (course_id, title, description, file_url, category, is_published)
select
  c.id,
  'Checklist de Prompt para Marketing',
  'Um roteiro para criar prompts melhores em campanhas reais.',
  'https://drive.google.com/',
  'Marketing com IA',
  true
from public.courses c
where c.slug = 'marketing-com-ia-do-zero'
on conflict do nothing;

insert into public.materials
  (title, description, file_url, category, is_published)
values
  (
    'Modelo de Planejamento de Campanha',
    'Template para organizar canais, oferta, criativos e metricas.',
    'https://notion.so/',
    'Estratégia',
    true
  ),
  (
    'Planilha de Ideias de Conteúdo',
    'Banco simples de ideias para posts, reels e emails.',
    'https://docs.google.com/spreadsheets/',
    'Criativos',
    true
  ),
  (
    'Guia Rápido de IA para Vendas',
    'Perguntas e prompts para atendimento e fechamento.',
    'https://dropbox.com/',
    'Vendas',
    true
  );

insert into public.settings (key, value)
values ('whatsapp_group_url', 'https://chat.whatsapp.com/LrjCUbrxG3HAcqQKbn2Ejv')
on conflict (key) do update set value = excluded.value;
