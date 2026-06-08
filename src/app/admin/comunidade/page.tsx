import { MessageCircle, UsersRound } from "lucide-react";
import { updateWhatsappLink } from "@/app/admin/actions";
import { AdminSubpage } from "@/components/admin/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/form-fields";
import { getAdminUsers, getWhatsappLink } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminCommunityPage() {
  await requireAdmin();
  const [whatsappLink, users] = await Promise.all([getWhatsappLink(), getAdminUsers()]);

  return (
    <AdminSubpage
      title="Comunidade e usuários"
      description="Configure o grupo oficial e acompanhe o status dos membros."
    >
      <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/20 bg-gold/10">
              <MessageCircle className="h-5 w-5 text-gold-strong" />
            </div>
            <h2 className="text-xl font-bold">Grupo WhatsApp</h2>
          </div>
          <form action={updateWhatsappLink} className="mt-5 grid gap-4" data-testid="whatsapp-settings-form">
            <Field label="Link do grupo" name="whatsapp_group_url" defaultValue={whatsappLink} required />
            <Button type="submit" className="w-full">Salvar link</Button>
          </form>
        </Card>
        <Card className="overflow-hidden">
          <div className="border-b border-line p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/20 bg-gold/10">
                <UsersRound className="h-5 w-5 text-gold-strong" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Usuários</h2>
                <p className="mt-1 text-sm text-muted">Lista simples com status de assinatura.</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-white/[0.04] text-muted">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Assinatura</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-line">
                    <td className="px-4 py-3">{user.name || "-"}</td>
                    <td className="px-4 py-3 text-muted">{user.email || "-"}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          user.subscription_status === "active" ||
                          user.subscription_status === "trialing"
                            ? "green"
                            : "neutral"
                        }
                      >
                        {user.subscription_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </AdminSubpage>
  );
}
