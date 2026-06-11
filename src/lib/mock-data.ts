import type {
  Challenge,
  CommunityEvent,
  CommunityQuestion,
  Course,
  CourseWithLessons,
  JourneyTrack,
  Lesson,
  Material,
  Mentorship,
  NextAction,
  RecentContent,
  ToolResource,
} from "@/lib/types";
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

export const mockNextActions: NextAction[] = [
  {
    id: "continue-fundamentos",
    title: "Continue a trilha Fundamentos da IA",
    description:
      "Finalize a missão de prompts empresariais para criar comandos mais úteis no dia a dia.",
    href: "/comunidade/jornada",
    label: "Continuar jornada",
    priority: "high",
  },
  {
    id: "content-week",
    title: "Assista ao conteúdo novo da semana",
    description:
      "Veja o caso prático sobre como usar IA para revisar uma campanha antes de colocar no ar.",
    href: "/comunidade/conteudos-recentes",
    label: "Ver novidade",
    priority: "medium",
  },
  {
    id: "next-mentorship",
    title: "Prepare-se para a mentoria deste mês",
    description:
      "Tema: diagnóstico de gargalos comerciais com IA. Separe uma campanha ou funil para revisar.",
    href: "/comunidade/mentorias",
    label: "Ver mentoria",
    priority: "medium",
  },
  {
    id: "current-challenge",
    title: "Conclua o desafio atual",
    description:
      "Faltam dois dias para finalizar o desafio de mapear oportunidades de automação no negócio.",
    href: "/comunidade/desafios",
    label: "Abrir desafio",
    priority: "low",
  },
];

export const mockJourneyTracks: JourneyTrack[] = [
  {
    id: "track-fundamentos",
    title: "Fundamentos da IA",
    description:
      "A base para usar inteligência artificial com clareza, intenção e aplicação real no negócio.",
    category: "IA",
    progress: 35,
    modules: [
      {
        id: "module-ia-negocio",
        title: "IA aplicada ao negócio",
        description:
          "Entenda onde a IA gera ganho de tempo, clareza e tomada de decisão.",
        lessons: [
          {
            id: "journey-fundamentos-1",
            title: "O mapa da IA dentro da empresa",
            duration: "12 min",
            description: "Identifique áreas onde a IA pode apoiar marketing, vendas e operação.",
            status: "recommended",
          },
          {
            id: "journey-fundamentos-2",
            title: "Como pensar antes de pedir para a IA",
            duration: "9 min",
            description: "Aprenda a transformar uma necessidade vaga em uma tarefa clara.",
            status: "available",
          },
        ],
      },
      {
        id: "module-prompts",
        title: "Prompt empresarial",
        description:
          "Crie comandos que retornam respostas melhores e mais acionáveis.",
        lessons: [
          {
            id: "journey-prompt-1",
            title: "A estrutura de prompt que evita resposta genérica",
            duration: "14 min",
            description: "Contexto, objetivo, restrições e formato de saída em uma estrutura simples.",
            status: "new",
          },
          {
            id: "journey-prompt-2",
            title: "Transformando respostas em próximos passos",
            duration: "11 min",
            description: "Como revisar, aprofundar e converter ideias em execução.",
            status: "available",
          },
        ],
      },
    ],
  },
  {
    id: "track-marketing",
    title: "Marketing com IA",
    description:
      "Use IA para pesquisar mercado, melhorar oferta, criar campanhas e produzir conteúdo com estratégia.",
    category: "Marketing",
    progress: 48,
    modules: [
      {
        id: "module-market-research",
        title: "Pesquisa e posicionamento",
        description:
          "Use IA para encontrar dores, desejos, linguagem do cliente e oportunidades.",
        lessons: [
          {
            id: "journey-marketing-1",
            title: "Pesquisa de público em 20 minutos",
            duration: "18 min",
            description: "Monte uma visão rápida de público, objeções e proposta de valor.",
            status: "available",
          },
          {
            id: "journey-marketing-2",
            title: "Oferta clara para vender melhor",
            duration: "16 min",
            description: "Organize promessa, entrega, diferenciais e CTA sem ruído.",
            status: "recommended",
          },
        ],
      },
      {
        id: "module-content-ai",
        title: "Produção de conteúdo",
        description:
          "Transforme uma ideia central em posts, roteiros, anúncios e emails.",
        lessons: [
          {
            id: "journey-content-1",
            title: "Sistema de ideias para 30 dias",
            duration: "13 min",
            description: "Crie uma matriz para não depender de inspiração.",
            status: "available",
          },
        ],
      },
    ],
  },
  {
    id: "track-atendimento",
    title: "Atendimento com IA",
    description:
      "Estruture respostas, triagens e follow-ups para vender melhor sem perder o tom humano.",
    category: "Atendimento",
    progress: 12,
    modules: [
      {
        id: "module-service",
        title: "Atendimento assistido",
        description:
          "Padronize respostas e acelere o suporte comercial com IA.",
        lessons: [
          {
            id: "journey-service-1",
            title: "Mapa de perguntas frequentes",
            duration: "10 min",
            description: "Transforme dúvidas repetidas em uma base de resposta útil.",
            status: "new",
          },
          {
            id: "journey-service-2",
            title: "Follow-up que retoma contexto",
            duration: "15 min",
            description: "Crie mensagens comerciais sem parecer insistente.",
            status: "available",
          },
        ],
      },
    ],
  },
];

