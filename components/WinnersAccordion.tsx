"use client";

import { useState } from "react";
import Link from "next/link";

// Inlined rather than imported from lib/session — that module also pulls in
// next/headers (cookies), which breaks when imported from a client component.
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type EditionLite = { id: string; year: number; month: number; title: string | null };

export default function WinnersAccordion({ years }: { years: [number, EditionLite[]][] }) {
  const defaultYear = years[0]?.[0] ?? null;
  const [openYear, setOpenYear] = useState<number | null>(defaultYear);

  return (
    <>
      {years.map(([year, list], yi) => {
        const isOpen = openYear === year;
        return (
          <div key={year} className="border-b border-rule last:border-b-0">

            {/* Year header */}
            <div className="flex items-center gap-6 py-5">
              <button
                type="button"
                onClick={() => setOpenYear(isOpen ? defaultYear : year)}
                className="group flex items-center gap-4 flex-1 min-w-0 text-left"
              >
                <span className="font-display text-4xl text-accent group-hover:text-white transition-colors leading-none shrink-0">
                  {year}
                </span>
                <span className="text-[0.55rem] font-black uppercase tracking-[0.25em] text-text-muted group-hover:text-accent transition-colors">
                  {list.length} edition{list.length !== 1 ? "s" : ""}
                </span>
                <div className="flex-1 h-px bg-rule hidden sm:block" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/uploads/decor/motif-diamond-tile.png" alt="" aria-hidden="true" className="hidden sm:block w-6 h-6 object-contain opacity-60 shrink-0" />
                <span className="text-text-muted text-xs font-black shrink-0">
                  {isOpen ? "↑" : "↓"}
                </span>
              </button>
            </div>

            {/* Editions grid */}
            {isOpen && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-6">
                {list.map((e, ei) => (
                  <Link
                    key={e.id}
                    href={`/winners/${e.year}/${e.month}`}
                    className={`relative bg-bg border-t border-rule p-5 group hover:bg-accent/5 transition-colors flex flex-col gap-3 ${
                      ei < list.length - 1 ? "border-r" : ""
                    }`}
                  >
                    <div>
                      <p className="text-[0.5rem] font-black tracking-[0.3em] text-accent/60 uppercase mb-1">{e.year}</p>
                      <p className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">
                        {e.title || MONTHS[(e.month ?? 1) - 1]}
                      </p>
                    </div>
                    <span className="text-[0.55rem] font-black tracking-[0.2em] text-text-muted uppercase group-hover:text-accent transition-colors mt-auto">
                      View →
                    </span>
                    {ei < list.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="hidden sm:block absolute top-1/2 -right-[3px] -translate-y-1/2 w-[6px] h-[6px] rotate-45 bg-wine-red z-10"
                      />
                    )}
                  </Link>
                ))}
              </div>
            )}

          </div>
        );
      })}
    </>
  );
}
