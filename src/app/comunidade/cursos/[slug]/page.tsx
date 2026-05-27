import { notFound } from "next/navigation";
import { ArrowRight, Download, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCourseBySlug } from "@/lib/data";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const currentLesson = course.lessons[0];
  const embedUrl = getYouTubeEmbedUrl(currentLesson?.youtube_video_id || currentLesson?.youtube_url);
  const progress = course.lessons.length ? Math.round((1 / course.lessons.length) * 100) : 0;

  return (
    <div className="grid gap-7">
      <section className="rounded-lg border border-line bg-[linear-gradient(135deg,rgba(255,201,40,0.12),rgba(255,255,255,0.035))] p-5 sm:p-7">
        <Badge>{course.category}</Badge>
        <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
          {course.title}
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted">{course.description}</p>
      </section>

      {currentLesson ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="overflow-hidden rounded-lg border border-line bg-navy-deep p-2 shadow-[0_24px_100px_rgba(0,0,0,0.28)]">
              <div className="aspect-video overflow-hidden rounded-md bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={currentLesson.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="grid h-full place-items-center text-muted">
                  Vídeo não configurado
                </div>
              )}
              </div>
            </div>
            <Card className="mt-5 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-gold/20 bg-gold/10">
                  <PlayCircle className="h-5 w-5 text-gold-strong" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentLesson.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {currentLesson.description}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs text-muted">
                  <span>Progresso visual</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <div
                    className="h-2 rounded-full bg-gold-strong"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          <aside className="grid content-start gap-4 xl:sticky xl:top-8">
            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold">Aulas</h2>
                <Badge tone="neutral">{course.lessons.length} aulas</Badge>
              </div>
              <div className="mt-4 grid gap-3">
                {course.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex gap-3 rounded-lg border border-line bg-white/[0.035] p-3 transition hover:border-gold/35"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-gold/12 text-xs font-bold text-gold-strong">
                      {lesson.order_index}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{lesson.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                        {lesson.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="font-bold">Materiais anexos</h2>
              <div className="mt-4 grid gap-3">
                {course.materials.length ? (
                  course.materials.map((material) => (
                    <ButtonLink
                      key={material.id}
                      href={material.file_url}
                      variant="secondary"
                      className="justify-between"
                    >
                      <span className="truncate">{material.title}</span>
                      <Download className="h-4 w-4 shrink-0" />
                    </ButtonLink>
                  ))
                ) : (
                  <p className="text-sm text-muted">Nenhum material anexado.</p>
                )}
              </div>
            </Card>
            <ButtonLink href="/comunidade/conteudos" className="justify-between">
              Próximo conteúdo
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </aside>
        </section>
      ) : (
        <EmptyState
          title="Curso sem aulas publicadas"
          description="O administrador pode publicar aulas no painel admin."
        />
      )}
    </div>
  );
}
