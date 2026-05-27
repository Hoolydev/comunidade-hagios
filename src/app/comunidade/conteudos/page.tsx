import { ContentGrid } from "@/components/community/content-grid";
import { getContentCards } from "@/lib/data";

export default async function ConteudosPage() {
  const items = await getContentCards();

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Biblioteca
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Conteúdos</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Filtre aulas, cursos e materiais por categoria e acesse o que precisa
          aplicar agora.
        </p>
      </div>
      <ContentGrid items={items} />
    </div>
  );
}
