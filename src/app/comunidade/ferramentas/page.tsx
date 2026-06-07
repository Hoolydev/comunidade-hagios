import { ToolsLibrary } from "@/components/community/tools-library";
import { getTools } from "@/lib/data";

export default async function FerramentasPage() {
  const tools = await getTools();

  return (
    <div className="grid gap-7">
      <section className="rounded-lg border border-line bg-[linear-gradient(135deg,rgba(255,201,40,0.13),rgba(255,255,255,0.04),rgba(8,13,22,0.72))] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Biblioteca de Ferramentas
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
          Encontre rápido o que ajuda você a implementar.
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Prompts, templates, checklists, planilhas, fluxogramas, guias,
          automações e ferramentas recomendadas para aplicar IA no negócio.
        </p>
      </section>

      <ToolsLibrary tools={tools} />
    </div>
  );
}
