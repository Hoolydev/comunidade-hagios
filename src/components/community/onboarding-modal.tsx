"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, PlayCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hagios-onboarding-v1";

const steps = [
  {
    title: "Assista à aula de boas-vindas",
    description:
      "Entenda como usar a comunidade para evoluir o negócio, não apenas consumir aulas.",
    icon: PlayCircle,
  },
  {
    title: "Entre no grupo de WhatsApp",
    description:
      "Avisos, networking e trocas rápidas acontecem no grupo oficial da comunidade.",
    icon: MessageCircle,
  },
  {
    title: "Inicie a trilha Fundamentos da IA",
    description:
      "Comece pela base para usar IA com clareza em marketing, vendas, atendimento e gestão.",
    icon: CheckCircle2,
  },
  {
    title: "Acompanhe os conteúdos recentes",
    description:
      "A área de novidades mostra o que foi publicado por último e o que merece sua atenção agora.",
    icon: CheckCircle2,
  },
  {
    title: "Participe da próxima mentoria",
    description:
      "As mentorias mensais conectam estratégia, prática e dúvidas reais dos membros.",
    icon: CheckCircle2,
  },
  {
    title: "Entre no ciclo contínuo",
    description:
      "Assista, implemente, tire dúvidas, participe dos desafios e acompanhe sua evolução.",
    icon: CheckCircle2,
  },
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const step = steps[current];

  useEffect(() => {
    queueMicrotask(() => {
      setOpen(window.localStorage.getItem(STORAGE_KEY) !== "done");
    });
  }, []);

  function close() {
    window.localStorage.setItem(STORAGE_KEY, "done");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/68 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-gold/25 bg-panel p-5 shadow-[0_40px_140px_rgba(0,0,0,0.55)] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-gold-strong to-white/50" />
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-white/10 hover:text-foreground"
          aria-label="Fechar onboarding"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pr-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Primeiro acesso
          </p>
          <h2 className="mt-2 text-2xl font-black">Comece com direção</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Em poucos passos você entende o fluxo da Comunidade Hágios e já sabe
            onde colocar energia primeiro.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-line bg-navy-deep/35 p-4">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/10">
              <step.icon className="h-5 w-5 text-gold-strong" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gold">
                Passo {current + 1} de {steps.length}
              </p>
              <h3 className="mt-1 text-lg font-black">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-6 gap-2">
          {steps.map((item, index) => (
            <div
              key={item.title}
              className={cn(
                "h-1.5 rounded-full",
                index <= current ? "bg-gold" : "bg-white/10",
              )}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="ghost" onClick={close}>
            Ver depois
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (current === steps.length - 1) {
                close();
                return;
              }
              setCurrent((value) => value + 1);
            }}
          >
            {current === steps.length - 1 ? "Concluir" : "Próximo"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
