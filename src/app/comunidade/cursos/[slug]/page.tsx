import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Download, FileText, Lock, MonitorPlay, PlayCircle, Smartphone } from "lucide-react";
import { PageHero } from "@/components/community/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatDate } from "@/lib/utils";
import { getCourseBySlug } from "@/lib/data";
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/youtube";

function isLocked(availableAt?: string | null) {
  return Boolean(availableAt && new Date(availableAt).getTime() > Date.now());
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const currentLesson =
    course.lessons.find((lesson) => !isLocked(lesson.available_at)) || course.lessons[0];
  const currentLocked = isLocked(currentLesson?.available_at);
  const isText = currentLesson?.content_type === "text";
  const embedUrl = getYouTubeEmbedUrl(currentLesson?.youtube_video_id || currentLesson?.youtube_url);
  const progress = course.lessons.length ? Math.round((1 / course.lessons.length) * 100) : 0;
  const verticalVideo = currentLesson?.video_format === "vertical";

  return (
    <div className="grid gap-7">
      <PageHero
        eyebrow={course.category}
        title={course.title}
        description={course.description}
        icon={MonitorPlay}
      />

      {currentLesson ? (
        <section className="rounded-lg border border-line bg-white/[0.035] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/10">
                {isText ? (
                  <FileText className="h-5 w-5 text-gold-strong" />
                ) : verticalVideo ? (
                  <Smartphone className="h-5 w-5 text-gold-strong" />
                ) : (
                  <MonitorPlay className="h-5 w-5 text-gold-strong" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gold">Aula em destaque</p>
                <h2 className="text-xl font-black">{currentLesson.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {isText
                    ? "Conteúdo escrito para leitura."
                    : `Formato ${verticalVideo ? "vertical 9:16" : "desktop 16:9"} definido no painel admin.`}
                </p>
              </div>
            </div>
            <Badge tone="neutral">{course.materials.length} anexos</Badge>
          </div>
        </section>
      ) : null}

      {currentLesson ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            {currentLocked ? (
              <Card className="grid place-items-center gap-3 p-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/25 bg-gold/10">
                  <Lock className="h-6 w-6 text-gold-strong" />
                </span>
                <h2 className="text-xl font-black">Conteúdo agendado</h2>
                <p className="max-w-md text-sm leading-6 text-muted">
                  As aulas desta trilha são liberadas aos poucos. A próxima abre em{" "}
                  <span className="font-semibold text-gold">
                    {formatDate(currentLesson.available_at)}
                  </span>
                  .
                </p>
              </Card>
            ) : isText ? (
              <Card className="p-6 sm:p-8">
                <article className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
                  {currentLesson.body || "Conteúdo em preparação."}
                </article>
              </Card>
            ) : (
              <div className="overflow-hidden rounded-lg border border-line bg-navy-deep p-2 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
                <div className={verticalVideo ? "mx-auto aspect-[9/16] max-h-[76svh] overflow-hidden rounded-md bg-black" : "aspect-video overflow-hidden rounded-md bg-black"}>
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
            )}
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
                {course.lessons.map((lesson) => {
                  const isCurrent = lesson.id === currentLesson?.id;
                  const locked = isLocked(lesson.available_at);

                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        "flex gap-3 rounded-lg border p-3 transition",
                        locked
                          ? "border-line bg-white/[0.02] opacity-70"
                          : isCurrent
                            ? "border-gold/45 bg-gold/10"
                            : "border-line bg-white/[0.035] hover:border-gold/35",
                      )}
                    >
                      <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-md bg-navy-deep">
                        <Image
                          src={getYouTubeThumbnail(lesson.youtube_video_id)}
                          alt={lesson.title}
                          fill
                          className={cn("object-cover", locked && "blur-[2px] grayscale")}
                          sizes="96px"
                        />
                        <span className="absolute inset-0 grid place-items-center bg-navy-deep/40">
                          {locked ? (
                            <Lock className="h-5 w-5 text-muted" />
                          ) : (
                            <PlayCircle className="h-5 w-5 text-gold-strong/90" />
                          )}
                        </span>
                        <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded bg-navy-deep/80 text-[11px] font-bold text-gold-strong">
                          {lesson.order_index}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{lesson.title}</p>
                        {locked ? (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                            <Lock className="h-3 w-3" />
                            Libera em {formatDate(lesson.available_at)}
                          </p>
                        ) : (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
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
            <ButtonLink href="/comunidade/conteudos-recentes" className="justify-between">
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
