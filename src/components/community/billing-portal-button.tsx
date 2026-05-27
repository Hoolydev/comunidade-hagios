"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BillingPortalButton() {
  const [pending, startTransition] = useTransition();

  function openPortal() {
    startTransition(async () => {
      const response = await fetch("/api/billing-portal", { method: "POST" });
      const payload = await response.json();

      if (!response.ok || !payload.url) {
        toast.error(payload.error || "Nao foi possivel abrir o portal.");
        return;
      }

      window.location.href = payload.url;
    });
  }

  return (
    <Button onClick={openPortal} disabled={pending} variant="secondary">
      <CreditCard className="h-4 w-4" />
      {pending ? "Abrindo..." : "Gerenciar assinatura"}
    </Button>
  );
}
