"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function QuestionForm() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        toast.success("Pergunta enviada para o time Hágios.");
        setSubject("");
        setQuestion("");
      }}
    >
      <input
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        className="min-h-11 rounded-lg border border-line bg-navy-deep/45 px-4 text-sm outline-none transition placeholder:text-muted focus:border-gold/50"
        placeholder="Tema da dúvida"
        required
      />
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        className="min-h-36 rounded-lg border border-line bg-navy-deep/45 px-4 py-3 text-sm outline-none transition placeholder:text-muted focus:border-gold/50"
        placeholder="Escreva sua pergunta com o máximo de contexto possível"
        required
      />
      <Button type="submit" className="w-full">
        Enviar pergunta
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
