import { PDFDocument, rgb, PDFFont, PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import * as fs from "fs";
import * as path from "path";

// yFrac = fraction from bottom (pdf-lib origin is bottom-left)
// xFrac = fraction from left (used for left-aligned date elements)
const POS = {
  category:  { yFrac: 0.925, sizeFrac: 0.0605, maxWidthFrac: 0.80 },
  name:      { yFrac: 0.748, sizeFrac: 0.080,  maxWidthFrac: 0.52 },
  filmTitle: { yFrac: 0.545, sizeFrac: 0.066,  maxWidthFrac: 0.52 },
  month:     { yFrac: 0.138, xFrac: 0.172,     sizeFrac: 0.026 },
  year:      { yFrac: 0.087, xFrac: 0.172,     sizeFrac: 0.065 },
};

const WHITE    = rgb(1,     1,     1    );
const WINE_RED = rgb(0.545, 0.125, 0.125); // #8b2020
const BLACK    = rgb(0,     0,     0    );

export interface CertOverrides {
  name?:                   string;
  film?:                   string;
  category?:               string;
  nameSizeMultiplier?:     number;
  filmSizeMultiplier?:     number;
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

// The certificate fonts are Latin-subset and have no glyph for typographic
// punctuation — pdf-lib silently draws an invisible .notdef box with a huge
// advance width for those, which reads as a stray gap. Normalize to ASCII.
function sanitizeText(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/ /g, " ");
}

function bestTwoLineSplit(
  text: string,
  font: PDFFont,
  size: number,
  maxW: number,
): { line1: string; line2: string; balance: number; fits: boolean } {
  const words = text.split(" ");
  let bestSplit = 1, bestBalance = 0;
  for (let i = 1; i < words.length; i++) {
    const l1 = words.slice(0, i).join(" ");
    const l2 = words.slice(i).join(" ");
    const w1 = font.widthOfTextAtSize(l1, size);
    const w2 = font.widthOfTextAtSize(l2, size);
    const balance = Math.min(w1, w2) / Math.max(w1, w2);
    if (balance > bestBalance) { bestBalance = balance; bestSplit = i; }
  }
  const line1 = words.slice(0, bestSplit).join(" ");
  const line2 = words.slice(bestSplit).join(" ");
  const fits =
    font.widthOfTextAtSize(line1, size) <= maxW &&
    font.widthOfTextAtSize(line2, size) <= maxW;
  return { line1, line2, balance: bestBalance, fits };
}

function wrapToFit(
  text: string,
  font: PDFFont,
  size: number,
  maxW: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (current && font.widthOfTextAtSize(test, size) > maxW) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawLines(
  page:   PDFPage,
  lines:  string[],
  width:  number,
  height: number,
  yFrac:  number,
  size:   number,
  font:   PDFFont,
  color:  ReturnType<typeof rgb>,
) {
  const lineGap = size * 1.25;
  const yStart  = height * yFrac + (lineGap * (lines.length - 1)) / 2;
  for (let i = 0; i < lines.length; i++) {
    const lw = font.widthOfTextAtSize(lines[i], size);
    page.drawText(lines[i], {
      x: width / 2 - lw / 2,
      y: yStart - i * lineGap,
      size,
      font,
      color,
    });
  }
}

function drawAdaptive(
  page:         PDFPage,
  text:         string,
  width:        number,
  height:       number,
  yFrac:        number,
  sizeFrac:     number,
  maxWidthFrac: number,
  font:         PDFFont,
  color:        ReturnType<typeof rgb>,
  sizeMultiplier = 1,
) {
  const maxW     = width * maxWidthFrac;
  const fullSize = height * sizeFrac * sizeMultiplier;
  const minSize  = fullSize * 0.55;

  let scaledSize = fullSize;
  while (font.widthOfTextAtSize(text, scaledSize) > maxW && scaledSize > minSize) {
    scaledSize -= 0.5;
  }
  const scaleFactor = scaledSize / fullSize;

  const { line1, line2, balance, fits } = bestTwoLineSplit(text, font, fullSize, maxW);

  let lines: string[];
  let size: number;
  if (scaleFactor >= 0.90) {
    lines = [text]; size = scaledSize;
  } else if (fits && balance >= 0.60) {
    lines = [line1, line2]; size = fullSize;
  } else {
    // Too long even for a balanced 2-line split: wrap into as many lines
    // as needed, shrinking further if any wrapped line still overflows.
    size = scaledSize;
    lines = wrapToFit(text, font, size, maxW);
    const absMinSize = fullSize * 0.35;
    while (
      lines.some((l) => font.widthOfTextAtSize(l, size) > maxW) &&
      size > absMinSize
    ) {
      size -= 0.5;
      lines = wrapToFit(text, font, size, maxW);
    }
  }

  drawLines(page, lines, width, height, yFrac, size, font, color);
}

function drawOverride(
  page:         PDFPage,
  text:         string,
  width:        number,
  height:       number,
  yFrac:        number,
  sizeFrac:     number,
  maxWidthFrac: number,
  font:         PDFFont,
  color:        ReturnType<typeof rgb>,
  sizeMultiplier = 1,
) {
  const maxW    = width * maxWidthFrac;
  let   size    = height * sizeFrac * sizeMultiplier;
  const minSize = size * 0.45;
  const lines   = text.split("\n").filter(Boolean);

  while (
    lines.some((l) => font.widthOfTextAtSize(l, size) > maxW) &&
    size > minSize
  ) {
    size -= 0.5;
  }

  drawLines(page, lines, width, height, yFrac, size, font, color);
}

export async function generateCertificate(
  data:       CertData,
  overrides?: CertOverrides,
): Promise<Uint8Array> {
  const templatePath = path.join(process.cwd(), "public/uploads/certificate-template-kiez-empty.jpg");
  if (!fs.existsSync(templatePath)) {
    throw new Error("Certificate template not found at public/uploads/certificate-template-kiez-empty.jpg");
  }

  const templateBytes     = fs.readFileSync(templatePath);
const pdfDoc            = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const pngImage          = await pdfDoc.embedJpg(templateBytes);
  const { width, height } = pngImage.size();

  const page = pdfDoc.addPage([width, height]);
  page.drawImage(pngImage, { x: 0, y: 0, width, height });

  const fontBebas = await pdfDoc.embedFont(loadFont("BebasNeue-Regular.otf"));
  const fontHeiti = await pdfDoc.embedFont(loadFont("HeitiTC-Medium-latin.ttf"));

  const MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];

  // Prize / category — Bebas Neue Regular, white, in the black bar at top
  const catText = sanitizeText(overrides?.category ?? data.category.toUpperCase());
  if (overrides?.category) {
    drawOverride(page, catText, width, height,
      POS.category.yFrac, POS.category.sizeFrac, POS.category.maxWidthFrac,
      fontBebas, WHITE, overrides.categorySizeMultiplier ?? 1);
  } else {
    drawAdaptive(page, catText, width, height,
      POS.category.yFrac, POS.category.sizeFrac, POS.category.maxWidthFrac,
      fontBebas, WHITE, overrides?.categorySizeMultiplier ?? 1);
  }

  // Recipient name — Heiti TC Medium, wine red, above divider
  const nameText = sanitizeText(overrides?.name ?? data.recipientName);
  if (overrides?.name) {
    drawOverride(page, nameText, width, height,
      POS.name.yFrac, POS.name.sizeFrac, POS.name.maxWidthFrac,
      fontHeiti, WINE_RED, overrides.nameSizeMultiplier ?? 1);
  } else {
    drawAdaptive(page, nameText, width, height,
      POS.name.yFrac, POS.name.sizeFrac, POS.name.maxWidthFrac,
      fontHeiti, WINE_RED, overrides?.nameSizeMultiplier ?? 1);
  }

  // Film title — Heiti TC Medium, wine red, below divider
  const filmText = sanitizeText(overrides?.film ?? data.filmTitle);
  if (overrides?.film) {
    drawOverride(page, filmText, width, height,
      POS.filmTitle.yFrac, POS.filmTitle.sizeFrac, POS.filmTitle.maxWidthFrac,
      fontHeiti, WINE_RED, overrides.filmSizeMultiplier ?? 1);
  } else {
    drawAdaptive(page, filmText, width, height,
      POS.filmTitle.yFrac, POS.filmTitle.sizeFrac, POS.filmTitle.maxWidthFrac,
      fontHeiti, WINE_RED, overrides?.filmSizeMultiplier ?? 1);
  }

  // Date — bottom left: month (small) above year (large), Bebas Neue, black
  const monthText = MONTHS[data.month - 1].toUpperCase();
  const monthSize = height * POS.month.sizeFrac;
  const monthW    = fontBebas.widthOfTextAtSize(monthText, monthSize);
  page.drawText(monthText, {
    x:     width * POS.month.xFrac - monthW / 2,
    y:     height * POS.month.yFrac,
    size:  monthSize,
    font:  fontBebas,
    color: BLACK,
  });

  const yearText = String(data.year);
  const yearSize = height * POS.year.sizeFrac;
  const yearW    = fontBebas.widthOfTextAtSize(yearText, yearSize);
  page.drawText(yearText, {
    x:     width * POS.year.xFrac - yearW / 2,
    y:     height * POS.year.yFrac,
    size:  yearSize,
    font:  fontBebas,
    color: BLACK,
  });

  return await pdfDoc.save();
}

export function parseCertOverrides(json: string | null | undefined): CertOverrides | undefined {
  if (!json) return undefined;
  try { return JSON.parse(json) as CertOverrides; } catch { return undefined; }
}