export const mockRecentContents: RecentContent[] = [
  {
    id: "recent-campaign-review",
    title: "Como revisar uma campanha com IA antes de publicar",
    description:
      "Um processo rápido para avaliar promessa, público, CTA e criativos antes de investir mídia.",
    category: "Marketing",
    type: "Caso prático",
    published_at: "2026-05-30T12:00:00.000Z",
    duration: "21 min",
    href: "/comunidade/conteudos-recentes",
  },
  {
    id: "recent-service-ai",
    title: "Novo prompt para melhorar respostas no atendimento",
    description:
      "Use este modelo para responder objeções com mais clareza e manter o próximo passo visível.",
    category: "Atendimento",
    type: "Ferramenta",
    published_at: "2026-05-27T12:00:00.000Z",
    href: "/comunidade/ferramentas",
  },
  {
    id: "recent-dashboard-ai",
    title: "Tendência: IA como copiloto de gestão semanal",
    description:
      "Como empresários estão usando IA para revisar indicadores e escolher prioridades da semana.",
    category: "Gestão",
    type: "Tendência",
    published_at: "2026-05-24T12:00:00.000Z",
    duration: "14 min",
    href: "/comunidade/conteudos-recentes",
  },
  {
    id: "recent-sales-script",
    title: "Script de vendas consultivas com apoio de IA",
    description:
      "Um roteiro prático para diagnosticar necessidade, apresentar solução e avançar para proposta.",
    category: "Vendas",
    type: "Vídeo",
    published_at: "2026-05-20T12:00:00.000Z",
    duration: "18 min",
    href: "/comunidade/conteudos-recentes",
  },
  {
    id: "recent-update-tools",
    title: "Atualização da biblioteca de ferramentas",
    description:
      "Novos templates de campanha, prompts de pesquisa e checklist de criativos foram adicionados.",
    category: "Atualizações",
    type: "Atualização",
    published_at: "2026-05-16T12:00:00.000Z",
    href: "/comunidade/ferramentas",
  },
];

export const mockMentorships: Mentorship[] = [
  {
    id: "mentoria-junho",
    title: "Diagnóstico de gargalos comerciais com IA",
    description:
      "Mentoria prática para encontrar pontos de perda no funil e definir melhorias para a próxima semana.",
    teacher: "Time Hágios",
    date: "2026-06-18T19:30:00.000Z",
    recording_url: null,
    materials: ["Roteiro de diagnóstico", "Planilha de priorização"],
    related_challenge: "Desafio 3 Dias: mapa de automações comerciais",
  },
  {
    id: "mentoria-maio",
    title: "Como criar campanhas melhores com IA",
    description:
      "Gravação da mentoria sobre pesquisa de público, ângulos criativos e revisão de anúncios.",
    teacher: "Time Hágios",
    date: "2026-05-21T19:30:00.000Z",
    recording_url: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    materials: ["Checklist de campanha", "Banco de prompts de revisão"],
    related_challenge: "Desafio 3 Dias: campanha mais clara",
  },
];

