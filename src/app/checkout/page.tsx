import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutWizard } from "@/components/auth/checkout-wizard";
import { LogoMark } from "@/components/brand/logo-mark";
import { getCurrentProfile, getCurrentUser, hasActiveAccess } from "@/lib/auth";
import { hasAbacatePayEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;

  if (hasActiveAccess(profile)) {
    redirect("/comunidade");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <LogoMark size="sm" priority />
            Comunidade Hágios
          </Link>
          <Link href="/" className="text-sm text-muted transition hover:text-foreground">
            Cancelar
          </Link>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Assinatura mensal
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Acesso premium à Comunidade Hágios
          </h1>
        </div>

        <CheckoutWizard
          loggedIn={Boolean(user)}
          email={user?.email}
          paymentConfigured={hasAbacatePayEnv()}
        />
      </div>
    </main>
  );
}
