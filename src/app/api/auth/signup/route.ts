import { NextResponse } from "next/server";
import { ensureProfile } from "@/lib/auth";
import { hasProfileIntake, normalizeProfileIntake } from "@/lib/profile-intake";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Cria a conta JÁ CONFIRMADA (email_confirm: true) usando a service role.
 * Isso elimina o e-mail de confirmação independentemente do toggle do projeto,
 * permitindo cadastro + checkout na mesma tela, sem fricção.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
    profile?: unknown;
  };

  const email = (body.email || "").trim();
  const password = body.password || "";
  const profileIntake = normalizeProfileIntake(body.profile);
  const name = profileIntake.name || email.split("@")[0];

  if (!email || password.length < 6) {
    return NextResponse.json(
      { error: "Informe um e-mail válido e senha de no mínimo 6 caracteres." },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Autenticação não configurada no ambiente." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      ...profileIntake,
      name,
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    const alreadyExists =
      message.includes("already") ||
      message.includes("registered") ||
      message.includes("exists");

    if (alreadyExists) {
      return NextResponse.json({ status: "exists" });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (data.user) {
    await ensureProfile(data.user.id, data.user.email);
    if (hasProfileIntake(profileIntake)) {
      await supabase
        .from("profiles")
        .update({
          ...profileIntake,
          name,
        })
        .eq("user_id", data.user.id);
    }
  }

  return NextResponse.json({ status: "created" });
}
