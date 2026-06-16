import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/env";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { BILLING_CONFIG } from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/server";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Faça login para comprar o acesso." }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe ainda nao foi configurado no ambiente." },
      { status: 500 },
    );
  }

  const appUrl = getAppUrl();
  const supabase = getSupabaseAdminClient();
  const profile = await getCurrentProfile();

  let customerId = profile?.stripe_customer_id || undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      ?.from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", user.id);
  }

  const lineItem = process.env.STRIPE_PRICE_ID
    ? { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: BILLING_CONFIG.currency,
          product_data: { name: BILLING_CONFIG.productName },
          unit_amount: BILLING_CONFIG.amountInCents,
          recurring: { interval: BILLING_CONFIG.interval },
        },
      };

  const session = await stripe.checkout.sessions.create({
    mode: BILLING_CONFIG.mode,
    customer: customerId,
    line_items: [lineItem],
    success_url: `${appUrl}/movimento?checkout=success`,
    cancel_url: `${appUrl}/checkout?canceled=1`,
    allow_promotion_codes: true,
    metadata: {
      user_id: user.id,
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
