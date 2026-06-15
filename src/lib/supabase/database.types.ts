export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<{
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
        role: "admin" | "member";
        stripe_customer_id: string | null;
        subscription_status: string;
        created_at: string;
        updated_at: string;
      }>;
      courses: Table<{
        id: string;
        title: string;
        slug: string;
        description: string;
        thumbnail_url: string | null;
        category: string;
        is_published: boolean;
        is_featured: boolean;
        created_at: string;
        updated_at: string;
      }>;
      lessons: Table<{
        id: string;
        course_id: string;
        title: string;
        description: string | null;
        content_type: "video" | "text";
        body: string | null;
        youtube_url: string;
        youtube_video_id: string;
        video_format: "desktop" | "vertical";
        order_index: number;
        available_at: string | null;
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>;
      materials: Table<{
        id: string;
        course_id: string | null;
        lesson_id: string | null;
        title: string;
        description: string | null;
        file_url: string;
        category: string;
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>;
      settings: Table<{
        id: string;
        key: string;
        value: string;
        created_at: string;
        updated_at: string;
      }>;
      subscriptions: Table<{
        id: string;
        user_id: string;
        stripe_customer_id: string | null;
        stripe_subscription_id: string | null;
        status: string;
        current_period_end: string | null;
        created_at: string;
        updated_at: string;
      }>;
      community_posts: Table<{
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
      }>;
      next_actions: Table<{
        id: string;
        title: string;
        description: string;
        href: string;
        label: string;
        priority: "high" | "medium" | "low";
        order_index: number;
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>;
      community_events: Table<{
        id: string;
        type: string;
        title: string;
        description: string;
        date: string;
        href: string;
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>;
      mentorships: Table<{
        id: string;
        title: string;
        description: string;
        teacher: string;
        date: string;
        recording_url: string | null;
        materials: string[];
        related_challenge: string | null;
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>;
      challenges: Table<{
        id: string;
        theme: string;
        description: string;
        objective: string;
        days: Json;
        material_url: string;
        expected_result: string;
        participants: number;
        completion_rate: number;
        ranking: Json;
        published_at: string;
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>;
      tools: Table<{
        id: string;
        title: string;
        description: string;
        category: string;
        url: string;
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>;
      community_questions: Table<{
        id: string;
        question: string;
        answer: string;
        category: string;
        author: string;
        answered_by: string;
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>;
      assistant_drafts: Table<{
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
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
