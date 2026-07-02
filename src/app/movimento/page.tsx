import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
  Target,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { OnboardingModal } from "@/components/movement/onboarding-modal";
import { WelcomeVideoCard } from "@/components/movement/welcome-video-card";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/auth";
import {
  getMovementEvents,
  getNextActions,
  getRecentContents,
  getWelcomeContent,
  getWhatsappLink,
} from "@/lib/data";
import { cn, formatDate } from "@/lib/utils";

function getFirstName(name?: string | null, email?: string | null) {
  const value = name || email?.split("@")[0] || "membro";
  return value.split(" ")[0];
}

function excerpt(value?: string | null, max = 118) {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max).trim()}...` : value;
}

export default async function MovementHomePage() {
  const [profile, nextActions, recentContents, events, whatsappLink, welcome] =
    await Promise.all([
      getCurrentProfile(),
      getNextActions(),
      getRecentContents(),
      getMovementEvents(),
      getWhatsappLink(),
      getWelcomeContent(),
    ]);

  const firstName = getFirstName(profile?.name, profile?.email);

  return (
    <>
      <OnboardingModal />
      <div className="grid gap-6">
        <section className="rounded-lg border border-line bg-panel p-5 shadow-[0_18px_55px_rgba(0,0,0,0.24)] sm:p-8">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-strong">
              <Sparkles className="h-4 w-4" />
              {welcome.eyebrow}
            </div>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl">
              Olá, {firstName}.
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-muted sm:text-2xl">
              Vamos continuar sua evolução empresarial através da IA.
            </p>
          </div>
        </section>

        <WelcomeVideoCard
          videoId={welcome.video_id}
          title={welcome.title}
          label={welcome.label}
        />

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                Agenda
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Próximos eventos</h2>
            </div>
            <ButtonLink href="/movimento/mentorias" variant="secondary" size="sm">
              Ver mentorias
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {events.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                href={event.href}
                className="group rounded-lg border border-line bg-panel/88 p-4 shadow-[0_12px_34px_rgba(0,0,0,0.18)] transition hover:border-gold/40 hover:bg-white/[0.045]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.045] px-2.5 py-1 text-xs text-muted">
                    <CalendarDays className="h-3.5 w-3.5 text-gold-strong" />
                    {event.type}
                  </span>
                  <span className="text-xs text-muted">{formatDate(event.date)}</span>
                </div>
                <h3 className="mt-4 text-lg font-black leading-snug group-hover:text-gold-strong">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{excerpt(event.description)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                Próximos passos
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">O que fazer agora?</h2>
            </div>
            <ButtonLink href="/movimento/jornada" variant="secondary" size="sm">
              Ver Jornada
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {nextActions.map((action) => (
              <Card
                key={action.id}
                tone="flat"
                className={cn(
                  "flex flex-col p-4 transition hover:border-gold/35 hover:bg-white/[0.045]",
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
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                  {excerpt(action.description, 104)}
                </p>
                <ButtonLink href={action.href} size="sm" className="mt-5 w-full">
                  {action.label}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              WhatsApp
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Acompanhe avisos e direcionamentos
            </h2>
          </div>

          <Card className="border-2 border-gold/45 bg-[linear-gradient(135deg,rgba(216,163,27,0.16),rgba(16,27,44,0.88)_52%,rgba(7,12,21,0.96))] p-5 shadow-[0_22px_72px_rgba(216,163,27,0.12)] sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-gold/35 bg-gold/15">
                  <WhatsAppIcon className="h-5 w-5 text-gold-strong" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Entre no grupo oficial</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                    Receba avisos, orientações práticas e chamadas importantes do Movimento.
                  </p>
                </div>
              </div>
              <ButtonLink href={whatsappLink} className="w-full sm:w-auto">
                Entrar no grupo
                <WhatsAppIcon className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Card>
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                Novidades
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Novidades do Movimento</h2>
            </div>
            <ButtonLink href="/movimento/conteudos-recentes" variant="secondary" size="sm">
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {recentContents.slice(0, 6).map((content) => (
              <Link
                key={content.id}
                href={content.href}
                className="group rounded-lg border border-line bg-panel/88 p-4 shadow-[0_12px_34px_rgba(0,0,0,0.18)] transition hover:border-gold/40 hover:bg-white/[0.045]"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 font-semibold text-gold-strong">
                    {content.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDate(content.published_at)}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-black leading-snug group-hover:text-gold-strong">
                  {content.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {excerpt(content.description, 112)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
