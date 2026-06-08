import Link from "next/link";
import { ArrowLeft, ChevronDown, Lock, Plus, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createLesson, deleteLesson, updateLesson } from "@/app/admin/actions";
import { contentTypeOptions, videoFormatOptions } from "@/components/admin/cms-fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox, Field, Select, TextArea } from "@/components/ui/form-fields";
import type { Course, Lesson } from "@/lib/types";

export function AdminSubpage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:py-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] sm:p-7">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao painel
            </Link>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-muted">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

export function AdminStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-3xl font-black">{value}</p>
          <p className="mt-1 text-sm text-muted">{label}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-lg border border-gold/20 bg-gold/10">
          <Icon className="h-5 w-5 text-gold-strong" />
        </div>
      </div>
    </Card>
  );
}

export function CourseSelect({
  courses,
  defaultValue,
  optional,
}: {
  courses: Course[];
  defaultValue?: string;
  optional?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm text-muted">
      Trilha relacionada
      <select
        name="course_id"
        defaultValue={defaultValue || ""}
        required={!optional}
        className="h-11 rounded-lg border border-line bg-navy-deep/45 px-3 text-foreground outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
      >
        {optional && <option value="">Sem curso</option>}
        {courses.map((course) => (
          <option key={course.id} value={course.id} className="bg-black text-white">
            {course.title}
          </option>
        ))}
      </select>
    </label>
  );
}

export function LessonSelect({
  lessons,
  defaultValue,
  optional,
}: {
  lessons: Lesson[];
  defaultValue?: string;
  optional?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm text-muted">
      Aula relacionada
      <select
        name="lesson_id"
        defaultValue={defaultValue || ""}
        required={!optional}
        className="h-11 rounded-lg border border-line bg-navy-deep/45 px-3 text-foreground outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
      >
        {optional && <option value="">Sem aula</option>}
        {lessons.map((lesson) => (
          <option key={lesson.id} value={lesson.id} className="bg-black text-white">
            {lesson.title}
          </option>
        ))}
      </select>
    </label>
  );
}

export function LessonEditCard({ lesson }: { lesson: Lesson }) {
  const isText = lesson.content_type === "text";
  const scheduled = Boolean(lesson.available_at);

  return (
    <details className="group overflow-hidden rounded-lg border border-line bg-white/[0.025]">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gold/12 text-xs font-bold text-gold-strong">
          {lesson.order_index}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{lesson.title}</span>
        {scheduled ? <Lock className="h-3.5 w-3.5 shrink-0 text-muted" /> : null}
        {!lesson.is_published ? <Badge tone="neutral">rascunho</Badge> : null}
        <Badge tone={isText ? "neutral" : "gold"}>{isText ? "Texto" : "Vídeo"}</Badge>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-180" />
      </summary>

      <div className="border-t border-line p-4">
        <form action={updateLesson} className="grid gap-3">
          <input type="hidden" name="id" value={lesson.id} />
          <input type="hidden" name="course_id" value={lesson.course_id} />
          <Field label="Título" name="title" defaultValue={lesson.title} required />
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Ordem" name="order_index" type="number" defaultValue={lesson.order_index} />
            <Select
              label="Tipo"
              name="content_type"
              options={contentTypeOptions}
              defaultValue={lesson.content_type || "video"}
            />
            <Select
              label="Formato"
              name="video_format"
              options={videoFormatOptions}
              defaultValue={lesson.video_format || "desktop"}
            />
          </div>
          <Field label="Link do YouTube" name="youtube_url" defaultValue={lesson.youtube_url} />
          <Field
            label="Data de liberação (opcional)"
            name="available_at"
            type="datetime-local"
            defaultValue={lesson.available_at ? lesson.available_at.slice(0, 16) : ""}
          />
          <TextArea
            label="Conteúdo escrito (só para aulas em texto)"
            name="body"
            defaultValue={lesson.body}
            rows={4}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Checkbox label="Publicado" name="is_published" defaultChecked={lesson.is_published} />
            <div className="flex items-center gap-2">
              <Button type="submit" variant="secondary" size="sm">
                Salvar aula
              </Button>
            </div>
          </div>
        </form>
        <form action={deleteLesson} className="mt-2">
          <input type="hidden" name="id" value={lesson.id} />
          <Button type="submit" variant="danger" size="sm">
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </form>
      </div>
    </details>
  );
}

/** Compact inline form to append a new lesson to a specific course. */
export function AddLessonForm({
  courseId,
  nextOrder,
}: {
  courseId: string;
  nextOrder: number;
}) {
  return (
    <Card tone="flat" className="p-4">
      <form
        action={createLesson}
        className="grid gap-3 sm:grid-cols-2 md:grid-cols-[1.2fr_1.6fr_84px_auto] md:items-end"
      >
        <input type="hidden" name="course_id" value={courseId} />
        <input type="hidden" name="content_type" value="video" />
        <input type="hidden" name="video_format" value="desktop" />
        <Field label="Título da aula" name="title" required />
        <Field label="Link do YouTube" name="youtube_url" />
        <Field label="Ordem" name="order_index" type="number" defaultValue={nextOrder} />
        <Button type="submit" className="h-11 w-full md:w-auto">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </form>
    </Card>
  );
}
