import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { InternalNav } from "@/components/community/internal-nav";
import { SignOutButton } from "@/components/community/sign-out-button";

export function InternalShell({
  children,
  isAdmin,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[292px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-panel/88 p-4 backdrop-blur lg:block">
        <Link href="/comunidade" className="mb-7 flex items-center gap-3 rounded-lg px-2 py-2 font-semibold">
          <LogoMark size="sm" />
          <span className="leading-tight">
            Comunidade
            <span className="block text-sm font-medium text-gold">Hagios</span>
          </span>
        </Link>
        <div className="mb-5 rounded-lg border border-line bg-navy-deep/35 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Centro de evolução
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            IA aplicada ao negócio com próximos passos, desafios e suporte.
          </p>
        </div>
        <InternalNav isAdmin={isAdmin} />
        <div className="absolute inset-x-4 bottom-4 border-t border-line pt-4">
          <SignOutButton />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-line bg-background/92 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <Link href="/comunidade" className="flex items-center gap-2 font-semibold">
              <LogoMark size="xs" />
              Hagios
            </Link>
            <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-strong">
              Premium
            </span>
          </div>
          <InternalNav isAdmin={isAdmin} mobile />
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
