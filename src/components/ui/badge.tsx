import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode;
  tone?: "gold" | "green" | "red" | "neutral";
  className?: string;
}) {
  const tones = {
    gold: "border-gold/30 bg-gold/10 text-gold-strong",
    green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    red: "border-red-400/30 bg-red-400/10 text-red-200",
    neutral: "border-white/15 bg-white/6 text-muted",
  };

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
