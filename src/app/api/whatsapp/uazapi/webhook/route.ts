import { NextRequest, NextResponse } from "next/server";
import { approveAssistantDraft, rejectAssistantDraft } from "@/lib/assistant/content-approval";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type WebhookAction = "approved" | "rejected" | "ignored";

function isAuthorized(request: NextRequest) {
  const secret = process.env.UAZAPI_WEBHOOK_SECRET;
  if (!secret) return true;

  const querySecret = request.nextUrl.searchParams.get("secret");
  const headerSecret =
    request.headers.get("x-uazapi-webhook-secret") ||
    request.headers.get("x-webhook-secret");

  return querySecret === secret || headerSecret === secret;
}

function walkPayload(value: unknown, visitor: (key: string, value: unknown) => void, key = "") {
  visitor(key, value);

  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach((item, index) => walkPayload(item, visitor, String(index)));
    return;
  }

  Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
    walkPayload(childValue, visitor, childKey);
  });
}

function getPayloadString(payload: unknown, keys: string[]) {
  const found: string[] = [];

  walkPayload(payload, (key, value) => {
    if (typeof value !== "string") return;
    if (keys.includes(key.toLowerCase()) && value.trim()) {
      found.push(value.trim());
    }
  });

  return found.sort((a, b) => b.length - a.length)[0] || "";
}

function isOwnMessage(payload: unknown) {
  let fromMe = false;

  walkPayload(payload, (key, value) => {
    if (key.toLowerCase() === "fromme" && value === true) {
      fromMe = true;
    }
  });

  return fromMe;
}

function extractIncomingText(payload: unknown) {
  return getPayloadString(payload, [
    "text",
    "body",
    "message",
    "conversation",
    "caption",
    "content",
  ]);
}

function extractSenderPhone(payload: unknown) {
  const value = getPayloadString(payload, [
    "from",
    "sender",
    "phone",
    "number",
    "chatid",
    "remotejid",
    "participant",
  ]);

  return value.replace(/\D/g, "");
}

function phoneCandidates(phone: string) {
  const candidates = new Set<string>();
  const digits = phone.replace(/\D/g, "");
  if (!digits) return [];

  candidates.add(digits);

  if (digits.startsWith("55") && digits.length === 13) {
    candidates.add(`${digits.slice(0, 4)}${digits.slice(5)}`);
  }

  if (digits.startsWith("55") && digits.length === 12) {
    candidates.add(`${digits.slice(0, 4)}9${digits.slice(4)}`);
  }

  return Array.from(candidates);
}

function detectDecision(text: string): Exclude<WebhookAction, "ignored"> | null {
  const normalized = text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  if (/\b(rejeitar|rejeitado|recusar|recusado|nao aprovar|nao publicar)\b/.test(normalized)) {
    return "rejected";
  }

  if (/\b(aprovar|aprovado|publicar|pode publicar|sim)\b/.test(normalized)) {
    return "approved";
  }

  return null;
}

function extractReviewToken(text: string) {
  return (
    text.match(/assistente\/aprovacao\/([0-9a-f-]{36})/i)?.[1] ||
    text.match(/\b(?:aprovar|rejeitar|publicar|recusar)\s+([0-9a-f-]{36})\b/i)?.[1] ||
    text.match(/\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i)?.[1] ||
    null
  );
}

async function getLatestPendingTokenForPhone(phone: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const candidates = phoneCandidates(phone);
  if (!candidates.length) return null;

  const { data } = await supabase
    .from("assistant_drafts")
    .select("review_token")
    .in("whatsapp_recipient", candidates)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.review_token || null;
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
  const eventType =
    payload?.EventType ||
    payload?.eventType ||
    payload?.type ||
    payload?.event ||
    "unknown";

  console.log("[uazapi:webhook]", {
    receivedAt: new Date().toISOString(),
    eventType,
  });

  if (!payload || isOwnMessage(payload)) {
    return NextResponse.json({
      ok: true,
      received: true,
      action: "ignored" satisfies WebhookAction,
    });
  }

  const text = extractIncomingText(payload);
  const decision = detectDecision(text);

  if (!decision) {
    return NextResponse.json({
      ok: true,
      received: true,
      action: "ignored" satisfies WebhookAction,
    });
  }

  const senderPhone = extractSenderPhone(payload);
  const reviewToken = extractReviewToken(text) || (await getLatestPendingTokenForPhone(senderPhone));

  if (!reviewToken) {
    return NextResponse.json({
      ok: true,
      received: true,
      action: "ignored" satisfies WebhookAction,
      reason: "pending_draft_not_found",
    });
  }

  try {
    if (decision === "approved") {
      await approveAssistantDraft(reviewToken);
    } else {
      await rejectAssistantDraft(reviewToken);
    }
  } catch (error) {
    console.error("[uazapi:webhook:approval_error]", {
      action: decision,
      message: error instanceof Error ? error.message : "Erro desconhecido.",
    });

    return NextResponse.json({
      ok: false,
      received: true,
      action: "ignored" satisfies WebhookAction,
      reason: "approval_failed",
    });
  }

  return NextResponse.json({
    ok: true,
    received: true,
    action: decision,
  });
}
