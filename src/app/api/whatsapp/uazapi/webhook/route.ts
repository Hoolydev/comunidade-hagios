import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const secret = process.env.UAZAPI_WEBHOOK_SECRET;
  if (!secret) return true;

  const querySecret = request.nextUrl.searchParams.get("secret");
  const headerSecret =
    request.headers.get("x-uazapi-webhook-secret") ||
    request.headers.get("x-webhook-secret");

  return querySecret === secret || headerSecret === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Webhook não autorizado." }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    provider: "uazapi",
    status: "webhook_ready",
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Webhook não autorizado." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);

  console.log("[uazapi:webhook]", {
    receivedAt: new Date().toISOString(),
    eventType:
      payload?.EventType ||
      payload?.eventType ||
      payload?.type ||
      payload?.event ||
      "unknown",
  });

  return NextResponse.json({
    ok: true,
    received: true,
  });
}
