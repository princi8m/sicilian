import * as fs from "fs";
import * as path from "path";
import { prisma } from "@/lib/prisma";
import { canvas as canvasEngine } from "festival-engine-core";
import { LAUREL_DEFAULT_LAYOUT, LAUREL_FONT_FAMILY, LAUREL_FONT_FILE, LAUREL_STYLE } from "@/lib/laurel-config";
import { getLaurelFieldPositions } from "@/lib/field-positions";

const LEGACY_TEMPLATE_PATH = path.join(
  process.cwd(),
  "public/uploads/laurel-template-sicilian-empty.png",
);
const TEMPLATE_SETTING_KEY = "laurel_template";

let fontLoaded = false;
function ensureFont() {
  if (fontLoaded) return;
  const bytes = fs.readFileSync(path.join(process.cwd(), "public/fonts", LAUREL_FONT_FILE));
  canvasEngine.registerCanvasFont(bytes, LAUREL_FONT_FAMILY);
  fontLoaded = true;
}

interface TemplateRecord {
  url:      string;
  publicId: string;
  format:   string; // "png" | "jpg"
}

interface TemplateAsset {
  bytes:  Buffer;
  format: "png" | "jpg";
}

function parseTemplateRecord(value: string): TemplateRecord | null {
  try {
    const parsed = JSON.parse(value);
    return parsed?.url ? (parsed as TemplateRecord) : null;
  } catch {
    return null;
  }
}

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

// ── Template resolution — same pattern as lib/certificate.ts ──

async function getTemplateAsset(): Promise<TemplateAsset> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: TEMPLATE_SETTING_KEY } });
  const record = setting ? parseTemplateRecord(setting.value) : null;

  if (record) {
    // Same class of bug as the Gmail SMTP hang found 2026-08-05: an external network call
    // with no timeout can hold this request (and its DB connection) open indefinitely if
    // Cloudinary is slow or unreachable.
    const res = await fetch(record.url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`Failed to fetch laurel template from Cloudinary (${res.status})`);
    const bytes = Buffer.from(await res.arrayBuffer());
    return { bytes, format: record.format === "jpg" ? "jpg" : "png" };
  }

  if (fs.existsSync(LEGACY_TEMPLATE_PATH)) {
    return { bytes: fs.readFileSync(LEGACY_TEMPLATE_PATH), format: "png" };
  }

  throw new Error("Laurel template not found — upload one from Admin → Certificates.");
}

export async function hasLaurelTemplate(): Promise<boolean> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: TEMPLATE_SETTING_KEY } });
  if (setting && parseTemplateRecord(setting.value)) return true;
  return fs.existsSync(LEGACY_TEMPLATE_PATH);
}

export async function getLaurelTemplatePreviewUrl(): Promise<string | null> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: TEMPLATE_SETTING_KEY } });
  const record = setting ? parseTemplateRecord(setting.value) : null;
  return record?.url ?? null;
}

// ── Public API ──

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

export async function generateLaurel(data: LaurelData, overrides?: LaurelOverrides): Promise<Buffer> {
  ensureFont();
  const template = await getTemplateAsset();
  const handle = await canvasEngine.createRasterCanvas(template);
  const layout = await getLaurelFieldPositions();

  // Category
  const catText = overrides?.category ?? data.category.toUpperCase();
  if (overrides?.category) {
    canvasEngine.drawOverrideField(handle, catText, layout.category, LAUREL_STYLE.category, LAUREL_FONT_FAMILY, overrides.categorySizeMultiplier ?? 1);
  } else {
    canvasEngine.drawAdaptiveField(handle, catText, layout.category, LAUREL_STYLE.category, LAUREL_FONT_FAMILY, overrides?.categorySizeMultiplier ?? 1);
  }

  // Date — month (smaller) + year (large), or a single custom override string drawn at
  // month's position in place of both (a composited business rule, not a generic field).
  if (overrides?.date) {
    canvasEngine.drawOverrideField(handle, overrides.date, layout.month, LAUREL_STYLE.month, LAUREL_FONT_FAMILY, overrides.dateSizeMultiplier ?? 1);
  } else {
    const monthMult = overrides?.dateSizeMultiplier ?? 1;
    canvasEngine.drawAdaptiveField(handle, MONTHS[data.month - 1].toUpperCase(), layout.month, LAUREL_STYLE.month, LAUREL_FONT_FAMILY, monthMult);
    canvasEngine.drawAdaptiveField(handle, String(data.year), layout.year, LAUREL_STYLE.year, LAUREL_FONT_FAMILY, monthMult);
  }

  return canvasEngine.finalizePng(handle);
}

export function parseLaurelOverrides(json: string | null | undefined): LaurelOverrides | undefined {
  if (!json) return undefined;
  try { return JSON.parse(json) as LaurelOverrides; } catch { return undefined; }
}

export { LAUREL_DEFAULT_LAYOUT };
