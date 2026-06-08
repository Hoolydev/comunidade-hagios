import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { categories, DEFAULT_WHATSAPP_LINK } from "@/lib/constants";
import {
  getMockCourseWithLessons,
  mockChallenges,
  mockCourses,
  mockEvents,
  mockJourneyTracks,
  mockLessons,
  mockMaterials,
  mockMentorships,
  mockNextActions,
  mockQuestions,
  mockRecentContents,
  mockTools,
} from "@/lib/mock-data";
import type {
  Challenge,
  ChallengeDay,
  CommunityEvent,
  CommunityPost,
  CommunityQuestion,
  Course,
  CourseWithLessons,
  Lesson,
  Material,
  Mentorship,
  NextAction,
  Profile,
  RecentContent,
  ToolResource,
} from "@/lib/types";
import { getYouTubeThumbnail, getYouTubeVideoId } from "@/lib/youtube";

function isCompleteWhatsappInvite(value?: string | null) {
  return Boolean(value && /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9_-]+$/.test(value));
}

function published<T extends { is_published: boolean }>(items: T[]) {
  return items.filter((item) => item.is_published);
}

export async function getCourses({ includeDrafts = false } = {}) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return includeDrafts ? mockCourses : published(mockCourses);
  }

  let query = supabase.from("courses").select("*").order("created_at", {
    ascending: false,
  });

  if (!includeDrafts) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error || !data) return includeDrafts ? mockCourses : published(mockCourses);

  return data as Course[];
}

export async function getLessons({ includeDrafts = false } = {}) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return includeDrafts ? mockLessons : published(mockLessons);
  }

  let query = supabase.from("lessons").select("*").order("order_index", {
    ascending: true,
  });

  if (!includeDrafts) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error || !data) return includeDrafts ? mockLessons : published(mockLessons);

  return data as Lesson[];
}

export async function getMaterials({ includeDrafts = false } = {}) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return includeDrafts ? mockMaterials : published(mockMaterials);
  }

  let query = supabase.from("materials").select("*").order("created_at", {
    ascending: false,
  });

  if (!includeDrafts) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error || !data) return includeDrafts ? mockMaterials : published(mockMaterials);

  return data as Material[];
}

export async function getCourseBySlug(slug: string): Promise<CourseWithLessons | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return getMockCourseWithLessons(slug);

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !course) return getMockCourseWithLessons(slug);

  const [{ data: lessons }, { data: materials }] = await Promise.all([
    supabase
      .from("lessons")
      .select("*")
      .eq("course_id", course.id)
      .eq("is_published", true)
      .order("order_index", { ascending: true }),
    supabase
      .from("materials")
      .select("*")
      .eq("course_id", course.id)
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
  ]);

  return {
    ...(course as Course),
    lessons: (lessons || []) as Lesson[],
    materials: (materials || []) as Material[],
  };
}

export async function getContentCards() {
  const [courses, lessons, materials] = await Promise.all([
    getCourses(),
    getLessons(),
    getMaterials(),
  ]);
  const coursesById = new Map(courses.map((course) => [course.id, course]));

  return [
    ...courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      thumbnail: course.thumbnail_url,
      type: "curso" as const,
      href: `/comunidade/cursos/${course.slug}`,
      created_at: course.created_at,
    })),
    ...lessons.map((lesson) => {
      const course = coursesById.get(lesson.course_id);

      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        category: course?.category || "Marketing com IA",
        thumbnail: getYouTubeThumbnail(lesson.youtube_video_id),
        type: "vídeo" as const,
        href: course ? `/comunidade/cursos/${course.slug}` : "/comunidade/cursos",
        created_at: lesson.created_at,
      };
    }),
    ...materials.map((material) => ({
      id: material.id,
      title: material.title,
      description: material.description,
      category: material.category,
      thumbnail: null,
      type: "material" as const,
      href: material.file_url,
      created_at: material.created_at,
    })),
  ].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function getDashboardStats() {
  const [courses, lessons, materials] = await Promise.all([
    getCourses(),
    getLessons(),
    getMaterials(),
  ]);

  return {
    courses: courses.length,
    lessons: lessons.length,
    materials: materials.length,
  };
}

export async function getNextActions({ includeDrafts = false } = {}): Promise<NextAction[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return mockNextActions;

  let query = supabase
    .from("next_actions")
    .select("*")
    .order("order_index", { ascending: true });
  if (!includeDrafts) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error || !data) return includeDrafts ? [] : mockNextActions;
  if (!includeDrafts && data.length === 0) return mockNextActions;

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    href: row.href,
    label: row.label,
    priority: row.priority as NextAction["priority"],
  }));
}

export async function getJourneyTracks() {
  return mockJourneyTracks;
}

export async function getRecentContents() {
  const posts = await getCommunityPosts();
  const postContents: RecentContent[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.subtitle || post.body.slice(0, 150),
    category: post.category,
    type: "Atualização",
    published_at: post.published_at || post.created_at,
    href: `/comunidade/posts/${post.slug}`,
    source_name: post.source_name,
    source_url: post.source_url,
  }));

  return [...postContents, ...mockRecentContents].sort(
    (a, b) => +new Date(b.published_at) - +new Date(a.published_at),
  );
}

export async function getCommunityPosts() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [] as CommunityPost[];

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [] as CommunityPost[];

  return data as CommunityPost[];
}

export async function getCommunityPostBySlug(slug: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;

  return data as CommunityPost;
}

