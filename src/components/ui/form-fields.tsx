import { cn } from "@/lib/utils";

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("grid min-w-0 gap-2 text-sm text-muted", className)}>
      <span>{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full min-w-0 rounded-lg border border-line bg-navy-deep/45 px-3 text-foreground outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-2 focus:ring-gold/15"
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  rows = 4,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}) {
  return (
    <label className={cn("grid min-w-0 gap-2 text-sm text-muted", className)}>
      <span>{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full min-w-0 rounded-lg border border-line bg-navy-deep/45 px-3 py-3 text-foreground outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-2 focus:ring-gold/15"
      />
    </label>
  );
}

type SelectOption = string | { label: string; value: string };

function getOptionValue(option: SelectOption) {
  return typeof option === "string" ? option : option.value;
}

function getOptionLabel(option: SelectOption) {
  return typeof option === "string" ? option : option.label;
}

export function Select({
  label,
  name,
  options,
  defaultValue,
  className,
}: {
  label: string;
  name: string;
  options: SelectOption[];
  defaultValue?: string | null;
  className?: string;
}) {
  const fallbackValue = options[0] ? getOptionValue(options[0]) : "";

  return (
    <label className={cn("grid min-w-0 gap-2 text-sm text-muted", className)}>
      <span>{label}</span>
      <select
        name={name}
        defaultValue={defaultValue || fallbackValue}
        className="h-11 w-full min-w-0 truncate rounded-lg border border-line bg-navy-deep/45 px-3 text-foreground outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
      >
        {options.map((option) => (
          <option
            key={getOptionValue(option)}
            value={getOptionValue(option)}
            className="bg-black text-white"
          >
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-line accent-gold"
      />
      <span>{label}</span>
    </label>
  );
}
