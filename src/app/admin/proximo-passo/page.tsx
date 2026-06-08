import { createNextAction, deleteNextAction, updateNextAction } from "@/app/admin/actions";
import { nextActionFields } from "@/components/admin/cms-fields";
import { CrudSection } from "@/components/admin/crud-section";
import { AdminSubpage } from "@/components/admin/shared";
import { getAdminRows } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminNextActionsPage() {
  await requireAdmin();
  const items = await getAdminRows("next_actions", "order_index", true);

  return (
    <AdminSubpage
      title="Próximo passo"
      description="Os cards de 'O que fazer agora?' na home. A prioridade Alta vira o card em destaque."
    >
      <CrudSection
        title="Criar card"
        createLabel="Criar card"
        items={items}
        fields={nextActionFields}
        createAction={createNextAction}
        updateAction={updateNextAction}
        deleteAction={deleteNextAction}
        getItemTitle={(row) => String(row.title)}
      />
    </AdminSubpage>
  );
}
