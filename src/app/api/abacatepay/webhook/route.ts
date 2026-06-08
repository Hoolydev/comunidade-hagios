import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ACTIVATING = new Set([
  "subscription.completed",
  "subscription.renewed",
  "checkout.completed",
]);

const DEACTIVATING = new Set([
  "subscription.cancelled",
  "subscription.expired",
  "checkout.refunded",
]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

/** AbacatePay payloads vary by event; look for our user id in the likely spots. */
function pickUserId(data: unknown): string | undefined {
  const d = asRecord(data);
  const subscription = asRecord(d.subscription);
  const billing = asRecord(d.billing);
  const payment = asRecord(d.payment);

  return (
    str(d.externalId) ||
    str(asRecord(d.metadata).user_id) ||
    str(subscription.externalId) ||
    str(asRecord(subscription.metadata).user_id) ||
    str(billing.externalId) ||
    str(asRecord(billing.metadata).user_id) ||
    str(asRecord(payment.metadata).user_id)
  );
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;

  // Segurança documentada do AbacatePay: secret enviado como query param.
  if (expectedSecret && url.searchParams.get("webhookSecret") !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = (await request.json().catch(() => null)) as
    | { event?: string; data?: unknown }
    | null;

  if (!event?.event) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ received: true });

  const userId = pickUserId(event.data);
  if (!userId) {
    return NextResponse.json({ received: true, note: "sem mapeamento de usuário" });
  }

  let status: string | null = null;
  if (ACTIVATING.has(event.event)) status = "active";
  else if (DEACTIVATING.has(event.event)) status = "canceled";

  if (status) {
    await supabase
      .from("profiles")
      .update({ subscription_status: status, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  }

  return NextResponse.json({ received: true });
}
