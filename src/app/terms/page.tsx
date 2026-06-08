import { PublicFooter } from "@/components/landing/public-footer";
import { PublicHeader } from "@/components/landing/public-header";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicHeader />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-black">Termos de uso</h1>
        <p className="mt-5 leading-7 text-muted">
          Estes termos devem ser revisados pela Hágios Marketing antes da
          publicação. O acesso à Comunidade Hágios é pessoal, mediante assinatura
          ativa, e pode ser cancelado conforme as regras configuradas no Stripe.
        </p>
      </article>
      <PublicFooter />
    </main>
  );
}
