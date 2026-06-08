import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  Flag,
  GraduationCap,
  HelpCircle,
  LibraryBig,
  Megaphone,
  Target,
  UsersRound,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AdminStat } from "@/components/admin/shared";
import {
  getAdminRows,
  getAdminUsers,
  getCourses,
  getLessons,
  getMaterials,
} from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

type AdminCategory = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  count?: number;
};

export default async function AdminPage() {
  await requireAdmin();
  const [courses, lessons, materials, users, nextActions, events, mentorships, challenges, tools, questions] =
    await Promise.all([
      getCourses({ includeDrafts: true }),
      getLessons({ includeDrafts: true }),
      getMaterials({ includeDrafts: true }),
      getAdminUsers(),
      getAdminRows("next_actions", "order_index", true),
      getAdminRows("community_events", "date", true),
      getAdminRows("mentorships", "date", false),
      getAdminRows("challenges", "published_at", false),
      getAdminRows("tools", "updated_at", false),
      getAdminRows("community_questions", "created_at", false),
    ]);

  const home: AdminCategory[] = [
    {
      href: "/admin/banner",
      icon: Megaphone,
      title: "Banner de boas-vindas",
      description: "Texto e vídeo do topo da comunidade.",
    },
    {
      href: "/admin/proximo-passo",
      icon: Target,
      title: "Próximo passo",
      description: "Cards de 'O que fazer agora?'.",
      count: nextActions.length,
    },
    {
      href: "/admin/eventos",
      icon: CalendarDays,
      title: "Próximos eventos",
      description: "Agenda da home.",
      count: events.length,
    },
  ];

  const content: AdminCategory[] = [
    {
      href: "/admin/trilhas",
      icon: BookOpen,
      title: "Trilhas",
      description: "Crie e edite os cursos da Jornada.",
      count: courses.length,
    },
    {
      href: "/admin/aulas",
      icon: Video,
      title: "Aulas",
      description: "Vídeos e textos de cada trilha.",
      count: lessons.length,
    },
    {
      href: "/admin/materiais",
      icon: FileText,
      title: "Materiais das aulas",
      description: "Anexos das trilhas e aulas.",
      count: materials.length,
    },
    {
      href: "/admin/mentorias",
      icon: GraduationCap,
      title: "Mentorias",
      description: "Encontros ao vivo e gravações.",
      count: mentorships.length,
    },
    {
      href: "/admin/desafios",
      icon: Flag,
      title: "Desafios",
      description: "Desafios de implementação.",
      count: challenges.length,
    },
    {
      href: "/admin/ferramentas",
      icon: LibraryBig,
      title: "Biblioteca de ferramentas",
      description: "Prompts, templates e planilhas.",
      count: tools.length,
    },
    {
      href: "/admin/duvidas",
      icon: HelpCircle,
      title: "Dúvidas",
      description: "Perguntas e respostas da comunidade.",
      count: questions.length,
    },
  ];

  const community: AdminCategory[] = [
    {
      href: "/admin/comunidade",
      icon: UsersRound,
      title: "Comunidade e usuários",
      description: "Grupo do WhatsApp e lista de membros.",
      count: users.length,
    },
  ];

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:py-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link href="/comunidade" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold">
                <ArrowLeft className="h-4 w-4" />
                Voltar para comunidade
              </Link>
              <h1 className="mt-3 text-3xl font-black sm:text-5xl">Painel administrativo</h1>
              <p className="mt-2 max-w-2xl text-muted">
                Escolha uma categoria para gerenciar. Cada área abre sua própria tela de edição.
              </p>
            </div>
            <Badge tone="gold">Admin</Badge>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <AdminStat icon={BookOpen} label="Trilhas cadastradas" value={courses.length} />
          <AdminStat icon={Video} label="Aulas cadastradas" value={lessons.length} />
          <AdminStat icon={FileText} label="Materiais cadastrados" value={materials.length} />
        </section>

        <CategoryGroup title="Página inicial" items={home} />
        <CategoryGroup title="Conteúdo" items={content} />
        <CategoryGroup title="Comunidade" items={community} />
      </div>
    </main>
  );
}

function CategoryGroup({ title, items }: { title: string; items: AdminCategory[] }) {
  return (
    <section className="grid gap-4">
      <p className="border-t border-line pt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
        {title}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="group">
            <Card className="flex h-full items-start gap-4 p-5 transition hover:-translate-y-1 hover:border-gold/45">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/10">
                <item.icon className="h-5 w-5 text-gold-strong" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-bold">{item.title}</h2>
                  {typeof item.count === "number" ? (
                    <Badge tone="neutral">{item.count}</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold">
                  Gerenciar
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
