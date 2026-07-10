import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateReviewSettings } from "./actions";
export const dynamic = "force-dynamic";

export default async function TestimonialsList() {
  const [testimonials, settings] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    prisma.siteSetting.findMany({ where: { key: { in: ["reviews_count", "reviews_stars", "filmfreeway_url"] } } }),
  ]);
  const s = Object.fromEntries(settings.map(r => [r.key, r.value]));
  const input = "w-full bg-panel border border-white/10 rounded px-3 py-2 text-sm";

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Link href="/admin/testimonials/new" className="px-4 py-2 rounded bg-accent text-ink font-medium text-sm">
          + New testimonial
        </Link>
      </div>

      {/* FilmFreeway aggregate settings */}
      <section>
        <h2 className="text-lg font-semibold mb-4">FilmFreeway aggregate</h2>
        <form action={updateReviewSettings} className="grid md:grid-cols-3 gap-4 bg-panel border border-white/10 rounded-lg p-5">
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Review count</span>
            <input name="reviews_count" defaultValue={s.reviews_count || ""} placeholder="105" className={input + " mt-1"} />
          </label>
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Stars (1-5)</span>
            <input name="reviews_stars" defaultValue={s.reviews_stars || ""} placeholder="5" className={input + " mt-1"} />
          </label>
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">FilmFreeway URL</span>
            <input name="filmfreeway_url" defaultValue={s.filmfreeway_url || ""} placeholder="https://filmfreeway.com/..." className={input + " mt-1"} />
          </label>
          <div className="md:col-span-3">
            <button className="px-5 py-2 rounded bg-accent text-ink font-medium text-sm">Save settings</button>
          </div>
        </form>
      </section>

      {/* List */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Testimonials ({testimonials.length})</h2>
        <div className="space-y-2">
          {testimonials.map((t) => (
            <Link
              key={t.id}
              href={`/admin/testimonials/${t.id}`}
              className="flex items-start gap-4 bg-panel border border-white/10 rounded-lg p-4 hover:border-accent"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">{t.name}</span>
                  {t.rating && <span className="text-accent text-xs">{"★".repeat(t.rating)}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded ${t.featured ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/50"}`}>
                    {t.featured ? "Featured" : "Hidden"}
                  </span>
                </div>
                <p className="text-white/50 text-xs mt-1 truncate">{t.body}</p>
              </div>
              <span className="text-white/30 text-xs shrink-0">#{t.order}</span>
            </Link>
          ))}
          {testimonials.length === 0 && (
            <p className="text-white/50 text-sm">No testimonials yet.</p>
          )}
        </div>
      </section>

    </div>
  );
}
