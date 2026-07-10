/**
 * Festival-specific configuration.
 * When cloning this project for a new festival, this is the primary file to update.
 * Also update: tailwind.config.ts (accent/star colors), public/uploads/ (logos, photos),
 * app/icon.png + app/favicon.ico, and .env (DATABASE_URL, SMTP_*, NEXTAUTH_SECRET).
 */

export const festival = {
  name: "Sicilian Film Awards",
  shortName: "SFA",
  tagline: "A Dialogue Between Sicily and the World",
  location: "Palermo, Italy",

  // TODO (confirm with Michele): primary venue — the old site only mentions
  // "Xinergie" as a past event location, not necessarily the main venue.
  venue: {
    name: "Xinergie",
    address: "Palermo, Italy",
    neighborhood: "Palermo",
  },

  contact: {
    email: "info@sicilianfilmawards.com",
    domain: "sicilianfilmawards.com",
  },

  // TODO: real Instagram/social handles unknown — old site didn't surface one.
  socials: {
    instagram: "",
    instagramHandle: "",
  },

  // TODO: confirm FilmFreeway URL for Sicilian Film Awards.
  filmfreeway: {
    submitUrl: "",
    profileUrl: "",
  },

  // TODO: unused in current codebase (Impressum is admin-editable), but if
  // wired up later this needs real Italian legal-notice fields (Codice
  // Fiscale / Partita IVA / sede legale), not the German Amtsgericht/HRB
  // shape below — that's Berlin-specific and doesn't apply to an Italian entity.
  legal: {
    operator: "",
    address: "",
    postcode: "",
    city: "Palermo",
    country: "Italy",
    email: "info@sicilianfilmawards.com",
    registergericht: "",
    registernummer: "",
    steuernummer: "",
    ustIdNr: "",
  },

  cloudinary: {
    photos: "sicilian/photos",
    posters: "sicilian/posters",
    reviewCovers: "sicilian/reviews/covers",
    reviewImages: "sicilian/reviews/images",
    reviewVideos: "sicilian/reviews/videos",
  },

  /** Tailwind design tokens — also duplicated in tailwind.config.ts (update both) */
  colors: {
    accent: "#e0b75c",
    star: "#e0b75c",
  },
};
