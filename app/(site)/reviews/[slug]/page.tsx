import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { youtubeEmbedUrl } from "@/lib/youtube";

export const revalidate = 86400;

// Pre-render every published review at build time from a single batched query (not one
// query per page) so every review page ships as real static HTML on every deploy — no
// page is ever generated cold from a live visitor/bot hit. Build-time parallelism is capped
// via `experimental.cpus` in next.config.mjs so this can't reopen the DB-connection-exhaustion
// issue that broke a BIF deploy previously. dynamicParams stays at its default (true) as a
// fallback for anything published between deploys.
export async function generateStaticParams() {
  const reviews = await prisma.filmReview.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return reviews.map((r) => ({ slug: r.slug }));
}

export default async function ReviewDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Reject malformed slugs (bot probes like /reviews/.env) before touching the DB.
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(slug)) notFound();
  const r = await prisma.filmReview.findFirst({
    where: { slug, published: true },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!r) notFound();

  const embedUrl = r.youtubeUrl ? youtubeEmbedUrl(r.youtubeUrl) : null;

  return (
    <div className="bg-textured">
    <article className="container-x py-16">
      {/* Back link */}
      <Link
        href="/reviews"
        className="inline-block text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-accent transition-colors mb-10"
      >
        ← Film Reviews
      </Link>

      {/* Title block */}
      <div className="border-b border-rule pb-8 mb-12">
        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight leading-none mb-3">
          {r.filmTitle}
        </h1>
        {r.director && (
          <p className="text-sm text-text-muted uppercase tracking-widest">
            dir. {r.director}
          </p>
        )}
      </div>

      {/* Video */}
      {(r.videoUrl || embedUrl) && (
        <div className="border border-rule mb-12 bg-black">
          {r.videoUrl ? (
            <video src={r.videoUrl} controls className="w-full max-h-[70vh]" />
          ) : embedUrl ? (
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title={`${r.filmTitle} — video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : null}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-px bg-rule">
        {/* Left column: poster + stills */}
        <div className="bg-bg flex flex-col gap-px">
          {r.coverImage && (
            <div className="aspect-[2/3] overflow-hidden bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.coverImage}
                alt={r.filmTitle}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {r.images.length > 0 && (
            <div className="flex flex-col gap-px bg-rule mt-px">
              {r.images.map((img) => (
                <div key={img.id} className="bg-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imagePath}
                    alt={img.caption || ""}
                    className="w-full object-cover"
                  />
                  {img.caption && (
                    <p className="text-[0.65rem] text-text-muted px-3 py-1.5 uppercase tracking-widest">
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: review text */}
        <div className="bg-bg p-8 md:p-10">
          <div className="prose prose-invert prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
            {r.body}
          </div>
        </div>
      </div>
    </article>
    </div>
  );
}
