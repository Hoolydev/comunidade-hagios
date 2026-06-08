import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/community/course-card";
import { JourneyProgressBoard } from "@/components/community/journey-progress-board";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCourses, getJourneyTracks } from "@/lib/data";

export default async function JornadaPage() {
  const [tracks, courses] = await Promise.all([
    getJourneyTracks(),
    getCourses(),
  ]);

  return (
    <div className="grid gap-7">
      <section className="rounded-lg border border-line bg-panel p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] sm:p-8">
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

      {courses.length ? (
        <section>
          <div className="mb-4 flex flex-col gap-1">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Trilhas da comunidade
            </p>
            <h2 className="text-2xl font-black">Escolha uma trilha para assistir</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      ) : null}

      <JourneyProgressBoard tracks={tracks} />

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Depois da base, avance para a prática.</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Os conteúdos recentes e desafios mostram onde aplicar o que você aprendeu.
          </p>
        </div>
        <ButtonLink href="/comunidade/conteudos-recentes" className="w-full sm:w-auto">
          Ver conteúdos recentes
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </Card>
    </div>
  );
}
