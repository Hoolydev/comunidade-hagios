import { MessageSquareText } from "lucide-react";
import { PageHero } from "@/components/movement/page-hero";
import { QuestionForm } from "@/components/movement/question-form";
import { Card } from "@/components/ui/card";
import { getMovementQuestions } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function DuvidasPage() {
  const questions = await getMovementQuestions();

  return (
    <div className="grid gap-7">
      <PageHero
        eyebrow="Área de Dúvidas"
        title="Perguntas registradas viram suporte, conteúdo e melhoria."
        description="Consulte respostas do time e envie novas dúvidas para acelerar sua implementação com IA."
        descriptionLabel="Como funciona a Área de Dúvidas?"
        icon={MessageSquareText}
      />

      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <Card className="h-fit p-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/10">
              <MessageSquareText className="h-5 w-5 text-gold-strong" />
            </div>
            <div>
              <h2 className="text-xl font-black">Enviar uma pergunta</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                Descreva o contexto do negócio para o time conseguir responder
                com mais precisão.
              </p>
            </div>
          </div>
          <QuestionForm />
        </Card>

        <div className="grid gap-4">
          {questions.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-strong">
                  {item.category}
                </span>
                <span className="text-xs text-muted">{formatDate(item.created_at)}</span>
              </div>
              <h2 className="text-xl font-black">{item.question}</h2>
              <div className="mt-4 rounded-lg border border-line bg-white/[0.035] p-4">
                <p className="text-sm font-semibold text-gold">Resposta do time</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
              </div>
              <p className="mt-3 text-xs text-muted">
                Respondido por {item.answered_by}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
