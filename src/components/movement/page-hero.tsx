import type { ComponentType, SVGProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export function PageHero({
  eyebrow,
  title,
  description,
  descriptionLabel = "O que é esta área?",
  icon: Icon,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  descriptionLabel?: string;
  icon?: IconComponent;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "py-2",
        className,
      )}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="mb-4 flex items-center gap-3">
            {Icon ? (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/10">
                <Icon className="h-5 w-5 text-gold-strong" />
              </span>
            ) : null}
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              {eyebrow}
            </p>
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
            {title}
          </h1>
          <details className="group mt-4 max-w-2xl">
            <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-line bg-white/[0.045] px-4 text-sm font-semibold text-foreground transition hover:border-gold/45 hover:bg-white/[0.07] [&::-webkit-details-marker]:hidden">
              {descriptionLabel}
              <ChevronDown className="h-4 w-4 text-gold-strong transition group-open:rotate-180" />
            </summary>
            <div className="mt-3 rounded-lg border border-line bg-white/[0.035] p-4">
              <p className="text-sm leading-6 text-muted sm:text-base sm:leading-7">
                {description}
              </p>
            </div>
          </details>
        </div>
        {action ? <div className="flex flex-col gap-3 sm:flex-row">{action}</div> : null}
      </div>
    </section>
  );
}
