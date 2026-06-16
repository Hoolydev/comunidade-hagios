import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export function BenefitCard({
  title,
  icon: Icon,
}: {
  title: string;
  icon: IconComponent;
}) {
  return (
    <div className="group rounded-lg border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-gold/45 hover:bg-white/[0.07]">
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg border border-gold/20 bg-gold/12 text-gold-strong transition group-hover:scale-105">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
    </div>
  );
}
