import { FileText } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gold/25 bg-[linear-gradient(135deg,rgba(255,201,40,0.08),rgba(255,255,255,0.025))] p-8 text-center">
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-lg border border-gold/20 bg-gold/10">
        <FileText className="h-7 w-7 text-gold-strong" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
    </div>
  );
}
