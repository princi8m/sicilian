import { prisma } from "@/lib/prisma";
import { saveBodyFont, saveDisplayFont } from "./actions";
import SubmitButton from "@/components/admin/SubmitButton";
export const dynamic = "force-dynamic";

const FONTS = [
  { key: "archivo",       name: "Archivo",       description: "Sicilian Film Awards brand font — strong, precise, uppercase-friendly" },
  { key: "inter",         name: "Inter",         description: "Ultra-neutral, highly readable, universal" },
  { key: "space-grotesk", name: "Space Grotesk", description: "Geometric with a technical, slightly mechanical edge" },
  { key: "barlow",        name: "Barlow",        description: "Grotesque with an industrial, functional character" },
  { key: "syne",          name: "Syne",          description: "Contemporary, geometric — popular in European arts branding" },
];

function FontPicker({
  action,
  current,
  label,
  hint,
}: {
  action: (f: FormData) => Promise<void>;
  current: string;
  label: string;
  hint: string;
}) {
  return (
    <section className="space-y-3">
      <div className="mb-4">
        <p className="text-xs font-black uppercase tracking-widest text-white/40">{label}</p>
        <p className="text-xs text-white/30 mt-1">{hint}</p>
      </div>
      <div className="border border-white/10">
        {FONTS.map((f) => {
          const isActive = current === f.key;
          return (
            <form key={f.key} action={action}>
              <input type="hidden" name="family" value={f.key} />
              <button
                type="submit"
                className={`w-full text-left px-5 py-4 flex items-center justify-between gap-6 border-b border-white/10 last:border-b-0 transition-colors ${
                  isActive ? "bg-accent/10" : "bg-panel hover:bg-white/5"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold mb-0.5 ${isActive ? "text-accent" : "text-white"}`}>
                    {f.name}
                  </p>
                  <p className="text-xs text-white/30">{f.description}</p>
                </div>
                <span className={`shrink-0 text-[0.6rem] font-black uppercase tracking-widest px-3 py-1 border ${
                  isActive ? "border-accent text-accent" : "border-white/20 text-white/30"
                }`}>
                  {isActive ? "Active" : "Select"}
                </span>
              </button>
            </form>
          );
        })}
      </div>
    </section>
  );
}

export default async function FontsPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["font_family", "font_display"] } },
  });
  const s = Object.fromEntries(settings.map((r) => [r.key, r.value]));
  const bodyFont    = s.font_family  ?? "archivo";
  const displayFont = s.font_display ?? "archivo";

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-1">Text Fonts</h1>
        <p className="text-sm text-white/50">
          Set the typeface for body text and display headings.
        </p>
      </div>

      <FontPicker
        action={saveBodyFont}
        current={bodyFont}
        label="Body font"
        hint="Used for paragraphs, labels, and general text."
      />

      <FontPicker
        action={saveDisplayFont}
        current={displayFont}
        label="Display font — headings"
        hint="Used for large titles and section headings."
      />
    </div>
  );
}
