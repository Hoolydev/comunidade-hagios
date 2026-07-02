"use client";

import { useState } from "react";
import { ChevronDown, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/movement/video-embed";
import { cn } from "@/lib/utils";

export function WelcomeVideoCard({
  videoId,
  title,
  label,
}: {
  videoId: string;
  title: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-lg border border-line bg-panel/88 p-4 shadow-[0_14px_42px_rgba(0,0,0,0.2)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/10">
            <PlayCircle className="h-5 w-5 text-gold-strong" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {label}
            </p>
            <h2 className="mt-1 text-xl font-black leading-tight">{title}</h2>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="w-full sm:w-auto"
          aria-expanded={open}
        >
          {open ? "Ocultar aula" : "Reassistir"}
          <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
        </Button>
      </div>

      {open ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-line/70 bg-navy-deep">
          <VideoEmbed videoId={videoId} title={title} />
        </div>
      ) : null}
    </section>
  );
}
