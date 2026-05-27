"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileText,
  Home,
  LayoutDashboard,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/comunidade", label: "Início", icon: Home },
  { href: "/comunidade/conteudos", label: "Conteúdos", icon: LayoutDashboard },
  { href: "/comunidade/cursos", label: "Cursos", icon: BookOpen },
  { href: "/comunidade/materiais", label: "Materiais", icon: FileText },
  { href: "/comunidade/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { href: "/comunidade/conta", label: "Conta", icon: User },
];

function isActive(pathname: string, href: string) {
  if (href === "/comunidade") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function InternalNav({
  isAdmin,
  mobile = false,
}: {
  isAdmin?: boolean;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const items = isAdmin
    ? [...nav, { href: "/admin", label: "Admin", icon: Settings }]
    : nav;

  return (
    <nav className={cn(mobile ? "flex gap-2 overflow-x-auto pb-1" : "grid gap-1")}>
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg border text-sm font-medium transition",
              mobile ? "min-h-10 shrink-0 px-3" : "min-h-11 px-3",
              active
                ? "border-gold/35 bg-gold/12 text-gold-strong shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                : "border-transparent text-muted hover:border-line hover:bg-white/[0.06] hover:text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 shrink-0",
                active ? "text-gold-strong" : "text-muted group-hover:text-foreground",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
