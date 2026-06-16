import Link from "next/link";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { createCourse, deleteCourse, updateCourse } from "@/app/admin/actions";
import { AdminSubpage } from "@/components/admin/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox, Field, Select, TextArea } from "@/components/ui/form-fields";
import { categories, getCourses } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  await requireAdmin();
  const courses = await getCourses({ includeDrafts: true });

  return (
    <AdminSubpage
      title="Trilhas"
      description="Crie trilhas base, defina categoria e controle publicação. As aulas de cada trilha são gerenciadas em Aulas."
    >
      <section className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <Card className="p-5 xl:sticky xl:top-6 xl:self-start">
          <h2 className="text-xl font-bold">Criar trilha</h2>
          <form action={createCourse} className="mt-5 grid gap-4" data-testid="create-course-form">
            <Field label="Nome" name="title" required />
            <Field label="Slug automático ou customizado" name="slug" />
            <TextArea label="Descrição" name="description" required />
            <Field label="Thumbnail URL" name="thumbnail_url" />
            <Select label="Categoria" name="category" options={categories} />
            <div className="flex flex-wrap gap-4">
              <Checkbox label="Publicado" name="is_published" defaultChecked />
              <Checkbox label="Destaque" name="is_featured" />
            </div>
            <Button type="submit" className="w-full">Criar trilha</Button>
          </form>
        </Card>

        <div className="grid gap-4">
          {courses.length === 0 ? (
            <Card tone="flat" className="p-6 text-sm text-muted">
              Nenhuma trilha cadastrada ainda.
            </Card>
          ) : (
            courses.map((course) => (
              <Card key={course.id} className="p-5 transition hover:border-gold/35">
                <form action={updateCourse} className="grid gap-4">
                  <input type="hidden" name="id" value={course.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nome" name="title" defaultValue={course.title} required />
                    <Field label="Slug" name="slug" defaultValue={course.slug} required />
                  </div>
                  <TextArea label="Descrição" name="description" defaultValue={course.description} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Thumbnail URL" name="thumbnail_url" defaultValue={course.thumbnail_url} />
                    <Select label="Categoria" name="category" options={categories} defaultValue={course.category} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <Checkbox label="Publicado" name="is_published" defaultChecked={course.is_published} />
                      <Checkbox label="Destaque" name="is_featured" defaultChecked={course.is_featured} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/movimento/cursos/${course.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-gold"
                      >
                        Ver na área do membro
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <Button type="submit" variant="secondary">Salvar trilha</Button>
                    </div>
                  </div>
                </form>
                <form action={deleteCourse} className="mt-3">
                  <input type="hidden" name="id" value={course.id} />
                  <Button type="submit" variant="danger" size="sm">
                    <Trash2 className="h-4 w-4" />
                    Excluir trilha
                  </Button>
                </form>
              </Card>
            ))
          )}
        </div>
      </section>
    </AdminSubpage>
  );
}
