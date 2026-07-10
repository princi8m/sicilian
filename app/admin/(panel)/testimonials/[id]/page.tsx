import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateTestimonial, deleteTestimonial } from "../actions";
export const dynamic = "force-dynamic";

export default async function EditTestimonial({ params }: { params: { id: string } }) {
  const t = await prisma.testimonial.findUnique({ where: { id: params.id } });
  if (!t) notFound();

  const input = "w-full bg-panel border border-white/10 rounded px-3 py-2 text-sm";
  const reviewedAtVal = t.reviewedAt
    ? new Date(t.reviewedAt).toISOString().slice(0, 10)
    : "";

  return (
    <div className="max-w-xl space-y-8">
      <Link href="/admin/testimonials" className="text-sm text-white/60">← All testimonials</Link>

      <section>
        <h1 className="text-2xl font-bold mb-5">{t.name}</h1>
        <form action={updateTestimonial} className="space-y-4">
          <input type="hidden" name="id" value={t.id} />
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Filmmaker name</span>
            <input name="name" defaultValue={t.name} required className={input + " mt-1"} />
          </label>
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Avatar URL (optional)</span>
            <input name="avatarPath" defaultValue={t.avatarPath || ""} className={input + " mt-1"} />
          </label>
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Testimonial</span>
            <textarea name="body" required rows={5} defaultValue={t.body} className={input + " mt-1 resize-y"} />
          </label>
          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="text-xs text-white/60 uppercase tracking-wide">Rating (1-5)</span>
              <select name="rating" defaultValue={t.rating ?? ""} className={input + " mt-1"}>
                <option value="">—</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-white/60 uppercase tracking-wide">Reviewed on</span>
              <input name="reviewedAt" type="date" defaultValue={reviewedAtVal} className={input + " mt-1"} />
            </label>
            <label className="block">
              <span className="text-xs text-white/60 uppercase tracking-wide">Order</span>
              <input name="order" type="number" defaultValue={t.order} className={input + " mt-1"} />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="featured" type="checkbox" defaultChecked={t.featured} /> Featured on home page
          </label>
          <button className="px-5 py-2 rounded bg-accent text-ink font-medium text-sm">Save</button>
        </form>
      </section>

      <section className="border-t border-white/10 pt-6">
        <form action={deleteTestimonial}>
          <input type="hidden" name="id" value={t.id} />
          <button className="text-red-300 text-sm">Delete this testimonial</button>
        </form>
      </section>
    </div>
  );
}
