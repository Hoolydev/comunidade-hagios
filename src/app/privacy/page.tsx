import { PublicFooter } from "@/components/landing/public-footer";
import { PublicHeader } from "@/components/landing/public-header";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicHeader />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-black">Política de privacidade</h1>
        <p className="mt-5 leading-7 text-muted">
          Esta política deve ser adaptada pela Hagios Marketing. A plataforma usa
          Supabase para autenticação e dados de usuários, e Stripe para pagamentos
          e gerenciamento de assinaturas.
        </p>
      </article>
      <PublicFooter />
    </main>
  );
}
