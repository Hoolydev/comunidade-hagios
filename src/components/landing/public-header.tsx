import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { ButtonLink } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <LogoMark size="xs" priority />
          <span>Comunidade Hágios</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          <a href="#incluso" className="hover:text-foreground">
            Incluso
          </a>
          <a href="#preco" className="hover:text-foreground">
            Preço
          </a>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/login?next=/comunidade" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Já sou assinante
          </ButtonLink>
          <ButtonLink href="/checkout" size="sm">
            Assinar
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
