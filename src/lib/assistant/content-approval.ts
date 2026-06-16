import { revalidatePath } from "next/cache";
import { getAppUrl } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { AssistantDraft, MovementPost } from "@/lib/types";
import { slugify } from "@/lib/utils";

export type AssistantDraftInput = {
  title: string;
  subtitle?: string | null;
  body: string;
  category?: string | null;
  tags?: string[] | string | null;
  source_name?: string | null;
  source_url?: string | null;
  cover_url?: string | null;
};

export function normalizeTags(tags?: string[] | string | null) {
  if (!tags) return [];
  const values = Array.isArray(tags) ? tags : tags.split(",");

  return values
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export function validateDraftInput(input: Partial<AssistantDraftInput>) {
  const title = String(input.title || "").trim();
  const body = String(input.body || "").trim();

  if (title.length < 6) {
    throw new Error("O título precisa ter pelo menos 6 caracteres.");
  }

  if (body.length < 20) {
    throw new Error("O texto precisa ter pelo menos 20 caracteres.");
  }

  return {
    title,
    subtitle: String(input.subtitle || "").trim() || null,
    body,
    category: String(input.category || "Atualizações").trim(),
    tags: normalizeTags(input.tags),
    source_name: String(input.source_name || "").trim() || null,
    source_url: String(input.source_url || "").trim() || null,
    cover_url: String(input.cover_url || "").trim() || null,
  };
}

export function getApprovalUrl(token: string) {
  return `${getAppUrl()}/assistente/aprovacao/${token}`;
}

export function buildApprovalMessage({
  draft,
  approvalUrl,
  approverName,
}: {
  draft: Pick<
    AssistantDraft,
    "title" | "subtitle" | "body" | "category" | "tags" | "source_url"
  >;
  approvalUrl: string;
  approverName?: string | null;
}) {
  const preview = draft.body.length > 900 ? `${draft.body.slice(0, 900).trim()}...` : draft.body;
  const greeting = approverName ? `Olá, ${approverName}.` : "Olá.";
  const tags = draft.tags.length ? draft.tags.map((tag) => `#${tag}`).join(" ") : "sem tags";

  return [
    greeting,
    "",
    "Tenho um novo conteúdo para aprovação no Movimento Hágios.",
    "",
    `Título: ${draft.title}`,
    draft.subtitle ? `Subtítulo: ${draft.subtitle}` : null,
    `Categoria: ${draft.category}`,
    `Tags: ${tags}`,
    draft.source_url ? `Fonte: ${draft.source_url}` : null,
    "",
    "Texto:",
    preview,
    "",
    "Para aprovar ou rejeitar, acesse:",
    approvalUrl,
  ]
    .filter(Boolean)
    .join("\n");
}

function previewText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
}

