import { createChallenge, deleteChallenge, updateChallenge } from "@/app/admin/actions";
import { challengeFields } from "@/components/admin/cms-fields";
import { CrudSection } from "@/components/admin/crud-section";
import { AdminSubpage } from "@/components/admin/shared";
import { getAdminRows } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminChallengesPage() {
  await requireAdmin();
  const items = await getAdminRows("challenges", "published_at", false);

  return (
    <AdminSubpage
      title="Desafios"
      description="Desafios de implementação. Dias e ranking são editados em formato JSON."
    >
      <CrudSection
        title="Criar desafio"
        createLabel="Criar desafio"
        items={items}
        fields={challengeFields}
        createAction={createChallenge}
        updateAction={updateChallenge}
        deleteAction={deleteChallenge}
        getItemTitle={(row) => String(row.theme)}
      />
    </AdminSubpage>
  );
}
