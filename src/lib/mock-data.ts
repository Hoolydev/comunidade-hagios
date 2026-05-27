import type { Course, CourseWithLessons, Lesson, Material } from "@/lib/types";
export { categories } from "@/lib/constants";

const now = new Date().toISOString();

export const mockCourses: Course[] = [
  {
    id: "course-ai-zero",
    title: "Marketing com IA do Zero",
    slug: "marketing-com-ia-do-zero",
    description:
      "Monte sua base: como usar IA para pesquisar mercado, criar campanhas, estruturar ofertas e ganhar velocidade sem perder estratégia.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    category: "Marketing com IA",
    is_published: true,
    is_featured: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "course-automation",
    title: "Automações para Vender Mais",
    slug: "automacoes-para-vender-mais",
    description:
      "Crie fluxos simples para captação, atendimento, follow-up e recuperação de oportunidades usando IA e ferramentas acessíveis.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    category: "Automações",
    is_published: true,
    is_featured: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "course-creatives",
    title: "Conteúdo e Criativos com IA",
    slug: "conteudo-e-criativos-com-ia",
    description:
      "Transforme uma ideia em posts, roteiros, anúncios, páginas e materiais comerciais com um sistema de produção reaproveitável.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    category: "Criativos",
    is_published: true,
    is_featured: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "course-copy-ai",
    title: "Copywriting com IA para Ofertas",
    slug: "copywriting-com-ia-para-ofertas",
    description:
      "Use IA para transformar benefícios soltos em mensagens claras, CTAs melhores, páginas mais persuasivas e ofertas mais fáceis de entender.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    category: "Vendas",
    is_published: true,
    is_featured: false,
    created_at: now,
    updated_at: now,
  },
  {
    id: "course-traffic-ai",
    title: "Tráfego Pago com IA",
    slug: "trafego-pago-com-ia",
    description:
      "Planeje campanhas, varie ângulos criativos, organize testes e leia métricas com apoio de IA sem terceirizar o pensamento estratégico.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    category: "Tráfego Pago",
    is_published: true,
    is_featured: false,
    created_at: now,
    updated_at: now,
  },
  {
    id: "course-strategy-ai",
    title: "Estratégia de Crescimento com IA",
    slug: "estrategia-de-crescimento-com-ia",
    description:
      "Organize ideias, priorize ações e crie um plano de crescimento semanal para vender mais com menos dispersão.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    category: "Estratégia",
    is_published: true,
    is_featured: false,
    created_at: now,
    updated_at: now,
  },
];

