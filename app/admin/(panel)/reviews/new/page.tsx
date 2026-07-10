import { createReview } from "../actions";

const inp = "w-full bg-panel border border-white/10 px-3 py-2 text-sm";

export default function NewReviewPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Film Review</h1>
      <form action={createReview} encType="multipart/form-data" className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="block col-span-2">
            <span className="text-xs text-white/60 uppercase tracking-wide">Film Title *</span>
            <input name="filmTitle" required placeholder="e.g. Limitless" className={inp + " mt-1"} />
          </label>
          <label className="block col-span-2">
            <span className="text-xs text-white/60 uppercase tracking-wide">Director</span>
            <input name="director" placeholder="Director name" className={inp + " mt-1"} />
          </label>
        </div>
        <label className="block">
          <span className="text-xs text-white/60 uppercase tracking-wide">Poster / Cover image</span>
          <input type="file" name="coverImage" accept="image/*" className="block w-full mt-1 text-sm text-white/70 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-white/20" />
        </label>
        <div className="border border-white/10 p-4 space-y-4">
          <p className="text-xs text-white/60 uppercase tracking-wide">Video (optional — either or both)</p>
          <label className="block">
            <span className="text-xs text-white/40">Upload a video file (hosted on Cloudinary)</span>
            <input type="file" name="videoFile" accept="video/*" className="block w-full mt-1 text-sm text-white/70 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-white/20" />
          </label>
          <label className="block">
            <span className="text-xs text-white/40">Or a YouTube URL</span>
            <input name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=…" className={inp + " mt-1"} />
          </label>
        </div>
        <label className="block">
          <span className="text-xs text-white/60 uppercase tracking-wide">Review text *</span>
          <textarea name="body" required rows={14} placeholder="Write the review here…" className={inp + " mt-1 resize-none"} />
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="published" className="w-4 h-4" />
          <span className="text-sm">Publish immediately</span>
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-wine-red text-white px-5 py-2 text-sm font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors">
            Create
          </button>
          <a href="/admin/reviews" className="px-5 py-2 text-sm text-white/60 hover:text-white">Cancel</a>
        </div>
      </form>
    </div>
  );
}
