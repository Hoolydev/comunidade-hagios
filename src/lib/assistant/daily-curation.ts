import {
  buildDraftApprovalChoices,
  buildDraftApprovalMessage,
  createAssistantDrafts,
  markDraftsWhatsappSent,
  type AssistantDraftInput,
} from "@/lib/assistant/content-approval";
import { generateAssistantCover } from "@/lib/assistant/cover-generation";
import {
  getWhatsAppRecipients,
  sendUazapiMenuWithTextFallback,
} from "@/lib/whatsapp/uazapi";

type NewsSource = {
  name: string;
  rss: string;
  trust: number;
};

type NewsItem = {
  source: string;
  title: string;
  description: string;
  link: string;
  date: Date | null;
  score: number;
};

const sources: NewsSource[] = [
  {
    name: "OpenAI",
    rss: "https://openai.com/news/rss.xml",
    trust: 96,
  },
  {
    name: "Google AI",
    rss: "https://blog.google/technology/ai/rss/",
    trust: 94,
  },
  {
    name: "Google Innovation & AI",
    rss: "https://blog.google/innovation-and-ai/rss/",
    trust: 92,
  },
  {
    name: "Marketing AI Institute",
    rss: "https://www.marketingaiinstitute.com/blog/rss.xml",
    trust: 88,
  },
  {
    name: "VentureBeat AI",
    rss: "https://venturebeat.com/category/ai/feed/",
    trust: 82,
  },
  {
    name: "Google News - IA nos negócios",
    rss: "https://news.google.com/rss/search?q=intelig%C3%AAncia%20artificial%20neg%C3%B3cios%20empresas&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    trust: 84,
  },
  {
    name: "Google News - IA em atendimento",
    rss: "https://news.google.com/rss/search?q=intelig%C3%AAncia%20artificial%20atendimento%20cliente%20empresas&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    trust: 84,
  },
  {
    name: "Google News - IA em vendas",
    rss: "https://news.google.com/rss/search?q=intelig%C3%AAncia%20artificial%20vendas%20crm%20empresas&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    trust: 84,
  },
  {
    name: "Google News - IA em gestão",
    rss: "https://news.google.com/rss/search?q=intelig%C3%AAncia%20artificial%20gest%C3%A3o%20produtividade%20empresas&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    trust: 84,
  },
];

const includeTerms = [
  "negócio",
  "business",
  "empresa",
  "enterprise",
  "automation",
  "automação",
  "agent",
  "agente",
  "workflow",
  "marketing",
  "sales",
  "vendas",
  "customer",
  "cliente",
  "atendimento",
  "productivity",
  "produtividade",
  "gestão",
  "finance",
  "finanças",
  "operation",
  "operação",
  "openai",
  "google",
  "anthropic",
  "microsoft",
  "chatgpt",
  "gemini",
  "claude",
];

const excludeTerms = ["celebrity", "famoso", "filme", "movie", "game", "gaming", "meme"];

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function getLink(block: string) {
  const href = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  return href ? decodeXml(href[1]) : pickTag(block, "link") || pickTag(block, "guid");
}

function getCategory(text: string) {
  const value = text.toLowerCase();
  if (/sales|vendas|crm|lead|comercial/.test(value)) return "Vendas";
  if (/marketing|content|criativo|campaign|anuncio|ads|campanha/.test(value)) return "Marketing";
  if (/support|customer service|atendimento|whatsapp|chatbot|cliente/.test(value)) {
    return "Atendimento";
  }
  if (/agent|agente|automation|workflow|automacao|automação/.test(value)) return "Produtividade";
  if (/finance|financas|finanças|custo|receita/.test(value)) return "Finanças";
  if (/gestao|gestão|operation|operacao|operação|processo/.test(value)) return "Gestão";
  return "IA";
}

function getTags(text: string) {
  const value = text.toLowerCase();
  const tags = ["IA"];
  const map = [
    ["agent", "Agentes"],
    ["agente", "Agentes"],
    ["automation", "Automação"],
    ["automação", "Automação"],
    ["sales", "Vendas"],
    ["vendas", "Vendas"],
    ["marketing", "Marketing"],
    ["atendimento", "Atendimento"],
    ["gestão", "Gestão"],
    ["produtividade", "Produtividade"],
    ["openai", "OpenAI"],
    ["google", "Google"],
    ["anthropic", "Anthropic"],
    ["microsoft", "Microsoft"],
  ];

  map.forEach(([term, tag]) => {
    if (value.includes(term) && !tags.includes(tag)) tags.push(tag);
  });

  return tags.slice(0, 6);
}

function getScore(item: Pick<NewsItem, "title" | "description" | "date">, source: NewsSource) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  let score = Math.round(source.trust / 3);

  includeTerms.forEach((term) => {
    if (text.includes(term)) score += 7;
  });

  excludeTerms.forEach((term) => {
    if (text.includes(term)) score -= 16;
  });

  if (/empresa|empreendedor|business|cliente|receita|custo|processo|operação|operacao/.test(text)) {
    score += 16;
  }

  if (item.date && Date.now() - item.date.getTime() <= 36 * 60 * 60 * 1000) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

