import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MONTHS } from "@/lib/session";
import { removeFromCarousel } from "../editions/actions";

export const dynamic = "force-dynamic";

export default async function CarouselPage() {
  const items = await prisma.seasonImage.findMany({
    where: { featuredInCarousel: true },
    include: { edition: true },
    orderBy: [{ edition: { year: "desc" } }, { edition: { month: "desc" } }, { order: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Carousel</h1>
        <p className="text-sm text-white/40">{items.length} poster{items.length !== 1 ? "s" : ""} featured</p>
      </div>

      {items.length === 0 && (
        <p className="text-white/50 text-sm">
          No posters in the carousel yet. Open an edition and check the &ldquo;Carousel&rdquo; box on a poster.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((img) => {
          const editionLabel = img.edition.title || `${MONTHS[img.edition.month - 1]} ${img.edition.year}`;
          return (
            <div key={img.id} className="flex flex-col gap-2">
              {/* Poster */}
              <div className="aspect-[2/3] overflow-hidden bg-surface border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imagePath}
                  alt={img.caption || ""}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption */}
              <p className="text-xs font-semibold truncate text-white/80">
                {img.caption || <span className="text-white/30">No caption</span>}
              </p>

              {/* Edition link */}
              <Link
                href={`/admin/editions/${img.editionId}`}
                className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors truncate"
              >
                {editionLabel}
              </Link>

              {/* Remove */}
              <form action={removeFromCarousel}>
                <input type="hidden" name="id" value={img.id} />
                <button
                  type="submit"
                  className="w-full text-[0.6rem] font-black uppercase tracking-widest text-red-400 hover:text-red-300 py-1 border border-red-400/20 hover:border-red-300/40 transition-colors"
                >
                  Remove
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
