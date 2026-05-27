"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, KeyRound, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Mode = "login" | "signup" | "reset";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [pending, startTransition] = useTransition();
  const supabase = createSupabaseBrowserClient();
  const authConfigured = Boolean(supabase);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const email = String(formData.get("email") || "");
      const password = String(formData.get("password") || "");

      if (!supabase) {
        toast.error("Configure as variáveis do Supabase para usar autenticação.");
        return;
      }

      if (!email) {
        toast.error("Informe seu e-mail.");
        return;
      }

      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) toast.error(error.message);
        else toast.success("Enviamos o link de recuperação para seu e-mail.");
        return;
      }

      if (!password) {
        toast.error("Informe sua senha.");
        return;
      }

      const response =
        mode === "signup"
          ? await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: `${window.location.origin}/login`,
              },
            })
          : await supabase.auth.signInWithPassword({ email, password });

      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      await fetch("/api/auth/ensure-profile", { method: "POST" });

      if (mode === "signup" && !response.data.session) {
        toast.success("Conta criada. Confira seu e-mail para confirmar o acesso.");
        setMode("login");
        return;
      }

      const accessResponse = await fetch("/api/auth/access");
      const access = await accessResponse.json();
      toast.success(mode === "signup" ? "Conta criada com sucesso." : "Login realizado.");

      const next = searchParams.get("next");
      const safeNext = next?.startsWith("/") ? next : null;
      const memberDestination = safeNext?.startsWith("/checkout")
        ? "/comunidade"
        : safeNext || "/comunidade";

      if (access.hasAccess) router.push(memberDestination);
      else router.push(safeNext || "/checkout");
      router.refresh();
    });
  }

  const title = {
    login: "Entrar na Comunidade",
    signup: "Criar sua conta",
    reset: "Recuperar senha",
  }[mode];

  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-panel p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
      <div className="mb-7">
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-gold/12 text-gold-strong">
          {mode === "signup" ? (
            <UserPlus className="h-5 w-5" />
          ) : mode === "reset" ? (
            <KeyRound className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </div>
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {mode === "signup"
            ? "Crie sua conta para assinar e liberar a área de membros."
            : "Entre para acessar sua área de membro da Comunidade Hagios."}
        </p>
      </div>

      <form action={handleSubmit} className="grid gap-4">
        {!authConfigured && (
          <div className="rounded-lg border border-gold/25 bg-gold/10 p-3 text-sm leading-6 text-gold-strong">
            Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            para habilitar login e cadastro.
          </div>
        )}
        <label className="grid gap-2 text-sm text-muted">
          E-mail
          <div className="flex h-11 items-center gap-2 rounded-lg border border-line bg-black/30 px-3 focus-within:border-gold">
            <Mail className="h-4 w-4 text-gold" />
            <input
              name="email"
              type="email"
              required
              className="w-full bg-transparent text-foreground outline-none"
              placeholder="voce@email.com"
            />
          </div>
        </label>
        {mode !== "reset" && (
          <label className="grid gap-2 text-sm text-muted">
            Senha
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="h-11 rounded-lg border border-line bg-black/30 px-3 text-foreground outline-none focus:border-gold"
              placeholder="mínimo 6 caracteres"
            />
          </label>
        )}
        <Button disabled={pending || !authConfigured} type="submit" className="mt-2">
          {pending
            ? "Processando..."
            : mode === "login"
              ? "Entrar como assinante"
              : mode === "signup"
                ? "Criar conta e continuar"
                : "Enviar recuperação"}
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted">
        {mode !== "login" && (
          <button className="hover:text-foreground" onClick={() => setMode("login")}>
            Já tenho conta
          </button>
        )}
        {mode !== "signup" && (
          <button className="hover:text-foreground" onClick={() => setMode("signup")}>
            Criar cadastro
          </button>
        )}
        {mode !== "reset" && (
          <button className="hover:text-foreground" onClick={() => setMode("reset")}>
            Esqueci minha senha
          </button>
        )}
      </div>
    </div>
  );
}
