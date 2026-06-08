import { LibraryBig } from "lucide-react";
import { PageHero } from "@/components/community/page-hero";
import { ToolsLibrary } from "@/components/community/tools-library";
import { getTools } from "@/lib/data";

export default async function FerramentasPage() {
  const tools = await getTools();

  return (
    <div className="grid gap-7">
      <PageHero
        eyebrow="Biblioteca de Ferramentas"
        title="Encontre rápido o que ajuda você a implementar."
        description="Prompts, templates, checklists, planilhas, fluxogramas, guias, automações e ferramentas recomendadas para aplicar IA no negócio."
        icon={LibraryBig}
      />

      <ToolsLibrary tools={tools} />
    </div>
  );
}
