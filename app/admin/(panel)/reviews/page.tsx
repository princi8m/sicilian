import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteReview } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.filmReview.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { images: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Film Reviews</h1>
        <Link href="/admin/reviews/new" className="bg-wine-red text-white px-4 py-2 text-sm font-semibold hover:bg-wine-red/80 transition-colors">
          + New Review
        </Link>
      </div>

      {reviews.length === 0 && (
        <p className="text-white/50 text-sm">No reviews yet.</p>
      )}

      <div className="space-y-2">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-center gap-4 bg-panel border border-white/10 p-3">
            {r.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.coverImage} alt="" className="w-12 h-16 object-cover shrink-0 grayscale" />
            ) : (
              <div className="w-12 h-16 bg-surface border border-white/10 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black uppercase tracking-tight truncate">{r.filmTitle}</p>
              {r.director && <p className="text-xs text-white/50 mt-0.5">{r.director}</p>}
              <p className="text-xs text-white/30 mt-0.5">{r._count.images} image{r._count.images !== 1 ? "s" : ""}</p>
            </div>
            <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 shrink-0 ${r.published ? "text-green-400 bg-green-400/10" : "text-white/40 bg-white/5"}`}>
              {r.published ? "Published" : "Draft"}
            </span>
            <Link href={`/admin/reviews/${r.id}`} className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors shrink-0">
              Edit
            </Link>
            <form action={deleteReview}>
              <input type="hidden" name="id" value={r.id} />
              <button className="text-red-400 hover:text-red-300 text-lg leading-none px-1">×</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