export async function getMentorships({ includeDrafts = false } = {}): Promise<Mentorship[]> {
  const fallback = [...mockMentorships].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const supabase = getSupabaseAdminClient();
  if (!supabase) return fallback;

  let query = supabase.from("mentorships").select("*").order("date", { ascending: false });
  if (!includeDrafts) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error || !data) return includeDrafts ? [] : fallback;
  if (!includeDrafts && data.length === 0) return fallback;

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    teacher: row.teacher,
    date: row.date,
    recording_url: row.recording_url,
    materials: row.materials || [],
    related_challenge: row.related_challenge,
  }));
}

export async function getChallenges({ includeDrafts = false } = {}): Promise<Challenge[]> {
  const fallback = [...mockChallenges].sort(
    (a, b) => +new Date(b.published_at) - +new Date(a.published_at),
  );
  const supabase = getSupabaseAdminClient();
  if (!supabase) return fallback;

  let query = supabase
    .from("challenges")
    .select("*")
    .order("published_at", { ascending: false });
  if (!includeDrafts) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error || !data) return includeDrafts ? [] : fallback;
  if (!includeDrafts && data.length === 0) return fallback;

  return data.map((row) => ({
    id: row.id,
    theme: row.theme,
    description: row.description,
    objective: row.objective,
    days: (row.days as ChallengeDay[]) || [],
    material_url: row.material_url,
    expected_result: row.expected_result,
    participants: row.participants,
    completion_rate: row.completion_rate,
    ranking: (row.ranking as Array<{ name: string; points: number }>) || [],
    published_at: row.published_at,
  }));
}

export async function getTools({ includeDrafts = false } = {}): Promise<ToolResource[]> {
  const fallback = [...mockTools].sort(
    (a, b) => +new Date(b.updated_at) - +new Date(a.updated_at),
  );
  const supabase = getSupabaseAdminClient();
  if (!supabase) return fallback;

  let query = supabase.from("tools").select("*").order("updated_at", { ascending: false });
  if (!includeDrafts) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error || !data) return includeDrafts ? [] : fallback;
  if (!includeDrafts && data.length === 0) return fallback;

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as ToolResource["category"],
    url: row.url,
    updated_at: row.updated_at,
  }));
}

export async function getCommunityQuestions({ includeDrafts = false } = {}): Promise<
  CommunityQuestion[]
> {
  const fallback = [...mockQuestions].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
  const supabase = getSupabaseAdminClient();
  if (!supabase) return fallback;

  let query = supabase
    .from("community_questions")
    .select("*")
    .order("created_at", { ascending: false });
  if (!includeDrafts) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error || !data) return includeDrafts ? [] : fallback;
  if (!includeDrafts && data.length === 0) return fallback;

  return data.map((row) => ({
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    author: row.author,
    answered_by: row.answered_by,
    created_at: row.created_at,
  }));
}

export async function getCommunityEvents({ includeDrafts = false } = {}): Promise<
  CommunityEvent[]
> {
  const fallback = [...mockEvents].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const supabase = getSupabaseAdminClient();
  if (!supabase) return fallback;

  let query = supabase.from("community_events").select("*").order("date", { ascending: true });
  if (!includeDrafts) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error || !data) return includeDrafts ? [] : fallback;
  if (!includeDrafts && data.length === 0) return fallback;

  return data.map((row) => ({
    id: row.id,
    type: row.type as CommunityEvent["type"],
    title: row.title,
    description: row.description,
    date: row.date,
    href: row.href,
  }));
}

export async function getWhatsappLink() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return DEFAULT_WHATSAPP_LINK;

  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "whatsapp_group_url")
    .maybeSingle();

  return isCompleteWhatsappInvite(data?.value) ? data!.value : DEFAULT_WHATSAPP_LINK;
}

export async function getSettingsMap(): Promise<Record<string, string>> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return {};

  const { data } = await supabase.from("settings").select("key, value");
  if (!data) return {};

  return Object.fromEntries(
    data.map((row) => [row.key as string, (row.value as string) ?? ""]),
  );
}

export type WelcomeContent = {
  eyebrow: string;
  label: string;
  title: string;
  description: string;
  video_url: string;
  video_id: string;
};

export const DEFAULT_WELCOME: WelcomeContent = {
  eyebrow: "Centro de evolução empresarial",
  label: "Aula de boas-vindas",
  title: "Reassista quando precisar",
  description:
    "Um guia rápido para entender a Jornada Hágios, conteúdos vivos, mentorias, desafios e ferramentas.",
  video_url: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
  video_id: "M7lc1UVf-VE",
};

export async function getWelcomeContent(): Promise<WelcomeContent> {
  const settings = await getSettingsMap();
  const videoUrl = settings.hero_welcome_video_url || DEFAULT_WELCOME.video_url;

  return {
    eyebrow: settings.hero_welcome_eyebrow || DEFAULT_WELCOME.eyebrow,
    label: settings.hero_welcome_label || DEFAULT_WELCOME.label,
    title: settings.hero_welcome_title || DEFAULT_WELCOME.title,
    description: settings.hero_welcome_description || DEFAULT_WELCOME.description,
    video_url: videoUrl,
    video_id: getYouTubeVideoId(videoUrl) || DEFAULT_WELCOME.video_id,
  };
}

type CmsTable =
  | "next_actions"
  | "community_events"
  | "mentorships"
  | "challenges"
  | "tools"
  | "community_questions";

/**
 * Raw rows for the admin CMS forms — returns every column (including drafts and
 * publication flags) so edit forms can prefill correctly. Empty when Supabase is
 * not configured (admin can only manage real DB rows).
 */
export async function getAdminRows(
  table: CmsTable,
  orderColumn: string,
  ascending = false,
): Promise<Record<string, unknown>[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from(table)
    .select("*")
    .order(orderColumn, { ascending });

  return (data || []) as unknown as Record<string, unknown>[];
}

export async function getAdminUsers() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [] as Profile[];

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (data || []) as Profile[];
}

export { categories };
