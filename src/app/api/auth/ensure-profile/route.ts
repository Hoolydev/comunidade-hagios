import { NextResponse } from "next/server";
import { ensureProfile, getCurrentUser } from "@/lib/auth";
import { hasProfileIntake, normalizeProfileIntake } from "@/lib/profile-intake";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { profile?: unknown };
  const profileIntake = normalizeProfileIntake(body.profile);
  let profile = await ensureProfile(user.id, user.email);

  if (hasProfileIntake(profileIntake)) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          ...profileIntake,
        },
      });

      const { data } = await supabase
        .from("profiles")
        .update(profileIntake)
        .eq("user_id", user.id)
        .select("*")
        .maybeSingle();

      profile = (data as Profile | null) || profile;
    }
  }

  return NextResponse.json({ profile });
}
