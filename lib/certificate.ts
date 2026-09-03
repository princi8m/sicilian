import * as fs from "fs";
import * as path from "path";
import { prisma } from "@/lib/prisma";
import { pdf } from "festival-engine-core";
import { CERT_DEFAULT_LAYOUT, CERT_FONTS, CERT_STYLE, type CertFieldKey } from "@/lib/certificate-config";
import { getCertFieldPositions } from "@/lib/field-positions";

const LEGACY_TEMPLATE_PATH = path.join(
  process.cwd(),
  "public/uploads/certificate-template-sicilian-empty.jpg",
);
const TEMPLATE_SETTING_KEY = "certificate_template";

interface TemplateRecord {
  url:      string;
  publicId: string;
  format:   string; // "jpg" | "png"
}

interface TemplateAsset {
  bytes:  Buffer;
  format: "jpg" | "png";
}

function parseTemplateRecord(value: string): TemplateRecord | null {
  try {
    const parsed = JSON.parse(value);
    return parsed?.url ? (parsed as TemplateRecord) : null;
  } catch {
    return null;
  }
}

export interface CertOverrides {
  name?:                 string;
  film?:                 string;
  category?:             string;
  nameSizeMultiplier?:   number;
  filmSizeMultiplier?:   number;
  categorySizeMultiplier?: number;
}

export interface CertData {
  recipientName: string;
  filmTitle:     string;
  category:      string;
  month:         number;
  year:          number;
}

function loadFont(filename: string): Buffer {
  return fs.readFileSync(path.join(process.cwd(), "public/fonts", filename));
}

// ── Template resolution ──────────────────────────────────────────────────────
// Preferred source is a Cloudinary asset managed from /admin/certificates
// (survives redeploys); a local file at LEGACY_TEMPLATE_PATH is kept as a
// fallback for zero-downtime migration from the old hardcoded-path setup.

async function getTemplateAsset(): Promise<TemplateAsset> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: TEMPLATE_SETTING_KEY },
  });
  const record = setting ? parseTemplateRecord(setting.value) : null;

  if (record) {
    // Same class of bug as the Gmail SMTP hang found 2026-08-05: an external network call
    // with no timeout can hold this request (and its DB connection) open indefinitely if
    // Cloudinary is slow or unreachable.
    const res = await fetch(record.url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      throw new Error(`Failed to fetch certificate template from Cloudinary (${res.status})`);
    }
    const bytes = Buffer.from(await res.arrayBuffer());
    return { bytes, format: record.format === "png" ? "png" : "jpg" };
  }

  if (fs.existsSync(LEGACY_TEMPLATE_PATH)) {
    return { bytes: fs.readFileSync(LEGACY_TEMPLATE_PATH), format: "jpg" };
  }

  throw new Error(
    "Certificate template not found — upload one from Admin → Certificates.",
  );
}

export async function hasCertificateTemplate(): Promise<boolean> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: TEMPLATE_SETTING_KEY },
  });
  if (setting && parseTemplateRecord(setting.value)) return true;
  return fs.existsSync(LEGACY_TEMPLATE_PATH);
}

export async function getCertificateTemplatePreviewUrl(): Promise<string | null> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: TEMPLATE_SETTING_KEY },
  });
  const record = setting ? parseTemplateRecord(setting.value) : null;
  return record?.url ?? null;
}

// ── Public API ────────────────────────────────────────────────────────────────

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

export async function generateCertificate(
  data:       CertData,
  overrides?: CertOverrides,
): Promise<Uint8Array> {
  const template = await getTemplateAsset();
  const handle = await pdf.createCertificatePdf(template);

  const layout = await getCertFieldPositions();
  const fonts: Record<CertFieldKey, Awaited<ReturnType<typeof pdf.embedPdfFont>>> = {
    category:  await pdf.embedPdfFont(handle, loadFont(CERT_FONTS.category)),
    name:      await pdf.embedPdfFont(handle, loadFont(CERT_FONTS.name)),
    filmTitle: await pdf.embedPdfFont(handle, loadFont(CERT_FONTS.filmTitle)),
    date:      await pdf.embedPdfFont(handle, loadFont(CERT_FONTS.date)),
  };

  // Date — no override support (never has had one); always adaptive.
  pdf.drawAdaptiveField(
    handle,
    `${MONTHS[data.month - 1].toUpperCase()} ${data.year}`,
    layout.date,
    CERT_STYLE.date,
    fonts.date,
  );

  // Category
  const catText = overrides?.category ?? data.category.toUpperCase();
  if (overrides?.category) {
    pdf.drawOverrideField(handle, catText, layout.category, CERT_STYLE.category, fonts.category, overrides.categorySizeMultiplier ?? 1);
  } else {
    pdf.drawAdaptiveField(handle, catText, layout.category, CERT_STYLE.category, fonts.category, overrides?.categorySizeMultiplier ?? 1);
  }

  // Name — mixed case (NOT uppercased; unlike bif/bracciano, this site has never
  // uppercased recipient names on the certificate).
  const nameText = overrides?.name ?? data.recipientName;
  if (overrides?.name) {
    pdf.drawOverrideField(handle, nameText, layout.name, CERT_STYLE.name, fonts.name, overrides.nameSizeMultiplier ?? 1);
  } else {
    pdf.drawAdaptiveField(handle, nameText, layout.name, CERT_STYLE.name, fonts.name, overrides?.nameSizeMultiplier ?? 1);
  }

  // Film title — mixed case (NOT uppercased)
  const filmText = overrides?.film ?? data.filmTitle;
  if (overrides?.film) {
    pdf.drawOverrideField(handle, filmText, layout.filmTitle, CERT_STYLE.filmTitle, fonts.filmTitle, overrides.filmSizeMultiplier ?? 1);
  } else {
    pdf.drawAdaptiveField(handle, filmText, layout.filmTitle, CERT_STYLE.filmTitle, fonts.filmTitle, overrides?.filmSizeMultiplier ?? 1);
  }

  return pdf.finalizePdf(handle);
}

export function parseCertOverrides(json: string | null | undefined): CertOverrides | undefined {
  if (!json) return undefined;
  try { return JSON.parse(json) as CertOverrides; } catch { return undefined; }
}

// Re-exported so app/admin/(panel)/certificates/field-position-actions.ts and admin UI
// can validate against the same default shape without importing lib/certificate-config.ts
// directly everywhere.
export { CERT_DEFAULT_LAYOUT };
