export const dynamic = "force-dynamic";
import Link from "next/link";

const items = [
  {
    id: "trophy",
    name: "Festival Trophy",
    category: "Physical award",
    description:
      "The official Sicilian Film Awards trophy, handcrafted and engraved with the film title, category, and edition year. Shipped worldwide. Contact us for details and availability.",
    image: null,
  },
  {
    id: "certificate",
    name: "Festival Certificate",
    category: "Physical award",
    description:
      "Official Sicilian Film Awards certificate of award or selection, available on metal, acrylic, or other premium supports. Engraved with film title, category, and edition. Shipped worldwide. Contact us for material options and pricing.",
    image: null,
  },
  {
    id: "film-review",
    name: "Individual Film Review",
    category: "Editorial service",
    description:
      "A written review of your film by the Sicilian Film Awards editorial team, published on our Film Reviews page. Includes poster and stills. Ideal for independent filmmakers seeking visibility and a critical perspective on their work.",
    image: null,
  },
];

export default function ShopPage() {
  return (
    <div>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section className="border-b border-rule bg-textured-surface">
        <div className="container-x py-16">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-accent mb-3">Sicilian Film Awards</p>
          <h1 className="font-display text-5xl uppercase tracking-tight leading-none mb-4">Shop</h1>
          <p className="text-sm text-text-muted max-w-md leading-relaxed">
            Trophies, certificates, and editorial services for filmmakers. Online payment is coming soon — for now, contact us directly to order.
          </p>
        </div>
      </section>

      {/* ── PRODUCTS ───────────────────────────────────────────── */}
      <section className="border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule">
          {items.map((item) => (
            <div key={item.id} className="bg-bg flex flex-col">
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-surface border-b border-rule flex items-center justify-center">
                <span className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted">
                  {item.category}
                </span>
              </div>
              <div className="p-7 flex flex-col flex-1 gap-3">
                <div>
                  <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-accent mb-1">{item.category}</p>
                  <h2 className="text-lg font-black uppercase tracking-tight leading-tight">{item.name}</h2>
                </div>
                <p className="text-sm text-text-muted leading-relaxed flex-1">{item.description}</p>
                <Link
                  href="/contact"
                  className="mt-2 self-start text-xs font-black uppercase tracking-widest border border-rule px-5 py-2 hover:border-accent hover:text-accent transition-colors"
                >
                  Enquire →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAYMENT NOTE ───────────────────────────────────────── */}
      <section>
        <div className="container-x py-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-xs text-text-muted flex-1">
            Online payment via PayPal is coming soon. In the meantime, reach out to us directly and we will handle your order personally.
          </p>
          <Link
            href="/contact"
            className="shrink-0 text-xs font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          >
            Contact us →
          </Link>
        </div>
      </section>

    </div>
  );
}
