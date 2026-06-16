import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, MessageSquareText, XCircle } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAssistantDraftByToken } from "@/lib/assistant/content-approval";
import { formatDate } from "@/lib/utils";

function statusLabel(status: string) {
  if (status === "approved") return "Publicado";
  if (status === "rejected") return "Rejeitado";
  return "Aguardando revisão";
}

function statusTone(status: string) {
  if (status === "approved") return "green" as const;
  if (status === "rejected") return "red" as const;
  return "gold" as const;
}

export default async function ApprovalPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ status?: string; message?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const draft = await getAssistantDraftByToken(token);

  if (!draft) notFound();

  const canReview = draft.status === "pending";

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:py-10">
      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <LogoMark size="sm" priority />
          Movimento Hágios
        </Link>

        <Card className="overflow-hidden">
          <div className="border-b border-line bg-[linear-gradient(135deg,rgba(255,201,40,0.14),rgba(255,255,255,0.04))] p-5 sm:p-7">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge tone={statusTone(draft.status)}>{statusLabel(draft.status)}</Badge>
              <Badge tone="neutral">{draft.category}</Badge>
              <span className="text-xs text-muted">Criado em {formatDate(draft.created_at)}</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/10">
                <MessageSquareText className="h-5 w-5 text-gold-strong" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                  Assistente editorial
                </p>
                <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">
                  Revisar conteúdo para o Movimento
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                  Aprove apenas se o título e o texto estiverem prontos para aparecer
                  em Conteúdos Recentes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-7">
            {query.status === "approved" ? (
              <div className="rounded-lg border border-emerald-300/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                Conteúdo aprovado e publicado no Movimento.
              </div>
            ) : null}
            {query.status === "rejected" ? (
              <div className="rounded-lg border border-red-300/25 bg-red-400/10 p-4 text-sm text-red-100">
                Conteúdo rejeitado. Ele não foi publicado.
              </div>
            ) : null}
            {query.status === "error" ? (
              <div className="rounded-lg border border-red-300/25 bg-red-400/10 p-4 text-sm text-red-100">
                {query.message || "Não foi possível revisar o conteúdo."}
              </div>
            ) : null}

            <article className="rounded-lg border border-line bg-white/[0.035] p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                {draft.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-strong"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-black leading-tight">{draft.title}</h2>
              {draft.subtitle ? (
                <p className="mt-3 text-lg leading-7 text-muted">{draft.subtitle}</p>
              ) : null}
              <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-muted">
                {draft.body}
              </div>
              {draft.source_url ? (
                <a
                  href={draft.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-strong hover:text-gold"
                >
                  Ver fonte original
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </article>

            <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-muted transition hover:bg-white/[0.08] hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>

              {canReview ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <form action={`/api/assistant/approve/${token}`} method="post">
                    <input type="hidden" name="decision" value="reject" />
                    <Button type="submit" variant="danger" className="w-full sm:w-auto">
                      <XCircle className="h-4 w-4" />
                      Rejeitar
                    </Button>
                  </form>
                  <form action={`/api/assistant/approve/${token}`} method="post">
                    <input type="hidden" name="decision" value="approve" />
                    <Button type="submit" className="w-full sm:w-auto">
                      <CheckCircle2 className="h-4 w-4" />
                      Aprovar e publicar
                    </Button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/movimento/conteudos-recentes"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-white/[0.055] px-4 text-sm font-semibold transition hover:border-gold/70 hover:bg-white/[0.09]"
                >
                  Ver Conteúdos Recentes
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
