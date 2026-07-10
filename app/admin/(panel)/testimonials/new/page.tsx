import { createTestimonial } from "../actions";

export default function NewTestimonial() {
  const input = "w-full bg-panel border border-white/10 rounded px-3 py-2 text-sm";
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">New testimonial</h1>
      <form action={createTestimonial} className="space-y-4">
        <label className="block">
          <span className="text-xs text-white/60 uppercase tracking-wide">Filmmaker name</span>
          <input name="name" required placeholder="e.g. Sofia Andersson" className={input + " mt-1"} />
        </label>
        <label className="block">
          <span className="text-xs text-white/60 uppercase tracking-wide">Avatar URL (optional)</span>
          <input name="avatarPath" placeholder="https://..." className={input + " mt-1"} />
        </label>
        <label className="block">
          <span className="text-xs text-white/60 uppercase tracking-wide">Testimonial</span>
          <textarea name="body" required rows={5} className={input + " mt-1 resize-y"} />
        </label>
        <div className="grid grid-cols-3 gap-4">
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Rating (1-5)</span>
            <select name="rating" className={input + " mt-1"}>
              <option value="">—</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Reviewed on</span>
            <input name="reviewedAt" type="date" className={input + " mt-1"} />
          </label>
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Order</span>
            <input name="order" type="number" defaultValue={0} className={input + " mt-1"} />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input name="featured" type="checkbox" defaultChecked /> Featured on home page
        </label>
        <button className="px-5 py-2 rounded bg-accent text-ink font-medium text-sm">Create</button>
      </form>
    </div>
  );
}
