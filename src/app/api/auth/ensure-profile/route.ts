import { NextResponse } from "next/server";
import { ensureProfile, getCurrentUser } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await ensureProfile(user.id, user.email);
  return NextResponse.json({ profile });
}
