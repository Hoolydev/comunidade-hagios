import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { CheckoutButton } from "@/components/auth/checkout-button";
import { LogoMark } from "@/components/brand/logo-mark";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentProfile, getCurrentUser, hasActiveAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  const { start } = await searchParams;
  const shouldAutoStartCheckout = Boolean(user && start === "1");

  if (hasActiveAccess(profile)) {
    redirect("/comunidade");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <LogoMark size="sm" priority />
          Comunidade Hagios
        </Link>

        <section className="overflow-hidden rounded-lg border border-line bg-panel shadow-[0_28px_120px_rgba(0,0,0,0.32)]">
          <div className="grid lg:grid-cols-[1fr_390px]">
            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,201,40,0.12),transparent_18rem)]" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
                  Assinatura mensal
                </p>
                <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
                  Acesso premium à Comunidade Hagios
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                  Entre para uma comunidade de Marketing com IA com aulas, cursos,
                  materiais, atualizações e grupo exclusivo no WhatsApp.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    "Cursos e aulas práticas",
                    "Materiais por links externos",
                    "Grupo oficial no WhatsApp",
                    "Atualizações constantes",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-lg border border-line bg-white/[0.035] p-3 text-sm text-muted"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  {user ? (
                    <CheckoutButton autoStart={shouldAutoStartCheckout} />
                  ) : (
                    <ButtonLink
                      href="/login?mode=signup&next=%2Fcheckout%3Fstart%3D1"
                      size="lg"
                    >
                      Criar conta e assinar
                    </ButtonLink>
                  )}
                  <ButtonLink href="/" variant="secondary" size="lg">
                    Voltar ao site
                  </ButtonLink>
                </div>
              </div>
            </div>

            <aside className="border-t border-line bg-[linear-gradient(180deg,rgba(255,201,40,0.15),rgba(255,255,255,0.035))] p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4 border-b border-line pb-6">
                <div>
                  <p className="text-sm text-muted">Total hoje</p>
                  <p className="mt-1 text-5xl font-black">R$39,90</p>
                  <p className="mt-2 text-sm text-muted">cobrança mensal</p>
                </div>
                <ShieldCheck className="h-10 w-10 text-gold-strong" />
              </div>
              <div className="mt-6 grid gap-3 text-sm text-muted">
                {[
                  "Cobrança via Stripe Checkout",
                  "Acesso liberado automaticamente",
                  "Preparado para pagamento único no futuro",
                  "Cancelamento via Stripe Customer Portal",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-3 rounded-lg border border-line bg-navy-deep/45 p-3 text-xs leading-5 text-muted">
                <LockKeyhole className="h-4 w-4 shrink-0 text-gold" />
                <span>Pagamento protegido e processado fora da plataforma.</span>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
