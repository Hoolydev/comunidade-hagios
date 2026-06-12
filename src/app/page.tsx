import {
  ArrowRight,
  BrainCircuit,
  Check,
  Download,
  MessageCircle,
  RefreshCw,
  Rocket,
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
  ["Implementações práticas com IA", RefreshCw],
  ["Mentorias mensais", Users],
  ["Desafios de implementação", Rocket],
  ["Biblioteca de ferramentas", Download],
  ["Grupo exclusivo no WhatsApp", MessageCircle],
] as const;

const successRules = [
  "Não medimos sucesso por aulas assistidas.",
  "Não medimos sucesso por horas consumidas.",
  "Medimos sucesso por implementação.",
] as const;

const faqs = [
  {
    question: "O que é a Comunidade Hágios?",
    answer:
      "É um ambiente de implementação para empresários que querem aplicar IA em áreas importantes da empresa, com trilhas, conteúdos vivos, ferramentas, desafios, mentorias e comunidade.",
  },
  {
    question: "Preciso ter experiência com IA?",
    answer:
      "Não. A comunidade foi pensada para empreendedores que querem começar de forma prática, com orientação clara e foco em implementação.",
  },
  {
    question: "Em quais áreas posso aplicar IA?",
    answer:
      "Você pode aplicar IA em marketing, vendas, atendimento, gestão, produtividade, finanças, criação de conteúdo, análise e processos operacionais.",
  },
  {
    question: "O conteúdo é prático?",
    answer:
      "Sim. A ideia é assistir fazendo. Cada missão deve ajudar você a implementar uma solução, melhorar um processo ou tomar uma decisão melhor no negócio.",
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
      <section className="relative min-h-[calc(100svh-64px)] overflow-hidden">
        <Image
          src="/hagios-hero-mobile.png"
          alt="Comunidade Hágios"
          fill
          priority
          sizes="(max-width: 767px) 100vw, 0px"
          className="object-cover object-top md:hidden"
        />
        <Image
          src="/hagios-hero-desktop.png"
          alt="Comunidade Hágios"
          fill
          priority
          sizes="(min-width: 768px) 100vw, 0px"
          className="hidden object-cover object-center md:block"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,15,24,0)_55%,rgba(9,15,24,0.34)_100%)]" />
        <div className="absolute left-4 top-6 z-10 sm:left-8 sm:top-8 lg:left-[max(2rem,calc((100vw-80rem)/2))]">
          <LogoMark size="lg" priority />
        </div>
      </section>

      <section className="relative border-y border-line bg-background py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              Hágios apresenta
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              Implemente IA em pelo menos 3 áreas da sua empresa nos próximos 90 dias.
            </h1>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Nosso propósito é ajudar empreendedores a aplicar a Inteligência
              Artificial de forma prática em seus negócios, modernizando suas
              operações e preparando suas empresas para a nova era do mercado.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/checkout" size="lg">
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
          </div>
        </div>
        <div className="mx-auto mt-10 grid w-full max-w-7xl gap-3 px-4 sm:grid-cols-3 sm:px-6">
          {successRules.map((rule) => (
            <div key={rule} className="rounded-lg border border-gold/25 bg-navy-deep/72 p-4">
              <p className="text-sm font-semibold leading-6 text-foreground">{rule}</p>
            </div>
          ))}
          <div className="rounded-lg border border-gold/35 bg-gold/12 p-4 sm:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              Como definimos sucesso
            </p>
            <p className="mt-2 text-lg font-black">
              “O que você implementou na sua empresa este mês?”
            </p>
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
            A Comunidade Hágios foi criada para empreendedores, gestores,
            profissionais comerciais e donos de negócios que querem usar IA para
            modernizar operações, tomar decisões melhores, ganhar produtividade e
            criar processos mais inteligentes sem perder clareza estratégica.
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
                Pagamento seguro e liberação automática quando a assinatura estiver ativa.
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
