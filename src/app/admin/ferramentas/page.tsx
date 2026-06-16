import { createTool, deleteTool, updateTool } from "@/app/admin/actions";
import { toolFields } from "@/components/admin/cms-fields";
import { CrudSection } from "@/components/admin/crud-section";
import { AdminSubpage } from "@/components/admin/shared";
import { getAdminRows } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminToolsPage() {
  await requireAdmin();
  const items = await getAdminRows("tools", "updated_at", false);

  return (
    <AdminSubpage
      title="Biblioteca de ferramentas"
      description="Recursos autônomos (prompts, templates, planilhas) exibidos em /movimento/ferramentas."
    >
      <CrudSection
        title="Criar ferramenta"
        createLabel="Criar ferramenta"
        items={items}
        fields={toolFields}
        createAction={createTool}
        updateAction={updateTool}
        deleteAction={deleteTool}
        getItemTitle={(row) => String(row.title)}
      />
    </AdminSubpage>
  );
}
