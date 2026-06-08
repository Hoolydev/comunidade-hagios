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
      <section className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <Card className="p-5 xl:sticky xl:top-6 xl:self-start">
          <h2 className="text-xl font-bold">Criar aula (completa)</h2>
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
              Use este formulário para uma aula com todos os detalhes. Para adicionar
              vários links rápido, use o botão <strong>Adicionar aula</strong> em cada trilha.
            </p>
            <Checkbox label="Publicado" name="is_published" defaultChecked />
            <Button type="submit" className="w-full">Criar aula</Button>
          </form>
        </Card>

        <div className="grid gap-7">
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
                <div key={course.id} className="grid gap-3">
                  <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <Badge tone="neutral">{courseLessons.length} aula(s)</Badge>
                  </div>
                  {courseLessons.map((lesson) => (
                    <LessonEditCard key={lesson.id} lesson={lesson} />
                  ))}
                  <AddLessonForm courseId={course.id} nextOrder={courseLessons.length + 1} />
                </div>
              );
            })
          )}
        </div>
      </section>
    </AdminSubpage>
  );
}
