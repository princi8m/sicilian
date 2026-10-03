import { createEdition } from "../actions";
import { MONTHS } from "@/lib/session";

export default async function NewEdition({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; year?: string; month?: string }>;
}) {
  const sp = await searchParams;
  const thisYear = new Date().getFullYear();
  const isDuplicate = sp.error === "duplicate";
  const isInvalid   = sp.error === "1";
  const dupYear     = sp.year;
  const dupMonth    = sp.month ? MONTHS[parseInt(sp.month) - 1] : "";

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">New edition</h1>

      {isDuplicate && (
        <div className="mb-4 px-4 py-3 bg-accent/10 border border-accent text-sm text-accent">
          An edition for <strong>{dupMonth} {dupYear}</strong> already exists. Choose a different month or year.
        </div>
      )}
      {isInvalid && (
        <div className="mb-4 px-4 py-3 bg-accent/10 border border-accent text-sm text-accent">
          Invalid year or month. Please check the values and try again.
        </div>
      )}

      <form action={createEdition} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-white/70">Year</span>
            <input name="year" type="number" defaultValue={dupYear ?? thisYear} className="w-full bg-panel border border-white/10 rounded px-3 py-2 mt-1" />
          </label>
          <label className="block">
            <span className="text-sm text-white/70">Month</span>
            <select name="month" defaultValue={sp.month ?? "1"} className="w-full bg-panel border border-white/10 rounded px-3 py-2 mt-1">
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-sm text-white/70">Title (optional)</span>
          <input name="title" placeholder="e.g. June 2026 Edition" className="w-full bg-panel border border-white/10 rounded px-3 py-2 mt-1" />
        </label>
        <label className="flex items-center gap-2">
          <input name="published" type="checkbox" /> <span className="text-sm">Published</span>
        </label>
        <button className="px-5 py-2 rounded bg-accent text-white font-medium">Create</button>
      </form>
    </div>
  );
}
