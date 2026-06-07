import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  MessageCircle,
  Trash2,
  UsersRound,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  createCourse,
  createLesson,
  createMaterial,
  deleteCourse,
  deleteLesson,
  deleteMaterial,
  updateCourse,
  updateLesson,
  updateMaterial,
  updateWhatsappLink,
} from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox, Field, Select, TextArea } from "@/components/ui/form-fields";
import {
  categories,
  getAdminUsers,
  getCourses,
  getLessons,
  getMaterials,
  getWhatsappLink,
} from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const [courses, lessons, materials, users, whatsappLink] = await Promise.all([
    getCourses({ includeDrafts: true }),
    getLessons({ includeDrafts: true }),
    getMaterials({ includeDrafts: true }),
    getAdminUsers(),
    getWhatsappLink(),
  ]);

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:py-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8">
        <div className="rounded-lg border border-line bg-[linear-gradient(135deg,rgba(255,201,40,0.14),rgba(255,255,255,0.04))] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.22)] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/comunidade" className="inline-flex items-center gap-2 text-sm text-muted">
              <ArrowLeft className="h-4 w-4" />
              Voltar para comunidade
            </Link>
            <h1 className="mt-3 text-3xl font-black sm:text-5xl">Painel administrativo</h1>
            <p className="mt-2 text-muted">
              Gerencie Jornada, aulas, ferramentas, WhatsApp e usuários.
            </p>
          </div>
          <Badge tone="gold">Admin</Badge>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          <AdminStat icon={BookOpen} label="Trilhas cadastradas" value={courses.length} />
          <AdminStat icon={Video} label="Aulas cadastradas" value={lessons.length} />
          <AdminStat icon={FileText} label="Ferramentas cadastradas" value={materials.length} />
        </section>

        <AdminSectionHeading title="Jornada" description="Crie trilhas base, defina categoria e controle publicação." />
        <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <Card className="p-5 xl:sticky xl:top-6 xl:self-start">
            <h2 className="text-xl font-bold">Criar trilha</h2>
            <form action={createCourse} className="mt-5 grid gap-4">
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
            {courses.map((course) => (
              <Card key={course.id} className="p-5 transition hover:border-gold/35">
                <form action={updateCourse} className="grid gap-4">
                  <input type="hidden" name="id" value={course.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nome" name="title" defaultValue={course.title} required />
                    <Field label="Slug" name="slug" defaultValue={course.slug} required />
                  </div>
                  <TextArea label="Descrição" name="description" defaultValue={course.description} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Thumbnail URL"
                      name="thumbnail_url"
                      defaultValue={course.thumbnail_url}
                    />
                    <Select
                      label="Categoria"
                      name="category"
                      options={categories}
                      defaultValue={course.category}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <Checkbox
                        label="Publicado"
                        name="is_published"
                        defaultChecked={course.is_published}
                      />
                      <Checkbox
                        label="Destaque"
                        name="is_featured"
                        defaultChecked={course.is_featured}
                      />
                    </div>
                    <Button type="submit" variant="secondary">
                      Salvar trilha
                    </Button>
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
            ))}
          </div>
        </section>

        <AdminSectionHeading title="Aulas" description="Cadastre vídeos do YouTube e organize a ordem das aulas." />
        <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <Card className="p-5 xl:sticky xl:top-6 xl:self-start">
            <h2 className="text-xl font-bold">Criar aula</h2>
            <form action={createLesson} className="mt-5 grid gap-4">
              <CourseSelect courses={courses} />
              <Field label="Título" name="title" required />
              <TextArea label="Descrição" name="description" />
              <Field label="Link do YouTube ou ID" name="youtube_url" required />
              <Field label="Ordem da aula" name="order_index" type="number" defaultValue={1} />
              <Checkbox label="Publicado" name="is_published" defaultChecked />
              <Button type="submit" className="w-full">Criar aula</Button>
            </form>
          </Card>

          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="p-5 transition hover:border-gold/35">
                <form action={updateLesson} className="grid gap-4">
                  <input type="hidden" name="id" value={lesson.id} />
                  <CourseSelect courses={courses} defaultValue={lesson.course_id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Título" name="title" defaultValue={lesson.title} required />
                    <Field
                      label="Ordem"
                      name="order_index"
                      type="number"
                      defaultValue={lesson.order_index}
                    />
                  </div>
                  <TextArea label="Descrição" name="description" defaultValue={lesson.description} />
                  <Field label="YouTube" name="youtube_url" defaultValue={lesson.youtube_url} />
                  <div className="flex items-center justify-between gap-4">
                    <Checkbox
                      label="Publicado"
                      name="is_published"
                      defaultChecked={lesson.is_published}
                    />
                    <Button type="submit" variant="secondary">
                      Salvar aula
                    </Button>
                  </div>
                </form>
                <form action={deleteLesson} className="mt-3">
                  <input type="hidden" name="id" value={lesson.id} />
                  <Button type="submit" variant="danger" size="sm">
                    <Trash2 className="h-4 w-4" />
                    Excluir aula
                  </Button>
                </form>
              </Card>
            ))}
          </div>
        </section>

        <AdminSectionHeading title="Ferramentas" description="Adicione links externos e vincule a trilhas ou aulas quando fizer sentido." />
        <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <Card className="p-5 xl:sticky xl:top-6 xl:self-start">
            <h2 className="text-xl font-bold">Criar ferramenta</h2>
            <form action={createMaterial} className="mt-5 grid gap-4">
              <CourseSelect courses={courses} optional />
              <LessonSelect lessons={lessons} optional />
              <Field label="Título" name="title" required />
              <TextArea label="Descrição" name="description" />
              <Field label="Link externo" name="file_url" required />
              <Select label="Categoria" name="category" options={categories} />
              <Checkbox label="Publicado" name="is_published" defaultChecked />
              <Button type="submit" className="w-full">Criar ferramenta</Button>
            </form>
          </Card>

          <div className="grid gap-4">
            {materials.map((material) => (
              <Card key={material.id} className="p-5 transition hover:border-gold/35">
                <form action={updateMaterial} className="grid gap-4">
                  <input type="hidden" name="id" value={material.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <CourseSelect
                      courses={courses}
                      optional
                      defaultValue={material.course_id || ""}
                    />
                    <LessonSelect
                      lessons={lessons}
                      optional
                      defaultValue={material.lesson_id || ""}
                    />
                  </div>
                  <Field label="Título" name="title" defaultValue={material.title} required />
                  <TextArea
                    label="Descrição"
                    name="description"
                    defaultValue={material.description}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Link" name="file_url" defaultValue={material.file_url} />
                    <Select
                      label="Categoria"
                      name="category"
                      options={categories}
                      defaultValue={material.category}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Checkbox
                      label="Publicado"
                      name="is_published"
                      defaultChecked={material.is_published}
                    />
                    <Button type="submit" variant="secondary">
                      Salvar ferramenta
                    </Button>
                  </div>
                </form>
                <form action={deleteMaterial} className="mt-3">
                  <input type="hidden" name="id" value={material.id} />
                  <Button type="submit" variant="danger" size="sm">
                    <Trash2 className="h-4 w-4" />
                    Excluir ferramenta
                  </Button>
                </form>
              </Card>
            ))}
          </div>
        </section>

        <AdminSectionHeading title="Comunidade e usuários" description="Configure o grupo oficial e acompanhe o status dos membros." />
        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/20 bg-gold/10">
                <MessageCircle className="h-5 w-5 text-gold-strong" />
              </div>
              <h2 className="text-xl font-bold">Grupo WhatsApp</h2>
            </div>
            <form action={updateWhatsappLink} className="mt-5 grid gap-4">
              <Field
                label="Link do grupo"
                name="whatsapp_group_url"
                defaultValue={whatsappLink}
                required
              />
              <Button type="submit" className="w-full">Salvar link</Button>
            </form>
          </Card>
          <Card className="overflow-hidden">
            <div className="border-b border-line p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/20 bg-gold/10">
                  <UsersRound className="h-5 w-5 text-gold-strong" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Usuários</h2>
                  <p className="mt-1 text-sm text-muted">
                    Lista simples com status de assinatura.
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-white/[0.04] text-muted">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">E-mail</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Assinatura</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-line">
                      <td className="px-4 py-3">{user.name || "-"}</td>
                      <td className="px-4 py-3 text-muted">{user.email || "-"}</td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3">
                        <Badge
                          tone={
                            user.subscription_status === "active" ||
                            user.subscription_status === "trialing"
                              ? "green"
                              : "neutral"
                          }
                        >
                          {user.subscription_status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

function AdminStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <Card className="p-5 transition hover:-translate-y-1 hover:border-gold/35">
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

function AdminSectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-t border-line pt-7">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
        {title}
      </p>
      <p className="max-w-2xl text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function CourseSelect({
  courses,
  defaultValue,
  optional,
}: {
  courses: Awaited<ReturnType<typeof getCourses>>;
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

function LessonSelect({
  lessons,
  defaultValue,
  optional,
}: {
  lessons: Awaited<ReturnType<typeof getLessons>>;
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
