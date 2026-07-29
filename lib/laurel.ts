import { createCanvas, loadImage, GlobalFonts, SKRSContext2D } from "@napi-rs/canvas";
import * as fs from "fs";
import * as path from "path";

const TEMPLATE_PATH = path.join(
  process.cwd(),
  "public/uploads/laurel-template-sicilian-empty.png",
);
const FONT_FAMILY = "Poppins Bold Laurel";

function ensureFont() {
  // Check the native GlobalFonts registry itself rather than a module-scoped flag — in dev
  // mode, hot-reloading this module resets any JS-level flag on each edit, but the registry
  // is process-global, so re-registering the same family name after a reload (once the old
  // module instance's font buffer has been GC'd) can leave a stale/broken mapping instead of
  // a fresh one. Checking .has() first avoids that entirely.
  if (GlobalFonts.has(FONT_FAMILY)) return;
  GlobalFonts.registerFromPath(
    path.join(process.cwd(), "public/fonts/Poppins-Bold.ttf"),
    FONT_FAMILY,
  );
}

// ── Position constants (measured off the reference laurel — topFrac = fraction from top) ──
const POS = {
  category: { topFrac: 0.414, sizeFrac: 0.20, maxWidthFrac: 0.70, lineGapMult: 1.05 },
  month:    { topFrac: 0.747, sizeFrac: 0.044, maxWidthFrac: 0.5 },
  year:     { topFrac: 0.817, sizeFrac: 0.131, maxWidthFrac: 0.55 },
};

const BLACK = "#000000";

export interface LaurelOverrides {
  category?:               string;
  date?:                   string;
  categorySizeMultiplier?: number;
  dateSizeMultiplier?:     number;
}

export interface LaurelData {
  category: string;
  month:    number;
  year:     number;
}

function sanitizeText(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/ /g, " ");
}

// ── Text helpers (same fitting algorithm as lib/certificate.ts, adapted to canvas) ──

function bestTwoLineSplit(
  text: string,
  ctx: SKRSContext2D,
  size: number,
  maxW: number,
): { line1: string; line2: string; balance: number; fits: boolean } {
  ctx.font = `${size}px "${FONT_FAMILY}"`;
  const words = text.split(" ");
  let bestSplit = 1, bestBalance = 0;
  for (let i = 1; i < words.length; i++) {
    const l1 = words.slice(0, i).join(" ");
    const l2 = words.slice(i).join(" ");
    const w1 = ctx.measureText(l1).width;
    const w2 = ctx.measureText(l2).width;
    const balance = Math.min(w1, w2) / Math.max(w1, w2);
    if (balance > bestBalance) { bestBalance = balance; bestSplit = i; }
  }
  const line1 = words.slice(0, bestSplit).join(" ");
  const line2 = words.slice(bestSplit).join(" ");
  const fits =
    ctx.measureText(line1).width <= maxW &&
    ctx.measureText(line2).width <= maxW;
  return { line1, line2, balance: bestBalance, fits };
}

function wrapToFit(text: string, ctx: SKRSContext2D, size: number, maxW: number): string[] {
  ctx.font = `${size}px "${FONT_FAMILY}"`;
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(test).width > maxW) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawLinesTopAnchored(
  ctx: SKRSContext2D,
  lines: string[],
  canvasWidth: number,
  topY: number,
  size: number,
  lineGap: number,
  color: string,
) {
  ctx.font = `${size}px "${FONT_FAMILY}"`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], canvasWidth / 2, topY + i * lineGap);
  }
}

function drawAdaptiveTopAnchored(
  ctx: SKRSContext2D,
  text: string,
  canvasWidth: number,
  canvasHeight: number,
  topFrac: number,
  sizeFrac: number,
  maxWidthFrac: number,
  lineGapMult: number,
  color: string,
  sizeMultiplier = 1,
  maxBlockHeightFrac = Infinity,
) {
  const maxW = canvasWidth * maxWidthFrac;
  const fullSize = canvasHeight * sizeFrac * sizeMultiplier;
  const minSize = fullSize * 0.5;
  const topY = canvasHeight * topFrac;

  let scaledSize = fullSize;
  ctx.font = `${scaledSize}px "${FONT_FAMILY}"`;
  while (ctx.measureText(text).width > maxW && scaledSize > minSize) {
    scaledSize -= 0.5;
    ctx.font = `${scaledSize}px "${FONT_FAMILY}"`;
  }
  const scaleFactor = scaledSize / fullSize;

  const { line1, line2, balance, fits } = bestTwoLineSplit(text, ctx, fullSize, maxW);

  let lines: string[];
  let size: number;
  if (scaleFactor >= 0.90) {
    lines = [text]; size = scaledSize;
  } else if (fits && balance >= 0.55) {
    lines = [line1, line2]; size = fullSize;
  } else {
    size = scaledSize;
    lines = wrapToFit(text, ctx, size, maxW);
    const absMinSize = fullSize * 0.4;
    while (
      lines.some((l) => { ctx.font = `${size}px "${FONT_FAMILY}"`; return ctx.measureText(l).width > maxW; }) &&
      size > absMinSize
    ) {
      size -= 0.5;
      lines = wrapToFit(text, ctx, size, maxW);
    }
  }

  // Multi-line splits (2-word-balanced or wrapped) are sized purely against maxWidthFrac —
  // nothing above checks whether N stacked lines still fit above the next text block (month/
  // year). A short 2-word category rendered at full nominal size can be tall enough to bleed
  // into that area, so clamp the whole block's height as a last step.
  const maxBlockH = canvasHeight * maxBlockHeightFrac;
  const blockH = size * (1 + (lines.length - 1) * lineGapMult);
  if (blockH > maxBlockH) {
    size = size * (maxBlockH / blockH);
  }

  const lineGap = size * lineGapMult;
  drawLinesTopAnchored(ctx, lines, canvasWidth, topY, size, lineGap, color);
}

