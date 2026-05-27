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
        youtube_url: string;
        youtube_video_id: string;
        order_index: number;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
