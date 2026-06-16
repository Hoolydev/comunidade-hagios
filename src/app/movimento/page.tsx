import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  ArrowRight,
  Bot,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileStack,
  FileText,
  GitFork,
  LibraryBig,
  ListChecks,
  Map,
  MessageSquareText,
  Sparkles,
  Table2,
  Target,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { OnboardingModal } from "@/components/movement/onboarding-modal";
import { VideoEmbed } from "@/components/movement/video-embed";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/auth";
import {
  getMovementEvents,
  getNextActions,
  getRecentContents,
  getTools,
  getWelcomeContent,
  getWhatsappLink,
} from "@/lib/data";
import { cn, formatDate } from "@/lib/utils";

function getFirstName(name?: string | null, email?: string | null) {
  const value = name || email?.split("@")[0] || "membro";
  return value.split(" ")[0];
}

const toolCategoryIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Prompts: MessageSquareText,
  Templates: FileStack,
  Checklists: ListChecks,
  Planilhas: Table2,
  Fluxogramas: GitFork,
  "E-books": BookOpen,
  Guias: Map,
  "Ferramentas recomendadas": Sparkles,
  Automações: Bot,
};

function ToolIcon({ category }: { category: string }) {
  const Icon = toolCategoryIcons[category] || FileText;
  return <Icon className="h-3.5 w-3.5" />;
}

export default async function MovementHomePage() {
  const [profile, nextActions, recentContents, events, tools, whatsappLink, welcome] =
    await Promise.all([
      getCurrentProfile(),
      getNextActions(),
      getRecentContents(),
      getMovementEvents(),
      getTools(),
      getWhatsappLink(),
      getWelcomeContent(),
    ]);

  const firstName = getFirstName(profile?.name, profile?.email);

  return (
    <>
      <OnboardingModal />
      <div className="grid gap-7">
        <section className="rounded-lg border border-line bg-panel p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] sm:p-8">
          <div className="grid gap-7 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-sm font-semibold text-gold-strong">
                <Sparkles className="h-4 w-4" />
                {welcome.eyebrow}
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
                Olá, {firstName}.
              </h1>
              <p className="mt-3 max-w-2xl text-xl leading-8 text-muted sm:text-2xl">
                Vamos continuar sua evolução empresarial através da IA.
              </p>
            </div>
            <Card tone="flat" className="overflow-hidden p-3">
              <VideoEmbed videoId={welcome.video_id} title={welcome.title} />
              <div className="px-1 pb-1 pt-4">
                <p className="text-sm font-semibold text-gold">{welcome.label}</p>
                <h2 className="mt-1 text-lg font-bold">{welcome.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{welcome.description}</p>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                Próximo passo
              </p>
              <h2 className="mt-2 text-2xl font-black">O que fazer agora?</h2>
            </div>
            <ButtonLink href="/movimento/jornada" size="sm">
              Ver Jornada
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {nextActions.map((action) => (
              <Card
                key={action.id}
                className={cn(
                  "flex flex-col p-5",
                  action.priority === "high" && "border-gold/35 bg-gold/10",
                )}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-gold/20 bg-gold/10">
                    {action.priority === "high" ? (
                      <Target className="h-5 w-5 text-gold-strong" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-gold-strong" />
                    )}
                  </span>
                  {action.priority === "high" ? (
                    <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-strong">
                      recomendado
                    </span>
                  ) : null}
                </div>
                <h3 className="text-lg font-black leading-snug">{action.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">{action.description}</p>
                <ButtonLink href={action.href} size="sm" className="mt-5 w-full">
                  {action.label}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                  Novidades
                </p>
                <h2 className="mt-2 text-2xl font-black">Novidades do Movimento</h2>
              </div>
              <ButtonLink href="/movimento/conteudos-recentes" variant="ghost" size="sm">
                Ver todas as novidades
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="grid gap-3">
              {recentContents.slice(0, 3).map((content) => (
                <Link
                  key={content.id}
                  href={content.href}
                  className="rounded-lg border border-line bg-white/[0.035] p-4 transition hover:border-gold/35 hover:bg-white/[0.06]"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-1 font-semibold text-gold-strong">
                      {content.category}
                    </span>
                    <span className="text-muted">{formatDate(content.published_at)}</span>
                  </div>
                  <h3 className="mt-3 font-black">{content.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{content.description}</p>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg border border-gold/25 bg-gold/10">
                <CalendarDays className="h-5 w-5 text-gold-strong" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gold">Agenda</p>
                <h2 className="text-xl font-black">Próximos Eventos</h2>
              </div>
            </div>
            <div className="grid gap-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={event.href}
                  className="rounded-lg border border-line bg-white/[0.035] p-4 transition hover:border-gold/35"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-line bg-white/[0.045] px-2 py-1 text-xs text-muted">
                      {event.type}
                    </span>
                    <span className="text-xs text-muted">{formatDate(event.date)}</span>
                  </div>
                  <h3 className="mt-3 font-black">{event.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{event.description}</p>
                </Link>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                Canal WhatsApp
              </p>
              <h2 className="mt-2 text-3xl font-black">Acompanhe avisos e orientações</h2>
            </div>
            <Card className="border-2 border-gold/45 bg-gold/10 p-5 shadow-[0_18px_70px_rgba(216,163,27,0.12)]">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-gold/35 bg-gold/15">
                  <WhatsAppIcon className="h-5 w-5 text-gold-strong" />
                </div>
                <div>
                  <p className="text-sm leading-6 text-muted">
                    Avisos rápidos, direcionamentos e dúvidas práticas acontecem no
                    canal oficial do Movimento.
                  </p>
                  <ButtonLink href={whatsappLink} className="mt-5 w-full sm:w-auto">
                    Entrar no canal
                    <WhatsAppIcon className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                  Últimas ferramentas
                </p>
                <h2 className="mt-2 text-2xl font-black">Para implementar agora</h2>
              </div>
              <ButtonLink href="/movimento/ferramentas" variant="ghost" size="sm">
                Ver todas as ferramentas
                <LibraryBig className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tools.slice(0, 4).map((tool) => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-line bg-white/[0.035] p-4 transition hover:border-gold/35"
                >
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-2 py-1 text-xs font-semibold text-gold-strong">
                    <ToolIcon category={tool.category} />
                    {tool.category}
                  </div>
                  <h3 className="font-black">{tool.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{tool.description}</p>
                </a>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
