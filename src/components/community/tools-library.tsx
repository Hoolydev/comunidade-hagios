"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ToolResource } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const categories = [
  "Todos",
  "Prompts",
  "Templates",
  "Checklists",
  "Planilhas",
  "Fluxogramas",
  "E-books",
  "Guias",
  "Ferramentas recomendadas",
  "Automações",
];

export function ToolsLibrary({ tools }: { tools: ToolResource[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory = category === "Todos" || tool.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${tool.title} ${tool.description} ${tool.category}`.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query, tools]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 rounded-lg border border-line bg-panel/70 p-3 lg:grid-cols-[1fr_auto]">
        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-line bg-navy-deep/50 px-4">
          <Search className="h-4 w-4 text-gold" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar prompts, templates, planilhas..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "min-h-12 shrink-0 rounded-lg border px-4 text-sm font-semibold transition",
                category === item
                  ? "border-gold/40 bg-gold/12 text-gold-strong"
                  : "border-line bg-white/[0.045] text-muted hover:border-gold/30 hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filteredTools.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="flex h-full flex-col p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-strong">
                  {tool.category}
                </span>
                <span className="text-xs text-muted">{formatDate(tool.updated_at)}</span>
              </div>
              <h2 className="text-xl font-black">{tool.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted">{tool.description}</p>
              <ButtonLink href={tool.url} className="mt-5 w-full">
                Abrir ferramenta
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma ferramenta encontrada"
          description="Tente buscar por outro termo ou mudar a categoria selecionada."
        />
      )}
    </div>
  );
}
