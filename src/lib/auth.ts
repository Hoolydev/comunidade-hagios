import { redirect } from "next/navigation";
import { createSupabaseServerClient, getSupabaseAdminClient } from "@/lib/supabase/server";
import { ACTIVE_SUBSCRIPTION_STATUSES, type Profile } from "@/lib/types";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function ensureProfile(userId: string, email?: string | null) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing as Profile;

  const { data } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      email,
      name: email?.split("@")[0] || null,
      role: "member",
      subscription_status: "none",
    })
    .select("*")
    .single();

  return (data || null) as Profile | null;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase =
    getSupabaseAdminClient() || (await createSupabaseServerClient());
  if (!supabase) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    (data as Profile | null) ||
    (getSupabaseAdminClient() ? await ensureProfile(user.id, user.email) : null)
  );
}

export function hasActiveAccess(profile?: Profile | null) {
  return Boolean(
    profile &&
      ACTIVE_SUBSCRIPTION_STATUSES.includes(profile.subscription_status || "none"),
  );
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireActiveAccess() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  if (!hasActiveAccess(profile)) {
    redirect("/checkout");
  }

  return { user, profile: profile! };
}

export async function requireAdmin() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  if (profile?.role !== "admin") {
    redirect("/movimento");
  }

  return { user, profile };
}
