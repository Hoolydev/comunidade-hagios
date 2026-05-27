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
  youtube_url: string;
  youtube_video_id: string;
  order_index: number;
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

export const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  "active",
  "trialing",
];
