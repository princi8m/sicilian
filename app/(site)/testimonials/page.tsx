import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const [testimonials, settings] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    prisma.siteSetting.findMany({ where: { key: { in: ["reviews_count", "reviews_stars", "filmfreeway_url"] } } }),
  ]);
  const s = Object.fromEntries(settings.map(r => [r.key, r.value]));
  const stars = parseInt(s.reviews_stars || "0", 10);

  return (
    <div>
      <section className="border-b border-rule bg-textured">
        <div className="container-x py-14">
          <Link href="/" className="text-[0.6rem] font-black tracking-[0.2em] uppercase text-text-muted hover:text-accent transition-colors">
            ← Home
          </Link>
          <h1 className="font-display text-5xl md:text-6xl uppercase leading-none tracking-tighter mt-6 mb-8">
            What<br />Filmmakers<br />Say
          </h1>

          {(s.reviews_count || stars > 0) && (
            <div className="flex flex-wrap items-center gap-6">
              {s.reviews_count && (
                <div>
                  <span className="font-display text-4xl">{s.reviews_count}</span>
                  <span className="text-text-muted text-sm font-black ml-2">reviews</span>
                </div>
              )}
              {stars > 0 && (
                <span className="text-accent text-2xl tracking-widest">{"★".repeat(stars)}</span>
              )}
              {s.filmfreeway_url && (
                <a
                  href={s.filmfreeway_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto border border-rule px-4 py-2 text-[0.6rem] font-black tracking-[0.2em] uppercase hover:bg-wine-red hover:text-white hover:border-wine-red transition-colors"
                >
                  Read on FilmFreeway ↗
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="container-x">
          {testimonials.length === 0 && (
            <p className="py-16 text-text-muted text-sm">No testimonials yet.</p>
          )}
          {testimonials.map((t, i) => (
            <div key={t.id} className={i > 0 ? "border-t border-rule" : ""}>
              <div className="py-8 flex gap-6">
                <div className="shrink-0">
                  {t.avatarPath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatarPath} alt={t.name} className="w-14 h-14 object-cover grayscale" />
                  ) : (
                    <div className="w-14 h-14 border border-rule flex items-center justify-center text-xl font-black text-text-muted bg-surface">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                    <span className="text-sm font-black uppercase tracking-tight">{t.name}</span>
                    {t.reviewedAt && (
                      <span className="text-[0.6rem] text-text-muted tracking-widest uppercase">
                        {new Date(t.reviewedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                      </span>
                    )}
                    {t.rating && (
                      <span className="text-accent text-sm ml-auto tracking-widest">{"★".repeat(t.rating)}</span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{t.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
