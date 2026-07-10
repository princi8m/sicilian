import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MONTHS } from "@/lib/session";
import {
  updateEdition, deleteEdition,
  addWinner, updateWinner, deleteWinner, importWinners,
  addSeasonImage, updateSeasonImage, deleteSeasonImage,
  saveAllCarousel,
} from "../actions";
export const dynamic = "force-dynamic";

export default async function EditEdition({ params }: { params: { id: string } }) {
  const edition = await prisma.edition.findUnique({
    where: { id: params.id },
    include: {
      winners: { orderBy: { order: "asc" } },
      seasonImages: { orderBy: { order: "asc" } },
    },
  });
  if (!edition) notFound();

  const inp = "w-full bg-panel border border-white/10 px-3 py-2 text-sm";

  return (
    <div className="max-w-3xl space-y-12">
      <div className="flex items-center justify-between">
        <Link href="/admin/editions" className="text-sm text-white/60">← All editions</Link>
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/certificates?editionId=${edition.id}`}
            className="text-sm px-3 py-1.5 border border-accent/40 text-accent hover:bg-wine-red hover:text-white transition-colors"
          >
            Send certificates →
          </Link>
          {edition.published && (
            <Link href={`/winners/${edition.year}/${edition.month}`} className="text-sm text-white/60 hover:text-accent" target="_blank">
              View public page ↗
            </Link>
          )}
        </div>
      </div>

      {/* Edition details */}
      <section>
        <h1 className="text-2xl font-bold mb-4">
          {edition.title || `${MONTHS[edition.month - 1]} ${edition.year}`}
        </h1>
        <form action={updateEdition} className="space-y-4">
          <input type="hidden" name="id" value={edition.id} />
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">Year</span>
              <input name="year" type="number" defaultValue={edition.year} className={inp + " mt-1"} />
            </label>
            <label className="block">
              <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">Month / Edition #</span>
              <select name="month" defaultValue={edition.month} className={inp + " mt-1"}>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">Title override</span>
            <input name="title" defaultValue={edition.title || ""} className={inp + " mt-1"} placeholder="e.g. Spring Edition 2025" />
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input name="published" type="checkbox" defaultChecked={edition.published} className="w-4 h-4" />
            <span className="text-sm">Published</span>
          </label>
          <button className="px-5 py-2 bg-wine-red text-white text-sm font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors">
            Save
          </button>
        </form>
      </section>

      {/* Winners */}
      <section>
        <h2 className="text-lg font-black uppercase tracking-widest mb-4 border-b border-rule pb-2">Winners</h2>
        <div className="space-y-2 mb-6">
          {edition.winners.map((w) => (
            <div key={w.id} className="flex gap-2 items-start bg-panel border border-white/10 p-3">
              {/* Edit form */}
              <form action={updateWinner} className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                <input type="hidden" name="id" value={w.id} />
                <input type="hidden" name="editionId" value={edition.id} />
                <label className="block">
                  <span className="text-[0.6rem] text-white/40 uppercase tracking-wider">Prize</span>
                  <input name="category" defaultValue={w.category} placeholder="e.g. Best Film" className={inp + " mt-0.5"} />
                </label>
                <label className="block">
                  <span className="text-[0.6rem] text-white/40 uppercase tracking-wider">Film title</span>
                  <input name="filmTitle" defaultValue={w.filmTitle || ""} placeholder="Film title" className={inp + " mt-0.5"} />
                </label>
                <label className="block">
                  <span className="text-[0.6rem] text-white/40 uppercase tracking-wider">Recipient / name</span>
                  <input name="recipient" defaultValue={w.recipient || ""} placeholder="Director / filmmaker" className={inp + " mt-0.5"} />
                </label>
                <label className="block">
                  <span className="text-[0.6rem] text-white/40 uppercase tracking-wider">Country</span>
                  <input name="country" defaultValue={w.country || ""} placeholder="e.g. DE" className={inp + " mt-0.5"} />
                </label>
                <label className="block col-span-2 md:col-span-4">
                  <span className="text-[0.6rem] text-white/40 uppercase tracking-wider">Email (internal)</span>
                  <input name="email" defaultValue={w.email || ""} placeholder="For certificate delivery" className={inp + " mt-0.5"} />
                </label>
                <button
                  type="submit"
                  className="md:col-span-4 px-3 py-1.5 bg-white/10 hover:bg-wine-red hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
                >
                  Save
                </button>
              </form>
              {/* Delete form — sibling, not nested */}
              <form action={deleteWinner} className="shrink-0">
                <input type="hidden" name="id" value={w.id} />
                <input type="hidden" name="editionId" value={edition.id} />
                <button className="text-red-400 hover:text-red-300 text-lg leading-none px-1 pt-1">
                  ×
                </button>
              </form>
            </div>
          ))}
          {edition.winners.length === 0 && <p className="text-white/50 text-sm">No winners yet.</p>}
        </div>
        <form action={addWinner} className="grid md:grid-cols-2 gap-3 bg-panel/50 border border-white/10 p-4">
          <input type="hidden" name="editionId" value={edition.id} />
          <input name="category" placeholder="Category (e.g. Best Film)" className={inp} />
          <input name="filmTitle" placeholder="Film title" className={inp} />
          <input name="recipient" placeholder="Recipient / director" className={inp} />
          <input name="country" placeholder="Country" className={inp} />
          <input name="email" placeholder="Email (internal, not published)" className={`${inp} md:col-span-2`} />
          <input name="imagePath" placeholder="Image URL (optional)" className={inp} />
          <input name="order" type="number" placeholder="Order" defaultValue={edition.winners.length} className={inp} />
          <button className="md:col-span-2 px-4 py-2 bg-wine-red text-white text-sm font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors">
            + Add winner
          </button>
        </form>

        {/* CSV import */}
        <div className="mt-4 border border-white/10 bg-panel/30 p-4">
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-1">Import from CSV / Google Sheets</p>
          <p className="text-[0.65rem] text-white/40 mb-3">
            Expected columns: <span className="text-white/70">col 1 Film Title · col 2 Recipient · col 3 Prize/Category · col 4 Country (optional) · col 5 Email (optional, internal)</span>
          </p>
          <form action={importWinners} encType="multipart/form-data" className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="editionId" value={edition.id} />
            <label className="flex-1 min-w-[200px]">
              <span className="text-xs text-white/60 block mb-1">CSV file *</span>
              <input
                type="file"
                name="csvFile"
                accept=".csv,text/csv,text/plain"
                required
                className="block w-full text-sm text-white/70 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-white/20"
              />
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer mb-0.5">
              <input type="checkbox" name="hasHeader" defaultChecked className="w-4 h-4" />
              <span className="text-xs text-white/60">First row is a header</span>
            </label>
            <button className="px-4 py-2 bg-white/10 hover:bg-wine-red hover:text-white text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap">
              Import
            </button>
          </form>
        </div>
      </section>

      {/* Film posters */}
      <section>
        <h2 className="text-lg font-black uppercase tracking-widest mb-1 border-b border-rule pb-2">Film Posters</h2>
        <p className="text-xs text-white/40 mb-4">Vertical (portrait) images — all displayed at 2:3 ratio. Check "Carousel" to feature on the home page scrolling bar.</p>

        {/* Single form for carousel toggles */}
        <form id="carousel-form" action={saveAllCarousel}>
          <input type="hidden" name="editionId" value={edition.id} />
          {edition.seasonImages.map((img) => (
            <input key={img.id} type="hidden" name="imageId" value={img.id} />
          ))}
        </form>

        {edition.seasonImages.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {edition.seasonImages.map((img) => (
                <div key={img.id} className="flex flex-col gap-1.5">
                  {/* 2:3 poster */}
                  <div className="aspect-[2/3] overflow-hidden bg-surface border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.imagePath} alt={img.caption || ""} className="w-full h-full object-cover" />
                  </div>

                  {/* Carousel checkbox */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name={`carousel_${img.id}`}
                      form="carousel-form"
                      defaultChecked={img.featuredInCarousel}
                      className="w-3 h-3"
                    />
                    <span className="text-[0.55rem] font-black uppercase tracking-wide text-white/50">Carousel</span>
                  </label>

                  {/* Caption edit */}
                  <form action={updateSeasonImage} className="flex gap-1">
                    <input type="hidden" name="id" value={img.id} />
                    <input type="hidden" name="editionId" value={edition.id} />
                    <input
                      name="caption"
                      defaultValue={img.caption || ""}
                      placeholder="Caption…"
                      className="flex-1 min-w-0 bg-white/5 border border-white/10 px-2 py-1 text-[0.65rem]"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-white/10 hover:bg-wine-red hover:text-white text-[0.6rem] font-black uppercase tracking-wide transition-colors"
                    >
                      Save
                    </button>
                  </form>

                  {/* Delete */}
                  <form action={deleteSeasonImage}>
                    <input type="hidden" name="id" value={img.id} />
                    <input type="hidden" name="editionId" value={edition.id} />
                    <button className="w-full text-[0.6rem] font-black uppercase tracking-wide text-red-400 hover:text-red-300 py-0.5 transition-colors">
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>

            <div className="flex justify-end mb-6">
              <button
                type="submit"
                form="carousel-form"
                className="bg-white/10 hover:bg-wine-red hover:text-white text-xs font-black uppercase tracking-widest px-5 py-2 transition-colors"
              >
                Save Carousel Selection
              </button>
            </div>
          </>
        )}

        {/* Upload new poster */}
        <form action={addSeasonImage} encType="multipart/form-data" className="flex flex-col sm:flex-row gap-3 bg-panel/50 border border-white/10 p-4">
          <input type="hidden" name="editionId" value={edition.id} />
          <label className="flex-1">
            <span className="text-xs text-white/60 block mb-1">Poster image *</span>
            <input
              type="file"
              name="files"
              accept="image/*"
              multiple
              required
              className="block w-full text-sm text-white/70 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-white/20"
            />
          </label>
          <label className="flex-1">
            <span className="text-xs text-white/60 block mb-1">Caption</span>
            <input name="caption" placeholder="Film title or description" className={inp} />
          </label>
          <div className="flex items-end">
            <button className="px-4 py-2 bg-wine-red text-white text-sm font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors whitespace-nowrap">
              Upload
            </button>
          </div>
        </form>
      </section>

      {/* Danger zone */}
      <section className="border-t border-white/10 pt-6">
        <form action={deleteEdition}>
          <input type="hidden" name="id" value={edition.id} />
          <button className="text-red-400 text-sm hover:text-red-300">Delete this edition</button>
        </form>
      </section>
    </div>
  );
}
