import { revalidatePath } from "next/cache";
import { getAppUrl } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { AssistantDraft, CommunityPost } from "@/lib/types";
import { slugify } from "@/lib/utils";

export type AssistantDraftInput = {
  title: string;
  subtitle?: string | null;
  body: string;
  category?: string | null;
  tags?: string[] | string | null;
  source_name?: string | null;
  source_url?: string | null;
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
    "title" | "subtitle" | "body" | "category" | "tags" | "source_url" | "review_token"
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
    "Tenho um novo conteúdo para aprovação na Comunidade Hágios.",
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
    "",
    "Se preferir, responda esta mensagem com:",
    `APROVAR ${draft.review_token}`,
    `REJEITAR ${draft.review_token}`,
  ]
    .filter(Boolean)
    .join("\n");
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

  if (error || !data) {
    throw new Error(error?.message || "Não foi possível criar o rascunho.");
  }

  return data as AssistantDraft;
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
      .from("community_posts")
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

  const { data: post, error: postError } = await supabase
    .from("community_posts")
    .insert({
      title: draft.title,
      slug,
      subtitle: draft.subtitle,
      body: draft.body,
      category: draft.category,
      tags: draft.tags,
      source_name: draft.source_name,
      source_url: draft.source_url,
      status: "published",
      published_at: now,
    })
    .select("*")
    .single();

  if (postError || !post) {
    throw new Error(postError?.message || "Não foi possível publicar o conteúdo.");
  }

  const { data, error } = await supabase
    .from("assistant_drafts")
    .update({
      status: "approved",
      approved_at: now,
      published_post_id: (post as CommunityPost).id,
    })
    .eq("review_token", token)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Conteúdo publicado, mas rascunho não atualizado.");
  }

  revalidatePath("/comunidade");
  revalidatePath("/comunidade/conteudos-recentes");

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
