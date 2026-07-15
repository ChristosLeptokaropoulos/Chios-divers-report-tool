// easy-template-x places images by converting a pixel width/height into EMU
// at a fixed 96 DPI (see its `pixelsToEmu`: px * 9525). That conversion controls
// the *physical* size of the image box in the document — it has nothing to do
// with the resolution of the embedded image bytes. So we keep two numbers per
// photo: a high-resolution pixel size (for print-quality source bytes, matching
// the legacy tool's 300 DPI target) and a 96-DPI-equivalent pixel size (purely
// to tell easy-template-x what physical cm size to render at).

const PRINT_DPI = 300;
const EMU_BASIS_DPI = 96;

export function cmToPrintPx(cm: number): number {
  return Math.round((cm / 2.54) * PRINT_DPI);
}

export function cmToEmuPx(cm: number): number {
  return Math.round((cm / 2.54) * EMU_BASIS_DPI);
}
