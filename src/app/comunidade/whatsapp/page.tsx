import { ArrowRight, Bell, MessageCircle, UsersRound } from "lucide-react";
import { PageHero } from "@/components/community/page-hero";
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
      <PageHero
        eyebrow="Grupo WhatsApp"
        title="Entre no grupo oficial da Comunidade Hágios."
        description="Networking, avisos importantes e trocas da comunidade acontecem no WhatsApp. É o canal para você não perder o que está acontecendo agora."
        icon={MessageCircle}
        action={
          <ButtonLink href={whatsappLink} size="lg" className="w-full sm:w-auto">
            <MessageCircle className="h-5 w-5" />
            Entrar no grupo
          </ButtonLink>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card className="border-2 border-gold/45 bg-gold/10 p-5 shadow-[0_18px_70px_rgba(216,163,27,0.12)]">
          <h2 className="text-2xl font-black">O canal vivo da comunidade</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use o WhatsApp para acompanhar avisos rápidos, participar das conversas
            e não perder os movimentos mensais da comunidade.
          </p>
        </Card>

        <Card className="p-5">
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
