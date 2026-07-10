export const dynamic = "force-dynamic";
import SocialLinks from "@/components/SocialLinks";
import { festival } from "@/lib/festival";

const groups = [
  {
    label: "Filmmakers",
    intro: "Whether you are submitting a film, waiting for results, or coordinating a screening — we are here at every stage.",
    items: [
      "Submission questions & eligibility",
      "Scheduling your Palermo screening",
      "Certificates — download, corrections, printed copies",
      "Updates to your winner or selection listing",
      "Trophies and physical awards",
    ],
  },
  {
    label: "Press & Industry",
    intro: "We welcome journalists, programmers, and industry professionals. Write to us and we will get back to you promptly.",
    items: [
      "Interviews and features",
      "Partnership and collaboration enquiries",
    ],
  },
  {
    label: "Everyone else",
    intro: "Curious about the festival, interested in attending a screening, or just want to say hello — we read every message.",
    items: [
      "Upcoming screenings and events",
      "Film reviews and editorial",
      "General questions",
    ],
  },
];

export default function ContactPage() {
  return (
    <div>

      {/* ── HERO ───────────────────────────────────────────────── */}
      {/* Dark mask over the maiolica-tile artwork, same treatment used
          across all hero banners site-wide. */}
      <section className="border-b border-rule relative overflow-hidden bg-bg min-h-[240px] md:min-h-0 md:aspect-[1500/300]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/d_contact.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center saturate-[1.12] brightness-[0.95] sepia-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent" />
          {/* Softens the hard edge where the dark navbar meets the banner */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="h-1 w-full absolute top-0 z-10 flex"><span className="flex-1 bg-wine-red" /><span className="flex-1 bg-accent" /></div>
        <div className="relative z-10 container-x min-h-[240px] md:min-h-0 md:h-full flex flex-col justify-center py-8 md:py-4 max-w-full">
          <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-1 md:mb-2">Contact</p>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight leading-none mb-2 md:mb-3 text-text-primary">
            Write to us.
          </h1>
          <p className="text-sm text-text-muted max-w-xs md:max-w-sm leading-relaxed">
            We are a small team and read every message personally. We aim to reply within one working day — usually faster.
          </p>
        </div>
      </section>

      {/* ── DECORATIVE BORDER STRIP ─────────────────────────────── */}
      <div
        className="border-b border-rule bg-bg h-16"
        style={{
          backgroundImage: "url(/uploads/decor/border-strip.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* ── EMAIL — large centrepiece ───────────────────────────── */}
      <section className="border-b border-rule bg-textured">
        <div className="container-x py-16 flex flex-col items-start gap-5">
          <p className="text-[0.6rem] font-black tracking-[0.25em] text-text-muted uppercase">Email</p>
          <a
            href={`mailto:${"info"}@${"sicilianfilmawards"}.com`}
            className="group inline-flex items-center gap-4 hover:text-accent transition-colors"
          >
            <span className="font-display text-4xl md:text-5xl tracking-wide text-text-primary group-hover:text-accent transition-colors leading-none">
              info@sicilianfilmawards.com
            </span>
            <span className="text-accent text-2xl leading-none group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <p className="text-xs text-text-muted">Or copy: info&#64;sicilianfilmawards&#46;com</p>
        </div>
      </section>

      {/* ── INSTAGRAM ──────────────────────────────────────────── */}
      {/* TODO: hidden until a real Instagram handle is set in lib/festival.ts */}
      {festival.socials.instagram && (
        <section className="border-b border-rule bg-textured-surface">
          <div className="container-x py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="text-[0.6rem] font-black tracking-[0.25em] text-text-muted uppercase mb-1">Instagram</p>
              <p className="text-sm font-black uppercase tracking-tight">Follow the festival — {festival.socials.instagramHandle}</p>
            </div>
            <SocialLinks variant="button" />
          </div>
        </section>
      )}

      {/* ── GROUPS ─────────────────────────────────────────────── */}
      <section className="border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule">
          {groups.map((g, i) => (
            <div key={g.label} className="bg-textured p-8 md:p-10 flex flex-col gap-5">
              <div>
                <span className="text-[0.5rem] font-black tracking-[0.3em] text-accent/50 uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight mt-1">{g.label}</h2>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{g.intro}</p>
              <ul className="space-y-2 mt-auto">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-text-muted">
                    <span className="text-accent mt-px shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── RESPONSE TIME ──────────────────────────────────────── */}
      <section className="bg-textured">
        <div className="container-x py-12 flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="flex flex-col gap-1">
            <span className="font-display text-5xl text-accent leading-none">1</span>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted">Working day</p>
            <p className="text-xs text-text-muted mt-1">Typical response time</p>
          </div>
          <div className="w-px bg-rule hidden md:block" />
          <div className="flex flex-col gap-1">
            <span className="font-display text-5xl text-accent leading-none">3</span>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted">Working days max</p>
            <p className="text-xs text-text-muted mt-1">During busy periods</p>
          </div>
          <div className="w-px bg-rule hidden md:block" />
          <div className="flex flex-col justify-center max-w-sm">
            <p className="text-xs text-text-muted leading-relaxed">
              We read every message ourselves. If your enquiry is urgent — for example ahead of a screening or notification date — please say so in the subject line.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