function shortTitle(title: string) {
  return title.replace(/\s*[-|].*$/, "").trim().slice(0, 92);
}

function areaLabel(category: string) {
  const value = category.toLowerCase();
  if (value === "ia") return "operações com IA";
  return value;
}

function getBusinessSubject(item: NewsItem) {
  const text = `${item.title} ${item.description} ${item.source}`.toLowerCase();

  if (/chatgpt|openai/.test(text)) return "ChatGPT e OpenAI";
  if (/gemini|google/.test(text)) return "Gemini e Google AI";
  if (/claude|anthropic/.test(text)) return "Claude e Anthropic";
  if (/agent|agente/.test(text)) return "agentes de IA";
  if (/automation|automacao|automação|workflow/.test(text)) return "automação com IA";
  if (/customer|support|atendimento|whatsapp|chatbot/.test(text)) return "atendimento com IA";
  if (/sales|vendas|crm|lead|comercial/.test(text)) return "vendas com IA";
  if (/marketing|content|criativo|campaign|anuncio|ads|campanha/.test(text)) {
    return "marketing com IA";
  }
  if (/finance|financas|finanças|custo|receita/.test(text)) return "finanças com IA";
  if (/gestao|gestão|productivity|produtividade|operation|operacao|operação/.test(text)) {
    return "gestão com IA";
  }

  return "IA aplicada ao negócio";
}

function movementTitle(item: NewsItem) {
  const category = getCategory(`${item.title} ${item.description}`);
  const subject = getBusinessSubject(item);
  return `${subject}: aplicação prática para ${areaLabel(category)} nas empresas`;
}

function movementSummary(item: NewsItem) {
  const category = getCategory(`${item.title} ${item.description}`);
  const area = areaLabel(category);

  return `Uma atualização recente sobre inteligência artificial aponta novas oportunidades para ${area}. Para o Movimento Hágios, o ponto central é transformar essa tendência em um teste prático dentro da empresa, com foco em processo, implementação e resultado.`;
}

function implementationPlaybook(category: string) {
  const value = category.toLowerCase();

  if (value === "atendimento") {
    return {
      action: "revisar as 20 dúvidas mais frequentes recebidas no WhatsApp, Instagram ou e-mail e criar uma base de respostas assistida por IA.",
      steps: [
        "Liste perguntas recorrentes, objeções e solicitações que travam o atendimento.",
        "Transforme cada pergunta em uma resposta padrão com tom humano, objetivo e alinhado à marca.",
        "Crie um processo de revisão: a IA sugere, o time valida e só depois a resposta vira padrão.",
      ],
      metric: "tempo médio de primeira resposta, quantidade de atendimentos resolvidos sem retrabalho e satisfação percebida do cliente.",
    };
  }

  if (value === "vendas") {
    return {
      action: "usar IA para qualificar leads, identificar intenção de compra e sugerir o próximo passo comercial.",
      steps: [
        "Separe conversas recentes de vendas em três grupos: frio, morno e pronto para comprar.",
        "Crie critérios objetivos para a IA classificar cada lead com base em urgência, orçamento e dor.",
        "Monte mensagens de follow-up específicas para cada grupo, evitando abordagem genérica.",
      ],
      metric: "taxa de resposta no follow-up, reuniões agendadas e conversões por etapa do funil.",
    };
  }

  if (value === "marketing") {
    return {
      action: "transformar a notícia em um teste de conteúdo, campanha ou criativo com mensagem mais clara para o público.",
      steps: [
        "Escolha uma oferta ou serviço que precisa de mais clareza comercial.",
        "Use IA para criar três ângulos de comunicação: dor, oportunidade e prova.",
        "Publique ou anuncie o melhor ângulo e compare resposta, cliques e conversas geradas.",
      ],
      metric: "CTR, comentários qualificados, leads gerados e custo por conversa.",
    };
  }

  if (value === "gestão" || value === "produtividade") {
    return {
      action: "mapear uma rotina repetitiva da operação e criar um fluxo simples de melhoria com IA.",
      steps: [
        "Escolha uma tarefa que consome tempo toda semana, como relatórios, propostas ou organização de demandas.",
        "Documente entrada, transformação e saída esperada dessa tarefa.",
        "Use IA para gerar a primeira versão do processo e deixe uma pessoa responsável por validar o resultado.",
      ],
      metric: "tempo economizado por semana, erros evitados e previsibilidade da entrega.",
    };
  }

  return {
    action: "selecionar um processo pequeno do negócio e testar uma melhoria de IA em escala controlada.",
    steps: [
      "Escolha uma rotina com impacto claro em receita, atendimento, gestão ou produtividade.",
      "Defina o antes e depois: como é feito hoje e como a IA pode apoiar.",
      "Rode um teste por sete dias antes de automatizar ou escalar.",
    ],
    metric: "tempo economizado, qualidade da entrega e impacto percebido no cliente ou no time.",
  };
}

