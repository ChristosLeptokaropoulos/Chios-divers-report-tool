import { NextResponse } from "next/server";
import sharp from "sharp";
import { TemplateHandler, MimeType } from "easy-template-x";
import { del } from "@vercel/blob";
import fs from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/session";
import {
  buildTextTokenData,
  type TextFieldValues,
  type PartFieldValues,
} from "@/lib/report-fields";
import { PHOTO_SLOTS } from "@/lib/photo-slots";
import { cmToEmuPx, cmToPrintPx } from "@/lib/image-sizing";

export const runtime = "nodejs";
export const maxDuration = 60;

interface GenerateReportBody {
  textValues: TextFieldValues;
  partValues: PartFieldValues;
  photos: Record<string, string>; // IMG token -> Vercel Blob URL
}

async function buildImageTagData(token: string, url: string, widthCm: number, heightCm: number) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch uploaded photo for ${token}`);
  }
  const sourceBuffer = Buffer.from(await res.arrayBuffer());

  const jpeg = await sharp(sourceBuffer)
    .rotate() // auto-orient using EXIF, then strip the orientation tag
    .resize(cmToPrintPx(widthCm), cmToPrintPx(heightCm), { fit: "fill" })
    .jpeg({ quality: 85 })
    .toBuffer();

  return {
    _type: "image" as const,
    source: jpeg,
    format: MimeType.Jpeg,
    width: cmToEmuPx(widthCm),
    height: cmToEmuPx(heightCm),
  };
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const authenticated = await verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: GenerateReportBody;
  try {
    body = (await request.json()) as GenerateReportBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { textValues, partValues, photos } = body;
  const data: Record<string, unknown> = buildTextTokenData(textValues ?? {}, partValues ?? {});

  const blobUrls = Object.values(photos ?? {});

  try {
    await Promise.all(
      PHOTO_SLOTS.map(async (slot) => {
        const url = photos?.[slot.token];
        if (!url) {
          data[slot.token] = "";
          return;
        }
        data[slot.token] = await buildImageTagData(slot.token, url, slot.widthCm, slot.heightCm);
      }),
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process photos" },
      { status: 400 },
    );
  }

  const templatePath = path.join(process.cwd(), "templates", "report-template.docx");
  const templateFile = await fs.readFile(templatePath);

  const handler = new TemplateHandler({
    delimiters: { tagStart: "{{", tagEnd: "}}" },
  });
  const outputBuffer = await handler.process(templateFile, data);

  if (blobUrls.length > 0) {
    del(blobUrls).catch(() => {
      // best-effort cleanup; leftover blobs are harmless and can be pruned later
    });
  }

  const filenameDate = new Date().toISOString().slice(0, 10);
  return new NextResponse(outputBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="service-report-${filenameDate}.docx"`,
    },
  });
}
