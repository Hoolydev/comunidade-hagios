"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, PlayCircle, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { DEFAULT_WHATSAPP_LINK } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hagios-onboarding-v1";

const steps = [
  {
    title: "Assista à aula de boas-vindas",
    description:
      "Entenda como usar o Movimento para evoluir o negócio, não apenas consumir aulas.",
    icon: PlayCircle,
  },
  {
    title: "Entre no canal de WhatsApp",
    description:
      "Avisos, orientações e dúvidas práticas acontecem no canal oficial do Movimento.",
    icon: WhatsAppIcon,
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
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/70 px-3 pb-3 pt-12 backdrop-blur-sm sm:place-items-center sm:p-6">
      <div className="relative w-full max-w-xl overflow-hidden rounded-lg border border-line bg-panel shadow-[0_24px_80px_rgba(0,0,0,0.48)]">
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-lg text-muted transition hover:bg-white/10 hover:text-foreground"
          aria-label="Fechar onboarding"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-line bg-navy-deep/40 p-5 pr-14 sm:p-6 sm:pr-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Primeiro acesso
          </p>
          <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
            Um caminho simples para começar
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            O Movimento funciona em ciclos: aprender, aplicar, tirar dúvidas e
            acompanhar o que mudou.
          </p>
        </div>

        <div className="p-5 sm:p-6">
        <div className="rounded-lg border border-line bg-white/[0.035] p-4">
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
              {current === 1 ? (
                <a
                  href={DEFAULT_WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gold-strong px-4 text-sm font-semibold text-navy-deep transition hover:bg-gold"
                >
                  Entrar no canal agora
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-6 gap-2" aria-hidden="true">
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

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" onClick={close} className="min-h-11">
            Ver depois
          </Button>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Button
              type="button"
              variant="secondary"
              disabled={current === 0}
              onClick={() => setCurrent((value) => Math.max(0, value - 1))}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
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
      </div>
    </div>
  );
}
