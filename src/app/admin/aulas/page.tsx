import { createLesson } from "@/app/admin/actions";
import { contentTypeOptions, videoFormatOptions } from "@/components/admin/cms-fields";
import {
  AddLessonForm,
  AdminSubpage,
  CourseSelect,
  LessonEditCard,
} from "@/components/admin/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox, Field, Select, TextArea } from "@/components/ui/form-fields";
import { getCourses, getLessons } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLessonsPage() {
  await requireAdmin();
  const [courses, lessons] = await Promise.all([
    getCourses({ includeDrafts: true }),
    getLessons({ includeDrafts: true }),
  ]);

  return (
    <AdminSubpage
      title="Aulas"
      description="Cada trilha tem suas aulas (vídeo do YouTube ou texto). Adicione quantos links quiser — um por aula."
    >
      <section className="grid min-w-0 gap-6 2xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="min-w-0 overflow-hidden p-5 2xl:sticky 2xl:top-6 2xl:self-start">
          <div>
            <h2 className="text-xl font-bold">Criar aula completa</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Use este formulário quando precisar configurar descrição, formato,
              liberação ou conteúdo em texto.
            </p>
          </div>
          <form action={createLesson} className="mt-5 grid gap-4" data-testid="create-lesson-form">
            <CourseSelect courses={courses} />
            <Select label="Tipo de conteúdo" name="content_type" options={contentTypeOptions} defaultValue="video" />
            <Field label="Título" name="title" required />
            <TextArea label="Descrição" name="description" />
            <Field label="Link do YouTube ou ID (para aulas em vídeo)" name="youtube_url" />
            <TextArea label="Conteúdo escrito (para aulas em texto)" name="body" rows={6} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ordem da aula" name="order_index" type="number" defaultValue={1} />
              <Select label="Formato do vídeo" name="video_format" options={videoFormatOptions} defaultValue="desktop" />
            </div>
            <Field label="Data de liberação (opcional)" name="available_at" type="datetime-local" />
            <p className="text-xs leading-5 text-muted">
              Para links simples, abra o formulário rápido dentro da trilha desejada.
            </p>
            <Checkbox label="Publicado" name="is_published" defaultChecked />
            <Button type="submit" className="w-full">Criar aula</Button>
          </form>
        </Card>

        <div className="grid min-w-0 gap-5">
          {courses.length === 0 ? (
            <Card tone="flat" className="p-6 text-sm text-muted">
              Crie uma trilha primeiro para poder adicionar aulas.
            </Card>
          ) : (
            courses.map((course) => {
              const courseLessons = lessons
                .filter((lesson) => lesson.course_id === course.id)
                .sort((a, b) => a.order_index - b.order_index);

              return (
                <Card key={course.id} tone="flat" className="min-w-0 p-4 sm:p-5">
                  <div className="flex min-w-0 items-start justify-between gap-4 border-b border-line pb-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold leading-snug break-words">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        Organize as aulas desta trilha em ordem de execução.
                      </p>
                    </div>
                    <Badge tone="neutral">{courseLessons.length} aula(s)</Badge>
                  </div>
                  <div className="mt-4 grid min-w-0 gap-3">
                    {courseLessons.length ? (
                      courseLessons.map((lesson) => (
                        <LessonEditCard key={lesson.id} lesson={lesson} />
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed border-line/70 bg-black/10 p-4 text-sm leading-6 text-muted">
                        Nenhuma aula cadastrada nesta trilha ainda.
                      </div>
                    )}
                    <AddLessonForm courseId={course.id} nextOrder={courseLessons.length + 1} />
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </AdminSubpage>
  );
}
