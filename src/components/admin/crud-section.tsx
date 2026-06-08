import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox, Field, Select, TextArea } from "@/components/ui/form-fields";

type FieldType = "text" | "url" | "number" | "datetime" | "textarea" | "select" | "checkbox";
type FieldFormat = "datetime" | "lines" | "json";

export type CrudField = {
  name: string;
  label: string;
  type: FieldType;
  options?: Array<string | { label: string; value: string }>;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  /** How to turn a stored row value into the input's default value. */
  format?: FieldFormat;
  /** Default value for the "create" form. */
  createDefault?: string;
  defaultChecked?: boolean;
  /** Span both columns of the grid. */
  fullWidth?: boolean;
};

type Row = Record<string, unknown>;

function toInputValue(raw: unknown, format?: FieldFormat): string {
  if (raw === null || raw === undefined) return "";
  if (format === "datetime") return String(raw).slice(0, 16);
  if (format === "lines") return Array.isArray(raw) ? raw.join("\n") : String(raw);
  if (format === "json") return JSON.stringify(raw, null, 2);
  return String(raw);
}

function FieldControl({
  field,
  row,
  singleColumn,
}: {
  field: CrudField;
  row?: Row;
  singleColumn?: boolean;
}) {
  const value = row ? toInputValue(row[field.name], field.format) : field.createDefault;
  const wrapper = !singleColumn && field.fullWidth ? "sm:col-span-2" : undefined;

  if (field.type === "checkbox") {
    return (
      <div className={wrapper}>
        <Checkbox
          label={field.label}
          name={field.name}
          defaultChecked={row ? Boolean(row[field.name]) : field.defaultChecked ?? true}
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <TextArea
        label={field.label}
        name={field.name}
        defaultValue={value}
        required={field.required}
        rows={field.rows}
        placeholder={field.placeholder}
        className={wrapper}
      />
    );
  }

  if (field.type === "select") {
    return (
      <Select
        label={field.label}
        name={field.name}
        options={field.options || []}
        defaultValue={value}
        className={wrapper}
      />
    );
  }

  const inputType = field.type === "datetime" ? "datetime-local" : field.type === "number" ? "number" : "text";

  return (
    <Field
      label={field.label}
      name={field.name}
      type={inputType}
      defaultValue={value}
      required={field.required}
      placeholder={field.placeholder}
      className={wrapper}
    />
  );
}

export function CrudSection({
  title,
  createLabel,
  items,
  fields,
  createAction,
  updateAction,
  deleteAction,
  getItemTitle,
}: {
  title: string;
  createLabel: string;
  items: Row[];
  fields: CrudField[];
  createAction: (formData: FormData) => void | Promise<void>;
  updateAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
  getItemTitle: (row: Row) => string;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <Card className="p-5 xl:sticky xl:top-6 xl:self-start">
        <h2 className="text-xl font-bold">{title}</h2>
        <form action={createAction} className="mt-5 grid gap-4">
          {fields.map((field) => (
            <FieldControl key={field.name} field={field} singleColumn />
          ))}
          <Button type="submit" className="w-full">
            {createLabel}
          </Button>
        </form>
      </Card>

      <div className="grid gap-4">
        {items.length === 0 ? (
          <Card tone="flat" className="p-6 text-sm text-muted">
            Nenhum item cadastrado ainda. Use o formulário ao lado para criar o primeiro.
          </Card>
        ) : (
          items.map((row) => (
            <Card key={String(row.id)} className="p-5 transition hover:border-gold/35">
              <form action={updateAction} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={String(row.id)} />
                <p className="text-sm font-semibold text-gold sm:col-span-2">
                  {getItemTitle(row)}
                </p>
                {fields.map((field) => (
                  <FieldControl key={field.name} field={field} row={row} />
                ))}
                <div className="sm:col-span-2">
                  <Button type="submit" variant="secondary">
                    Salvar
                  </Button>
                </div>
              </form>
              <form action={deleteAction} className="mt-3">
                <input type="hidden" name="id" value={String(row.id)} />
                <Button type="submit" variant="danger" size="sm">
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </form>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
