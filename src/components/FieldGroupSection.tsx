import type { FieldGroup } from "@/lib/report-fields";

interface Props {
  group: FieldGroup;
  values: Record<string, string>;
  onChange: (token: string, value: string) => void;
}

export function FieldGroupSection({ group, values, onChange }: Props) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-brand-navy dark:text-white">
        {group.title}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {group.fields.map((field) => (
          <div
            key={field.token}
            className={field.type === "textarea" ? "sm:col-span-2" : undefined}
          >
            <label htmlFor={field.token} className="mb-1 block text-sm font-medium">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.token}
                rows={2}
                value={values[field.token] ?? ""}
                onChange={(e) => onChange(field.token, e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
              />
            ) : (
              <input
                id={field.token}
                type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                value={values[field.token] ?? ""}
                onChange={(e) => onChange(field.token, e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
