"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseUrl } from "@/lib/env";

export function createSupabaseBrowserClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  return createBrowserClient(
    getSupabaseUrl()!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
