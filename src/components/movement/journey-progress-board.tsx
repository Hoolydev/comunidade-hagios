"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Circle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { JourneyTrack } from "@/lib/types";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hagios-journey-progress-v1";

type ProgressState = Record<string, boolean>;

function getLessonIds(track: JourneyTrack) {
  return track.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
}

function getMissions(track: JourneyTrack) {
  return track.modules.flatMap((module) => module.lessons);
}

function calculateProgress(track: JourneyTrack, progress: ProgressState) {
  const lessonIds = getLessonIds(track);
  if (!lessonIds.length) return 0;
  const completed = lessonIds.filter((id) => progress[id]).length;
  return Math.round((completed / lessonIds.length) * 100);
}

export function JourneyProgressBoard({ tracks }: { tracks: JourneyTrack[] }) {
  const [progress, setProgress] = useState<ProgressState>({});

  useEffect(() => {
    queueMicrotask(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
        setProgress(JSON.parse(saved) as ProgressState);
      } catch {
        setProgress({});
      }
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const totals = useMemo(() => {
    const lessonIds = tracks.flatMap(getLessonIds);
    const completed = lessonIds.filter((id) => progress[id]).length;
    const percent = lessonIds.length ? Math.round((completed / lessonIds.length) * 100) : 0;

    return { completed, total: lessonIds.length, percent };
  }, [progress, tracks]);

  function toggleLesson(id: string) {
    setProgress((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <div className="grid gap-5">
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Sua progressão
            </p>
            <h2 className="mt-2 text-2xl font-black">Avanço geral da Jornada</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Marque as missões concluídas para acompanhar sua evolução nas trilhas.
            </p>
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold text-gold">{totals.percent}% concluído</span>
              <span className="text-muted">
                {totals.completed}/{totals.total} missões
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gold-strong transition-all duration-300"
                style={{ width: `${totals.percent}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          Trilhas do Movimento
        </p>
        <h2 className="mt-2 text-2xl font-black">Avance por missões práticas</h2>
      </section>

      {tracks.map((track) => {
        const trackProgress = calculateProgress(track, progress);
        const missions = getMissions(track);

        return (
          <Card key={track.id} className="overflow-hidden">
            <div className="grid gap-5 border-b border-line p-5 lg:grid-cols-[1fr_230px] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-strong">
                    Trilha
                  </span>
                  <span className="rounded-full border border-line bg-white/[0.045] px-2.5 py-1 text-xs text-muted">
                    {track.category}
                  </span>
                  <span className="rounded-full border border-line bg-white/[0.045] px-2.5 py-1 text-xs text-muted">
                    {missions.length} missões
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-black">Trilha: {track.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                  {track.description}
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-gold">Progresso da trilha</span>
                  <span className="text-muted">{trackProgress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gold-strong transition-all duration-300"
                    style={{ width: `${trackProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-5 lg:grid-cols-2">
              {missions.map((mission) => {
                const completed = Boolean(progress[mission.id]);

                return (
                  <button
                    key={mission.id}
                    type="button"
                    onClick={() => toggleLesson(mission.id)}
                    className={cn(
                      "flex min-h-36 items-start gap-4 rounded-lg border p-4 text-left transition",
                      completed
                        ? "border-gold/40 bg-gold/10 shadow-[0_12px_34px_rgba(216,163,27,0.1)]"
                        : "border-line bg-white/[0.035] hover:border-gold/35 hover:bg-white/[0.055]",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-11 w-11 shrink-0 place-items-center rounded-lg border",
                        completed
                          ? "border-gold/40 bg-gold/15"
                          : "border-gold/20 bg-gold/10",
                      )}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-5 w-5 text-gold-strong" />
                      ) : (
                        <Target className="h-5 w-5 text-gold-strong" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-strong">
                          Missão
                        </span>
                        <span className="text-xs text-muted">{mission.duration}</span>
                        {mission.status !== "available" ? (
                          <span className="rounded-full border border-line bg-white/[0.045] px-2 py-0.5 text-[11px] font-semibold text-muted">
                            {mission.status === "new" ? "novo" : "recomendado"}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-3 block text-lg font-black leading-snug">
                        {mission.title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-muted">
                        {mission.description}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-strong">
                        {completed ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Feito
                          </>
                        ) : (
                          <>
                            <Circle className="h-4 w-4" />
                            Marcar como feito
                          </>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        );
      })}

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-1 h-5 w-5 shrink-0 text-gold" />
          <div>
            <h2 className="text-xl font-black">Regra simples: avance uma missão por vez.</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              A progressão ajuda a manter foco sem transformar o Movimento em uma lista infinita.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setProgress({})}
          className="w-full sm:w-auto"
        >
          Reiniciar progresso
        </Button>
      </Card>
    </div>
  );
}
