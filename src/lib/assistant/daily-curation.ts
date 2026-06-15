import {
  buildBatchApprovalMessage,
  createAssistantDrafts,
  markDraftsWhatsappSent,
  type AssistantDraftInput,
} from "@/lib/assistant/content-approval";
import { sendUazapiTextMessage } from "@/lib/whatsapp/uazapi";

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
    name: "Google News - IA nos negócios",
    rss: "https://news.google.com/rss/search?q=intelig%C3%AAncia%20artificial%20neg%C3%B3cios%20empresas&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    trust: 94,
  },
  {
    name: "Google News - IA em empresas",
    rss: "https://news.google.com/rss/search?q=IA%20empresas%20opera%C3%A7%C3%B5es%20gest%C3%A3o&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    trust: 92,
  },
  {
    name: "Google News - automação com IA",
    rss: "https://news.google.com/rss/search?q=automa%C3%A7%C3%A3o%20intelig%C3%AAncia%20artificial%20neg%C3%B3cios&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    trust: 92,
  },
  {
    name: "VentureBeat AI",
    rss: "https://venturebeat.com/category/ai/feed/",
    trust: 72,
  },
  {
    name: "MIT News AI",
    rss: "https://news.mit.edu/rss/topic/artificial-intelligence2",
    trust: 74,
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

async function readFeed(source: NewsSource) {
  try {
    const response = await fetch(source.rss, {
      headers: { "user-agent": "Comunidade-Hagios-Curadoria/1.0" },
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
  const title = shortTitle(item.title);
  const context = decodeXml(item.description).slice(0, 260);
  const text = `${item.title} ${item.description}`;

  return {
    title: `Novidade de IA: ${title}`,
    subtitle: "Curadoria para empresários aplicarem IA com foco em implementação.",
    body: [
      `Resumo da novidade: ${context || title}.`,
      "",
      "Por que isso importa para empresários da Comunidade Hágios:",
      "- A IA está deixando de ser tendência e virando melhoria prática de operação, atendimento, marketing, vendas e gestão.",
      "- O melhor uso agora é escolher um processo específico, testar uma melhoria pequena e medir resultado antes de escalar.",
      "- Use esta notícia como gatilho para revisar uma rotina da empresa que ainda depende de trabalho manual repetitivo.",
      "",
      "Pergunta de implementação: qual processo do negócio pode ganhar velocidade, qualidade ou previsibilidade com IA ainda esta semana?",
    ].join("\n"),
    category: getCategory(text),
    tags: getTags(text),
    source_name: item.source,
    source_url: item.link,
  };
}

export async function collectDailyCuration(limit = 3) {
  const allItems = (await Promise.all(sources.map(readFeed))).flat();
  const seen = new Set<string>();

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
    .map(newsToDraft);
}

export async function runDailyAssistantCuration(limit = 3) {
  const items = await collectDailyCuration(limit);
  if (items.length < 3) {
    throw new Error("A curadoria encontrou menos de 3 notícias úteis para aprovação.");
  }

  const drafts = await createAssistantDrafts(items);
  const message = buildBatchApprovalMessage({
    drafts,
    approverName: process.env.WHATSAPP_APPROVER_NAME,
  });
  const whatsapp = await sendUazapiTextMessage(message);

  if (whatsapp.ok && process.env.WHATSAPP_APPROVER_PHONE) {
    await markDraftsWhatsappSent(
      drafts.map((draft) => draft.id),
      process.env.WHATSAPP_APPROVER_PHONE,
    );
  }

  return {
    count: drafts.length,
    draft_ids: drafts.map((draft) => draft.id),
    titles: drafts.map((draft) => draft.title),
    whatsapp,
  };
}
