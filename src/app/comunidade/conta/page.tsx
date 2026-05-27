import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BillingPortalButton } from "@/components/community/billing-portal-button";
import { SignOutButton } from "@/components/community/sign-out-button";
import { getCurrentProfile, requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Minha conta
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Dados e assinatura</h1>
      </div>
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
