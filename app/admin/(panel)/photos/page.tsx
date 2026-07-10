import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePhoto, saveAllFeatured, movePhoto } from "./actions";
import SubmitButton from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
  const photos = await prisma.eventPhoto.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Photos</h1>
        <Link
          href="/admin/photos/new"
          className="bg-wine-red text-white px-4 py-2 text-sm font-semibold hover:bg-wine-red/80 transition-colors"
        >
          + Upload Photo
        </Link>
      </div>

      {photos.length === 0 && (
        <p className="text-white/50 text-sm">No photos yet. Upload one to get started.</p>
      )}

      {photos.length > 0 && (
        <>
          {/*
            Single form for all featured toggles — uses HTML `form` attribute
            so checkboxes outside this element can still be associated with it.
          */}
          <form id="featured-form" action={saveAllFeatured}>
            {photos.map((p) => (
              <input key={p.id} type="hidden" name="photoId" value={p.id} />
            ))}
          </form>

          <div className="space-y-2">
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className="flex items-center gap-4 bg-white/5 border border-white/10 p-3"
              >
                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imagePath}
                  alt={photo.caption || ""}
                  className="w-20 h-14 object-cover shrink-0 grayscale"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {photo.caption || <span className="text-white/40">No caption</span>}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">Order: {photo.order}</p>
                </div>

                {/* Featured checkbox — associated with featured-form via form attr */}
                <label className="flex flex-col items-center gap-1 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    name={`featured_${photo.id}`}
                    form="featured-form"
                    defaultChecked={photo.featuredOnHome}
                    className="w-4 h-4"
                  />
                  <span className="text-[0.6rem] font-black uppercase tracking-wide text-white/50">
                    Home
                  </span>
                </label>

                {/* Reorder */}
                <div className="flex flex-col gap-1 shrink-0">
                  <form action={movePhoto}>
                    <input type="hidden" name="id" value={photo.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={i === 0}
                      className="block px-2 py-0.5 text-xs bg-white/10 hover:bg-white/20 disabled:opacity-20"
                    >
                      ↑
                    </button>
                  </form>
                  <form action={movePhoto}>
                    <input type="hidden" name="id" value={photo.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={i === photos.length - 1}
                      className="block px-2 py-0.5 text-xs bg-white/10 hover:bg-white/20 disabled:opacity-20"
                    >
                      ↓
                    </button>
                  </form>
                </div>

                {/* Delete */}
                <form action={deletePhoto} className="shrink-0">
                  <input type="hidden" name="id" value={photo.id} />
                  <SubmitButton
                    pendingLabel="Deleting…"
                    savedLabel="Deleted"
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                  >
                    Delete
                  </SubmitButton>
                </form>
              </div>
            ))}
          </div>

          {/* Single Save button for all featured changes */}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              form="featured-form"
              className="bg-white/10 hover:bg-wine-red hover:text-white text-sm font-black uppercase tracking-widest px-6 py-2.5 transition-colors"
            >
              Save Home Page Selection
            </button>
          </div>
        </>
      )}
    </div>
  );
}
