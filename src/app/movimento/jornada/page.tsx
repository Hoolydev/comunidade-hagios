import { Map } from "lucide-react";
import { JourneyProgressBoard } from "@/components/movement/journey-progress-board";
import { PageHero } from "@/components/movement/page-hero";
import { getJourneyTracks } from "@/lib/data";

export default async function JornadaPage() {
  const tracks = await getJourneyTracks();

  return (
    <div className="grid gap-6">
      <PageHero
        eyebrow="Jornada Hágios"
        title="A Jornada vai te guiar para suas primeiras implementações."
        description="A jornada é organizada em trilhas, que são implementações de soluções de IA dentro de um macro tema. Nas trilhas você encontra missões fundamentais com prática guiada para fazer enquanto acompanha. Ao final de cada missão, você já implementou aquela IA em uma parte da sua operação."
        descriptionLabel="O que é Jornada?"
        icon={Map}
      />

      <JourneyProgressBoard tracks={tracks} />
    </div>
  );
}
