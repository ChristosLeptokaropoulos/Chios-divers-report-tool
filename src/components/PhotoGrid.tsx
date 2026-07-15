import { PHOTO_SLOTS } from "@/lib/photo-slots";
import { PhotoSlotCard, type PhotoSlotState } from "@/components/PhotoSlotCard";

interface Props {
  states: Record<string, PhotoSlotState>;
  onPick: (token: string, file: File) => void;
  onClear: (token: string) => void;
}

export function PhotoGrid({ states, onPick, onClear }: Props) {
  const [shipSlot, ...pairSlots] = PHOTO_SLOTS;

  const filledCount = PHOTO_SLOTS.filter((s) => states[s.token]?.status === "ready").length;

  const pairs: Array<[typeof pairSlots[number], typeof pairSlots[number]]> = [];
  for (let i = 0; i < pairSlots.length; i += 2) {
    pairs.push([pairSlots[i], pairSlots[i + 1]]);
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-brand-navy dark:text-white">Photos</h2>
        <span className="text-sm text-foreground/60">
          {filledCount} / {PHOTO_SLOTS.length} added
        </span>
      </div>

      <div className="mx-auto mb-6 max-w-xs">
        <PhotoSlotCard
          slot={shipSlot}
          state={states[shipSlot.token] ?? { status: "empty" }}
          onPick={(file) => onPick(shipSlot.token, file)}
          onClear={() => onClear(shipSlot.token)}
        />
      </div>

      <div className="flex flex-col gap-3">
        {pairs.map(([before, after]) => (
          <div key={before.token} className="grid grid-cols-2 gap-3">
            <PhotoSlotCard
              slot={before}
              state={states[before.token] ?? { status: "empty" }}
              onPick={(file) => onPick(before.token, file)}
              onClear={() => onClear(before.token)}
            />
            <PhotoSlotCard
              slot={after}
              state={states[after.token] ?? { status: "empty" }}
              onPick={(file) => onPick(after.token, file)}
              onClear={() => onClear(after.token)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
