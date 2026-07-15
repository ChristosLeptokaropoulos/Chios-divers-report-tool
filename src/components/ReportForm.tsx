"use client";

import { useCallback, useMemo, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  HEADER_GROUP,
  GENERAL_DETAILS_GROUP,
  ASSIGNMENT_GROUP,
  emptyTextFieldValues,
  emptyPartFieldValues,
  type PartFieldValue,
} from "@/lib/report-fields";
import { PHOTO_SLOTS } from "@/lib/photo-slots";
import { resizeImageFile } from "@/lib/resize-image";
import { FieldGroupSection } from "@/components/FieldGroupSection";
import { PartsConditionSection } from "@/components/PartsConditionSection";
import { PhotoGrid } from "@/components/PhotoGrid";
import type { PhotoSlotState } from "@/components/PhotoSlotCard";

export function ReportForm() {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [textValues, setTextValues] = useState(emptyTextFieldValues);
  const [partValues, setPartValues] = useState(emptyPartFieldValues);
  const [photoStates, setPhotoStates] = useState<Record<string, PhotoSlotState>>({});
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);

  const updateText = useCallback((token: string, value: string) => {
    setTextValues((prev) => ({ ...prev, [token]: value }));
  }, []);

  const updatePart = useCallback((key: string, value: PartFieldValue) => {
    setPartValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePick = useCallback(
    async (token: string, file: File) => {
      const previewUrl = URL.createObjectURL(file);
      setPhotoStates((prev) => ({
        ...prev,
        [token]: { status: "uploading", previewUrl },
      }));

      try {
        const resized = await resizeImageFile(file);
        const result = await upload(`reports/${sessionId}/${token}.jpg`, resized, {
          access: "public",
          handleUploadUrl: "/api/blob-upload",
          contentType: "image/jpeg",
        });
        setPhotoStates((prev) => ({
          ...prev,
          [token]: { status: "ready", previewUrl, blobUrl: result.url },
        }));
      } catch (error) {
        setPhotoStates((prev) => ({
          ...prev,
          [token]: {
            status: "error",
            previewUrl,
            error: error instanceof Error ? error.message : "Upload failed",
          },
        }));
      }
    },
    [sessionId],
  );

  const handleClear = useCallback((token: string) => {
    setPhotoStates((prev) => {
      const next = { ...prev };
      if (next[token]?.previewUrl) URL.revokeObjectURL(next[token].previewUrl!);
      delete next[token];
      return next;
    });
  }, []);

  const photos = useMemo(() => {
    const result: Record<string, string> = {};
    for (const slot of PHOTO_SLOTS) {
      const blobUrl = photoStates[slot.token]?.blobUrl;
      if (blobUrl) result[slot.token] = blobUrl;
    }
    return result;
  }, [photoStates]);

  async function handleGenerate() {
    setGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(false);
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textValues, partValues, photos }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to generate report");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = /filename="(.+)"/.exec(disposition);
      const filename = match?.[1] ?? "service-report.docx";

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      setGenerateSuccess(true);
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  }

  const uploading = Object.values(photoStates).some((s) => s.status === "uploading");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 pb-28 sm:p-6">
      <FieldGroupSection group={HEADER_GROUP} values={textValues} onChange={updateText} />
      <FieldGroupSection group={GENERAL_DETAILS_GROUP} values={textValues} onChange={updateText} />
      <FieldGroupSection group={ASSIGNMENT_GROUP} values={textValues} onChange={updateText} />
      <PartsConditionSection values={partValues} onChange={updatePart} />
      <PhotoGrid states={photoStates} onPick={handlePick} onClear={handleClear} />

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-surface/95 backdrop-blur p-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="text-sm">
            {generateError && <p className="text-brand-red">{generateError}</p>}
            {generateSuccess && !generateError && (
              <p className="text-green-700 dark:text-green-400">Report downloaded.</p>
            )}
            {uploading && !generateError && (
              <p className="text-foreground/60">Photos still uploading…</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || uploading}
            className="shrink-0 rounded-lg bg-brand-red px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-red-dark disabled:opacity-50"
          >
            {generating ? "Generating…" : "Generate report"}
          </button>
        </div>
      </div>
    </div>
  );
}
