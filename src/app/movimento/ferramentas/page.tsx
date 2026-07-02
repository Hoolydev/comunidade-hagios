import { LibraryBig } from "lucide-react";
import { PageHero } from "@/components/movement/page-hero";
import { ToolsLibrary } from "@/components/movement/tools-library";
import { getTools } from "@/lib/data";

export default async function FerramentasPage() {
  const tools = await getTools();

  return (
    <div className="grid gap-7">
      <PageHero
        eyebrow="Biblioteca de Ferramentas"
        title="Encontre rápido o que ajuda você a implementar."
        description="Prompts, templates, checklists, planilhas, fluxogramas, guias, automações e ferramentas recomendadas para aplicar IA no negócio."
        descriptionLabel="O que tem na biblioteca?"
        icon={LibraryBig}
      />

      <ToolsLibrary tools={tools} />
    </div>
  );
}
