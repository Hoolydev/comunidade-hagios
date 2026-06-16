"use client";

import type { ComponentType, InputHTMLAttributes, ReactNode } from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CreditCard,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

const included = [
  "Jornada Hágios estruturada",
  "Conteúdos recentes e mentorias",
  "Desafios de implementação",
  "Biblioteca de ferramentas",
  "Canal oficial no WhatsApp",
];

const STEP_LABELS = ["Seus dados", "Pagamento", "Acesso liberado"];

function Steps({
  active,
  canSelect,
  onSelect,
}: {
  active: number;
  canSelect: (n: number) => boolean;
  onSelect: (n: number) => void;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {STEP_LABELS.map((label, index) => {
        const n = index + 1;
        const done = n < active;
        const current = n === active;
        const selectable = canSelect(n);

        const inner = (
          <>
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-bold transition",
                done && "border-gold bg-gold text-navy-deep",
                current && "border-gold bg-gold/15 text-gold-strong",
                !done && !current && "border-line bg-white/[0.03] text-muted",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                current ? "text-foreground" : "text-muted",
              )}
            >
              {label}
            </span>
          </>
        );

        return (
          <li key={label} className="flex items-center gap-3">
            {selectable ? (
              <button
                type="button"
                onClick={() => onSelect(n)}
                className="flex items-center gap-3 rounded-lg transition hover:opacity-80"
              >
                {inner}
              </button>
            ) : (
              <span className="flex items-center gap-3">{inner}</span>
            )}
            {n < STEP_LABELS.length ? (
              <span className="hidden h-px w-8 bg-line sm:block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function SummaryCard() {
  return (
    <Card className="p-6 lg:sticky lg:top-8">
      <h2 className="text-lg font-bold">Resumo</h2>
      <div className="mt-4 grid gap-2.5">
        {included.map((item) => (
          <div key={item} className="flex gap-3 text-sm text-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Plano mensal</span>
          <span>R$49,90</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <span className="text-sm text-muted">Total hoje</span>
          <span className="text-4xl font-black">R$49,90</span>
        </div>
        <p className="mt-1 text-xs text-muted">cobrança mensal · cancele quando quiser</p>
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-lg border border-line bg-navy-deep/40 p-3 text-xs leading-5 text-muted">
        <Lock className="h-4 w-4 shrink-0 text-gold" />
        <span>Cartão de crédito — pagamento seguro processado pelo AbacatePay.</span>
      </div>
    </Card>
  );
}

function FieldShell({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-2 text-sm text-muted", className)}>
      {label}
      {children}
    </label>
  );
}

function InputShell({
  icon: Icon,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-black/30 px-3 focus-within:border-gold">
      <Icon className="h-4 w-4 shrink-0 text-gold" />
      <input
        {...props}
        className="w-full bg-transparent text-foreground outline-none placeholder:text-muted/60"
      />
    </div>
  );
}

export function CheckoutWizard({
  loggedIn,
  email,
  paymentConfigured = true,
}: {
  loggedIn: boolean;
  email?: string | null;
  paymentConfigured?: boolean;
}) {
  const [step, setStep] = useState(loggedIn ? 2 : 1);
  const [accountEmail, setAccountEmail] = useState(email || "");
  const [pending, startTransition] = useTransition();
  const supabase = createSupabaseBrowserClient();

  // Só dá para voltar para "Seus dados" (etapa 1) quando não está logado.
  const canSelect = (n: number) => n === 1 && step === 2 && !loggedIn;
  const onSelect = (n: number) => {
    if (n === 1 && !loggedIn) setStep(1);
  };

  async function openPayment() {
    const response = await fetch("/api/abacatepay/checkout", { method: "POST" });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.url) {
      toast.error(data.error || "Não foi possível abrir o pagamento.");
      return false;
    }

    window.location.href = data.url;
    return true;
  }

  function createAccount(formData: FormData) {
    startTransition(async () => {
      if (!supabase) {
        toast.error("Configure o Supabase para habilitar o cadastro.");
        return;
      }

      const emailValue = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");
      const profile = {
        name: String(formData.get("name") || "").trim(),
        company_role: String(formData.get("company_role") || "").trim(),
        company_name: String(formData.get("company_name") || "").trim(),
        company_sector: String(formData.get("company_sector") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        city_state: String(formData.get("city_state") || "").trim(),
        urgent_operation_1: String(formData.get("urgent_operation_1") || "").trim(),
        urgent_operation_2: String(formData.get("urgent_operation_2") || "").trim(),
        urgent_operation_3: String(formData.get("urgent_operation_3") || "").trim(),
      };

      if (!emailValue || password.length < 6) {
        toast.error("Informe um e-mail válido e senha de no mínimo 6 caracteres.");
        return;
      }

      if (Object.values(profile).some((value) => !value)) {
        toast.error("Preencha seus dados e as 3 operações que deseja otimizar.");
        return;
      }

      // Cria a conta já confirmada (sem e-mail de confirmação).
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, password, profile }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Não foi possível criar a conta.");
        return;
      }

      const signIn = await supabase.auth.signInWithPassword({
        email: emailValue,
        password,
      });
      if (signIn.error) {
        toast.error(
          data.status === "exists"
            ? "Esse e-mail já tem conta. Confira a senha para continuar."
            : signIn.error.message,
        );
        return;
      }

      await fetch("/api/auth/ensure-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      setAccountEmail(emailValue);
      setStep(2);
      toast.success("Conta criada. Abrindo pagamento...");
      await openPayment();
    });
  }

  function goToPayment() {
    startTransition(async () => {
      await openPayment();
    });
  }

  return (
    <div className="grid gap-8">
      <Steps active={step} canSelect={canSelect} onSelect={onSelect} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <Card className="p-6 sm:p-8">
          {step === 1 ? (
            <form action={createAccount} className="grid gap-5">
              <div>
                <h2 className="text-xl font-black">Seus dados</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Conte um pouco sobre você e sua empresa para entrarmos com mais
                  contexto desde o primeiro acesso.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldShell label="Nome completo">
                  <InputShell
                    icon={User}
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Seu nome"
                  />
                </FieldShell>
                <FieldShell label="Cargo na empresa">
                  <InputShell
                    icon={BriefcaseBusiness}
                    name="company_role"
                    required
                    autoComplete="organization-title"
                    placeholder="Ex: Sócio, CEO, gerente"
                  />
                </FieldShell>
                <FieldShell label="Nome da empresa">
                  <InputShell
                    icon={Building2}
                    name="company_name"
                    required
                    autoComplete="organization"
                    placeholder="Nome do negócio"
                  />
                </FieldShell>
                <FieldShell label="Setor da empresa">
                  <InputShell
                    icon={Building2}
                    name="company_sector"
                    required
                    placeholder="Ex: varejo, saúde, serviços"
                  />
                </FieldShell>
                <FieldShell label="Telefone pessoal">
                  <InputShell
                    icon={Phone}
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="(00) 00000-0000"
                  />
                </FieldShell>
                <FieldShell label="Cidade/estado">
                  <InputShell
                    icon={MapPin}
                    name="city_state"
                    required
                    autoComplete="address-level2"
                    placeholder="Goiânia/GO"
                  />
                </FieldShell>
                <FieldShell label="E-mail">
                  <InputShell
                    icon={Mail}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="voce@email.com"
                  />
                </FieldShell>
                <FieldShell label="Senha">
                  <InputShell
                    icon={KeyRound}
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="mínimo 6 caracteres"
                  />
                </FieldShell>
              </div>

              <div className="rounded-lg border border-gold/20 bg-gold/5 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Quais são as 3 operações dentro do seu negócio que você precisa
                  otimizar com urgência e por quê?
                </p>
                <div className="mt-4 grid gap-3">
                  {[1, 2, 3].map((n) => (
                    <textarea
                      key={n}
                      name={`urgent_operation_${n}`}
                      required
                      rows={2}
                      className="min-h-20 resize-y rounded-lg border border-line bg-black/30 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted/60 focus:border-gold"
                      placeholder={`Operação ${n}`}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
                {pending ? "Finalizando..." : "Finalizar agora"}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <div className="grid gap-5">
              <div>
                <h2 className="text-xl font-black">Pagamento</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {accountEmail ? (
                    <>
                      Conta <span className="text-foreground">{accountEmail}</span>{" "}
                      pronta. Revise e finalize sua assinatura.
                    </>
                  ) : (
                    "Revise e finalize sua assinatura."
                  )}
                </p>
              </div>

              <div className="grid gap-2 rounded-lg border border-line bg-white/[0.025] p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Plano</span>
                  <span className="font-semibold">Movimento Hágios — mensal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Total hoje</span>
                  <span className="font-semibold">R$49,90</span>
                </div>
              </div>

              <Button
                onClick={goToPayment}
                size="lg"
                disabled={pending || !paymentConfigured}
                className="w-full"
              >
                <CreditCard className="h-5 w-5" />
                {pending ? "Abrindo pagamento..." : "Finalizar agora"}
              </Button>
              {paymentConfigured ? (
                <p className="text-xs leading-5 text-muted">
                  Você será levado ao ambiente seguro do AbacatePay para concluir o
                  pagamento no cartão. O acesso é liberado automaticamente após a
                  confirmação.
                </p>
              ) : (
                <p className="rounded-lg border border-gold/25 bg-gold/10 p-3 text-xs leading-5 text-gold-strong">
                  Pagamento ainda não ativado. Configure o AbacatePay
                  (ABACATEPAY_API_KEY + ABACATEPAY_PRODUCT_ID) no ambiente para abrir
                  o checkout.
                </p>
              )}

              {!loggedIn ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="justify-self-start text-sm text-muted transition hover:text-foreground"
                >
                  ← Voltar para os dados
                </button>
              ) : null}
            </div>
          )}
        </Card>

        <SummaryCard />
      </div>
    </div>
  );
}
