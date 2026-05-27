import { MaterialCard } from "@/components/community/material-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getMaterials } from "@/lib/data";

export default async function MaterialsPage() {
  const materials = await getMaterials();

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Downloads
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Materiais</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Links externos para Google Drive, Dropbox, Notion, PDFs, planilhas e
          outros materiais de apoio.
        </p>
      </div>
      {materials.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {materials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum material publicado"
          description="Cadastre links de download no painel admin."
        />
      )}
    </div>
  );
}
