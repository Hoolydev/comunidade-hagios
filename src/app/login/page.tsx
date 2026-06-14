import Link from "next/link";
import { Suspense } from "react";
import { LogoMark } from "@/components/brand/logo-mark";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-background px-4 py-8 text-foreground lg:grid-cols-[0.95fr_1.05fr] lg:p-0">
      <section className="hidden min-h-screen flex-col justify-between border-r border-line bg-panel-soft/40 p-10 lg:flex">
        <Link href="/" className="mx-auto flex flex-col items-center gap-3 text-center font-semibold">
          <LogoMark size="lg" priority />
          <span>Comunidade Hágios</span>
        </Link>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
            Empreenda com IA
          </p>
          <h2 className="mt-4 max-w-xl text-5xl font-black leading-tight">
            Conteúdo, implementação e comunidade para otimizar suas operações.
          </h2>
        </div>
        <p className="text-sm text-muted">Comunidade Hágios</p>
      </section>
      <section className="flex min-h-screen items-center justify-center">
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
