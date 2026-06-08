import { createEvent, deleteEvent, updateEvent } from "@/app/admin/actions";
import { eventFields } from "@/components/admin/cms-fields";
import { CrudSection } from "@/components/admin/crud-section";
import { AdminSubpage } from "@/components/admin/shared";
import { getAdminRows } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdmin();
  const items = await getAdminRows("community_events", "date", true);

  return (
    <AdminSubpage
      title="Próximos eventos"
      description="A agenda exibida na home (mentorias, votações e desafios)."
    >
      <CrudSection
        title="Criar evento"
        createLabel="Criar evento"
        items={items}
        fields={eventFields}
        createAction={createEvent}
        updateAction={updateEvent}
        deleteAction={deleteEvent}
        getItemTitle={(row) => String(row.title)}
      />
    </AdminSubpage>
  );
}
