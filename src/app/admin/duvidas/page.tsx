import { createQuestion, deleteQuestion, updateQuestion } from "@/app/admin/actions";
import { questionFields } from "@/components/admin/cms-fields";
import { CrudSection } from "@/components/admin/crud-section";
import { AdminSubpage } from "@/components/admin/shared";
import { getAdminRows } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  await requireAdmin();
  const items = await getAdminRows("community_questions", "created_at", false);

  return (
    <AdminSubpage
      title="Dúvidas"
      description="Perguntas e respostas exibidas em /comunidade/duvidas."
    >
      <CrudSection
        title="Criar dúvida"
        createLabel="Criar dúvida"
        items={items}
        fields={questionFields}
        createAction={createQuestion}
        updateAction={updateQuestion}
        deleteAction={deleteQuestion}
        getItemTitle={(row) => String(row.question)}
      />
    </AdminSubpage>
  );
}
