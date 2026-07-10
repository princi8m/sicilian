import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MONTHS } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function WinnersIndex({
  searchParams,
}: {
  searchParams: { open?: string };
}) {
  const editions = await prisma.edition.findMany({
    where: { published: true },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  const openYear = searchParams.open ? parseInt(searchParams.open, 10) : null;

  const byYear = new Map<number, typeof editions>();
  for (const e of editions) {
    if (!byYear.has(e.year)) byYear.set(e.year, []);
    byYear.get(e.year)!.push(e);
  }

  const sortedYears = [...byYear.entries()].sort(([a], [b]) => b - a);
  const latestEdition = editions[0];

  return (
    <div>

      {/* ── HERO ───────────────────────────────────────────────── */}
      {/* Dark mask over the maiolica-tile artwork, same treatment used
          across all hero banners site-wide. */}
      <section className="border-b border-rule relative overflow-hidden bg-bg min-h-[300px] md:min-h-0 md:aspect-[1500/300]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/d_winners.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center saturate-[1.12] brightness-[0.95] sepia-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent" />
          {/* Softens the hard edge where the dark navbar meets the banner */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="h-1 w-full absolute top-0 z-10 flex"><span className="flex-1 bg-wine-red" /><span className="flex-1 bg-accent" /></div>
        <div className="relative z-10 container-x min-h-[300px] md:min-h-0 md:h-full flex flex-col justify-center py-8 md:py-4 max-w-full">
          <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-1 md:mb-2">Archive</p>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight leading-none mb-2 md:mb-3 text-text-primary">
            Winners
          </h1>
          <p className="text-sm text-text-muted max-w-xs md:max-w-sm leading-relaxed mb-3 md:mb-4">
            Every edition, every laureate. Browse the full archive of Sicilian Film Awards winners from {editions[editions.length - 1]?.year ?? 2024} to today.
          </p>
          <div className="flex gap-6 md:gap-8">
            <div>
              <p className="font-display text-2xl md:text-3xl text-accent leading-none">{editions.length}</p>
              <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-text-muted mt-1">Editions</p>
            </div>
            <div>
              <p className="font-display text-2xl md:text-3xl text-accent leading-none">{sortedYears.length}</p>
              <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-text-muted mt-1">Years</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DECORATIVE BORDER STRIP ─────────────────────────────── */}
      <div
        className="border-b border-rule bg-bg h-16"
        style={{
          backgroundImage: "url(/uploads/decor/border-strip.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* ── LATEST EDITION HIGHLIGHT ───────────────────────────── */}
      {latestEdition && (
        <section className="border-b border-rule">
          <div className="container-x py-3 flex items-center gap-4">
            <span className="text-[0.55rem] font-black uppercase tracking-[0.25em] text-text-muted shrink-0">Latest</span>
            <div className="flex-1 h-px bg-rule" />
            <Link
              href={`/winners/${latestEdition.year}/${latestEdition.month}`}
              className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-accent hover:text-white transition-colors"
            >
              {latestEdition.title || `${MONTHS[(latestEdition.month ?? 1) - 1]} ${latestEdition.year}`}
              <span>→</span>
            </Link>
          </div>
        </section>
      )}

      {/* ── EDITIONS BY YEAR ───────────────────────────────────── */}
      <section className="bg-textured">
      <div className="container-x py-12 space-y-0">
        {editions.length === 0 && (
          <p className="text-text-muted text-sm">No editions published yet.</p>
        )}

        {sortedYears.map(([year, list], yi) => {
          const isOpen = openYear === year || (openYear === null && yi === 0);
          return (
            <div key={year} className="border-b border-rule last:border-b-0">

              {/* Year header */}
              <div className="flex items-center gap-6 py-5">
                <Link
                  href={isOpen && openYear !== null ? "/winners" : `/winners?open=${year}`}
                  className="group flex items-center gap-4 flex-1 min-w-0"
                >
                  <span className="font-display text-4xl text-accent group-hover:text-white transition-colors leading-none shrink-0">
                    {year}
                  </span>
                  <span className="text-[0.55rem] font-black uppercase tracking-[0.25em] text-text-muted group-hover:text-accent transition-colors">
                    {list.length} edition{list.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex-1 h-px bg-rule hidden sm:block" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/uploads/decor/motif-diamond-tile.png" alt="" aria-hidden="true" className="hidden sm:block w-6 h-6 object-contain opacity-60 shrink-0" />
                  <span className="text-text-muted text-xs font-black shrink-0">
                    {isOpen ? "↑" : "↓"}
                  </span>
                </Link>
              </div>

              {/* Editions grid */}
              {isOpen && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-6">
                  {list.map((e, ei) => (
                    <Link
                      key={e.id}
                      href={`/winners/${e.year}/${e.month}`}
                      className={`relative bg-bg border-t border-rule p-5 group hover:bg-accent/5 transition-colors flex flex-col gap-3 ${
                        ei < list.length - 1 ? "border-r" : ""
                      }`}
                    >
                      <div>
                        <p className="text-[0.5rem] font-black tracking-[0.3em] text-accent/60 uppercase mb-1">{e.year}</p>
                        <p className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">
                          {e.title || MONTHS[(e.month ?? 1) - 1]}
                        </p>
                      </div>
                      <span className="text-[0.55rem] font-black tracking-[0.2em] text-text-muted uppercase group-hover:text-accent transition-colors mt-auto">
                        View →
                      </span>
                      {ei < list.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="hidden sm:block absolute top-1/2 -right-[3px] -translate-y-1/2 w-[6px] h-[6px] rotate-45 bg-wine-red z-10"
                        />
                      )}
                    </Link>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>
      </section>

    </div>
  );
}
