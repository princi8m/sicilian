import { prisma } from "@/lib/prisma";

export type FieldType = "text" | "textarea";

export interface ContentField {
  key: string;
  label: string;
  defaultValue: string;
  type: FieldType;
}

export interface ContentSection {
  section: string;
  fields: ContentField[];
}

export const CONTENT_REGISTRY: ContentSection[] = [
  {
    section: "Home — Hero",
    fields: [
      { key: "home_hero_tagline",  label: "Tagline / sub-heading", defaultValue: "A Dialogue Between Sicily and the World", type: "text" },
      { key: "home_hero_location", label: "Location line",         defaultValue: "Palermo, Italy · Independent Cinema",     type: "text" },
    ],
  },
  {
    section: "Home — Mission",
    fields: [
      { key: "home_mission_heading", label: "Heading",   defaultValue: "A dialogue between\nSicily and the world.",                                                                                                                                                                                                               type: "textarea" },
      { key: "home_mission_body",    label: "Body text", defaultValue: "The Sicilian Film Awards celebrates independent cinema in Palermo, bringing diverse international voices to the island. We welcome films from makers at every stage of their career, from any country and in any language, judged on vision and craft alone.", type: "textarea" },
    ],
  },
  {
    section: "Home — Enter the Festival",
    fields: [
      { key: "home_enter_heading", label: "Heading",     defaultValue: "Enter the Festival",                                                                          type: "text"     },
      { key: "home_enter_body",    label: "Body text",   defaultValue: "Short films, features, documentaries and experimental works welcome. Submit through FilmFreeway.", type: "textarea" },
      { key: "home_enter_cta",     label: "Button text", defaultValue: "Submit on FilmFreeway →",                                                                       type: "text"     },
    ],
  },
  {
    section: "Contact page",
    fields: [
      { key: "contact_heading",  label: "Heading",          defaultValue: "Contact",                                                                                                              type: "text"     },
      { key: "contact_body_1",   label: "First paragraph",  defaultValue: "We are always happy to hear from filmmakers, industry professionals, and anyone who loves independent cinema.",        type: "textarea" },
      { key: "contact_body_2",   label: "Second paragraph", defaultValue: "We aim to respond to all enquiries within one working day.",                                                           type: "textarea" },
    ],
  },
  {
    section: "Submissions page",
    fields: [
      { key: "submissions_heading", label: "Heading",         defaultValue: "Enter the Festival",                                                                                                                                       type: "text"     },
      { key: "submissions_body",    label: "Intro paragraph", defaultValue: "Short films, features, documentaries and experimental works welcome. Every form. Every voice. Winners announced monthly.", type: "textarea" },
    ],
  },
  {
    section: "Selection & Awards page",
    fields: [
      { key: "winners_heading", label: "Heading", defaultValue: "Selection & Awards", type: "text" },
      { key: "winners_eyebrow", label: "Eyebrow", defaultValue: "Archive",            type: "text" },
    ],
  },
  {
    section: "Photos page",
    fields: [
      { key: "photos_heading", label: "Heading", defaultValue: "Festival Moments", type: "text" },
      { key: "photos_eyebrow", label: "Eyebrow", defaultValue: "Gallery",          type: "text" },
    ],
  },
  {
    section: "Reviews page",
    fields: [
      { key: "reviews_page_heading", label: "Heading", defaultValue: "Film Reviews", type: "text" },
    ],
  },
  {
    section: "Dates & Deadlines page",
    fields: [
      { key: "dates_intro", label: "Intro paragraph", defaultValue: "Upcoming screenings, award nights, and submission deadlines for the Sicilian Film Awards.", type: "textarea" },
    ],
  },
];

const DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_REGISTRY.flatMap(s => s.fields).map(f => [f.key, f.defaultValue])
);

const ALL_KEYS = CONTENT_REGISTRY.flatMap(s => s.fields.map(f => f.key));

export async function getContent(): Promise<(key: string) => string> {
  let raw: Record<string, string> = {};
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: ALL_KEYS } } });
    raw = Object.fromEntries(rows.map(r => [r.key, r.value]));
  } catch {
    // DB unreachable — use defaults
  }
  return (key: string) => raw[key] ?? DEFAULTS[key] ?? "";
}
