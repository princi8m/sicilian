import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MONTHS } from "@/lib/session";
export const dynamic = "force-dynamic";

export default async function EditionsList() {
  const editions = await prisma.edition.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: { _count: { select: { winners: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Editions &amp; winners</h1>
        <Link href="/admin/editions/new" className="px-4 py-2 rounded bg-accent text-ink font-medium">
          + New edition
        </Link>
      </div>
      <div className="space-y-2">
        {editions.map((e) => (
          <Link
            key={e.id}
            href={`/admin/editions/${e.id}`}
            className="flex items-center justify-between bg-panel border border-white/10 rounded-lg p-4 hover:border-accent"
          >
            <span className="flex flex-col gap-0.5">
              <span className="font-semibold">
                {MONTHS[e.month - 1]} {e.year}
                {e.title && <span className="text-white/50 font-normal ml-2 text-sm">"{e.title}"</span>}
              </span>
              <span className="text-white/50 text-xs">{e._count.winners} winners</span>
            </span>
            <span className={`text-xs px-2 py-1 rounded ${e.published ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/50"}`}>
              {e.published ? "Published" : "Draft"}
            </span>
          </Link>
        ))}
        {editions.length === 0 && <p className="text-white/60">No editions yet. Create your first one.</p>}
      </div>
    </div>
  );
}
