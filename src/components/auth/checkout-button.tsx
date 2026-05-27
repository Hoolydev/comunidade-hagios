"use client";

import { useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ autoStart = false }: { autoStart?: boolean }) {
  const [pending, startTransition] = useTransition();
  const started = useRef(false);

  function checkout() {
    if (started.current) return;
    started.current = true;

    startTransition(async () => {
      const response = await fetch("/api/checkout", { method: "POST" });
      const payload = await response.json();

      if (!response.ok || !payload.url) {
        started.current = false;
        toast.error(payload.error || "Nao foi possivel iniciar o checkout.");
        return;
      }

      window.location.href = payload.url;
    });
  }

  useEffect(() => {
    if (autoStart) checkout();
  }, [autoStart]);

  return (
    <Button onClick={checkout} disabled={pending} className="w-full sm:w-auto" size="lg">
      <CreditCard className="h-5 w-5" />
      {pending ? "Abrindo checkout..." : "Assinar por R$39,90/mês"}
    </Button>
  );
}
