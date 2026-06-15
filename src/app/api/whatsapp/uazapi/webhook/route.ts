import { NextRequest, NextResponse } from "next/server";
import { approveAssistantDraft, rejectAssistantDraft } from "@/lib/assistant/content-approval";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type WebhookAction = "approved" | "rejected" | "batch_processed" | "ignored";
type ApprovalDecision = Exclude<WebhookAction, "batch_processed" | "ignored">;

type PendingDraftReference = {
  review_token: string;
  whatsapp_sent_at: string | null;
  created_at: string;
};

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

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function detectDecision(text: string): ApprovalDecision | null {
  const normalized = normalizeText(text);

  if (/\b(rejeitar|rejeitado|recusar|recusado|nao aprovar|nao publicar)\b/.test(normalized)) {
    return "rejected";
  }

  if (/\b(aprovar|aprovado|publicar|pode publicar|sim)\b/.test(normalized)) {
    return "approved";
  }

  return null;
}

function extractNumbers(text: string) {
  return Array.from(text.matchAll(/\b([1-9]\d*)\b/g))
    .map((match) => Number(match[1]))
    .filter((value) => Number.isInteger(value));
}

function parseBatchCommands(text: string) {
  const normalized = normalizeText(text);
  const actionPattern =
    /\b(nao aprovar|nao publicar|rejeitar|rejeitado|recusar|recusado|aprovar|aprovado|publicar|pode publicar)\b/g;
  const matches = Array.from(normalized.matchAll(actionPattern));

  return matches
    .map((match, index) => {
      const action = match[1];
      const start = match.index || 0;
      const end = matches[index + 1]?.index || normalized.length;
      const segment = normalized.slice(start, end);
      const decision: ApprovalDecision =
        action.includes("reje") ||
        action.includes("recus") ||
        action.includes("nao aprovar") ||
        action.includes("nao publicar")
          ? "rejected"
          : "approved";

      return {
        decision,
        all: /\b(todas|todos|tudo)\b/.test(segment),
        numbers: extractNumbers(segment),
      };
    })
    .filter((command) => command.all || command.numbers.length > 0);
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
  const drafts = await getLatestPendingDraftsForPhone(phone);
  return drafts.length === 1 ? drafts[0].review_token : null;
}

async function getLatestPendingDraftsForPhone(phone: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const candidates = phoneCandidates(phone);
  if (!candidates.length) return [];

  const { data: latest } = await supabase
    .from("assistant_drafts")
    .select("review_token, whatsapp_sent_at, created_at")
    .in("whatsapp_recipient", candidates)
    .eq("status", "pending")
    .not("whatsapp_sent_at", "is", null)
    .order("whatsapp_sent_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<PendingDraftReference>();

  if (latest?.whatsapp_sent_at) {
    const { data: batch } = await supabase
      .from("assistant_drafts")
      .select("review_token, whatsapp_sent_at, created_at")
      .in("whatsapp_recipient", candidates)
      .eq("status", "pending")
      .eq("whatsapp_sent_at", latest.whatsapp_sent_at)
      .order("created_at", { ascending: true })
      .returns<PendingDraftReference[]>();

    return batch || [];
  }

  const { data: fallback } = await supabase
    .from("assistant_drafts")
    .select("review_token, whatsapp_sent_at, created_at")
    .in("whatsapp_recipient", candidates)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(3)
    .returns<PendingDraftReference[]>();

  return (fallback || []).reverse();
}

async function applyApproval(decision: ApprovalDecision, reviewToken: string) {
  if (decision === "approved") {
    await approveAssistantDraft(reviewToken);
  } else {
    await rejectAssistantDraft(reviewToken);
  }
}

function resolveBatchActions(
  commands: ReturnType<typeof parseBatchCommands>,
  drafts: PendingDraftReference[],
) {
  const actions = new Map<string, ApprovalDecision>();

  for (const command of commands) {
    const selectedDrafts = command.all
      ? drafts
      : command.numbers
          .map((number) => drafts[number - 1])
          .filter((draft): draft is PendingDraftReference => Boolean(draft));

    selectedDrafts.forEach((draft) => actions.set(draft.review_token, command.decision));
  }

  return actions;
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
  const senderPhone = extractSenderPhone(payload);
  const batchCommands = parseBatchCommands(text);

  if (batchCommands.length) {
    const pendingDrafts = await getLatestPendingDraftsForPhone(senderPhone);
    const actions = resolveBatchActions(batchCommands, pendingDrafts);

    if (!actions.size) {
      return NextResponse.json({
        ok: true,
        received: true,
        action: "ignored" satisfies WebhookAction,
        reason: "batch_drafts_not_found",
      });
    }

    const summary = {
      approved: 0,
      rejected: 0,
    };

    try {
      for (const [reviewToken, decision] of actions) {
        await applyApproval(decision, reviewToken);
        summary[decision === "approved" ? "approved" : "rejected"] += 1;
      }
    } catch (error) {
      console.error("[uazapi:webhook:batch_approval_error]", {
        message: error instanceof Error ? error.message : "Erro desconhecido.",
      });

      return NextResponse.json({
        ok: false,
        received: true,
        action: "ignored" satisfies WebhookAction,
        reason: "batch_approval_failed",
      });
    }

    return NextResponse.json({
      ok: true,
      received: true,
      action: "batch_processed" satisfies WebhookAction,
      ...summary,
    });
  }

  const decision = detectDecision(text);

  if (!decision) {
    return NextResponse.json({
      ok: true,
      received: true,
      action: "ignored" satisfies WebhookAction,
    });
  }

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
    await applyApproval(decision, reviewToken);
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
