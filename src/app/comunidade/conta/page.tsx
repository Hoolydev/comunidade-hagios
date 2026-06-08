import { UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BillingPortalButton } from "@/components/community/billing-portal-button";
import { PageHero } from "@/components/community/page-hero";
import { SignOutButton } from "@/components/community/sign-out-button";
import { getCurrentProfile, requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  return (
    <div className="grid max-w-4xl gap-6">
      <PageHero
        eyebrow="Minha conta"
        title="Dados e assinatura"
        description="Consulte seus dados de acesso, status da assinatura e opções de gerenciamento."
        icon={UserRound}
      />
      <Card className="p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted">Nome</p>
            <p className="mt-1 font-semibold">{profile?.name || "Sem nome cadastrado"}</p>
          </div>
          <div>
            <p className="text-sm text-muted">E-mail</p>
            <p className="mt-1 font-semibold">{profile?.email || user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Status da assinatura</p>
            <div className="mt-2">
              <Badge
                tone={
                  profile?.subscription_status === "active" ||
                  profile?.subscription_status === "trialing"
                    ? "green"
                    : "red"
                }
              >
                {profile?.subscription_status || "none"}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted">Perfil</p>
            <p className="mt-1 font-semibold">{profile?.role || "member"}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row">
          <BillingPortalButton />
          <div className="rounded-lg border border-line">
            <SignOutButton />
          </div>
        </div>
      </Card>
    </div>
  );
}
