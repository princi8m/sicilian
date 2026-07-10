import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateReview, addReviewImage, deleteReviewImage } from "../actions";

export const dynamic = "force-dynamic";

const inp = "w-full bg-panel border border-white/10 px-3 py-2 text-sm";

export default async function EditReviewPage({ params }: { params: { id: string } }) {
  const review = await prisma.filmReview.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!review) notFound();

  return (
    <div className="max-w-2xl space-y-12">
      <div className="flex items-center justify-between">
        <Link href="/admin/reviews" className="text-sm text-white/60">← All reviews</Link>
        {review.published && (
          <Link href={`/reviews/${review.slug}`} className="text-sm text-accent" target="_blank">
            View public page ↗
          </Link>
        )}
      </div>

      {/* Edit form */}
      <section>
        <h1 className="text-2xl font-bold mb-5">{review.filmTitle}</h1>
        <form action={updateReview} encType="multipart/form-data" className="space-y-5">
          <input type="hidden" name="id" value={review.id} />
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Film Title *</span>
            <input name="filmTitle" defaultValue={review.filmTitle} required className={inp + " mt-1"} />
          </label>
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Director</span>
            <input name="director" defaultValue={review.director || ""} className={inp + " mt-1"} />
          </label>
          <div>
            <span className="text-xs text-white/60 uppercase tracking-wide block mb-1">Poster / Cover</span>
            {review.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={review.coverImage} alt="" className="w-24 h-32 object-cover mb-2 border border-white/10" />
            )}
            <input type="file" name="coverImage" accept="image/*" className="block w-full text-sm text-white/70 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-white/20" />
          </div>
          <div className="border border-white/10 p-4 space-y-4">
            <p className="text-xs text-white/60 uppercase tracking-wide">Video (optional — either or both)</p>
            {review.videoUrl && (
              <div className="space-y-2">
                <video src={review.videoUrl} controls className="w-full max-w-xs border border-white/10" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="removeVideo" className="w-4 h-4" />
                  <span className="text-xs text-red-400">Remove uploaded video</span>
                </label>
              </div>
            )}
            <label className="block">
              <span className="text-xs text-white/40">{review.videoUrl ? "Replace video file" : "Upload a video file (hosted on Cloudinary)"}</span>
              <input type="file" name="videoFile" accept="video/*" className="block w-full mt-1 text-sm text-white/70 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-white/20" />
            </label>
            <label className="block">
              <span className="text-xs text-white/40">Or a YouTube URL</span>
              <input name="youtubeUrl" defaultValue={review.youtubeUrl || ""} placeholder="https://www.youtube.com/watch?v=…" className={inp + " mt-1"} />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Review text *</span>
            <textarea name="body" defaultValue={review.body} required rows={16} className={inp + " mt-1 resize-none"} />
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="published" defaultChecked={review.published} className="w-4 h-4" />
            <span className="text-sm">Published</span>
          </label>
          <button type="submit" className="bg-wine-red text-white px-5 py-2 text-sm font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors">
            Save
          </button>
        </form>
      </section>

      {/* Additional images */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest mb-3 border-b border-rule pb-2">
          Additional Images
        </h2>
        <p className="text-xs text-white/40 mb-4">Film stills, behind-the-scenes, etc. Shown alongside the review.</p>

        {review.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
            {review.images.map((img) => (
              <div key={img.id} className="flex flex-col gap-1.5">
                <div className="aspect-[2/3] overflow-hidden bg-surface border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imagePath} alt={img.caption || ""} className="w-full h-full object-cover" />
                </div>
                {img.caption && <p className="text-[0.55rem] text-white/50 truncate">{img.caption}</p>}
                <form action={deleteReviewImage}>
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="reviewId" value={review.id} />
                  <button className="w-full text-[0.6rem] font-black uppercase tracking-wide text-red-400 hover:text-red-300 py-0.5 transition-colors">
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        <form action={addReviewImage} encType="multipart/form-data" className="flex flex-col sm:flex-row gap-3 bg-panel/50 border border-white/10 p-4">
          <input type="hidden" name="reviewId" value={review.id} />
          <label className="flex-1">
            <span className="text-xs text-white/60 block mb-1">Images (multiple)</span>
            <input type="file" name="files" accept="image/*" multiple required className="block w-full text-sm text-white/70 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-white/20" />
          </label>
          <label className="flex-1">
            <span className="text-xs text-white/60 block mb-1">Caption (optional)</span>
            <input name="caption" placeholder="Applies to all uploaded" className={inp} />
          </label>
          <div className="flex items-end">
            <button className="px-4 py-2 bg-wine-red text-white text-sm font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors whitespace-nowrap">
              Upload
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
