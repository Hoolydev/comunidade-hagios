"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, FileText, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { categories } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ContentCard = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string | null;
  type: "curso" | "material" | "vídeo";
  href: string;
  created_at: string;
};

const filters = ["Todos", ...categories, "Conteúdos recentes"];

export function ContentGrid({ items }: { items: ContentCard[] }) {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredItems = useMemo(() => {
    if (activeFilter === "Todos") return items;
    if (activeFilter === "Conteúdos recentes") return items.slice(0, 6);
    return items.filter((item) => item.category === activeFilter);
  }, [activeFilter, items]);

  return (
    <div>
      <div className="mb-7 flex gap-2 overflow-x-auto rounded-lg border border-line bg-panel/55 p-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "min-h-10 shrink-0 rounded-lg border px-4 text-sm font-medium transition",
              activeFilter === filter
                ? "border-gold bg-gold/15 text-gold-strong"
                : "border-line bg-white/[0.03] text-muted hover:text-foreground",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          title="Nenhum conteúdo encontrado"
          description="Assim que novos conteúdos forem publicados, eles aparecem nesta grade."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={`${item.type}-${item.id}`}
              className="group overflow-hidden rounded-lg border border-line bg-panel shadow-[0_18px_70px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-gold/45"
            >
              <div className="relative aspect-[16/9] bg-white/5">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="grid h-full place-items-center">
                    <FileText className="h-10 w-10 text-gold" />
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <Badge tone="neutral">
                    {item.type === "material" ? (
                      <FileText className="mr-1 h-3 w-3" />
                    ) : (
                      <PlayCircle className="mr-1 h-3 w-3" />
                    )}
                    {item.type}
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <Badge>{item.category}</Badge>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
                  {item.description}
                </p>
                <ButtonLink href={item.href} className="mt-5 w-full">
                  Acessar
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
