import { ArrowRight, BookOpen, FileText, MessageCircle, PlayCircle } from "lucide-react";
import { CourseCard } from "@/components/community/course-card";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCourses, getDashboardStats, getWhatsappLink } from "@/lib/data";

export default async function CommunityHomePage() {
  const [stats, courses, whatsappLink] = await Promise.all([
    getDashboardStats(),
    getCourses(),
    getWhatsappLink(),
  ]);

  const statCards = [
    { label: "Conteúdos disponíveis", value: stats.lessons + stats.materials, icon: PlayCircle },
    { label: "Cursos disponíveis", value: stats.courses, icon: BookOpen },
    { label: "Materiais disponíveis", value: stats.materials, icon: FileText },
  ];

  return (
    <div className="grid gap-7">
      <section className="relative overflow-hidden rounded-lg border border-line bg-[linear-gradient(135deg,rgba(255,201,40,0.16),rgba(255,255,255,0.045)_46%,rgba(11,17,28,0.1))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.22)] sm:p-8">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_20%,rgba(255,201,40,0.18),transparent_18rem)]" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              Área interna
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black sm:text-5xl">
              Bem-vindo à Comunidade Hagios
            </h1>
            <p className="mt-4 max-w-2xl text-muted">
              Acesse aulas, cursos, materiais e o grupo oficial para aplicar
              Marketing com IA com mais clareza e velocidade.
            </p>
          </div>
          <ButtonLink href={whatsappLink} size="lg" className="w-full sm:w-auto">
            <MessageCircle className="h-5 w-5" />
            Acessar grupo
          </ButtonLink>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {statCards.map((item) => (
          <Card key={item.label} className="p-5 transition hover:-translate-y-1 hover:border-gold/35">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-3xl font-black">{item.value}</p>
                <p className="mt-1 text-sm text-muted">{item.label}</p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-lg border border-gold/20 bg-gold/10">
                <item.icon className="h-5 w-5 text-gold-strong" />
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Cursos em destaque</h2>
            <p className="mt-1 text-sm text-muted">Comece por uma trilha prática.</p>
          </div>
          <ButtonLink href="/comunidade/conteudos" variant="secondary">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
