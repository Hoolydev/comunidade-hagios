import { cn } from "@/lib/utils";

type CardTone = "flat" | "base" | "raised";

const tones: Record<CardTone, string> = {
  // Secondary panels / list rows — recede into the background.
  flat: "rounded-lg border border-line/60 bg-white/[0.025]",
  // Default surface.
  base: "rounded-lg border border-line bg-panel/88 shadow-[0_14px_42px_rgba(0,0,0,0.22)] ring-1 ring-white/[0.02]",
  // Hero / featured — clearly lifted off the page.
  raised:
    "rounded-lg border border-line bg-panel shadow-[0_28px_80px_rgba(0,0,0,0.45)] ring-1 ring-gold/10",
};

export function Card({
  children,
  className,
  tone = "base",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: CardTone;
}) {
  return <div className={cn(tones[tone], className)}>{children}</div>;
}
