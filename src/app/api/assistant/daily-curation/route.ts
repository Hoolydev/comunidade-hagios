import { NextRequest, NextResponse } from "next/server";
import { runDailyAssistantCuration } from "@/lib/assistant/daily-curation";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(request: NextRequest) {
  const secrets = [process.env.CRON_SECRET, process.env.ASSISTANT_API_SECRET].filter(Boolean);
  if (!secrets.length) return false;

  const authorization = request.headers.get("authorization") || "";
  const headerSecret = request.headers.get("x-assistant-secret") || "";

  return secrets.some((secret) => authorization === `Bearer ${secret}` || headerSecret === secret);
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const result = await runDailyAssistantCuration(3);
    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Erro ao executar curadoria diária.",
      },
      { status: 400 },
    );
  }
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
