import { prisma } from "@/lib/prisma";
import { updateDatesIntro } from "./actions";
import { DateRow } from "./DateRow";
import AddDateForm from "./AddDateForm";

export const dynamic = "force-dynamic";

function toInputDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}


export default async function AdminDatesPage() {
  const [dates, settings] = await Promise.all([
    prisma.eventDate.findMany({ orderBy: { startsAt: "asc" } }),
    prisma.siteSetting.findMany({ where: { key: "dates_intro" } }),
  ]);

  const intro = settings[0]?.value ?? "";

  return (
    <div className="max-w-3xl space-y-12">
      <h1 className="text-2xl font-bold">Dates &amp; Deadlines</h1>

      {/* Intro text */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest mb-3 border-b border-rule pb-2">Intro text</h2>
        <form action={updateDatesIntro} className="flex gap-3">
          <input
            name="intro"
            defaultValue={intro}
            placeholder="e.g. The current entry started on November 11, 2025"
            className="w-full bg-panel border border-white/10 px-3 py-2 text-sm flex-1"
          />
          <button className="px-4 py-2 bg-wine-red text-white text-sm font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors">
            Save
          </button>
        </form>
      </section>

      {/* Existing dates */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-rule pb-2">
          All dates ({dates.length})
        </h2>

        <div className="space-y-3">
          {dates.map((d) => <DateRow key={d.id} date={d} />)}
          {dates.length === 0 && <p className="text-white/40 text-sm">No dates yet.</p>}
        </div>
      </section>

      {/* Add new */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-rule pb-2">Add date</h2>
        <AddDateForm />
      </section>
    </div>
  );
}
