// Mirrors the slot layout of the legacy desktop tool (insert_photos.py):
// slot 0 is the ship/cover photo, slots 1-36 are 18 before/after pairs.

export const TOTAL_SLOTS = 37;

export const SHIP_WIDTH_CM = 15.0;
export const SHIP_HEIGHT_CM = 7.5;
export const SLOT_WIDTH_CM = 8.2;
export const SLOT_HEIGHT_CM = 7.01;

export interface PhotoSlot {
  index: number;
  token: string;
  label: string;
  widthCm: number;
  heightCm: number;
}

function slotLabel(i: number): string {
  if (i === 0) return "Ship";
  const pairNumber = Math.floor((i + 1) / 2);
  return (i % 2 === 1 ? "Before" : "After") + ` ${pairNumber}`;
}

export const PHOTO_SLOTS: PhotoSlot[] = Array.from(
  { length: TOTAL_SLOTS },
  (_, i) => ({
    index: i,
    token: `IMG_${String(i).padStart(2, "0")}`,
    label: slotLabel(i),
    widthCm: i === 0 ? SHIP_WIDTH_CM : SLOT_WIDTH_CM,
    heightCm: i === 0 ? SHIP_HEIGHT_CM : SLOT_HEIGHT_CM,
  }),
);
