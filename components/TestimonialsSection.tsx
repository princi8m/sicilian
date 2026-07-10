import Link from "next/link";

type Testimonial = {
  id: string; name: string; avatarPath: string | null;
  body: string; rating: number | null; reviewedAt: Date | null;
};

type Props = {
  testimonials: Testimonial[];
  settings: Record<string, string>;
};

export default function TestimonialsSection({ testimonials, settings }: Props) {
  if (!testimonials.length) return null;

  const count = settings.reviews_count || "";
  const stars = parseInt(settings.reviews_stars || "0", 10);
  const ffUrl = settings.filmfreeway_url || "";

  return (
    <section className="border-b border-rule">

      {/* Cinematic photo divider — no text overlay */}
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/biff-cover2c.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover grayscale"
        />
      </div>

      {/* Testimonials body */}
      <div className="bg-[#0e0e0e]">
        <div className="container-x py-10">

          {/* Section header below the photo */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-7 border-b border-rule">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-accent" />
                <span className="text-[0.55rem] font-black tracking-[0.3em] text-accent uppercase">
                  From the Filmmakers
                </span>
              </div>
              <h2 className="font-display text-2xl uppercase tracking-tight text-text-primary leading-none">
                What Filmmakers Say
              </h2>
            </div>
            {(count || stars > 0) && (
              <div className="flex items-end gap-5">
                {stars > 0 && (
                  <span className="text-star text-sm tracking-widest leading-none">
                    {"★".repeat(stars)}
                  </span>
                )}
                {count && (
                  <div className="text-right leading-none">
                    <span className="font-display block text-2xl">{count}</span>
                    <span className="text-[0.55rem] font-black tracking-[0.2em] text-text-muted uppercase">
                      reviews
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2-col grid separated by 1px rule lines */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-[#0e0e0e] border border-rule p-7 relative overflow-hidden">
                {/* Faint quote watermark */}
                <span
                  aria-hidden="true"
                  className="absolute -top-2 right-4 text-[6rem] font-black leading-none text-white/[0.04] select-none pointer-events-none"
                >
                  &ldquo;
                </span>

                <div className="flex gap-4 relative z-10">
                  <div className="shrink-0">
                    {t.avatarPath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.avatarPath}
                        alt={t.name}
                        className="w-10 h-10 object-cover grayscale"
                      />
                    ) : (
                      <div className="w-10 h-10 border border-rule bg-surface flex items-center justify-center text-sm font-black text-text-muted">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                      <span className="text-[0.65rem] font-black uppercase tracking-wider text-text-primary">
                        {t.name}
                      </span>
                      {t.reviewedAt && (
                        <span className="text-[0.55rem] text-text-muted tracking-widest uppercase">
                          {new Date(t.reviewedAt).toLocaleDateString("en-GB", {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {t.rating && (
                        <span className="text-star text-xs tracking-widest ml-auto">
                          {"★".repeat(t.rating)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">{t.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer bar */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-rule">
            <Link
              href="/testimonials"
              className="text-[0.6rem] font-black tracking-[0.2em] uppercase text-text-muted hover:text-accent transition-colors"
            >
              View More →
            </Link>
            {ffUrl && (
              <a
                href={ffUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-rule px-4 py-2 text-[0.6rem] font-black tracking-[0.2em] uppercase hover:bg-wine-red hover:text-white hover:border-wine-red transition-colors"
              >
                Read on FilmFreeway ↗
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
