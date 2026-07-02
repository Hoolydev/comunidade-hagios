import { Clock3 } from "lucide-react";
import { PageHero } from "@/components/movement/page-hero";
import { RecentContentList } from "@/components/movement/recent-content-list";
import { getRecentContents } from "@/lib/data";

export default async function ConteudosRecentesPage() {
  const items = await getRecentContents();

  return (
    <div className="grid gap-7">
      <PageHero
        eyebrow="Conteúdos Recentes"
        title="O que entrou agora no Movimento."
        description="Vídeos, atualizações, ferramentas, tendências e casos práticos em ordem de publicação, para você sempre saber o que é novo."
        descriptionLabel="O que são Conteúdos Recentes?"
        icon={Clock3}
      />

      <RecentContentList items={items} />
    </div>
  );
}