function drawOverrideTopAnchored(
  ctx: SKRSContext2D,
  text: string,
  canvasWidth: number,
  canvasHeight: number,
  topFrac: number,
  sizeFrac: number,
  maxWidthFrac: number,
  lineGapMult: number,
  color: string,
  sizeMultiplier = 1,
) {
  const maxW = canvasWidth * maxWidthFrac;
  let size = canvasHeight * sizeFrac * sizeMultiplier;
  const minSize = size * 0.45;
  const lines = text.split("\n").filter(Boolean);
  const topY = canvasHeight * topFrac;

  ctx.font = `${size}px "${FONT_FAMILY}"`;
  while (
    lines.some((l) => ctx.measureText(l).width > maxW) &&
    size > minSize
  ) {
    size -= 0.5;
    ctx.font = `${size}px "${FONT_FAMILY}"`;
  }

  const lineGap = size * lineGapMult;
  drawLinesTopAnchored(ctx, lines, canvasWidth, topY, size, lineGap, color);
}

// ── Template resolution — Sicilian keeps a plain local template for now (no Cloudinary
// template management here yet, matching how lib/certificate.ts already works in this project) ──

export function hasLaurelTemplate(): boolean {
  return fs.existsSync(TEMPLATE_PATH);
}

// ── Public API ──

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

export async function generateLaurel(data: LaurelData, overrides?: LaurelOverrides): Promise<Buffer> {
  ensureFont();
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Laurel template not found at public/uploads/laurel-template-sicilian-empty.png`);
  }
  const img = await loadImage(fs.readFileSync(TEMPLATE_PATH));
  const { width, height } = img;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height); // keep transparency where the template is transparent
  ctx.drawImage(img, 0, 0, width, height);

  // Category
  const catText = sanitizeText(overrides?.category ?? data.category.toUpperCase());
  if (overrides?.category) {
    drawOverrideTopAnchored(ctx, catText, width, height,
      POS.category.topFrac, POS.category.sizeFrac, POS.category.maxWidthFrac, POS.category.lineGapMult,
      BLACK, overrides.categorySizeMultiplier ?? 1);
  } else {
    drawAdaptiveTopAnchored(ctx, catText, width, height,
      POS.category.topFrac, POS.category.sizeFrac, POS.category.maxWidthFrac, POS.category.lineGapMult,
      BLACK, overrides?.categorySizeMultiplier ?? 1, POS.month.topFrac - POS.category.topFrac - 0.02);
  }

  // Date — month (smaller) + year (large), or a single custom override string on one line
  if (overrides?.date) {
    drawOverrideTopAnchored(ctx, sanitizeText(overrides.date), width, height,
      POS.month.topFrac, POS.month.sizeFrac, POS.month.maxWidthFrac, 1.3,
      BLACK, overrides.dateSizeMultiplier ?? 1);
  } else {
    const monthMult = overrides?.dateSizeMultiplier ?? 1;
    drawAdaptiveTopAnchored(ctx, MONTHS[data.month - 1].toUpperCase(), width, height,
      POS.month.topFrac, POS.month.sizeFrac, POS.month.maxWidthFrac, 1.3, BLACK, monthMult);
    drawAdaptiveTopAnchored(ctx, String(data.year), width, height,
      POS.year.topFrac, POS.year.sizeFrac, POS.year.maxWidthFrac, 1.1, BLACK, monthMult);
  }

  return canvas.toBuffer("image/png");
}

export function parseLaurelOverrides(json: string | null | undefined): LaurelOverrides | undefined {
  if (!json) return undefined;
  try { return JSON.parse(json) as LaurelOverrides; } catch { return undefined; }
}
