import { prisma } from "@/lib/prisma";
import { CONTENT_REGISTRY } from "@/lib/content";
import { saveSection } from "./actions";
import SubmitButton from "@/components/admin/SubmitButton";
export const dynamic = "force-dynamic";

const inp      = "w-full bg-[#0b0b0b] border border-white/10 px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30";
const inpLabel = "block text-[0.6rem] font-bold uppercase tracking-widest text-white/40 mb-1.5";

export default async function ContentPage() {
  const allKeys = CONTENT_REGISTRY.flatMap(s => s.fields.map(f => f.key));
  let stored: Record<string, string> = {};
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: allKeys } } });
    stored = Object.fromEntries(rows.map(r => [r.key, r.value]));
  } catch {
    // DB unreachable — forms will show registry defaults
  }

  return (
    <div className="max-w-2xl space-y-12">
      <div>
        <h1 className="text-2xl font-bold mb-1">Site Content</h1>
        <p className="text-sm text-white/50">
          Edit text shown on the public site. Each section saves independently.
        </p>
      </div>

      {CONTENT_REGISTRY.map((s) => (
        <section key={s.section} className="space-y-5">
          <div className="border-b border-white/10 pb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">{s.section}</p>
          </div>

          <form action={saveSection} className="space-y-5">
            {s.fields.map((f) => (
              <div key={f.key}>
                <label className={inpLabel}>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    name={f.key}
                    defaultValue={stored[f.key] ?? f.defaultValue}
                    rows={f.defaultValue.length > 120 ? 4 : 2}
                    className={inp + " resize-y"}
                  />
                ) : (
                  <input
                    type="text"
                    name={f.key}
                    defaultValue={stored[f.key] ?? f.defaultValue}
                    className={inp}
                  />
                )}
              </div>
            ))}

            <SubmitButton className="px-5 py-2 bg-wine-red text-white text-xs font-black uppercase tracking-widest hover:bg-wine-red/80">
              Save section
            </SubmitButton>
          </form>
        </section>
      ))}
    </div>
  );
}