function cleanWhatsappMarkdown(value: string) {
  return value.replace(/[*_~`]/g, "").trim();
}

function getDraftSummary(draft: Pick<AssistantDraft, "subtitle" | "body">) {
  const firstLine = draft.body
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return (
    firstLine?.replace(/^Resumo da novidade:\s*/i, "").trim() ||
    draft.subtitle ||
    "Resumo em revisão."
  );
}

function getSourceLabel(sourceName?: string | null) {
  const value = (sourceName || "").trim();
  if (!value) return null;

  if (/google news/i.test(value)) return "Google News";
  if (/anthropic/i.test(value)) return "Anthropic";
  if (/openai/i.test(value)) return "OpenAI";
  if (/microsoft/i.test(value)) return "Microsoft";
  if (/google/i.test(value)) return "Google";

  return value.replace(/\s*[-|].*$/, "").trim();
}

function withoutCoverUrl<T extends { cover_url?: string | null }>(value: T) {
  const copy = { ...value };
  delete copy.cover_url;
  return copy;
}

export function buildBatchApprovalMessage({
  drafts,
  approverName,
}: {
  drafts: AssistantDraft[];
  approverName?: string | null;
}) {
  const greeting = approverName ? `Olá, ${approverName}.` : "Olá.";
  const items = drafts.flatMap((draft, index) => [
    `*BLOCO ${index + 1}*`,
    `*${index + 1}. ${cleanWhatsappMarkdown(draft.title)}*`,
    `> ${previewText(cleanWhatsappMarkdown(getDraftSummary(draft)), 360)}`,
    `Categoria: ${draft.category}`,
    draft.source_url ? `Fonte: ${draft.source_url}` : null,
    "",
  ]);

  return [
    greeting,
    "",
    `Separei ${drafts.length} novidades para aprovação no Movimento Hágios.`,
    "Use os botões abaixo ou responda por número:",
    "",
    ...items,
    "*Como responder por texto:*",
    "- aprovar 1, 2 e 3",
    "- rejeitar 2",
    "- aprovar todas",
    "- aprovar 1 e rejeitar 3",
    "",
    "Se quiser revisar com mais calma, abra o painel do assistente na plataforma.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildBatchApprovalChoices() {
  return [
    "Aprovar todas|aprovar todas",
    "Rejeitar todas|rejeitar todas",
    "Responder por número|responder por numero",
  ];
}

export function buildDraftApprovalMessage({
  draft,
  index,
  total,
  approverName,
}: {
  draft: AssistantDraft;
  index: number;
  total: number;
  approverName?: string | null;
}) {
  const greeting = approverName ? `Olá, ${approverName}.` : "Olá.";

  return [
    greeting,
    "",
    `*NOTÍCIA ${index} DE ${total}*`,
    `*${cleanWhatsappMarkdown(draft.title)}*`,
    `> ${previewText(cleanWhatsappMarkdown(getDraftSummary(draft)), 420)}`,
    "",
    `Categoria: ${draft.category}`,
    getSourceLabel(draft.source_name) ? `Fonte: ${getSourceLabel(draft.source_name)}` : null,
    "",
    "Use o botão abaixo para aprovar esta notícia.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildDraftApprovalChoices(index: number) {
  return [`Aprovar|aprovar ${index}`];
}

export async function createAssistantDraft(input: AssistantDraftInput) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin não configurado.");
  }

  const draft = validateDraftInput(input);
  const reviewToken = crypto.randomUUID();

  const { data, error } = await supabase
    .from("assistant_drafts")
    .insert({
      ...draft,
      review_token: reviewToken,
      status: "pending",
    })
    .select("*")
    .single();

  if (error?.message?.includes("cover_url")) {
    const { data: retryData, error: retryError } = await supabase
      .from("assistant_drafts")
      .insert({
        ...withoutCoverUrl(draft),
        review_token: reviewToken,
        status: "pending",
      })
      .select("*")
      .single();

    if (retryError || !retryData) {
      throw new Error(retryError?.message || "Não foi possível criar o rascunho.");
    }

    return retryData as AssistantDraft;
  }

  if (error || !data) {
    throw new Error(error?.message || "Não foi possível criar o rascunho.");
  }

  return data as AssistantDraft;
}

export async function createAssistantDrafts(inputs: AssistantDraftInput[]) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin não configurado.");
  }

  if (inputs.length < 3) {
    throw new Error("Envie pelo menos 3 sugestões para aprovação em lote.");
  }

  const drafts = inputs.map((input) => ({
    ...validateDraftInput(input),
    review_token: crypto.randomUUID(),
    status: "pending",
  }));

  const { data, error } = await supabase.from("assistant_drafts").insert(drafts).select("*");

  if (error?.message?.includes("cover_url")) {
    const draftsWithoutCover = drafts.map((draft) => withoutCoverUrl(draft));
    const { data: retryData, error: retryError } = await supabase
      .from("assistant_drafts")
      .insert(draftsWithoutCover)
      .select("*");

    if (retryError || !retryData) {
      throw new Error(retryError?.message || "Não foi possível criar os rascunhos.");
    }

    return retryData as AssistantDraft[];
  }

  if (error || !data) {
    throw new Error(error?.message || "Não foi possível criar os rascunhos.");
  }

  return data as AssistantDraft[];
}

export async function getAssistantDraftByToken(token: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("assistant_drafts")
    .select("*")
    .eq("review_token", token)
    .maybeSingle();

  return (data || null) as AssistantDraft | null;
}

async function createUniquePostSlug(title: string) {
  const supabase = getSupabaseAdminClient();
  const baseSlug = slugify(title).slice(0, 70) || `post-${Date.now()}`;
  if (!supabase) return baseSlug;

  for (let index = 0; index < 10; index += 1) {
    const slug = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`;
    const { data } = await supabase
      .from("movement_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function approveAssistantDraft(token: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin não configurado.");
  }

  const draft = await getAssistantDraftByToken(token);
  if (!draft) throw new Error("Rascunho não encontrado.");
  if (draft.status !== "pending") return draft;

  const now = new Date().toISOString();
  const slug = await createUniquePostSlug(draft.title);

  const postPayload = {
    title: draft.title,
    slug,
    subtitle: draft.subtitle,
    body: draft.body,
    category: draft.category,
    tags: draft.tags,
    source_name: draft.source_name,
    source_url: draft.source_url,
    cover_url: draft.cover_url || null,
    status: "published" as const,
    published_at: now,
  };

  const { data: post, error: postError } = await supabase
    .from("movement_posts")
    .insert(postPayload)
    .select("*")
    .single();

  if (postError?.message?.includes("cover_url")) {
    const { data: retryPost, error: retryPostError } = await supabase
      .from("movement_posts")
      .insert(withoutCoverUrl(postPayload))
      .select("*")
      .single();

    if (retryPostError || !retryPost) {
      throw new Error(retryPostError?.message || "Não foi possível publicar o conteúdo.");
    }

    return updateApprovedDraft(token, now, retryPost as MovementPost);
  }

  if (postError || !post) {
    throw new Error(postError?.message || "Não foi possível publicar o conteúdo.");
  }

  return updateApprovedDraft(token, now, post as MovementPost);
}

async function updateApprovedDraft(token: string, now: string, post: MovementPost) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin não configurado.");
  }

  const { data, error } = await supabase
    .from("assistant_drafts")
    .update({
      status: "approved",
      approved_at: now,
      published_post_id: post.id,
    })
    .eq("review_token", token)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Conteúdo publicado, mas rascunho não atualizado.");
  }

  revalidatePath("/movimento");
  revalidatePath("/movimento/conteudos-recentes");

  return data as AssistantDraft;
}

export async function rejectAssistantDraft(token: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin não configurado.");
  }

  const { data, error } = await supabase
    .from("assistant_drafts")
    .update({
      status: "rejected",
      rejected_at: new Date().toISOString(),
    })
    .eq("review_token", token)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Não foi possível rejeitar o rascunho.");
  }

  return data as AssistantDraft;
}

export async function markDraftWhatsappSent(id: string, recipient: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  await supabase
    .from("assistant_drafts")
    .update({
      whatsapp_recipient: recipient,
      whatsapp_sent_at: new Date().toISOString(),
    })
    .eq("id", id);
}

export async function markDraftsWhatsappSent(ids: string[], recipient: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase || !ids.length) return;

  await supabase
    .from("assistant_drafts")
    .update({
      whatsapp_recipient: recipient,
      whatsapp_sent_at: new Date().toISOString(),
    })
    .in("id", ids);
}
