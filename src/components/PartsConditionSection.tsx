import { PARTS, type PartFieldValue, type PartFieldValues } from "@/lib/report-fields";

interface Props {
  values: PartFieldValues;
  onChange: (key: string, value: PartFieldValue) => void;
}

export function PartsConditionSection({ values, onChange }: Props) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <h2 className="mb-1 text-base font-semibold text-brand-navy dark:text-white">
        Parts Condition
      </h2>
      <p className="mb-4 text-sm text-foreground/60">
        Fouling notes are free text (e.g. &quot;Light&quot;, &quot;Heavy&quot;, or leave blank). Pick Good or Poor for overall condition.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-foreground/60">
              <th className="py-2 pr-2 font-medium">Part</th>
              <th className="py-2 px-2 font-medium">Barnacles</th>
              <th className="py-2 px-2 font-medium">Marine Grass</th>
              <th className="py-2 px-2 font-medium">Other</th>
              <th className="py-2 pl-2 font-medium">Condition</th>
            </tr>
          </thead>
          <tbody>
            {PARTS.map((part) => {
              const value = values[part.key];
              return (
                <tr key={part.key} className="border-t border-border">
                  <td className="py-2 pr-2 font-medium whitespace-nowrap">{part.label}</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={value.barnacles}
                      onChange={(e) => onChange(part.key, { ...value, barnacles: e.target.value })}
                      className="w-24 rounded-md border border-border bg-background px-2 py-1 outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={value.grass}
                      onChange={(e) => onChange(part.key, { ...value, grass: e.target.value })}
                      className="w-24 rounded-md border border-border bg-background px-2 py-1 outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={value.other}
                      onChange={(e) => onChange(part.key, { ...value, other: e.target.value })}
                      className="w-24 rounded-md border border-border bg-background px-2 py-1 outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    />
                  </td>
                  <td className="py-2 pl-2">
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1 whitespace-nowrap">
                        <input
                          type="radio"
                          name={`condition-${part.key}`}
                          checked={value.condition === "good"}
                          onChange={() => onChange(part.key, { ...value, condition: "good" })}
                        />
                        Good
                      </label>
                      <label className="flex items-center gap-1 whitespace-nowrap">
                        <input
                          type="radio"
                          name={`condition-${part.key}`}
                          checked={value.condition === "poor"}
                          onChange={() => onChange(part.key, { ...value, condition: "poor" })}
                        />
                        Poor
                      </label>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
