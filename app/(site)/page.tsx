import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import FactGrid from "@/components/FactGrid";
import { festival } from "@/lib/festival";

export const dynamic = "force-dynamic";

// TODO: no confirmed FilmFreeway profile for Sicilian Film Awards yet —
// linking to the internal submissions page until festival.filmfreeway is set.
const FF_URL = festival.filmfreeway.submitUrl || "/submissions";

const CATEGORIES = [
  "Features", "Short Films", "Documentaries", "Animation", "Experimental",
  "Music Videos", "Student Films", "Comedy", "Sci-Fi", "Historical",
  "Family", "Dance", "Travel", "Health", "Fashion", "Italian Productions",
  "AI Films", "Directing", "Acting", "Cinematography", "Editing", "Sound & Score",
  "First-time Filmmakers",
];

async function getSettings() {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
}

export default async function HomePage() {
  const [settings, featuredPosters, nextEvent, testimonials, featuredPhotos, latestEdition] = await Promise.all([
    getSettings(),
    prisma.seasonImage.findMany({
      where: { featuredInCarousel: true },
      include: { edition: true },
      orderBy: { order: "asc" },
    }),
    prisma.eventDate.findFirst({
      where: { startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
    }),
    prisma.testimonial.findMany({ where: { featured: true }, orderBy: [{ order: "asc" }], take: 4 }),
    prisma.eventPhoto.findMany({ where: { featuredOnHome: true }, orderBy: { order: "asc" } }),
    prisma.edition.findFirst({
      where: { published: true },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      include: { winners: { orderBy: { order: "asc" }, take: 6 } },
    }),
  ]);

  const carouselItems = featuredPosters.map((img) => ({
    id: img.id,
    title: img.caption || img.edition?.title || `${img.edition?.year ?? ""}`,
    previewImage: img.imagePath,
    linkUrl: img.edition ? `/winners/${img.edition.year}/${img.edition.month}` : null,
  }));

  const MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];

  return (
    <div>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="border-b border-rule relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 flex z-20">
          <span className="flex-1 bg-wine-red" />
          <span className="flex-1 bg-accent" />
        </div>
        {/* Subtle ceramic-tile texture — barely visible, adds depth only */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: "url(/uploads/decor/tile-texture.jpg)", backgroundSize: "360px", backgroundRepeat: "repeat" }}
          aria-hidden="true"
        />
        {/* Discrete portrait — low opacity, faded into the dark background */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 lg:w-2/5 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/home-hero-portrait.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-top opacity-[0.32]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/25 to-transparent" />
        </div>
        {/* Corner ornaments — behind text, low opacity */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/decor/corner-tl.png"
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute top-0 left-0 w-48 lg:w-64 opacity-25 pointer-events-none select-none"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/decor/corner-br.png"
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute bottom-0 right-0 w-48 lg:w-64 opacity-25 pointer-events-none select-none"
        />
        <div className="container-x relative z-10 py-16 md:py-28 flex flex-col items-center gap-5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.logo_path || "/uploads/trinacria-logo.png"} alt={festival.name} className="max-w-[160px] w-full object-contain mb-2" />
          <div>
            <p className="font-display text-5xl md:text-6xl tracking-wide text-text-primary leading-none">
              {festival.name}
            </p>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-text-muted mt-4">
              {festival.tagline} — {festival.location}
            </p>
          </div>
          <a
            href={FF_URL}
            {...(festival.filmfreeway.submitUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="mt-2 inline-flex items-center gap-3 bg-wine-red text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors"
          >
            Submit Your Film →
          </a>
        </div>
      </section>

      {/* ── DECORATIVE BORDER STRIP ────────────────────────────── */}
      {/* Fixed height, tiled horizontally — an aspect-ratio box here would
          grow taller as the window widens, which looked wrong. */}
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

      {/* ── FESTIVAL AT A GLANCE ───────────────────────────────── */}
      <section className="border-b border-rule bg-textured-surface">
        <div className="container-x py-10">
          <p className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-text-muted mb-4">Festival at a Glance</p>
          <FactGrid
            items={[
              { value: "Palermo", label: "Festival Location", icon: "/uploads/decor/motif-diamond-tile.png" },
              { value: "Multiple", label: "Award Categories", icon: "/uploads/decor/motif-sprig.png" },
              { value: "Regular", label: "Winner Announcements", icon: "/uploads/decor/motif-flower-tile.png" },
              { value: "Worldwide", label: "Open to Filmmakers", icon: "/uploads/decor/motif-laurel.png" },
            ]}
          />
        </div>
      </section>

      {/* ── LATEST WINNERS ─────────────────────────────────────── */}
      {latestEdition && (
        <section className="border-b border-rule">
          <div className="container-x py-12">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-1">Latest Edition</p>
                <h2 className="font-display text-2xl uppercase tracking-tight">
                  {MONTHS[(latestEdition.month ?? 1) - 1]} {latestEdition.year} Winners
                </h2>
              </div>
              <Link
                href={`/winners/${latestEdition.year}/${latestEdition.month}`}
                className="text-[0.6rem] font-black tracking-[0.2em] uppercase text-text-muted hover:text-accent transition-colors shrink-0"
              >
                All winners →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {latestEdition.winners.map((w) => (
                <div key={w.id} className="bg-bg border border-rule p-6 flex flex-col gap-1.5">
                  <p className="text-[0.55rem] font-black uppercase tracking-[0.22em] text-accent">{w.category}</p>
                  <p className="text-sm font-black uppercase tracking-tight leading-tight">{w.filmTitle}</p>
                  <p className="text-xs text-text-muted">{w.recipient}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                href="/winners"
                className="border border-rule px-8 py-3 text-xs font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
              >
                Browse All Editions →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT / MISSION ────────────────────────────────────── */}
      <section className="border-b border-rule bg-textured-surface">
        <div className="container-x py-16 md:py-20 max-w-3xl">
          <div className="flex gap-6 items-start">
            <div className="w-1 shrink-0 bg-accent self-stretch hidden md:block" />
            <div>
              <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-5">About</p>
              <p className="font-display text-3xl md:text-4xl uppercase tracking-tight leading-tight mb-6">
                A dialogue between Sicily and the world.
              </p>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                The Sicilian Film Awards brings independent international cinema to Palermo, Sicily. Our selection offers a range of cinematic works across diverse categories — from short films and features to documentaries, animation, music videos, and experimental works — promoting new ideas distinguished by originality and quality.
              </p>
              <p className="text-sm text-text-muted leading-relaxed">
                Each edition awards selected projects with screenings, official recognitions, and opportunities for public interaction. Monthly winners are announced throughout the year, culminating in live screening events in Palermo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES MARQUEE ─────────────────────────────────── */}
      <section className="border-b border-rule overflow-hidden py-4 bg-bg">
        <div className="flex gap-0 animate-marquee whitespace-nowrap">
          {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
            <span key={i} className="inline-flex items-center gap-4 text-[0.6rem] font-black uppercase tracking-[0.22em] text-text-muted px-6">
              {cat}
              <span className="text-accent">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── SUBMIT — full-width banner ──────────────────────────── */}
      {/* Dark mask over the maiolica-tile artwork, same treatment used
          across all hero banners site-wide. */}
      <section className="border-b border-rule relative overflow-hidden bg-bg min-h-[280px] md:min-h-0 md:aspect-[1500/249]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/submit-cta-sicilian.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center saturate-[1.12] brightness-[0.95] sepia-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="relative z-10 container-x min-h-[280px] md:min-h-0 md:h-full flex flex-col md:flex-row items-center gap-10 py-8 md:py-4">
          <div className="flex-1">
            <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-1 md:mb-4">Open submissions</p>
            <p className="font-display text-3xl md:text-5xl uppercase tracking-tight leading-none text-text-primary mb-2 md:mb-5">
              Your film<br />belongs here.
            </p>
            <p className="text-sm text-text-muted max-w-md leading-relaxed">
              We accept short films, features, documentaries, animation, music videos, and experimental works from independent filmmakers worldwide. All genres and languages welcome.
            </p>
          </div>
          <div className="flex flex-col items-center gap-5 shrink-0">
            {festival.filmfreeway.submitUrl ? (
              <a
                href={festival.filmfreeway.submitUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Submit on FilmFreeway"
                className="hover:opacity-80 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://public-assets.filmfreeway.com/submission_buttons/v2/med_submission_btn@2x-red.png"
                  alt="Submit on FilmFreeway"
                  width={263}
                  height={102}
                  className="w-52 h-auto"
                />
              </a>
            ) : (
              <Link
                href="/submissions"
                className="bg-wine-red text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors"
              >
                Submit Your Film →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FEATURED FILMS CAROUSEL ────────────────────────────── */}
      {carouselItems.length > 0 && (
        <section className="border-b border-rule">
          <div className="container-x py-10">
            <p className="text-[0.6rem] font-black tracking-[0.25em] text-text-muted uppercase mb-6">Highlights</p>
            <FeaturedCarousel items={carouselItems} />
          </div>
        </section>
      )}

      {/* ── LOCATION ───────────────────────────────────────────── */}
      {/* TODO: replace with a real Palermo venue photo once confirmed — no photo used yet to avoid showing an unverified building */}
      <section className="border-b border-rule bg-textured-surface">
        <div className="container-x py-16 md:py-20 max-w-3xl">
          <div className="flex gap-6 items-start">
            <div className="w-1 shrink-0 bg-wine-red self-stretch hidden md:block" />
            <div>
              <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-5">{festival.location}</p>
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight leading-tight mb-4">
                Held in Palermo.
              </h2>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                Our main screenings and award events take place in Palermo, Sicily — a city whose Norman, Arab, Byzantine, and Baroque layers have long made it a crossroads of cultures. It is exactly this spirit of dialogue that the festival brings to independent cinema.
              </p>
              <Link
                href="/events"
                className="inline-block border border-rule px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
              >
                Events & Screenings →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ────────────────────────────────────────────── */}
      <div className="border-b border-rule py-6 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/decor/flourish-divider.png"
          alt=""
          aria-hidden="true"
          className="h-6 w-auto opacity-70"
        />
      </div>

      {/* ── NEXT EVENT BAR ─────────────────────────────────────── */}
      {nextEvent && (
        <section className="border-b border-rule bg-wine-red">
          <div className="container-x py-5 flex items-center gap-6">
            <span className="text-white/70 text-[0.6rem] font-black tracking-[0.2em] uppercase shrink-0">
              Next Event
            </span>
            <div className="w-px h-4 bg-white/30 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black uppercase tracking-tight text-white truncate">{nextEvent.title}</p>
            </div>
            <p className="text-xs text-white/70 font-black shrink-0">
              {new Date(nextEvent.startsAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })}
              {nextEvent.location ? ` — ${nextEvent.location}` : ""}
            </p>
          </div>
        </section>
      )}

      {/* ── FILM REVIEWS ───────────────────────────────────────── */}
      <section className="border-b border-rule bg-textured-surface">
        <div className="container-x py-12 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-2">Film Reviews</p>
            <p className="font-display text-2xl uppercase tracking-tight leading-tight">
              Independent Cinema,<br />Reviewed.
            </p>
            <p className="text-sm text-text-muted mt-3 max-w-sm">
              Thoughtful reviews of independent films from the festival circuit.
            </p>
          </div>
          <Link
            href="/reviews"
            className="shrink-0 self-start sm:self-center border border-rule px-7 py-3 text-xs font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
          >
            Explore Reviews →
          </Link>
        </div>
      </section>

      {/* ── FEATURED PHOTOS ────────────────────────────────────── */}
      {featuredPhotos.length > 0 && (
        <section className="border-b border-rule">
          <div className="container-x py-10">
            <div className="flex items-baseline justify-between mb-6">
              <p className="text-[0.6rem] font-black tracking-[0.25em] text-text-muted uppercase">Photos</p>
              <Link href="/photos" className="text-[0.6rem] font-black tracking-[0.2em] uppercase text-text-muted hover:text-accent transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {featuredPhotos.map((p) => (
                <div key={p.id} className="relative overflow-hidden aspect-[4/3] bg-surface border border-rule group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imagePath} alt={p.caption || ""} className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-500" />
                  {p.caption && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-wide text-white/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {p.caption}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── INSTAGRAM ──────────────────────────────────────────── */}
      {/* TODO: hidden until a real Instagram handle is set in lib/festival.ts */}
      {festival.socials.instagram && (
        <section className="border-b border-rule bg-textured-surface">
          <div className="container-x py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-[0.6rem] font-black tracking-[0.25em] text-text-muted uppercase mb-1">Follow the festival</p>
              <p className="text-lg font-black uppercase tracking-tight">Stay connected</p>
            </div>
            <a
              href={festival.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 border border-accent px-8 py-4 text-accent hover:bg-wine-red hover:border-wine-red hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span className="text-xs font-black uppercase tracking-widest">Follow us — {festival.socials.instagramHandle}</span>
            </a>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ───────────────────────────────────────── */}
      <TestimonialsSection testimonials={testimonials} settings={settings} />

      {/* ── CONTACT BAR ────────────────────────────────────────── */}
      <section className="bg-textured-surface border-t border-rule">
        <div className="container-x py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-accent mb-2">Any questions?</p>
            <p className="text-xl font-black uppercase tracking-tight leading-tight">We are here to help.</p>
            <p className="text-sm text-text-muted mt-2 max-w-md">
              Whether you are a filmmaker, a journalist, or simply curious — feel free to reach out.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 bg-wine-red text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors"
          >
            Get in touch →
          </Link>
        </div>
      </section>

    </div>
  );
}
