import { MessageCircle, UsersRound } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { ButtonLink } from "@/components/ui/button";
import { getWhatsappLink } from "@/lib/data";

export default async function WhatsappPage() {
  const whatsappLink = await getWhatsappLink();

  return (
    <div className="grid min-h-[70svh] place-items-center">
      <section className="relative w-full max-w-4xl overflow-hidden rounded-lg border border-gold/25 bg-panel p-6 text-center shadow-[0_28px_120px_rgba(0,0,0,0.35)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,201,40,0.16),transparent_18rem)]" />
        <div className="relative">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold/25 bg-navy-deep/55">
            <LogoMark size="md" />
          </div>
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.045] px-3 py-1 text-sm text-muted">
            <UsersRound className="h-4 w-4 text-gold" />
            Networking e avisos da comunidade
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
            Entre no grupo oficial da Comunidade Hagios
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted">
            O networking, os avisos importantes e as trocas da comunidade acontecem
            no WhatsApp. Clique abaixo para abrir o link em uma nova aba.
          </p>
          <ButtonLink href={whatsappLink} size="lg" className="mt-8 w-full sm:w-auto">
            <MessageCircle className="h-5 w-5" />
            Entrar no grupo
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
