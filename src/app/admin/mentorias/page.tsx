import { createMentorship, deleteMentorship, updateMentorship } from "@/app/admin/actions";
import { mentorshipFields } from "@/components/admin/cms-fields";
import { CrudSection } from "@/components/admin/crud-section";
import { AdminSubpage } from "@/components/admin/shared";
import { getAdminRows } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminMentorshipsPage() {
  await requireAdmin();
  const items = await getAdminRows("mentorships", "date", false);

  return (
    <AdminSubpage
      title="Mentorias"
      description="Encontros ao vivo e gravações exibidos em /comunidade/mentorias."
    >
      <CrudSection
        title="Criar mentoria"
        createLabel="Criar mentoria"
        items={items}
        fields={mentorshipFields}
        createAction={createMentorship}
        updateAction={updateMentorship}
        deleteAction={deleteMentorship}
        getItemTitle={(row) => String(row.title)}
      />
    </AdminSubpage>
  );
}