export const mockChallenges: Challenge[] = [
  {
    id: "challenge-automation-map",
    theme: "Mapa de automações comerciais",
    description:
      "Identifique tarefas repetitivas no atendimento e vendas que podem ser padronizadas com IA.",
    objective:
      "Sair com três oportunidades claras de automação para melhorar velocidade e consistência comercial.",
    days: [
      {
        day: 1,
        title: "Mapear conversas repetidas",
        description: "Liste dúvidas, objeções e tarefas que aparecem toda semana.",
        completed: true,
      },
      {
        day: 2,
        title: "Criar respostas base",
        description: "Transforme os padrões encontrados em respostas e fluxos iniciais.",
        completed: false,
      },
      {
        day: 3,
        title: "Definir implementação",
        description: "Escolha uma automação simples para testar nos próximos sete dias.",
        completed: false,
      },
    ],
    material_url: "https://docs.google.com/spreadsheets/",
    expected_result:
      "Um mapa priorizado com três automações e uma ação escolhida para implementar primeiro.",
    participants: 84,
    completion_rate: 42,
    ranking: [
      { name: "Ana P.", points: 300 },
      { name: "Bruno M.", points: 260 },
      { name: "Carla S.", points: 220 },
    ],
    published_at: "2026-05-29T12:00:00.000Z",
  },
  {
    id: "challenge-clear-campaign",
    theme: "Campanha mais clara em 3 dias",
    description:
      "Reescreva uma campanha existente usando IA para melhorar promessa, CTA e objeções.",
    objective:
      "Transformar uma campanha confusa em uma peça com mensagem simples e próxima ação evidente.",
    days: [
      {
        day: 1,
        title: "Diagnosticar a campanha",
        description: "Analise promessa, público, oferta, CTA e possíveis dúvidas.",
        completed: true,
      },
      {
        day: 2,
        title: "Gerar novas versões",
        description: "Crie variações de gancho, mensagem e CTA com apoio da IA.",
        completed: true,
      },
      {
        day: 3,
        title: "Escolher a versão final",
        description: "Compare as versões e defina o próximo teste.",
        completed: true,
      },
    ],
    material_url: "https://notion.so/",
    expected_result:
      "Uma versão revisada de campanha pronta para publicar ou testar com tráfego.",
    participants: 63,
    completion_rate: 68,
    ranking: [
      { name: "Marcos R.", points: 300 },
      { name: "Lia F.", points: 280 },
      { name: "João C.", points: 250 },
    ],
    published_at: "2026-05-10T12:00:00.000Z",
  },
];

