import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";
import { createSubscriptionCheckout } from "@/lib/abacatepay/server";

export const runtime = "nodejs";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Faça login para assinar." }, { status: 401 });
  }

  const productId = process.env.ABACATEPAY_PRODUCT_ID;
  if (!process.env.ABACATEPAY_API_KEY || !productId) {
    return NextResponse.json(
      { error: "AbacatePay ainda não foi configurado no ambiente." },
      { status: 500 },
    );
  }

  const appUrl = getAppUrl();
  const result = await createSubscriptionCheckout({
    productId,
    externalId: user.id,
    userId: user.id,
    completionUrl: `${appUrl}/comunidade?checkout=success`,
    returnUrl: `${appUrl}/checkout?canceled=1`,
  });

  if (!result.data?.url) {
    return NextResponse.json(
      { error: result.error || "Não foi possível iniciar o checkout." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: result.data.url });
}
