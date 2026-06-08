import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gold-strong text-navy-deep shadow-[0_10px_24px_rgba(216,163,27,0.18)] hover:bg-gold",
  secondary:
    "border border-line bg-white/[0.045] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-gold/55 hover:bg-white/[0.075]",
  ghost: "text-muted hover:bg-white/[0.08] hover:text-foreground",
  danger:
    "border border-red-400/40 bg-red-500/10 text-red-100 hover:border-red-300/70 hover:bg-red-500/20",
};

const sizes = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg text-center font-semibold leading-tight transition duration-200 focus:outline-none focus:ring-2 focus:ring-gold/55 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return <button className={buttonClassName({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  const external = href.startsWith("http");
  const classes = buttonClassName({ variant, size, className });

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
