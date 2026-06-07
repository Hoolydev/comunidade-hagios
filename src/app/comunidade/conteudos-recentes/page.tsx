import { RecentContentList } from "@/components/community/recent-content-list";
import { getRecentContents } from "@/lib/data";

export default async function ConteudosRecentesPage() {
  const items = await getRecentContents();

  return (
    <div className="grid gap-7">
      <section className="rounded-lg border border-line bg-[linear-gradient(135deg,rgba(255,201,40,0.13),rgba(255,255,255,0.04),rgba(8,13,22,0.72))] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Conteúdos Recentes
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
          O que entrou agora na comunidade.
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Vídeos, atualizações, ferramentas, tendências e casos práticos em ordem
          de publicação, para você sempre saber o que é novo.
        </p>
      </section>

      <RecentContentList items={items} />
    </div>
  );
}