async function readFeed(source: NewsSource) {
  try {
    const response = await fetch(source.rss, {
      headers: { "user-agent": "Movimento-Hagios-Curadoria/1.0" },
      next: { revalidate: 60 * 30 },
    });
    const xml = await response.text();

    return Array.from(xml.matchAll(/<item[\s\S]*?<\/item>/gi)).map((match) => {
      const block = match[0];
      const title = pickTag(block, "title");
      const description = pickTag(block, "description");
      const link = getLink(block);
      const dateText = pickTag(block, "pubDate");
      const date = dateText ? new Date(dateText) : null;

      return {
        source: source.name,
        title,
        description,
        link,
        date,
        score: getScore({ title, description, date }, source),
      };
    });
  } catch {
    return [];
  }
}

function newsToDraft(item: NewsItem): AssistantDraftInput {
  const text = `${item.title} ${item.description}`;
  const category = getCategory(text);
  const playbook = implementationPlaybook(category);
  const sourceContext = decodeXml(item.description).slice(0, 320) || shortTitle(item.title);

  return {
    title: movementTitle(item),
    subtitle: movementSummary(item),
    body: [
      `Resumo da novidade: ${movementSummary(item)}`,
      "",
      `Contexto da fonte: ${sourceContext}`,
      "",
      "Por que isso importa para empresários do Movimento Hágios:",
      "- A notícia só vira valor quando ajuda a melhorar uma operação real da empresa.",
      "- O foco não é acompanhar tendência por curiosidade, é transformar IA em processo, rotina e resultado.",
      "- O melhor caminho é começar com um teste pequeno, medir o ganho e só depois escalar.",
      "",
      "Aplicação prática sugerida:",
      `Use este tema para ${playbook.action}`,
      "",
      "Como implementar ainda esta semana:",
      ...playbook.steps.map((step, index) => `${index + 1}. ${step}`),
      "",
      `Indicador para acompanhar: ${playbook.metric}`,
      "",
      "Pergunta de implementação: qual processo do negócio pode ganhar velocidade, qualidade ou previsibilidade com IA nos próximos 7 dias?",
    ].join("\n"),
    category,
    tags: getTags(text),
    source_name: item.source,
    source_url: item.link,
  };
}

export async function collectDailyCuration(limit = 3) {
  const allItems = (await Promise.all(sources.map(readFeed))).flat();
  const seen = new Set<string>();
  const seenDraftTitles = new Map<string, number>();

  return allItems
    .filter((item) => item.title && item.link)
    .sort((a, b) => b.score - a.score)
    .filter((item) => {
      const key = shortTitle(item.title).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, Math.max(3, limit))
    .map(newsToDraft)
    .map((draft) => {
      const titleKey = draft.title.toLowerCase();
      const count = seenDraftTitles.get(titleKey) || 0;
      seenDraftTitles.set(titleKey, count + 1);

      if (!count) return draft;

      return {
        ...draft,
        title: `${draft.title} (${draft.source_name})`,
      };
    });
}

export async function runDailyAssistantCuration(limit = 3) {
  const items = await collectDailyCuration(limit);
  if (items.length < 3) {
    throw new Error("A curadoria encontrou menos de 3 notícias úteis para aprovação.");
  }

  const coverUrls = await Promise.all(
    items.map((item) =>
      generateAssistantCover({
        title: item.title,
        summary: item.subtitle || item.body.slice(0, 240),
        category: item.category || "IA",
      }).catch(() => null),
    ),
  );
  const drafts = await createAssistantDrafts(
    items.map((item, index) => ({
      ...item,
      cover_url: coverUrls[index],
    })),
  );
  const whatsappMessages = [];
  const recipients = getWhatsAppRecipients();

  for (const recipient of recipients) {
    for (const [index, draft] of drafts.entries()) {
      const message = buildDraftApprovalMessage({
        draft,
        index: index + 1,
        total: drafts.length,
        approverName: recipient.name,
      });
      const whatsapp = await sendUazapiMenuWithTextFallback(
        {
          text: message,
          choices: buildDraftApprovalChoices(index + 1),
          footerText: "Movimento Hágios | Curadoria diária de IA",
          imageButton: coverUrls[index],
        },
        recipient,
      );

      whatsappMessages.push({
        ...whatsapp,
        recipient: recipient.phone,
        cover_url: coverUrls[index],
      });
    }
  }

  const whatsapp = {
    ok: whatsappMessages.every((message) => message.ok),
    skipped: whatsappMessages.every((message) => message.skipped),
    status: whatsappMessages.find((message) => message.status)?.status,
    data: whatsappMessages,
    error: whatsappMessages.find((message) => message.error)?.error,
  };

  if (whatsapp.ok && recipients.length) {
    await markDraftsWhatsappSent(
      drafts.map((draft) => draft.id),
      recipients.map((recipient) => recipient.phone).join(","),
    );
  }

  return {
    count: drafts.length,
    draft_ids: drafts.map((draft) => draft.id),
    titles: drafts.map((draft) => draft.title),
    cover_urls: coverUrls,
    whatsapp,
  };
}
