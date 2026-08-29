import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MONTHS } from "@/lib/session";
import WinnersAccordion from "@/components/WinnersAccordion";

export const revalidate = 3600;

export default async function WinnersIndex() {
  const editions = await prisma.edition.findMany({
    where: { published: true },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  }).catch(() => [] as Awaited<ReturnType<typeof prisma.edition.findMany>>);

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

        <WinnersAccordion years={sortedYears} />
      </div>
      </section>

    </div>
  );
}
