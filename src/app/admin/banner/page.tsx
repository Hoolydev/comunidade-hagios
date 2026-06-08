import { updateWelcome } from "@/app/admin/actions";
import { AdminSubpage } from "@/components/admin/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextArea } from "@/components/ui/form-fields";
import { getWelcomeContent } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminBannerPage() {
  await requireAdmin();
  const welcome = await getWelcomeContent();

  return (
    <AdminSubpage
      title="Banner de boas-vindas"
      description="Edite o texto e o vídeo do banner 'Aula de boas-vindas' que aparece no topo da comunidade."
    >
      <section className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <Card className="p-5">
          <h2 className="text-xl font-bold">Banner da home</h2>
          <form action={updateWelcome} className="mt-5 grid gap-4">
            <Field label="Etiqueta superior" name="eyebrow" defaultValue={welcome.eyebrow} />
            <Field label="Rótulo do card" name="label" defaultValue={welcome.label} />
            <Field label="Título do vídeo" name="title" defaultValue={welcome.title} />
            <TextArea label="Descrição" name="description" defaultValue={welcome.description} />
            <Field label="Link do vídeo (YouTube)" name="video_url" defaultValue={welcome.video_url} />
            <Button type="submit" className="w-full">Salvar banner</Button>
          </form>
        </Card>
        <Card tone="flat" className="overflow-hidden p-4">
          <p className="mb-3 text-sm text-muted">Pré-visualização do vídeo atual:</p>
          <div className="aspect-video overflow-hidden rounded-md bg-black">
            {welcome.video_id ? (
              <iframe
                src={`https://www.youtube.com/embed/${welcome.video_id}`}
                title={welcome.title}
                className="h-full w-full"
                allowFullScreen
              />
            ) : (
              <div className="grid h-full place-items-center text-muted">
                Informe um link do YouTube válido.
              </div>
            )}
          </div>
        </Card>
      </section>
    </AdminSubpage>
  );
}
