import { ArrowUpRight, CheckCircle2, Trophy } from "lucide-react";
import { PageHero } from "@/components/community/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getChallenges } from "@/lib/data";
import { cn, formatDate } from "@/lib/utils";

export default async function DesafiosPage() {
  const challenges = await getChallenges();

  return (
    <div className="grid gap-7">
      <PageHero
        eyebrow="Desafios"
        title="Implementação em ciclos curtos."
        description="Cada desafio transforma um tema em ação prática. O objetivo é terminar com uma melhoria real no negócio, mesmo que pequena."
        icon={Trophy}
      />

      <div className="grid gap-5">
        {challenges.map((challenge) => {
          const completed = challenge.days.filter((day) => day.completed).length;
          const progress = Math.round((completed / challenge.days.length) * 100);

          return (
            <Card key={challenge.id} className="overflow-hidden">
              <div className="grid gap-5 border-b border-line p-5 lg:grid-cols-[1fr_260px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-strong">
                      {formatDate(challenge.published_at)}
                    </span>
                    <span className="rounded-full border border-line bg-white/[0.045] px-2.5 py-1 text-xs text-muted">
                      {challenge.participants} participantes
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-black">{challenge.theme}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                    {challenge.description}
                  </p>
                  <p className="mt-4 rounded-lg border border-line bg-white/[0.035] p-3 text-sm leading-6 text-muted">
                    <span className="font-semibold text-foreground">Objetivo:</span>{" "}
                    {challenge.objective}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-white/[0.035] p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-gold">Progresso</span>
                    <span className="text-muted">
                      {completed}/{challenge.days.length} dias
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gold-strong" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    {challenge.completion_rate}% da comunidade concluiu.
                  </p>
                  <ButtonLink href={challenge.material_url} className="mt-4 w-full">
                    Material do desafio
                    <ArrowUpRight className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>

              <div className="grid gap-4 p-5 xl:grid-cols-[1fr_320px]">
                <div className="grid gap-3 md:grid-cols-3">
                  {challenge.days.map((day) => (
                    <div
                      key={day.day}
                      className={cn(
                        "rounded-lg border p-4",
                        day.completed
                          ? "border-emerald-300/25 bg-emerald-400/10"
                          : "border-line bg-white/[0.035]",
                      )}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gold">Dia {day.day}</span>
                        {day.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-100" />
                        ) : null}
                      </div>
                      <h3 className="font-black">{day.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{day.description}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-line bg-navy-deep/35 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-gold" />
                    <h3 className="font-black">Ranking do desafio</h3>
                  </div>
                  <div className="grid gap-2">
                    {challenge.ranking.map((member, index) => (
                      <div
                        key={member.name}
                        className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-sm"
                      >
                        <span className="text-muted">
                          {index + 1}. {member.name}
                        </span>
                        <span className="font-semibold text-gold">{member.points} pts</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted">
                    Resultado esperado: {challenge.expected_result}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
