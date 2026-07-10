import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  const photos = await prisma.eventPhoto.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────────── */}
      {/* Dark mask over the maiolica-tile artwork, same treatment used
          across all hero banners site-wide. */}
      <section className="border-b border-rule relative overflow-hidden bg-bg min-h-[200px] md:min-h-0 md:aspect-[1500/300]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/d_photos.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center saturate-[1.12] brightness-[0.95] sepia-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent" />
          {/* Softens the hard edge where the dark navbar meets the banner */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="h-1 w-full absolute top-0 z-10 flex"><span className="flex-1 bg-wine-red" /><span className="flex-1 bg-accent" /></div>
        <div className="relative z-10 container-x min-h-[200px] md:min-h-0 md:h-full flex flex-col justify-center py-6 md:py-4">
          <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-1 md:mb-2">
            Gallery
          </p>
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-tight leading-none text-text-primary">
            Event Photos
          </h1>
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

      {/* Grid */}
      <section className="bg-textured">
        <div className="container-x py-10">
          {photos.length === 0 ? (
            <p className="text-text-muted text-sm">No photos yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {photos.map((p) => (
                <figure key={p.id} className="relative overflow-hidden bg-surface border border-rule ring-1 ring-inset ring-accent/25 group aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imagePath}
                    alt={p.caption || ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.caption && (
                    <figcaption className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {p.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
