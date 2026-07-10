import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MONTHS_SHORT = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function dateParts(d: Date) {
  const date = new Date(d);
  return {
    day: date.getDate(),
    month: MONTHS_SHORT[date.getMonth()],
    year: date.getFullYear(),
  };
}

function formatFull(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

function DateBadge({ date, accentClass }: { date: Date; accentClass: string }) {
  const { day, month, year } = dateParts(date);
  return (
    <div className="shrink-0 w-24 md:w-28 border-r border-rule flex flex-col items-center justify-center py-6 gap-0.5">
      <p className={`font-display text-4xl md:text-5xl leading-none ${accentClass}`}>{day}</p>
      <p className="text-[0.6rem] font-black tracking-[0.2em] text-text-muted uppercase mt-1">{month}</p>
      <p className="text-[0.6rem] font-mono text-text-muted/70">{year}</p>
    </div>
  );
}

export default async function DatesPage() {
  const [dates, settings] = await Promise.all([
    prisma.eventDate.findMany({ orderBy: { startsAt: "asc" } }),
    prisma.siteSetting.findMany({ where: { key: "dates_intro" } }),
  ]);

  const intro = settings[0]?.value ?? "The current entry for the Sicilian Film Awards is now open.";
  const now = new Date();
  const deadlines = dates.filter((d) => d.type === "DEADLINE");
  const events    = dates.filter((d) => d.type !== "DEADLINE");

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────────── */}
      {/* Dark mask over the maiolica-tile artwork, same treatment used
          across all hero banners site-wide. */}
      <section className="border-b border-rule relative overflow-hidden bg-bg min-h-[260px] md:min-h-0 md:aspect-[1500/300]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/d_dates.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center saturate-[1.12] brightness-[0.95] sepia-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent" />
          {/* Softens the hard edge where the dark navbar meets the banner */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="h-1 w-full absolute top-0 z-10 flex"><span className="flex-1 bg-wine-red" /><span className="flex-1 bg-accent" /></div>
        <div className="relative z-10 container-x min-h-[260px] md:min-h-0 md:h-full flex flex-col justify-center py-8 md:py-4 max-w-full">
          <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-1 md:mb-2">
            Schedule
          </p>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight leading-none mb-2 md:mb-3 text-text-primary">
            Dates &amp; Deadlines
          </h1>
          <p className="text-sm text-text-muted max-w-xs md:max-w-sm leading-relaxed">
            {intro}
          </p>
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

      <section className="bg-textured">
      <div className="container-x py-14 space-y-16">

        {dates.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uploads/decor/motif-laurel.png" alt="" aria-hidden="true" className="w-16 h-16 object-contain opacity-60" />
            <p className="text-text-muted text-sm">Nothing scheduled yet — check back soon.</p>
          </div>
        )}

        {/* Deadlines */}
        {deadlines.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uploads/decor/motif-diamond-tile.png" alt="" aria-hidden="true" className="w-7 h-7 object-contain opacity-70" />
              <p className="text-xs font-black tracking-[0.25em] text-text-muted uppercase">
                Dates &amp; Deadlines
              </p>
            </div>
            <div className="border border-rule divide-y divide-rule">
              {deadlines.map((d) => {
                const past = new Date(d.startsAt) < now;
                return (
                  <div key={d.id} className={`flex ${past ? "opacity-40" : ""}`}>
                    <DateBadge date={d.startsAt} accentClass="text-accent" />
                    <div className="flex-1 px-6 md:px-8 py-6 flex flex-col justify-center gap-1.5">
                      <p className="text-lg md:text-xl font-black uppercase tracking-tight text-text-primary">{d.title}</p>
                      {d.description && (
                        <p className="text-sm text-text-muted leading-relaxed max-w-xl">{d.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {deadlines.length > 0 && events.length > 0 && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uploads/decor/flourish-divider.png" alt="" aria-hidden="true" className="h-7 w-auto opacity-70" />
          </div>
        )}

        {/* Events */}
        {events.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uploads/decor/motif-laurel.png" alt="" aria-hidden="true" className="w-8 h-8 object-contain opacity-70" />
              <p className="text-xs font-black tracking-[0.25em] text-text-muted uppercase">
                Events
              </p>
            </div>
            <div className="border border-rule divide-y divide-rule">
              {events.map((d) => {
                const past = new Date(d.startsAt) < now;
                return (
                  <div key={d.id} className={`flex ${past ? "opacity-40" : ""}`}>
                    <DateBadge date={d.startsAt} accentClass="text-star" />
                    <div className="flex-1 px-6 md:px-8 py-6 flex flex-col justify-center gap-1.5">
                      <p className="text-lg md:text-xl font-black uppercase tracking-tight text-text-primary">{d.title}</p>
                      {(d.endsAt || d.location) && (
                        <p className="text-xs text-text-muted uppercase tracking-wide">
                          {d.endsAt && <>Through {formatFull(d.endsAt)}</>}
                          {d.endsAt && d.location && " · "}
                          {d.location}
                        </p>
                      )}
                      {d.description && (
                        <p className="text-sm text-text-muted leading-relaxed max-w-xl">{d.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
      </section>
    </div>
  );
}