export const mockLessons: Lesson[] = [
  {
    id: "lesson-ai-1",
    course_id: "course-ai-zero",
    title: "O mapa simples do Marketing com IA",
    description:
      "Entenda onde a IA entra no marketing: pesquisa, oferta, conteúdo, vendas e operação.",
    youtube_url: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    youtube_video_id: "M7lc1UVf-VE",
    order_index: 1,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-ai-2",
    course_id: "course-ai-zero",
    title: "Pesquisa de público em 20 minutos",
    description:
      "Use prompts para levantar dores, desejos, objeções e linguagem real do seu cliente.",
    youtube_url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    youtube_video_id: "jNQXAC9IVRw",
    order_index: 2,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-ai-3",
    course_id: "course-ai-zero",
    title: "Briefing que gera campanhas melhores",
    description:
      "Monte um briefing enxuto para a IA entregar ideias úteis, não respostas genéricas.",
    youtube_url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    youtube_video_id: "ysz5S6PUM-U",
    order_index: 3,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-auto-1",
    course_id: "course-automation",
    title: "Fluxo de captação sem complicar",
    description:
      "Desenhe um caminho simples do primeiro contato ao próximo passo com automações leves.",
    youtube_url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    youtube_video_id: "aqz-KE-bpKQ",
    order_index: 1,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-auto-2",
    course_id: "course-automation",
    title: "Follow-up inteligente para leads mornos",
    description:
      "Crie mensagens de retorno que retomam contexto, reduzem fricção e convidam para ação.",
    youtube_url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    youtube_video_id: "LXb3EKWsInQ",
    order_index: 2,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-auto-3",
    course_id: "course-automation",
    title: "Atendimento com IA sem parecer robô",
    description:
      "Estruture respostas, triagem e próximos passos mantendo tom humano e comercial.",
    youtube_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    youtube_video_id: "ScMzIvxBSi4",
    order_index: 3,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-creative-1",
    course_id: "course-creatives",
    title: "Uma ideia, dez conteúdos",
    description:
      "Transforme uma ideia central em carrossel, reels, email, anúncio e roteiro curto.",
    youtube_url: "https://www.youtube.com/watch?v=e-ORhEE9VVg",
    youtube_video_id: "e-ORhEE9VVg",
    order_index: 1,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-creative-2",
    course_id: "course-creatives",
    title: "Criativos que param o scroll",
    description:
      "Use estruturas de gancho, contraste e promessa para gerar peças mais fortes com IA.",
    youtube_url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    youtube_video_id: "kJQP7kiw5Fk",
    order_index: 2,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-creative-3",
    course_id: "course-creatives",
    title: "Calendário editorial reaproveitável",
    description:
      "Monte um sistema semanal de temas, formatos e chamadas para publicar com consistência.",
    youtube_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    youtube_video_id: "9bZkp7q19f0",
    order_index: 3,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-copy-1",
    course_id: "course-copy-ai",
    title: "Oferta clara vence copy bonita",
    description:
      "Use IA para organizar promessa, público, mecanismo, entrega e motivo para agir agora.",
    youtube_url: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    youtube_video_id: "M7lc1UVf-VE",
    order_index: 1,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-copy-2",
    course_id: "course-copy-ai",
    title: "CTAs que reduzem dúvida",
    description:
      "Troque botões genéricos por chamadas que deixam claro o próximo passo do usuário.",
    youtube_url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    youtube_video_id: "jNQXAC9IVRw",
    order_index: 2,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-copy-3",
    course_id: "course-copy-ai",
    title: "FAQ que vende sem parecer venda",
    description:
      "Responda objeções reais, elimine ruído e deixe a decisão mais simples.",
    youtube_url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    youtube_video_id: "ysz5S6PUM-U",
    order_index: 3,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-traffic-1",
    course_id: "course-traffic-ai",
    title: "Ângulos criativos para anúncios",
    description:
      "Gere variações de promessa, dor, prova e mecanismo para testar sem repetir campanha.",
    youtube_url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    youtube_video_id: "aqz-KE-bpKQ",
    order_index: 1,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-traffic-2",
    course_id: "course-traffic-ai",
    title: "Leitura de métricas com IA",
    description:
      "Transforme dados de campanha em hipóteses de melhoria para criativo, público e oferta.",
    youtube_url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    youtube_video_id: "LXb3EKWsInQ",
    order_index: 2,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-traffic-3",
    course_id: "course-traffic-ai",
    title: "Plano de testes de 7 dias",
    description:
      "Organize hipóteses, orçamento, criativos e critérios de decisão para uma semana de testes.",
    youtube_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    youtube_video_id: "ScMzIvxBSi4",
    order_index: 3,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-strategy-1",
    course_id: "course-strategy-ai",
    title: "Plano semanal de crescimento",
    description:
      "Crie uma rotina simples para escolher prioridades, produzir ativos e revisar resultados.",
    youtube_url: "https://www.youtube.com/watch?v=e-ORhEE9VVg",
    youtube_video_id: "e-ORhEE9VVg",
    order_index: 1,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-strategy-2",
    course_id: "course-strategy-ai",
    title: "Skill stack de marketing com IA",
    description:
      "Identifique as habilidades que mais aumentam seu valor: copy, análise, oferta, conteúdo e automação.",
    youtube_url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    youtube_video_id: "kJQP7kiw5Fk",
    order_index: 2,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "lesson-strategy-3",
    course_id: "course-strategy-ai",
    title: "Rotina de revisão com IA",
    description:
      "Use IA para revisar entregas, encontrar gargalos e transformar aprendizados em próximos passos.",
    youtube_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    youtube_video_id: "9bZkp7q19f0",
    order_index: 3,
    is_published: true,
    created_at: now,
    updated_at: now,
  },
];

