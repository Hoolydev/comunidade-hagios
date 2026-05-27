import { CourseCard } from "@/components/community/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCourses } from "@/lib/data";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Cursos
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Trilhas da comunidade</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Escolha uma trilha e assista às aulas com materiais anexos.
        </p>
      </div>
      {courses.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum curso publicado"
          description="Assim que o admin publicar cursos, eles aparecem aqui."
        />
      )}
    </div>
  );
}
