import { ArrowUpRight, CalendarDays, PlayCircle, UserRound } from "lucide-react";
import { PageHero } from "@/components/movement/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMentorships } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function MentoriasPage() {
  const mentorships = await getMentorships();

  return (
    <div className="grid gap-7">
      <PageHero
        eyebrow="Mentorias"
        title="Encontros mensais para transformar dúvida em decisão."
        description="Acompanhe próximas mentorias, gravações, materiais complementares e desafios relacionados."
        icon={CalendarDays}
      />

      <div className="grid gap-4">
        {mentorships.map((mentorship, index) => (
          <Card
            key={mentorship.id}
            className="grid gap-5 p-5 lg:grid-cols-[1fr_280px] lg:items-start"
          >
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-strong">
                  {index === 0 ? "Próxima mentoria" : "Gravação disponível"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.045] px-2.5 py-1 text-xs text-muted">
                  <CalendarDays className="h-3.5 w-3.5 text-gold" />
                  {formatDate(mentorship.date)}
                </span>
              </div>
              <h2 className="text-2xl font-black">{mentorship.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                {mentorship.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-gold" />
                  {mentorship.teacher}
                </span>
                {mentorship.related_challenge ? (
                  <span>Desafio: {mentorship.related_challenge}</span>
                ) : null}
              </div>
            </div>

            <div className="rounded-lg border border-line bg-white/[0.035] p-4">
              <h3 className="font-black">Materiais complementares</h3>
              <ul className="mt-3 grid gap-2 text-sm text-muted">
                {mentorship.materials.map((material) => (
                  <li key={material} className="rounded-md bg-white/[0.04] px-3 py-2">
                    {material}
                  </li>
                ))}
              </ul>
              {mentorship.recording_url ? (
                <ButtonLink href={mentorship.recording_url} className="mt-4 w-full">
                  Assistir gravação
                  <PlayCircle className="h-4 w-4" />
                </ButtonLink>
              ) : (
                <ButtonLink href="/movimento/whatsapp" className="mt-4 w-full">
                  Acompanhar avisos
                  <ArrowUpRight className="h-4 w-4" />
                </ButtonLink>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
