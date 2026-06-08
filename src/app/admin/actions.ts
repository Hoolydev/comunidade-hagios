"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { slugify } from "@/lib/utils";
import { getYouTubeVideoId } from "@/lib/youtube";

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function videoFormat(formData: FormData): "desktop" | "vertical" {
  return value(formData, "video_format") === "vertical" ? "vertical" : "desktop";
}

function contentType(formData: FormData): "video" | "text" {
  return value(formData, "content_type") === "text" ? "text" : "video";
}

function optionalDate(formData: FormData, key: string): string | null {
  const raw = value(formData, key);
  return raw ? new Date(raw).toISOString() : null;
}

function requireAdminClient() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin nao configurado.");
  }
  return supabase;
}

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/comunidade");
  revalidatePath("/comunidade/conteudos");
  revalidatePath("/comunidade/materiais");
}

const NEW_LESSON_COLUMNS = ["video_format", "content_type", "body", "available_at"] as const;

type LessonInsertPayload = Database["public"]["Tables"]["lessons"]["Insert"];
type LessonUpdatePayload = Database["public"]["Tables"]["lessons"]["Update"];

function missingLessonColumn(error: { message?: string } | null) {
  const message = error?.message || "";
  return NEW_LESSON_COLUMNS.find((column) => message.includes(column));
}

async function insertLessonWithFallback(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  payload: LessonInsertPayload,
) {
  const insertPayload = { ...payload };

  for (let attempt = 0; attempt <= NEW_LESSON_COLUMNS.length; attempt += 1) {
    const { error } = await supabase.from("lessons").insert(insertPayload);
    if (!error) return;

    const missingColumn = missingLessonColumn(error);
    if (!missingColumn || !(missingColumn in insertPayload)) throw new Error(error.message);
    delete insertPayload[missingColumn as keyof typeof insertPayload];
  }

  throw new Error("Nao foi possivel criar a aula.");
}

async function updateLessonWithFallback(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  id: string,
  payload: LessonUpdatePayload,
) {
  const updatePayload = { ...payload };

  for (let attempt = 0; attempt <= NEW_LESSON_COLUMNS.length; attempt += 1) {
    const { error } = await supabase.from("lessons").update(updatePayload).eq("id", id);
    if (!error) return;

    const missingColumn = missingLessonColumn(error);
    if (!missingColumn || !(missingColumn in updatePayload)) throw new Error(error.message);
    delete updatePayload[missingColumn as keyof typeof updatePayload];
  }

  throw new Error("Nao foi possivel atualizar a aula.");
}

export async function createCourse(formData: FormData) {
  await requireAdmin();
  const supabase = requireAdminClient();
  const title = value(formData, "title");

  await supabase.from("courses").insert({
    title,
    slug: slugify(value(formData, "slug") || title),
    description: value(formData, "description"),
    thumbnail_url: value(formData, "thumbnail_url") || null,
    category: value(formData, "category"),
    is_published: checked(formData, "is_published"),
    is_featured: checked(formData, "is_featured"),
  });

  revalidateAdmin();
}

