import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/env";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe/server";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getCurrentProfile();
  const stripe = getStripe();

  if (!stripe || !profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "Portal de assinatura indisponivel." },
      { status: 400 },
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${getAppUrl()}/comunidade/conta`,
  });

  return NextResponse.json({ url: session.url });
}
