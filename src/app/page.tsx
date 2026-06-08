import {
  ArrowRight,
  BrainCircuit,
  Check,
  Crown,
  Download,
  MessageCircle,
  RefreshCw,
  Rocket,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { LogoMark } from "@/components/brand/logo-mark";
import { BenefitCard } from "@/components/landing/benefit-card";
import { PublicFooter } from "@/components/landing/public-footer";
import { PublicHeader } from "@/components/landing/public-header";
import { ButtonLink } from "@/components/ui/button";

const benefits = [
  ["Jornada Hágios estruturada", BrainCircuit],
  ["Conteúdos recentes para aplicar", RefreshCw],
  ["Mentorias mensais", Users],
  ["Desafios de implementação", Rocket],
  ["Biblioteca de ferramentas", Download],
  ["Grupo exclusivo no WhatsApp", MessageCircle],
] as const;

const heroStats = [
  ["IA", "Aplicada ao negócio"],
  ["R$49,90", "Assinatura mensal"],
  ["Mentorias", "Ciclo contínuo"],
] as const;

const heroPills = [
  { label: "IA aplicada", icon: Crown },
  { label: "Vendas", icon: TrendingUp },
  { label: "Comunidade", icon: Users },
] as const;

const faqs = [
  {
    question: "O que eu recebo ao entrar?",
    answer:
      "Você recebe acesso à Jornada Hágios, conteúdos recentes, mentorias, desafios, ferramentas práticas e ao grupo oficial da comunidade.",
  },
  {
    question: "Preciso ter experiência com IA?",
    answer:
      "Não. A comunidade foi pensada para quem quer aplicar IA no marketing com clareza, mesmo começando do zero.",
  },
  {
    question: "Para quem a comunidade é mais indicada?",
    answer:
      "Para empreendedores, social medias, gestores de tráfego, vendedores, donos de negócios e profissionais que querem vender mais usando IA.",
  },
  {
    question: "O conteúdo é prático ou só teoria?",
    answer:
      "A proposta é prática: estratégias, exemplos, materiais e ideias para aplicar em campanhas, vendas, conteúdo e automações.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Sim. A assinatura é mensal e pode ser cancelada quando quiser, sem multa.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_-10%,rgba(216,163,27,0.08),transparent_45%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-64px)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:py-14">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-sm font-semibold text-gold-strong">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Hágios Marketing apresenta
            </div>
            <LogoMark size="lg" className="mb-6 lg:hidden" priority />
            <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              Use IA para vender mais — mesmo começando do zero.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              A Comunidade Hágios transforma inteligência artificial em campanhas,
              vendas e automações prontas para rodar no seu negócio — com método,
              conteúdos vivos e suporte toda semana.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href="/checkout"
                size="lg"
              >
                Assinar comunidade
                <ArrowRight className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/login?next=/comunidade" variant="secondary" size="lg">
                Já sou assinante
              </ButtonLink>
            </div>
            <p className="mt-3 text-sm text-muted">
              Assinatura mensal de R$49,90. Acesso liberado após o pagamento.
            </p>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {heroStats.map(([value, label]) => (
                <div key={value} className="rounded-lg border border-line bg-white/[0.04] p-4">
                  <p className="text-lg font-black text-gold-strong">{value}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-line bg-panel shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-0 bg-[linear-gradient(160deg,#16212f,#0b111c)]" />
            <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:26px_26px]" />
            <div className="relative flex h-full min-h-[520px] flex-col justify-between p-5 sm:p-8">
              <div className="flex justify-center pt-3">
                <div className="relative aspect-square w-full max-w-[360px]">
                  <Image
                    src="/logo-comunidade-hagios.png"
                    alt="Logo Comunidade Hágios"
                    fill
                    priority
                    sizes="330px"
                    className="object-contain drop-shadow-[0_24px_38px_rgba(0,0,0,0.45)]"
                  />
                </div>
              </div>
              <div>
                <div className="mb-5 grid grid-cols-3 gap-3 text-center">
                  {heroPills.map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-lg border border-gold/20 bg-navy-deep/60 p-3"
                    >
                      <Icon className="mx-auto mb-2 h-4 w-4 text-gold-strong" />
                      <p className="text-xs text-muted">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-gold/30 bg-navy-deep/70 p-5 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.22em] text-gold-strong">
                    Acesso premium
                  </p>
                  <p className="mt-3 text-3xl font-black">R$49,90/mês</p>
                  <p className="mt-2 text-sm text-muted">
                    Jornada, mentorias, desafios, ferramentas e networking em
                    uma assinatura mensal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="incluso" className="border-y border-line bg-panel-soft/45 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
                O que você vai encontrar
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Clareza para saber o que assistir, implementar e acompanhar.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              Um centro de evolução empresarial com base permanente, conteúdos
              vivos e ferramentas para colocar IA em prática.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(([title, Icon]) => (
              <BenefitCard key={title} title={title} icon={Icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              Para quem é
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Para quem precisa transformar atenção em resultado.
            </h2>
          </div>
          <p className="text-lg leading-8 text-muted">
            A Comunidade Hágios foi criada para empreendedores, social medias,
            gestores de tráfego, vendedores, donos de negócios e profissionais que
            querem usar IA para vender mais, produzir melhor e criar processos mais
            inteligentes sem perder clareza estratégica.
          </p>
        </div>
      </section>

      <section id="preco" className="bg-white/[0.035] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="grid overflow-hidden rounded-lg border border-gold/25 bg-panel shadow-[0_24px_100px_rgba(0,0,0,0.35)] lg:grid-cols-[1fr_0.72fr]">
            <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              Acesso à Comunidade Hágios
            </p>
            <div className="mt-5">
              <div>
                <p className="text-5xl font-black">R$49,90</p>
                <p className="mt-2 text-muted">por mês</p>
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Jornada Hágios com aulas práticas",
                "Biblioteca de ferramentas por links externos",
                "Grupo oficial no WhatsApp",
                "Mentorias, desafios e conteúdos recentes",
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            </div>
            <div className="border-t border-line bg-[linear-gradient(160deg,rgba(255,201,40,0.16),rgba(255,255,255,0.035))] p-6 sm:p-8 lg:border-l lg:border-t-0">
              <p className="text-sm font-semibold text-gold-strong">Plano mensal</p>
              <h3 className="mt-3 text-2xl font-black">Comece pela comunidade completa.</h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                Pagamento seguro via Stripe e liberação automática quando a
                assinatura estiver ativa.
              </p>
              <ButtonLink
                href="/checkout"
                size="lg"
                className="mt-7 w-full"
              >
                Assinar comunidade
                <ArrowRight className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink
                href="/login?next=/comunidade"
                variant="secondary"
                className="mt-3 w-full"
              >
                Já sou assinante
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-black sm:text-4xl">Perguntas frequentes</h2>
          <div className="mt-8 grid gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-lg border border-line bg-white/[0.04] p-5"
              >
                <summary className="cursor-pointer text-base font-semibold">
                  {faq.question}
                </summary>
                <p className="mt-3 leading-7 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