export const mockMaterials: Material[] = [
  {
    id: "material-prompts",
    course_id: "course-ai-zero",
    lesson_id: "lesson-ai-2",
    title: "Biblioteca de Prompts para Pesquisa de Mercado",
    description:
      "Prompts para mapear dores, desejos, objeções, concorrentes e linguagem do cliente.",
    file_url: "https://drive.google.com/",
    category: "Marketing com IA",
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "material-campaign",
    course_id: "course-ai-zero",
    lesson_id: null,
    title: "Modelo de Planejamento de Campanha com IA",
    description:
      "Template para transformar objetivo, público, oferta e canais em um plano de execução.",
    file_url: "https://notion.so/",
    category: "Estratégia",
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "material-content",
    course_id: "course-creatives",
    lesson_id: "lesson-creative-3",
    title: "Planilha de Ideias de Conteúdo 30 Dias",
    description:
      "Uma matriz simples para gerar posts, reels, emails e anúncios a partir de pilares de conteúdo.",
    file_url: "https://docs.google.com/spreadsheets/",
    category: "Criativos",
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "material-sales",
    course_id: "course-automation",
    lesson_id: "lesson-auto-2",
    title: "Scripts de Follow-up para WhatsApp",
    description:
      "Mensagens prontas para retomar conversas, responder objeções e convidar para o próximo passo.",
    file_url: "https://dropbox.com/",
    category: "Vendas",
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "material-offer-canvas",
    course_id: "course-copy-ai",
    lesson_id: "lesson-copy-1",
    title: "Canvas de Oferta Clara",
    description:
      "Organize promessa, público, mecanismo, entrega, bônus e CTA em uma única página.",
    file_url: "https://notion.so/",
    category: "Vendas",
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "material-cta-bank",
    course_id: "course-copy-ai",
    lesson_id: "lesson-copy-2",
    title: "Banco de CTAs por Intenção",
    description:
      "Sugestões de botões para compra, login, download, comunidade, diagnóstico e agendamento.",
    file_url: "https://drive.google.com/",
    category: "Vendas",
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "material-ad-angles",
    course_id: "course-traffic-ai",
    lesson_id: "lesson-traffic-1",
    title: "Mapa de Ângulos para Anúncios",
    description:
      "Estrutura para variar promessa, dor, desejo, prova e mecanismo antes de criar os criativos.",
    file_url: "https://docs.google.com/document/",
    category: "Tráfego Pago",
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "material-metrics-review",
    course_id: "course-traffic-ai",
    lesson_id: "lesson-traffic-2",
    title: "Checklist de Revisão de Métricas",
    description:
      "Perguntas para interpretar CPC, CTR, CPA, criativo, página e oferta com apoio de IA.",
    file_url: "https://docs.google.com/spreadsheets/",
    category: "Tráfego Pago",
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "material-weekly-growth",
    course_id: "course-strategy-ai",
    lesson_id: "lesson-strategy-1",
    title: "Ritual Semanal de Crescimento",
    description:
      "Modelo para planejar a semana, escolher ações de maior impacto e registrar aprendizados.",
    file_url: "https://notion.so/",
    category: "Estratégia",
    is_published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "material-skill-stack",
    course_id: "course-strategy-ai",
    lesson_id: "lesson-strategy-2",
    title: "Mapa de Skill Stack para Marketing com IA",
    description:
      "Diagnóstico para descobrir quais habilidades você precisa fortalecer primeiro.",
    file_url: "https://drive.google.com/",
    category: "Estratégia",
    is_published: true,
    created_at: now,
    updated_at: now,
  },
];

export function getMockCourseWithLessons(slug: string): CourseWithLessons | null {
  const course = mockCourses.find((item) => item.slug === slug);
  if (!course) return null;

  return {
    ...course,
    lessons: mockLessons
      .filter((lesson) => lesson.course_id === course.id)
      .sort((a, b) => a.order_index - b.order_index),
    materials: mockMaterials.filter((material) => material.course_id === course.id),
  };
}
