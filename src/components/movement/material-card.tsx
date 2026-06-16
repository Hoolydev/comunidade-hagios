import { ExternalLink, FileDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { Material } from "@/lib/types";

export function MaterialCard({ material }: { material: Material }) {
  return (
    <article className="rounded-lg border border-line bg-panel p-5">
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-gold/12 text-gold-strong">
        <FileDown className="h-5 w-5" />
      </div>
      <Badge>{material.category}</Badge>
      <h3 className="mt-4 text-lg font-bold">{material.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
        {material.description}
      </p>
      <ButtonLink href={material.file_url} className="mt-5 w-full">
        Abrir material
        <ExternalLink className="h-4 w-4" />
      </ButtonLink>
    </article>
  );
}
