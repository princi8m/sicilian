import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MONTHS } from "@/lib/session";

export const dynamic = "force-dynamic";

const COUNTRY_NAMES: Record<string, string> = {
  AF: "Afghanistan", AL: "Albania", DZ: "Algeria", AR: "Argentina", AM: "Armenia",
  AU: "Australia", AT: "Austria", AZ: "Azerbaijan", BH: "Bahrain", BD: "Bangladesh",
  BY: "Belarus", BE: "Belgium", BO: "Bolivia", BA: "Bosnia & Herzegovina", BR: "Brazil",
  BG: "Bulgaria", KH: "Cambodia", CA: "Canada", CL: "Chile", CN: "China",
  CO: "Colombia", HR: "Croatia", CU: "Cuba", CY: "Cyprus", CZ: "Czech Republic",
  DK: "Denmark", EC: "Ecuador", EG: "Egypt", EE: "Estonia", ET: "Ethiopia",
  FI: "Finland", FR: "France", GE: "Georgia", DE: "Germany", GH: "Ghana",
  GR: "Greece", GT: "Guatemala", HK: "Hong Kong", HU: "Hungary", IN: "India",
  ID: "Indonesia", IR: "Iran", IQ: "Iraq", IE: "Ireland", IL: "Israel",
  IT: "Italy", JP: "Japan", JO: "Jordan", KZ: "Kazakhstan", KE: "Kenya",
  KW: "Kuwait", LV: "Latvia", LB: "Lebanon", LT: "Lithuania", LU: "Luxembourg",
  MK: "North Macedonia", MY: "Malaysia", MX: "Mexico", MA: "Morocco", NL: "Netherlands",
  NZ: "New Zealand", NG: "Nigeria", NO: "Norway", PK: "Pakistan", PS: "Palestine",
  PA: "Panama", PE: "Peru", PH: "Philippines", PL: "Poland", PT: "Portugal",
  QA: "Qatar", RO: "Romania", RU: "Russia", SA: "Saudi Arabia", SN: "Senegal",
  RS: "Serbia", SG: "Singapore", SK: "Slovakia", SI: "Slovenia", ZA: "South Africa",
  KR: "South Korea", ES: "Spain", LK: "Sri Lanka", SE: "Sweden", CH: "Switzerland",
  SY: "Syria", TW: "Taiwan", TZ: "Tanzania", TH: "Thailand", TN: "Tunisia",
  TR: "Turkey", UA: "Ukraine", AE: "UAE", GB: "United Kingdom", US: "United States",
  UY: "Uruguay", UZ: "Uzbekistan", VE: "Venezuela", VN: "Vietnam", YE: "Yemen",
};

function parseCountries(raw: string): { code: string; name: string }[] {
  return raw
    .split(/[,/;|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((token) => {
      const upper = token.toUpperCase();
      if (token.length === 2) return { code: upper, name: COUNTRY_NAMES[upper] ?? upper };
      return { code: token, name: token };
    });
}

export default async function WinnersDetail({
  params,
}: {
  params: { year: string; month: string };
}) {
  const year = parseInt(params.year, 10);
  const month = parseInt(params.month, 10);
  if (Number.isNaN(year) || Number.isNaN(month)) notFound();

  const edition = await prisma.edition.findFirst({
    where: { year, month, published: true },
    include: {
      winners: { orderBy: { order: "asc" } },
      seasonImages: { orderBy: { order: "asc" } },
    },
  });
  if (!edition) notFound();

  const editionLabel = edition.title || `${MONTHS[month - 1]} ${year}`;

  return (
    <div>
      {/* Header */}
      <div className="border-b border-rule bg-textured">
        <div className="h-1 w-full flex"><span className="flex-1 bg-wine-red" /><span className="flex-1 bg-accent" /></div>
        <div className="container-x py-10">
          <Link
            href="/winners"
            className="text-xs font-black tracking-[0.2em] text-text-muted uppercase hover:text-accent transition-colors"
          >
            ← Winners
          </Link>
          <div className="mt-4 flex items-baseline gap-4">
            <span className="font-display text-2xl text-accent">{year}</span>
            <h1 className="font-display text-4xl uppercase tracking-tight leading-none">
              {editionLabel}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-x py-10 space-y-14">

        {/* Winners table */}
        <section>
          <p className="text-[0.6rem] font-black tracking-[0.25em] text-text-muted uppercase mb-4">
            Award Recipients
          </p>

          {edition.winners.length === 0 ? (
            <p className="text-text-muted text-sm">Winners to be announced.</p>
          ) : (
            <div className="border border-rule">
              {edition.winners.map((w, i) => (
                <div
                  key={w.id}
                  className={`flex gap-4 items-start px-5 py-4 ${i > 0 ? "border-t border-rule" : ""}`}
                >
                  {w.imagePath && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={w.imagePath}
                      alt=""
                      className="w-14 h-20 object-cover shrink-0 grayscale"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black tracking-[0.2em] text-accent uppercase mb-1.5">
                      {w.category}
                    </p>
                    <p className="text-xl font-black uppercase tracking-tight leading-tight">
                      {w.filmTitle || w.recipient || "—"}
                    </p>
                    {w.filmTitle && w.recipient && (
                      <p className="text-sm text-text-muted mt-1 tracking-wide">
                        {w.recipient}
                      </p>
                    )}
                  </div>
                  {w.country && (
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {parseCountries(w.country).map(({ code, name }) => (
                        <span key={code} className="text-sm font-black tracking-wide text-text-primary">
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Film posters grid */}
        {edition.seasonImages.length > 0 && (
          <section>
            <p className="text-[0.6rem] font-black tracking-[0.25em] text-text-muted uppercase mb-4">
              Selected Films
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {edition.seasonImages.map((img) => (
                <figure key={img.id} className="bg-surface border border-rule group relative overflow-hidden">
                  <div className="aspect-[2/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.imagePath}
                      alt={img.caption || ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="absolute bottom-0 left-0 right-0 bg-black/80 px-3 py-2 text-[0.55rem] font-black uppercase tracking-wide text-white/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
