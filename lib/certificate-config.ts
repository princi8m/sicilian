import type { FieldLayout, FieldStyle } from "festival-engine-core";

export type CertFieldKey = "category" | "name" | "filmTitle" | "date";

// Converted from the hardcoded POS constants that lived in this file before the
// festival-engine-core migration — those measured yFrac as distance from the BOTTOM of
// the page (pdf-lib's native origin); festival-engine-core's "top" anchor measures from
// the TOP instead (yFrac_top = 1 - yFrac_bottom, an exact coordinate reframing, not a
// re-tuning — see pdf.ts). Every field here is top-anchored, unlike bif/bracciano which
// anchor from the block's vertical center.
export const CERT_DEFAULT_LAYOUT: Record<CertFieldKey, FieldLayout> = {
  category:  { anchor: "top", yFrac: 0.062, sizeFrac: 0.0547, maxWidthFrac: 0.78 }, // was yFrac 0.938 from bottom
  name:      { anchor: "top", yFrac: 0.208, sizeFrac: 0.0567, maxWidthFrac: 0.55 }, // was yFrac 0.792 from bottom
  filmTitle: { anchor: "top", yFrac: 0.407, sizeFrac: 0.0471, maxWidthFrac: 0.52 }, // was yFrac 0.593 from bottom
  date:      { anchor: "top", yFrac: 0.880, sizeFrac: 0.0300, maxWidthFrac: 0.5 },  // was yFrac 0.120 from bottom
};

const RED   = "#cc0000";
const OLIVE = "#676519";
const BLACK = "#000000";

// minSizeRatio/absMinSizeRatio/balanceThreshold are deliberately omitted here — the old
// drawAdaptive() in this file used 0.55/0.35/0.60 for every field, which are exactly
// festival-engine-core's own defaults.
export const CERT_STYLE: Record<CertFieldKey, FieldStyle> = {
  category:  { color: RED },
  name:      { color: OLIVE },
  filmTitle: { color: BLACK },
  date:      { color: RED },
};

// Font filename in public/fonts/, loaded via fs by lib/certificate.ts (the package
// itself never touches the filesystem).
export const CERT_FONTS: Record<CertFieldKey, string> = {
  category:  "EBGaramond-Bold.ttf",
  name:      "EBGaramond-Italic.ttf",
  filmTitle: "HeitiTC-Medium-latin.ttf",
  date:      "EBGaramond-Bold.ttf",
};
