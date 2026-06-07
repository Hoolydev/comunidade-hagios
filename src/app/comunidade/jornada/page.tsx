import { ArrowRight, BookOpen, CheckCircle2, Layers3 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getJourneyTracks } from "@/lib/data";

export default async function JornadaPage() {
  const tracks = await getJourneyTracks();

  return (
    <div className="grid gap-7">
      <section className="rounded-lg border border-line bg-[linear-gradient(135deg,rgba(255,201,40,0.14),rgba(255,255,255,0.04),rgba(8,13,22,0.72))] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Jornada Hágios
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
          A base permanente para aplicar IA no negócio com método.
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          A jornada organiza os fundamentos. Ela não substitui os conteúdos vivos,
          mentorias e desafios, mas dá estrutura para você implementar melhor cada
          novidade da comunidade.
        </p>
      </section>

      <div className="grid gap-5">
        {tracks.map((track) => (
          <Card key={track.id} className="overflow-hidden">
            <div className="grid gap-5 border-b border-line p-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-strong">
                    {track.category}
                  </span>
                  <span className="rounded-full border border-line bg-white/[0.045] px-2.5 py-1 text-xs text-muted">
                    {track.modules.length} módulos
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-black">{track.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                  {track.description}
                </p>
              </div>
              <div className="min-w-48">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-gold">Progresso</span>
                  <span className="text-muted">{track.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-strong"
                    style={{ width: `${track.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-5 lg:grid-cols-2">
              {track.modules.map((module) => (
                <div key={module.id} className="rounded-lg border border-line bg-white/[0.035] p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gold/20 bg-gold/10">
                      <Layers3 className="h-5 w-5 text-gold-strong" />
                    </div>
                    <div>
                      <h3 className="font-black">{module.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted">{module.description}</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-start gap-3 rounded-lg border border-line bg-navy-deep/35 p-3"
                      >
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{lesson.title}</p>
                            {lesson.status !== "available" ? (
                              <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 text-[11px] font-semibold text-gold-strong">
                                {lesson.status === "new" ? "novo" : "recomendado"}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs leading-5 text-muted">{lesson.description}</p>
                        </div>
                        <span className="shrink-0 text-xs text-muted">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" />
          <div>
            <h2 className="text-xl font-black">Depois da base, avance para a prática.</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Os conteúdos recentes e desafios mostram onde aplicar o que você aprendeu.
            </p>
          </div>
        </div>
        <ButtonLink href="/comunidade/conteudos-recentes" className="w-full sm:w-auto">
          Ver conteúdos recentes
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </Card>
    </div>
  );
}
