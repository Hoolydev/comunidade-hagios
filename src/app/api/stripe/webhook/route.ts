import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";
import type { SubscriptionStatus } from "@/lib/types";

export const runtime = "nodejs";

function getPeriodEnd(subscription: Stripe.Subscription) {
  const value =
    (subscription as unknown as { current_period_end?: number }).current_period_end ||
    subscription.items.data[0]?.current_period_end;

  return value ? new Date(value * 1000).toISOString() : null;
}

async function updateSubscription(subscription: Stripe.Subscription, explicitUserId?: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  let userId: string | undefined = explicitUserId || subscription.metadata.user_id;

  if (!userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    userId = profile?.user_id;
  }

  if (!userId) return;

  const status = subscription.status as SubscriptionStatus;
  const currentPeriodEnd = getPeriodEnd(subscription);

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status,
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  await supabase
    .from("profiles")
    .update({
      stripe_customer_id: customerId,
      subscription_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid signature" },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          String(session.subscription),
        );
        await updateSubscription(subscription, session.metadata?.user_id);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await updateSubscription(event.data.object as Stripe.Subscription);
      break;
    }
    case "invoice.payment_succeeded":
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = (invoice as unknown as { subscription?: string }).subscription;
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await updateSubscription(subscription);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
