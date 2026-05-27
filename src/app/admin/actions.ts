"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { getYouTubeVideoId } from "@/lib/youtube";

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
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

  await supabase.from("lessons").insert({
    course_id: value(formData, "course_id"),
    title: value(formData, "title"),
    description: value(formData, "description"),
    youtube_url: youtubeUrl,
    youtube_video_id: getYouTubeVideoId(youtubeUrl),
    order_index: Number(value(formData, "order_index") || 1),
    is_published: checked(formData, "is_published"),
  });

  revalidateAdmin();
}

export async function updateLesson(formData: FormData) {
  await requireAdmin();
  const supabase = requireAdminClient();
  const youtubeUrl = value(formData, "youtube_url");

  await supabase
    .from("lessons")
    .update({
      course_id: value(formData, "course_id"),
      title: value(formData, "title"),
      description: value(formData, "description"),
      youtube_url: youtubeUrl,
      youtube_video_id: getYouTubeVideoId(youtubeUrl),
      order_index: Number(value(formData, "order_index") || 1),
      is_published: checked(formData, "is_published"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", value(formData, "id"));

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
