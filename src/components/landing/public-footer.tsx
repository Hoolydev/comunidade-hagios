import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-semibold text-foreground">Comunidade Hágios</span> - IA
          aplicada ao negócio
        </p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/login?next=/comunidade" className="hover:text-foreground">
            Já sou assinante
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Termos
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Politica de privacidade
          </Link>
        </nav>
      </div>
    </footer>
  );
}
