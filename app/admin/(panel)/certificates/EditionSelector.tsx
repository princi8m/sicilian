"use client";
import { useRouter } from "next/navigation";

interface Edition {
  id: string;
  label: string;
}

export function EditionSelector({
  editions,
  selectedId,
}: {
  editions: Edition[];
  selectedId: string;
}) {
  const router = useRouter();

  return (
    <select
      value={selectedId}
      onChange={(e) => router.push(`/admin/certificates?editionId=${e.target.value}`)}
      className="bg-panel border border-white/20 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-accent"
    >
      {editions.map((e) => (
        <option key={e.id} value={e.id}>{e.label}</option>
      ))}
    </select>
  );
}
