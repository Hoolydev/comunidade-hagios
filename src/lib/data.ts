import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { categories } from "@/lib/constants";
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
  CommunityPost,
  Course,
  CourseWithLessons,
  Lesson,
  Material,
  Profile,
  RecentContent,
} from "@/lib/types";
import { getYouTubeThumbnail } from "@/lib/youtube";

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

export async function getNextActions() {
  return mockNextActions;
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

export async function getMentorships() {
  return [...mockMentorships].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getChallenges() {
  return [...mockChallenges].sort(
    (a, b) => +new Date(b.published_at) - +new Date(a.published_at),
  );
}

export async function getTools() {
  return [...mockTools].sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
}

export async function getCommunityQuestions() {
  return [...mockQuestions].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}

export async function getCommunityEvents() {
  return [...mockEvents].sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export async function getWhatsappLink() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return "https://chat.whatsapp.com/";

  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "whatsapp_group_url")
    .maybeSingle();

  return data?.value || "https://chat.whatsapp.com/";
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
