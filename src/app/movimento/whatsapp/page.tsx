import { ArrowRight, Bell, UsersRound } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { PageHero } from "@/components/movement/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getWhatsappLink } from "@/lib/data";

const reasons = [
  "Avisos sobre mentorias, votações e novos conteúdos",
  "Orientações rápidas para aplicar IA na operação",
  "Lembretes dos desafios e ciclos de implementação",
];

export default async function WhatsappPage() {
  const whatsappLink = await getWhatsappLink();

  return (
    <div className="grid gap-6">
      <PageHero
        eyebrow="Canal WhatsApp"
        title="Entre no canal oficial do Movimento Hágios."
        description="Avisos importantes, orientações práticas e dúvidas de implementação acontecem no WhatsApp. É o canal para acompanhar o que precisa ser aplicado agora."
        icon={WhatsAppIcon}
        action={
          <ButtonLink href={whatsappLink} size="lg" className="w-full sm:w-auto">
            <WhatsAppIcon className="h-5 w-5" />
            Entrar no canal
          </ButtonLink>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card className="border-2 border-gold/45 bg-gold/10 p-5 shadow-[0_18px_70px_rgba(216,163,27,0.12)]">
          <h2 className="text-2xl font-black">O canal vivo do Movimento</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use o WhatsApp para acompanhar avisos rápidos, tirar dúvidas práticas
            e não perder os ciclos mensais de implementação.
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
          <h2 className="mt-3 font-black">Orientação prática</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Receba direcionamentos para aplicar IA em processos reais da empresa.
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
          <WhatsAppIcon className="h-5 w-5 text-gold" />
          <h2 className="mt-3 font-black">Dúvidas de implementação</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use o canal para trazer dúvidas, aprendizados e exemplos do que está aplicando.
          </p>
        </Card>
      </section>
    </div>
  );
}
