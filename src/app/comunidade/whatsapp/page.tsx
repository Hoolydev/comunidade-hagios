import { ArrowRight, Bell, MessageCircle, UsersRound } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getWhatsappLink } from "@/lib/data";

const reasons = [
  "Avisos sobre mentorias, votações e novos conteúdos",
  "Trocas rápidas com outros empresários da comunidade",
  "Lembretes dos desafios e ciclos de implementação",
];

export default async function WhatsappPage() {
  const whatsappLink = await getWhatsappLink();

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-lg border border-gold/25 bg-[linear-gradient(135deg,rgba(255,201,40,0.17),rgba(255,255,255,0.05)_42%,rgba(10,15,25,0.82))] p-6 shadow-[0_28px_110px_rgba(0,0,0,0.34)] sm:p-8">
        <div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_75%_20%,rgba(255,201,40,0.20),transparent_18rem)]" />
        <div className="relative grid gap-7 lg:grid-cols-[1fr_340px] lg:items-center">
          <div>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-gold/25 bg-navy-deep/55">
              <LogoMark size="sm" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              Grupo WhatsApp
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
              Entre no grupo oficial da Comunidade Hágios.
            </h1>
            <p className="mt-4 max-w-2xl text-muted">
              Networking, avisos importantes e trocas da comunidade acontecem no
              WhatsApp. É o canal para você não perder o que está acontecendo agora.
            </p>
            <ButtonLink href={whatsappLink} size="lg" className="mt-7 w-full sm:w-auto">
              <MessageCircle className="h-5 w-5" />
              Entrar no grupo
            </ButtonLink>
          </div>

          <Card className="bg-navy-deep/55 p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg border border-emerald-300/25 bg-emerald-400/10">
                <Bell className="h-5 w-5 text-emerald-100" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-100">Canal vivo</p>
                <h2 className="text-xl font-black">Por que entrar?</h2>
              </div>
            </div>
            <div className="grid gap-3">
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className="flex items-start gap-3 rounded-lg border border-line bg-white/[0.035] p-3 text-sm leading-6 text-muted"
                >
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  {reason}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <UsersRound className="h-5 w-5 text-gold" />
          <h2 className="mt-3 font-black">Networking</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Converse com empresários que também estão implementando IA no negócio.
          </p>
        </Card>
        <Card className="p-5">
          <Bell className="h-5 w-5 text-gold" />
          <h2 className="mt-3 font-black">Avisos rápidos</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Saiba quando sair conteúdo novo, mentoria, votação ou desafio.
          </p>
        </Card>
        <Card className="p-5">
          <MessageCircle className="h-5 w-5 text-gold" />
          <h2 className="mt-3 font-black">Trocas práticas</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Compartilhe dúvidas, aprendizados e exemplos de implementação.
          </p>
        </Card>
      </section>
    </div>
  );
}
