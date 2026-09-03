import type { FieldLayout, FieldStyle } from "festival-engine-core";

export type LaurelFieldKey = "category" | "month" | "year";

const CATEGORY_TOP_FRAC = 0.414;
const MONTH_TOP_FRAC = 0.747;

// Transcribed 1:1 from the hardcoded POS constants that lived in this file before the
// festival-engine-core migration, including the derived maxBlockHeightFrac on "category"
// (so a short 2-word category rendered at full size can't bleed down into the month/year
// block).
export const LAUREL_DEFAULT_LAYOUT: Record<LaurelFieldKey, FieldLayout> = {
  category: {
    anchor: "top",
    yFrac: CATEGORY_TOP_FRAC,
    sizeFrac: 0.20,
    maxWidthFrac: 0.70,
    lineGapMult: 1.05,
    maxBlockHeightFrac: MONTH_TOP_FRAC - CATEGORY_TOP_FRAC - 0.02,
  },
  month: { anchor: "top", yFrac: MONTH_TOP_FRAC, sizeFrac: 0.044, maxWidthFrac: 0.5, lineGapMult: 1.3 },
  year:  { anchor: "top", yFrac: 0.817, sizeFrac: 0.131, maxWidthFrac: 0.55, lineGapMult: 1.1 },
};

const BLACK = "#000000";

// Matches this site's original hand-rolled thresholds (0.5 / 0.4 / 0.55) — same values
// bracciano_fest's laurel already uses, differing from festival-engine-core's certificate-
// tuned defaults (0.55 / 0.35 / 0.60).
export const LAUREL_STYLE: Record<LaurelFieldKey, FieldStyle> = {
  category: { color: BLACK, minSizeRatio: 0.5, absMinSizeRatio: 0.4, balanceThreshold: 0.55 },
  month:    { color: BLACK, minSizeRatio: 0.5, absMinSizeRatio: 0.4, balanceThreshold: 0.55 },
  year:     { color: BLACK, minSizeRatio: 0.5, absMinSizeRatio: 0.4, balanceThreshold: 0.55 },
};

export const LAUREL_FONT_FILE = "Poppins-Bold.ttf";
export const LAUREL_FONT_FAMILY = "Poppins Bold Laurel";