export async function updateCourse(formData: FormData) {
  await requireAdmin();
  const supabase = requireAdminClient();
  const title = value(formData, "title");

  await supabase
    .from("courses")
    .update({
      title,
      slug: slugify(value(formData, "slug") || title),
      description: value(formData, "description"),
      thumbnail_url: value(formData, "thumbnail_url") || null,
      category: value(formData, "category"),
      is_published: checked(formData, "is_published"),
      is_featured: checked(formData, "is_featured"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", value(formData, "id"));

  revalidateAdmin();
}

export async function deleteCourse(formData: FormData) {
  await requireAdmin();
  await requireAdminClient().from("courses").delete().eq("id", value(formData, "id"));
  revalidateAdmin();
}

export async function createLesson(formData: FormData) {
  await requireAdmin();
  const supabase = requireAdminClient();
  const youtubeUrl = value(formData, "youtube_url");

  const payload: LessonInsertPayload = {
    course_id: value(formData, "course_id"),
    title: value(formData, "title"),
    description: value(formData, "description"),
    content_type: contentType(formData),
    body: value(formData, "body") || null,
    youtube_url: youtubeUrl,
    youtube_video_id: getYouTubeVideoId(youtubeUrl),
    video_format: videoFormat(formData),
    order_index: Number(value(formData, "order_index") || 1),
    available_at: optionalDate(formData, "available_at"),
    is_published: checked(formData, "is_published"),
  };

  await insertLessonWithFallback(supabase, payload);

  revalidateAdmin();
}

export async function updateLesson(formData: FormData) {
  await requireAdmin();
  const supabase = requireAdminClient();
  const youtubeUrl = value(formData, "youtube_url");

  const payload: LessonUpdatePayload = {
    course_id: value(formData, "course_id"),
    title: value(formData, "title"),
    description: value(formData, "description"),
    content_type: contentType(formData),
    body: value(formData, "body") || null,
    youtube_url: youtubeUrl,
    youtube_video_id: getYouTubeVideoId(youtubeUrl),
    video_format: videoFormat(formData),
    order_index: Number(value(formData, "order_index") || 1),
    available_at: optionalDate(formData, "available_at"),
    is_published: checked(formData, "is_published"),
    updated_at: new Date().toISOString(),
  };

  await updateLessonWithFallback(supabase, value(formData, "id"), payload);

  revalidateAdmin();
}

export async function deleteLesson(formData: FormData) {
  await requireAdmin();
  await requireAdminClient().from("lessons").delete().eq("id", value(formData, "id"));
  revalidateAdmin();
}

export async function createMaterial(formData: FormData) {
  await requireAdmin();
  const supabase = requireAdminClient();

  await supabase.from("materials").insert({
    course_id: value(formData, "course_id") || null,
    lesson_id: value(formData, "lesson_id") || null,
    title: value(formData, "title"),
    description: value(formData, "description"),
    file_url: value(formData, "file_url"),
    category: value(formData, "category"),
    is_published: checked(formData, "is_published"),
  });

  revalidateAdmin();
}

export async function updateMaterial(formData: FormData) {
  await requireAdmin();
  const supabase = requireAdminClient();

  await supabase
    .from("materials")
    .update({
      course_id: value(formData, "course_id") || null,
      lesson_id: value(formData, "lesson_id") || null,
      title: value(formData, "title"),
      description: value(formData, "description"),
      file_url: value(formData, "file_url"),
      category: value(formData, "category"),
      is_published: checked(formData, "is_published"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", value(formData, "id"));

  revalidateAdmin();
}

export async function deleteMaterial(formData: FormData) {
  await requireAdmin();
  await requireAdminClient().from("materials").delete().eq("id", value(formData, "id"));
  revalidateAdmin();
}

export async function updateWhatsappLink(formData: FormData) {
  await requireAdmin();
  await requireAdminClient().from("settings").upsert(
    {
      key: "whatsapp_group_url",
      value: value(formData, "whatsapp_group_url"),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  revalidatePath("/comunidade/whatsapp");
  revalidatePath("/comunidade");
  revalidatePath("/admin");
}

// ---------------------------------------------------------------------------
// CMS da comunidade (Próximo passo, Eventos, Mentorias, Desafios, Ferramentas,
// Dúvidas) + banner "Aula de boas-vindas".
// ---------------------------------------------------------------------------

function number(formData: FormData, key: string) {
  return Number(value(formData, key) || 0);
}

function dateValue(formData: FormData, key: string) {
  const raw = value(formData, key);
  return raw ? new Date(raw).toISOString() : new Date().toISOString();
}

function lines(formData: FormData, key: string) {
  return value(formData, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function jsonValue(formData: FormData, key: string) {
  try {
    return JSON.parse(value(formData, key) || "[]");
  } catch {
    return [];
  }
}

function revalidateCommunity() {
  revalidatePath("/admin");
  revalidatePath("/comunidade");
  revalidatePath("/comunidade/mentorias");
  revalidatePath("/comunidade/desafios");
  revalidatePath("/comunidade/ferramentas");
  revalidatePath("/comunidade/duvidas");
}

async function deleteRow(table: string, id: string) {
  await requireAdmin();
  await requireAdminClient().from(table).delete().eq("id", id);
  revalidateCommunity();
}

// Banner "Aula de boas-vindas" -------------------------------------------------
export async function updateWelcome(formData: FormData) {
  await requireAdmin();
  const supabase = requireAdminClient();
  const entries: Array<[string, string]> = [
    ["hero_welcome_eyebrow", value(formData, "eyebrow")],
    ["hero_welcome_label", value(formData, "label")],
    ["hero_welcome_title", value(formData, "title")],
    ["hero_welcome_description", value(formData, "description")],
    ["hero_welcome_video_url", value(formData, "video_url")],
  ];

  await supabase.from("settings").upsert(
    entries.map(([key, val]) => ({
      key,
      value: val,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "key" },
  );
  revalidatePath("/comunidade");
  revalidatePath("/admin");
}

// Próximo passo ----------------------------------------------------------------
function nextActionPayload(formData: FormData) {
  return {
    title: value(formData, "title"),
    description: value(formData, "description"),
    href: value(formData, "href") || "/comunidade",
    label: value(formData, "label") || "Abrir",
    priority: (value(formData, "priority") || "medium") as "high" | "medium" | "low",
    order_index: number(formData, "order_index"),
    is_published: checked(formData, "is_published"),
  };
}

export async function createNextAction(formData: FormData) {
  await requireAdmin();
  await requireAdminClient().from("next_actions").insert(nextActionPayload(formData));
  revalidateCommunity();
}

export async function updateNextAction(formData: FormData) {
  await requireAdmin();
  await requireAdminClient()
    .from("next_actions")
    .update({ ...nextActionPayload(formData), updated_at: new Date().toISOString() })
    .eq("id", value(formData, "id"));
  revalidateCommunity();
}

export async function deleteNextAction(formData: FormData) {
  await deleteRow("next_actions", value(formData, "id"));
}

// Eventos ----------------------------------------------------------------------
function eventPayload(formData: FormData) {
  return {
    type: value(formData, "type") || "Mentoria",
    title: value(formData, "title"),
    description: value(formData, "description"),
    date: dateValue(formData, "date"),
    href: value(formData, "href") || "/comunidade",
    is_published: checked(formData, "is_published"),
  };
}

export async function createEvent(formData: FormData) {
  await requireAdmin();
  await requireAdminClient().from("community_events").insert(eventPayload(formData));
  revalidateCommunity();
}

export async function updateEvent(formData: FormData) {
  await requireAdmin();
  await requireAdminClient()
    .from("community_events")
    .update({ ...eventPayload(formData), updated_at: new Date().toISOString() })
    .eq("id", value(formData, "id"));
  revalidateCommunity();
}

export async function deleteEvent(formData: FormData) {
  await deleteRow("community_events", value(formData, "id"));
}

// Mentorias --------------------------------------------------------------------
function mentorshipPayload(formData: FormData) {
  return {
    title: value(formData, "title"),
    description: value(formData, "description"),
    teacher: value(formData, "teacher") || "Time Hágios",
    date: dateValue(formData, "date"),
    recording_url: value(formData, "recording_url") || null,
    materials: lines(formData, "materials"),
    related_challenge: value(formData, "related_challenge") || null,
    is_published: checked(formData, "is_published"),
  };
}

export async function createMentorship(formData: FormData) {
  await requireAdmin();
  await requireAdminClient().from("mentorships").insert(mentorshipPayload(formData));
  revalidateCommunity();
}

export async function updateMentorship(formData: FormData) {
  await requireAdmin();
  await requireAdminClient()
    .from("mentorships")
    .update({ ...mentorshipPayload(formData), updated_at: new Date().toISOString() })
    .eq("id", value(formData, "id"));
  revalidateCommunity();
}

export async function deleteMentorship(formData: FormData) {
  await deleteRow("mentorships", value(formData, "id"));
}

// Desafios ---------------------------------------------------------------------
function challengePayload(formData: FormData) {
  return {
    theme: value(formData, "theme"),
    description: value(formData, "description"),
    objective: value(formData, "objective"),
    days: jsonValue(formData, "days"),
    material_url: value(formData, "material_url"),
    expected_result: value(formData, "expected_result"),
    participants: number(formData, "participants"),
    completion_rate: number(formData, "completion_rate"),
    ranking: jsonValue(formData, "ranking"),
    is_published: checked(formData, "is_published"),
  };
}

export async function createChallenge(formData: FormData) {
  await requireAdmin();
  await requireAdminClient().from("challenges").insert(challengePayload(formData));
  revalidateCommunity();
}

export async function updateChallenge(formData: FormData) {
  await requireAdmin();
  await requireAdminClient()
    .from("challenges")
    .update({ ...challengePayload(formData), updated_at: new Date().toISOString() })
    .eq("id", value(formData, "id"));
  revalidateCommunity();
}

export async function deleteChallenge(formData: FormData) {
  await deleteRow("challenges", value(formData, "id"));
}

// Ferramentas ------------------------------------------------------------------
function toolPayload(formData: FormData) {
  return {
    title: value(formData, "title"),
    description: value(formData, "description"),
    category: value(formData, "category") || "Ferramentas recomendadas",
    url: value(formData, "url"),
    is_published: checked(formData, "is_published"),
  };
}

export async function createTool(formData: FormData) {
  await requireAdmin();
  await requireAdminClient().from("tools").insert(toolPayload(formData));
  revalidateCommunity();
}

export async function updateTool(formData: FormData) {
  await requireAdmin();
  await requireAdminClient()
    .from("tools")
    .update({ ...toolPayload(formData), updated_at: new Date().toISOString() })
    .eq("id", value(formData, "id"));
  revalidateCommunity();
}

export async function deleteTool(formData: FormData) {
  await deleteRow("tools", value(formData, "id"));
}

// Dúvidas ----------------------------------------------------------------------
function questionPayload(formData: FormData) {
  return {
    question: value(formData, "question"),
    answer: value(formData, "answer"),
    category: value(formData, "category") || "Jornada",
    author: value(formData, "author") || "Membro da comunidade",
    answered_by: value(formData, "answered_by") || "Time Hágios",
    is_published: checked(formData, "is_published"),
  };
}

export async function createQuestion(formData: FormData) {
  await requireAdmin();
  await requireAdminClient().from("community_questions").insert(questionPayload(formData));
  revalidateCommunity();
}

export async function updateQuestion(formData: FormData) {
  await requireAdmin();
  await requireAdminClient()
    .from("community_questions")
    .update({ ...questionPayload(formData), updated_at: new Date().toISOString() })
    .eq("id", value(formData, "id"));
  revalidateCommunity();
}

export async function deleteQuestion(formData: FormData) {
  await deleteRow("community_questions", value(formData, "id"));
}
