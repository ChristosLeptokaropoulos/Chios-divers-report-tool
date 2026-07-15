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

  return (
    <section className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-brand-navy dark:text-white">Photos</h2>
        <span className="text-sm text-foreground/60">
          {filledCount} / {PHOTO_SLOTS.length} added
        </span>
      </div>

      <div className="mb-6 max-w-xs">
        <PhotoSlotCard
          slot={shipSlot}
          state={states[shipSlot.token] ?? { status: "empty" }}
          onPick={(file) => onPick(shipSlot.token, file)}
          onClear={() => onClear(shipSlot.token)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {pairSlots.map((slot) => (
          <PhotoSlotCard
            key={slot.token}
            slot={slot}
            state={states[slot.token] ?? { status: "empty" }}
            onPick={(file) => onPick(slot.token, file)}
            onClear={() => onClear(slot.token)}
          />
        ))}
      </div>
    </section>
  );
}
