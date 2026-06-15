export type UserRole = "admin" | "member";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "canceled"
  | "past_due"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "none";

export type Profile = {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  company_role: string | null;
  company_name: string | null;
  company_sector: string | null;
  phone: string | null;
  city_state: string | null;
  urgent_operation_1: string | null;
  urgent_operation_2: string | null;
  urgent_operation_3: string | null;
  role: UserRole;
  stripe_customer_id: string | null;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  category: string;
  is_published: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content_type?: "video" | "text";
  body?: string | null;
  youtube_url: string;
  youtube_video_id: string;
  video_format?: "desktop" | "vertical";
  order_index: number;
  available_at?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Material = {
  id: string;
  course_id: string | null;
  lesson_id: string | null;
  title: string;
  description: string;
  file_url: string;
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type CourseWithLessons = Course & {
  lessons: Lesson[];
  materials: Material[];
};

export type JourneyLesson = {
  id: string;
  title: string;
  duration: string;
  description: string;
  status: "available" | "new" | "recommended";
};

export type JourneyModule = {
  id: string;
  title: string;
  description: string;
  lessons: JourneyLesson[];
};

export type JourneyTrack = {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  modules: JourneyModule[];
};

export type RecentContent = {
  id: string;
  title: string;
  description: string;
  cover_url?: string | null;
  category: string;
  type: "Vídeo" | "Atualização" | "Ferramenta" | "Caso prático" | "Tendência";
  published_at: string;
  duration?: string;
  href: string;
  source_name?: string | null;
  source_url?: string | null;
};

export type CommunityPost = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  body: string;
  category: string;
  tags: string[];
  source_name: string | null;
  source_url: string | null;
  cover_url?: string | null;
  status: "published" | "draft" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AssistantDraft = {
  id: string;
  title: string;
  subtitle: string | null;
  body: string;
  category: string;
  tags: string[];
  source_name: string | null;
  source_url: string | null;
  cover_url?: string | null;
  status: "pending" | "approved" | "rejected";
  review_token: string;
  whatsapp_recipient: string | null;
  whatsapp_sent_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  published_post_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Mentorship = {
  id: string;
  title: string;
  description: string;
  teacher: string;
  date: string;
  recording_url: string | null;
  materials: string[];
  related_challenge: string | null;
};

export type ChallengeDay = {
  day: number;
  title: string;
  description: string;
  completed: boolean;
};

export type Challenge = {
  id: string;
  theme: string;
  description: string;
  objective: string;
  days: ChallengeDay[];
  material_url: string;
  expected_result: string;
  participants: number;
  completion_rate: number;
  ranking: Array<{ name: string; points: number }>;
  published_at: string;
};

export type ToolResource = {
  id: string;
  title: string;
  description: string;
  category:
    | "Prompts"
    | "Templates"
    | "Checklists"
    | "Planilhas"
    | "Fluxogramas"
    | "E-books"
    | "Guias"
    | "Ferramentas recomendadas"
    | "Automações";
  url: string;
  updated_at: string;
};

export type CommunityQuestion = {
  id: string;
  question: string;
  answer: string;
  category: string;
  author: string;
  answered_by: string;
  created_at: string;
};

export type NextAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  label: string;
  priority: "high" | "medium" | "low";
};

export type CommunityEvent = {
  id: string;
  type: "Mentoria" | "Votação" | "Desafio";
  title: string;
  description: string;
  date: string;
  href: string;
};

export const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  "active",
  "trialing",
];
