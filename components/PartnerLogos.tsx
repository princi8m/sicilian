import Image from "next/image";

const PARTNERS = [
  { src: "/uploads/partners/xinergie.jpg", alt: "Xinergie" },
  { src: "/uploads/partners/young-film-academy.jpg", alt: "Young Film Academy" },
  { src: "/uploads/partners/quarto-tempo.jpg", alt: "Quarto Tempo — Spazio Idee APS-ASD" },
];

export default function PartnerLogos() {
  return (
    <section className="border-t border-rule">
      <div className="container-x py-12">
        <div className="flex items-center gap-4 mb-8">
          <span className="h-px flex-1 bg-rule" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">
            In collaborazione con
          </p>
          <span className="h-px flex-1 bg-rule" />
        </div>

        <div className="border border-rule">
          <div className="flex flex-wrap items-center justify-center divide-y divide-rule sm:divide-y-0 sm:divide-x sm:divide-rule">
            {PARTNERS.map((p) => (
              <div key={p.src} className="flex items-center justify-center px-10 py-6 w-full sm:w-auto">
                <div className="bg-paper rounded-md px-5 py-3">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={160}
                    height={64}
                    className="h-10 w-auto object-contain grayscale opacity-80"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
