"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RecentContent } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const filters = [
  "Todos",
  "IA",
  "Marketing",
  "Atendimento",
  "Gestão",
  "Vendas",
  "Finanças",
  "Produtividade",
  "Ferramentas",
  "Atualizações",
];

const typeByFilter: Record<string, RecentContent["type"]> = {
  Ferramentas: "Ferramenta",
  Atualizações: "Atualização",
};

export function RecentContentList({ items }: { items: RecentContent[] }) {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filtered = useMemo(() => {
    if (activeFilter === "Todos") return items;
    return items.filter(
      (item) => item.category === activeFilter || item.type === typeByFilter[activeFilter],
    );
  }, [activeFilter, items]);

  return (
    <div className="grid gap-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "min-h-10 shrink-0 rounded-lg border px-4 text-sm font-semibold transition",
              activeFilter === filter
                ? "border-gold/40 bg-gold/12 text-gold-strong"
                : "border-line bg-white/[0.045] text-muted hover:border-gold/30 hover:text-foreground",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((item, index) => (
          <Card key={item.id} className="overflow-hidden p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex aspect-video w-full shrink-0 flex-col justify-between rounded-lg border border-line bg-navy-deep/55 p-4 sm:w-44">
                <Sparkles className="h-6 w-6 text-gold" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    {item.type}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm font-black leading-snug">
                    {item.category}
                  </p>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-strong">
                    {item.category}
                  </span>
                  <span className="rounded-full border border-line bg-white/[0.045] px-2.5 py-1 text-xs text-muted">
                    {item.type}
                  </span>
                  {index === 0 ? (
                    <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-100">
                      Novo
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 text-xl font-black">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Clock3 className="h-4 w-4 text-gold" />
                    {formatDate(item.published_at)}
                    {item.duration ? <span>{item.duration}</span> : null}
                  </div>
                  <ButtonLink href={item.href} variant="secondary" size="sm">
                    Acessar
                    <ArrowRight className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
