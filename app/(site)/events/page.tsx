import { prisma } from "@/lib/prisma";
import { festival } from "@/lib/festival";

export const dynamic = "force-dynamic";

// TODO: this page previously carried a deep history of Kino Babylon (Berlin's
// venue) with real archival photos — that content is Berlin-specific and has
// been removed rather than faked for a Sicilian venue. Once a confirmed
// Palermo venue with real photos/history is available, this page should get
// the same treatment (a proper venue story), not just this data-driven list.

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EventsPage() {
  const events = await prisma.eventDate.findMany({
    where: { type: { not: "DEADLINE" } },
    orderBy: { startsAt: "desc" },
  });

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.startsAt) >= now).reverse();
  const past = events.filter((e) => new Date(e.startsAt) < now);

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="border-b border-rule bg-textured-surface">
        <div className="container-x py-16 md:py-20">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-accent mb-3">Events</p>
          <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tight leading-none mb-3">
            Screenings & Ceremonies
          </h1>
          <p className="text-sm text-text-muted uppercase tracking-widest">{festival.location}</p>
        </div>
      </section>

      {/* ── UPCOMING ───────────────────────────────────────────── */}
      <section className="border-b border-rule">
        <div className="container-x py-12">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-accent mb-6">Upcoming</p>
          {upcoming.length === 0 ? (
            <p className="text-sm text-text-muted">Nothing scheduled yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {upcoming.map((e) => (
                <div key={e.id} className="bg-bg border border-rule p-6 flex flex-col gap-1.5">
                  <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-accent">
                    {formatDate(e.startsAt)}
                  </p>
                  <p className="text-sm font-black uppercase tracking-tight leading-tight">{e.title}</p>
                  {e.location && <p className="text-xs text-text-muted">{e.location}</p>}
                  {e.description && <p className="text-xs text-text-muted mt-1 leading-relaxed">{e.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PAST ───────────────────────────────────────────────── */}
      {past.length > 0 && (
        <section>
          <div className="container-x py-12">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-text-muted mb-6">Past events</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {past.map((e) => (
                <div key={e.id} className="bg-bg border border-rule p-6 flex flex-col gap-1.5 opacity-70">
                  <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted">
                    {formatDate(e.startsAt)}
                  </p>
                  <p className="text-sm font-black uppercase tracking-tight leading-tight">{e.title}</p>
                  {e.location && <p className="text-xs text-text-muted">{e.location}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
