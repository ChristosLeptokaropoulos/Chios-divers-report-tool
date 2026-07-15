"use client";

import type { PhotoSlot } from "@/lib/photo-slots";

export type PhotoSlotStatus = "empty" | "uploading" | "ready" | "error";

export interface PhotoSlotState {
  status: PhotoSlotStatus;
  previewUrl?: string;
  blobUrl?: string;
  error?: string;
}

interface Props {
  slot: PhotoSlot;
  state: PhotoSlotState;
  onPick: (file: File) => void;
  onClear: () => void;
}

export function PhotoSlotCard({ slot, state, onPick, onClear }: Props) {
  const inputId = `photo-${slot.token}`;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
      <div className="relative flex aspect-4/3 items-center justify-center bg-black/5 dark:bg-white/5">
        {state.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={state.previewUrl}
            alt={slot.label}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-foreground/40">No photo</span>
        )}
        {state.status === "uploading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white">
            Uploading…
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="mb-1.5 truncate text-xs font-medium">{slot.label}</p>
        <div className="flex gap-1.5">
          <label
            htmlFor={inputId}
            className="flex-1 cursor-pointer rounded-md border border-border py-2 text-center text-sm font-medium active:bg-black/10 dark:active:bg-white/15"
          >
            {state.previewUrl ? "Replace" : "Add"}
          </label>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onPick(file);
              e.target.value = "";
            }}
          />
          {state.previewUrl && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-md border border-border px-3 py-2 text-sm font-medium active:bg-black/10 dark:active:bg-white/15"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {state.status === "error" && (
        <p className="px-2 pb-2 text-xs text-brand-red">{state.error ?? "Upload failed"}</p>
      )}
    </div>
  );
}