export const mockTools: ToolResource[] = [
  {
    id: "tool-prompt-marketing",
    title: "Checklist de Prompt para Marketing",
    description:
      "Estrutura para pedir análises, campanhas, criativos e ideias com contexto de negócio.",
    category: "Prompts",
    url: "https://drive.google.com/",
    updated_at: "2026-05-30T12:00:00.000Z",
  },
  {
    id: "tool-campaign-template",
    title: "Modelo de Planejamento de Campanha",
    description:
      "Template para organizar objetivo, oferta, público, canais, mensagens e próximos testes.",
    category: "Templates",
    url: "https://notion.so/",
    updated_at: "2026-05-28T12:00:00.000Z",
  },
  {
    id: "tool-content-sheet",
    title: "Planilha de Ideias de Conteúdo",
    description:
      "Gere pautas por pilar, estágio de consciência, formato e chamada comercial.",
    category: "Planilhas",
    url: "https://docs.google.com/spreadsheets/",
    updated_at: "2026-05-22T12:00:00.000Z",
  },
  {
    id: "tool-sales-guide",
    title: "Guia Rápido de IA para Vendas",
    description:
      "Como usar IA para preparar abordagens, responder objeções e fazer follow-up.",
    category: "Guias",
    url: "https://docs.google.com/document/",
    updated_at: "2026-05-18T12:00:00.000Z",
  },
  {
    id: "tool-automation-flow",
    title: "Fluxograma de Atendimento com IA",
    description:
      "Desenhe triagem, respostas, encaminhamentos e follow-up sem complicar a operação.",
    category: "Fluxogramas",
    url: "https://miro.com/",
    updated_at: "2026-05-14T12:00:00.000Z",
  },
  {
    id: "tool-ad-checklist",
    title: "Checklist de Criativos para Anúncios",
    description:
      "Valide gancho, promessa, prova, clareza visual e CTA antes de subir campanha.",
    category: "Checklists",
    url: "https://drive.google.com/",
    updated_at: "2026-05-11T12:00:00.000Z",
  },
  {
    id: "tool-ai-stack",
    title: "Ferramentas recomendadas para empresários",
    description:
      "Uma lista curada de ferramentas para pesquisa, conteúdo, atendimento, gestão e automação.",
    category: "Ferramentas recomendadas",
    url: "https://notion.so/",
    updated_at: "2026-05-08T12:00:00.000Z",
  },
  {
    id: "tool-followup-automation",
    title: "Automação simples de follow-up",
    description:
      "Modelo de sequência para retomar leads parados sem perder contexto ou tom humano.",
    category: "Automações",
    url: "https://zapier.com/",
    updated_at: "2026-05-04T12:00:00.000Z",
  },
];

export const mockQuestions: CommunityQuestion[] = [
  {
    id: "question-1",
    question: "Como sei se devo começar por marketing, vendas ou atendimento?",
    answer:
      "Comece pelo gargalo mais visível do negócio. Se falta demanda, vá para Marketing com IA. Se existem leads sem fechamento, priorize Vendas. Se o time perde tempo repetindo respostas, avance em Atendimento com IA.",
    category: "Jornada",
    author: "Membro da comunidade",
    answered_by: "Time Hágios",
    created_at: "2026-05-29T12:00:00.000Z",
  },
  {
    id: "question-2",
    question: "Posso usar os prompts com qualquer ferramenta de IA?",
    answer:
      "Sim. Os prompts foram pensados para funcionar em ferramentas diferentes. O mais importante é adaptar contexto, objetivo e formato de saída para a sua empresa.",
    category: "Ferramentas",
    author: "Membro da comunidade",
    answered_by: "Time Hágios",
    created_at: "2026-05-24T12:00:00.000Z",
  },
  {
    id: "question-3",
    question: "O desafio precisa ser feito exatamente em três dias?",
    answer:
      "Não. O ciclo de três dias ajuda a criar foco, mas você pode adaptar ao seu ritmo. O essencial é concluir com uma implementação real, mesmo que pequena.",
    category: "Desafios",
    author: "Membro da comunidade",
    answered_by: "Time Hágios",
    created_at: "2026-05-19T12:00:00.000Z",
  },
];

export const mockEvents: CommunityEvent[] = [
  {
    id: "event-june-mentorship",
    type: "Mentoria",
    title: "Mentoria: diagnóstico de gargalos comerciais",
    description: "Encontro ao vivo com análise prática e próximos passos.",
    date: "2026-06-18T19:30:00.000Z",
    href: "/comunidade/mentorias",
  },
  {
    id: "event-vote",
    type: "Votação",
    title: "Vote no tema da próxima mentoria",
    description: "Escolha entre vendas, atendimento, gestão ou produtividade.",
    date: "2026-06-05T12:00:00.000Z",
    href: "/comunidade/mentorias",
  },
  {
    id: "event-challenge",
    type: "Desafio",
    title: "Novo desafio de automações comerciais",
    description: "Três dias para mapear e priorizar uma implementação simples.",
    date: "2026-06-10T09:00:00.000Z",
    href: "/comunidade/desafios",
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
