import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-panel/86 shadow-[0_22px_80px_rgba(0,0,0,0.24)] ring-1 ring-white/[0.025]",
        className,
      )}
    >
      {children}
    </div>
  );
}
