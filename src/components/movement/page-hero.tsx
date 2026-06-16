import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export function PageHero({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
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
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
            {description}
          </p>
        </div>
        {action ? <div className="flex flex-col gap-3 sm:flex-row">{action}</div> : null}
      </div>
    </section>
  );
}
