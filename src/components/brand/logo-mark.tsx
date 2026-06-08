import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoMark({
  size = "sm",
  className,
  priority,
}: {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}) {
  const sizes = {
    xs: "h-8 w-8",
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-28 w-28 sm:h-36 sm:w-36",
  };

  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full ring-1 ring-gold/35 shadow-[0_0_32px_rgba(230,169,0,0.22)]",
        sizes[size],
        className,
      )}
    >
      <Image
        src="/logo-comunidade-hagios.png"
        alt="Logo Comunidade Hágios"
        fill
        sizes={size === "lg" ? "144px" : "56px"}
        className="object-cover"
        priority={priority}
      />
    </span>
  );
}
