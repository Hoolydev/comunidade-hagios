import { Trash2 } from "lucide-react";
import { createMaterial, deleteMaterial, updateMaterial } from "@/app/admin/actions";
import { AdminSubpage, CourseSelect, LessonSelect } from "@/components/admin/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox, Field, Select, TextArea } from "@/components/ui/form-fields";
import { categories, getCourses, getLessons, getMaterials } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminMaterialsPage() {
  await requireAdmin();
  const [courses, lessons, materials] = await Promise.all([
    getCourses({ includeDrafts: true }),
    getLessons({ includeDrafts: true }),
    getMaterials({ includeDrafts: true }),
  ]);

  return (
    <AdminSubpage
      title="Materiais das aulas"
      description="Anexos (PDFs, planilhas, links) que aparecem dentro das trilhas e aulas."
    >
      <section className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <Card className="p-5 xl:sticky xl:top-6 xl:self-start">
          <h2 className="text-xl font-bold">Criar material</h2>
          <form action={createMaterial} className="mt-5 grid gap-4" data-testid="create-material-form">
            <CourseSelect courses={courses} optional />
            <LessonSelect lessons={lessons} optional />
            <Field label="Título" name="title" required />
            <TextArea label="Descrição" name="description" />
            <Field label="Link externo" name="file_url" required />
            <Select label="Categoria" name="category" options={categories} />
            <Checkbox label="Publicado" name="is_published" defaultChecked />
            <Button type="submit" className="w-full">Criar material</Button>
          </form>
        </Card>

        <div className="grid gap-4">
          {materials.length === 0 ? (
            <Card tone="flat" className="p-6 text-sm text-muted">
              Nenhum material cadastrado ainda.
            </Card>
          ) : (
            materials.map((material) => (
              <Card key={material.id} className="p-5 transition hover:border-gold/35">
                <form action={updateMaterial} className="grid gap-4">
                  <input type="hidden" name="id" value={material.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <CourseSelect courses={courses} optional defaultValue={material.course_id || ""} />
                    <LessonSelect lessons={lessons} optional defaultValue={material.lesson_id || ""} />
                  </div>
                  <Field label="Título" name="title" defaultValue={material.title} required />
                  <TextArea label="Descrição" name="description" defaultValue={material.description} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Link" name="file_url" defaultValue={material.file_url} />
                    <Select label="Categoria" name="category" options={categories} defaultValue={material.category} />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Checkbox label="Publicado" name="is_published" defaultChecked={material.is_published} />
                    <Button type="submit" variant="secondary">Salvar material</Button>
                  </div>
                </form>
                <form action={deleteMaterial} className="mt-3">
                  <input type="hidden" name="id" value={material.id} />
                  <Button type="submit" variant="danger" size="sm">
                    <Trash2 className="h-4 w-4" />
                    Excluir material
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
