import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ReviewRequestModal from "@/components/ReviewRequestModal";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1") || 1);

  const [reviews, total] = await Promise.all([
    prisma.filmReview.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.filmReview.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const featured = reviews[0];
  const rest = reviews.slice(1);

  return (
    <div>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="border-b border-rule bg-textured-surface">
        <div className="h-1 w-full flex"><span className="flex-1 bg-wine-red" /><span className="flex-1 bg-accent" /></div>
        <div className="container-x py-14 md:py-18">
          <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-4">Editorial</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight leading-none mb-4">
            Film<br />Reviews
          </h1>
          <p className="text-sm text-text-muted max-w-lg leading-relaxed">
            Independent cinema, reviewed. Our editorial team writes about the films that pass through the festival — a critical perspective for filmmakers and audiences alike.
          </p>
        </div>
      </section>

      {reviews.length === 0 && (
        <div className="container-x py-20 text-center">
          <p className="text-text-muted text-sm">No reviews published yet.</p>
          <ReviewRequestModal />
        </div>
      )}

      {reviews.length > 0 && (
        <>
          {/* ── FEATURED REVIEW ──────────────────────────────────── */}
          {featured && page === 1 && (
            <section className="border-b border-rule">
              <Link
                href={`/reviews/${featured.slug}`}
                className="group grid grid-cols-1 md:grid-cols-[320px_1fr] gap-px bg-rule hover:bg-rule transition-colors"
              >
                {/* Poster */}
                <div className="aspect-[2/3] md:aspect-auto bg-black overflow-hidden relative min-h-[320px]">
                  {featured.coverImage ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={featured.coverImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-40" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={featured.coverImage} alt={featured.filmTitle} className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    </>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-text-muted uppercase tracking-widest">No poster</span>
                  )}
                  {(featured.videoUrl || featured.youtubeUrl) && (
                    <span className="absolute top-3 right-3 z-10 bg-wine-red text-white text-[0.6rem] font-black uppercase tracking-widest px-2 py-1 flex items-center gap-1">
                      ▶ Video
                    </span>
                  )}
                </div>
                {/* Text */}
                <div className="bg-bg p-8 md:p-12 flex flex-col justify-end gap-4">
                  <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase">Featured review</p>
                  <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">
                    {featured.filmTitle}
                  </h2>
                  {featured.director && (
                    <p className="text-sm text-text-muted">dir. {featured.director}</p>
                  )}
                  {featured.body && (
                    <p className="text-sm text-text-muted leading-relaxed max-w-lg line-clamp-3">
                      {featured.body.replace(/<[^>]*>/g, "").slice(0, 200)}
                    </p>
                  )}
                  <span className="text-xs font-black uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors mt-2">
                    Read review →
                  </span>
                </div>
              </Link>
            </section>
          )}

          {/* ── REVIEWS GRID ─────────────────────────────────────── */}
          {rest.length > 0 && (
            <section className="border-b border-rule">
              <div className="container-x py-10">
                {page === 1 && (
                  <p className="text-[0.6rem] font-black tracking-[0.25em] text-text-muted uppercase mb-6">More reviews</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {(page === 1 ? rest : reviews).map((r) => (
                    <Link
                      key={r.id}
                      href={`/reviews/${r.slug}`}
                      className="group bg-bg border border-rule flex flex-col overflow-hidden hover:bg-surface transition-colors"
                    >
                      <div className="aspect-[2/3] overflow-hidden relative bg-black">
                        {r.coverImage ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={r.coverImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-50" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={r.coverImage} alt={r.filmTitle} className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                          </>
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-text-muted uppercase tracking-widest">No poster</span>
                        )}
                        {(r.videoUrl || r.youtubeUrl) && (
                          <span className="absolute top-2 right-2 z-10 bg-wine-red text-white text-[0.55rem] font-black uppercase tracking-widest px-1.5 py-0.5">
                            ▶
                          </span>
                        )}
                      </div>
                      <div className="p-4 border-t border-rule flex-1 flex flex-col gap-1">
                        <p className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">
                          {r.filmTitle}
                        </p>
                        {r.director && (
                          <p className="text-xs text-text-muted">dir. {r.director}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── PAGINATION ───────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="container-x py-8 flex items-center justify-between">
              <span className="text-xs text-text-muted uppercase tracking-widest">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-px bg-rule">
                {page > 1 ? (
                  <Link href={`/reviews?page=${page - 1}`} className="bg-bg px-5 py-2 text-xs font-black uppercase tracking-widest hover:bg-surface hover:text-accent transition-colors">
                    ← Prev
                  </Link>
                ) : (
                  <span className="bg-surface px-5 py-2 text-xs font-black uppercase tracking-widest text-text-muted opacity-40 cursor-not-allowed">← Prev</span>
                )}
                {page < totalPages ? (
                  <Link href={`/reviews?page=${page + 1}`} className="bg-bg px-5 py-2 text-xs font-black uppercase tracking-widest hover:bg-surface hover:text-accent transition-colors">
                    Next →
                  </Link>
                ) : (
                  <span className="bg-surface px-5 py-2 text-xs font-black uppercase tracking-widest text-text-muted opacity-40 cursor-not-allowed">Next →</span>
                )}
              </div>
            </div>
          )}

          <ReviewRequestModal />
        </>
      )}

    </div>
  );
}
