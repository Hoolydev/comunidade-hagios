import { NextResponse } from "next/server";
import { getCurrentProfile, getCurrentUser, hasActiveAccess } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, hasAccess: false });
  }

  const profile = await getCurrentProfile();

  return NextResponse.json({
    authenticated: true,
    hasAccess: hasActiveAccess(profile),
    role: profile?.role || "member",
    subscriptionStatus: profile?.subscription_status || "none",
  });
}
