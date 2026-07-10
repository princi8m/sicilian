import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { festival } from "@/lib/festival";

export const dynamic = "force-dynamic";
export default async function ImpressumPage() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "nav_impressum" } });
  if (setting?.value === "0") notFound();

  const hasLegalInfo = Boolean(festival.legal.operator);

  return (
    <div>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section className="border-b border-rule bg-textured">
        <div className="container-x py-14">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-4">Legal</p>
          <h1 className="font-display text-4xl uppercase tracking-tight leading-tight">Impressum</h1>
        </div>
      </section>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      {/* TODO: festival.legal is currently empty — needs real Italian
          legal-notice details (Codice Fiscale / Partita IVA / sede legale),
          not the German Amtsgericht/HRB shape used by the Berlin sites. */}
      <section>
        <div className="container-x py-16 max-w-2xl">
          {!hasLegalInfo ? (
            <p className="text-sm text-text-muted leading-relaxed">
              Legal notice details are not yet available. This page will be updated once the
              festival&apos;s operating entity information is confirmed.
            </p>
          ) : (
            <div className="space-y-8 text-sm text-text-muted leading-relaxed">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted mb-3">Operator</p>
                <p className="text-white font-black uppercase tracking-tight text-base">{festival.legal.operator}</p>
                <p className="mt-2">
                  {festival.contact.domain} is operated by {festival.legal.operator}.
                </p>
              </div>

              <div className="border-t border-rule pt-8">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted mb-4">Address</p>
                <address className="not-italic leading-loose">
                  {festival.legal.operator}<br />
                  {festival.legal.address}<br />
                  {festival.legal.postcode} {festival.legal.city}<br />
                  {festival.legal.country}
                </address>
              </div>

              <div className="border-t border-rule pt-8">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted mb-4">Contact</p>
                <a
                  href={`mailto:${festival.legal.email}`}
                  className="hover:text-accent transition-colors"
                >
                  {festival.legal.email}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
