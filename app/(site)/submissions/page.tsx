export const dynamic = "force-dynamic";
import { festival } from "@/lib/festival";

const steps = [
  {
    num: "01",
    title: "Submit your film",
    body: "Submit your work through FilmFreeway. We accept short films, features, documentaries, and experimental films from independent filmmakers worldwide. All genres and languages are welcome.",
  },
  {
    num: "02",
    title: "Jury evaluation",
    body: "Every submission is reviewed by our jury — a combination of internal and external jury members with international backgrounds. Films are evaluated on artistic merit, originality, direction, and overall impact.",
  },
  {
    num: "03",
    title: "Selection & awards",
    body: "Selected films will be chosen for the official programme. Among those, winners will be announced for each category. Films may receive an award, an honorable mention, or selection status — each recognised with an official certificate.",
  },
  {
    num: "04",
    title: "Notification",
    body: "All filmmakers will receive their selection status on the official notification date. Within a couple of days, winners and selected filmmakers will receive more precise information about their award and screening placement.",
  },
  {
    num: "05",
    title: "Screenings in Palermo",
    body: "Selected films become eligible for public screenings in Palermo. The most recognised films will be placed in official festival events. Filmmakers are welcome to contact us to find a screening date that fits both their availability and our programme schedule.",
  },
];

export default function SubmissionsPage() {
  return (
    <div>

      {/* ── HERO ───────────────────────────────────────────────── */}
      {/* Dark mask over the maiolica-tile artwork, same treatment used
          across all hero banners site-wide. */}
      <section className="border-b border-rule relative overflow-hidden bg-bg min-h-[280px] md:min-h-0 md:aspect-[1500/300]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/d_submit.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center saturate-[1.12] brightness-[0.95] sepia-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent" />
          {/* Softens the hard edge where the dark navbar meets the banner */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="h-1 w-full absolute top-0 z-10 flex"><span className="flex-1 bg-wine-red" /><span className="flex-1 bg-accent" /></div>
        <div className="relative z-10 container-x min-h-[280px] md:min-h-0 md:h-full flex flex-col justify-center py-8 md:py-4">
          <p className="text-[0.6rem] font-black tracking-[0.25em] text-accent uppercase mb-1 md:mb-2">Sicilian Film Awards</p>
          <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight leading-none mb-2 md:mb-4 text-text-primary">
            Submit Your Film
          </h1>
          <p className="text-sm text-text-muted max-w-xs md:max-w-lg leading-relaxed">
            We welcome independent films from around the world. Selected works are screened in Palermo, in front of real audiences, in one of the Mediterranean&apos;s most storied cities.
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

      {/* ── SUBMIT CTA ─────────────────────────────────────────── */}
      {/* TODO: shows a FilmFreeway badge once festival.filmfreeway.submitUrl is set; falls back to a mailto until then */}
      <section className="border-b border-rule">
        <div className="container-x py-14 flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-2">Submissions open now</p>
            <p className="font-display text-2xl uppercase tracking-tight leading-tight">
              {festival.filmfreeway.submitUrl ? "Submit through FilmFreeway" : "Get in touch to submit"}
            </p>
            <p className="text-sm text-text-muted mt-2 max-w-sm">
              {festival.filmfreeway.submitUrl
                ? "All submissions are managed through FilmFreeway. Create a free account, upload your film, and apply in minutes."
                : "Write to us and we will send you everything you need to submit your film."}
            </p>
          </div>
          {festival.filmfreeway.submitUrl ? (
            <a
              href={festival.filmfreeway.submitUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Click to submit on FilmFreeway"
              className="shrink-0 hover:opacity-80 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://public-assets.filmfreeway.com/submission_buttons/v2/med_submission_btn@2x-red.png"
                alt="Submit on FilmFreeway"
                width={263}
                height={102}
                className="w-48 h-auto"
              />
            </a>
          ) : (
            <a
              href={`mailto:${festival.contact.email}`}
              className="shrink-0 bg-wine-red text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors"
            >
              Contact us →
            </a>
          )}
        </div>
      </section>

      {/* ── PROCESS STEPS ──────────────────────────────────────── */}
      <section className="border-b border-rule">
        <div className="container-x py-14">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-text-muted mb-10">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-rule">
            {steps.map((s) => (
              <div key={s.num} className="bg-bg p-6 flex flex-col gap-3">
                <span className="text-[0.6rem] font-black tracking-[0.3em] text-accent uppercase">{s.num}</span>
                <p className="text-sm font-black uppercase tracking-tight leading-tight">{s.title}</p>
                <p className="text-xs text-text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENINGS INFO ────────────────────────────────────── */}
      <section className="border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-px bg-rule">
          <div className="bg-textured-surface p-10 md:p-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-4">Screenings</p>
            <h2 className="font-display text-2xl uppercase tracking-tight leading-tight mb-5">
              Your film in Palermo
            </h2>
            <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
              <p>Selected films become part of a screening programme that runs throughout the year in Palermo, Sicily.</p>
              <p>The most recognised titles are placed in official festival events: full public screenings with a real audience.</p>
              <p>Filmmakers who wish to attend their screening are welcome to contact us. We do our best to find a date that works for both the filmmaker&apos;s availability and our programme schedule.</p>
            </div>
          </div>
          <div className="bg-textured-surface p-10 md:p-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-4">Awards & recognition</p>
            <h2 className="font-display text-2xl uppercase tracking-tight leading-tight mb-5">
              Certificates & awards
            </h2>
            <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
              <p>Winners in each category receive an official award certificate from the Sicilian Film Awards. Honorable mentions are also recognised with a dedicated certificate.</p>
              <p>All selected filmmakers receive confirmation of their selection status, which can be used for festival credits and distribution purposes.</p>
              <p>Detailed information — including award category, screening placement, and certificate details — is sent to all winners and selected filmmakers within a few days of the official notification date.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBMISSION RULES ───────────────────────────────────── */}
      <section id="rules" className="border-b border-rule">
        <div className="container-x py-14">
          <p className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-text-muted mb-10">Submission rules</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">

            {[
              {
                title: "Film length",
                body: "Short films are defined as any film with a runtime under 40 minutes. Feature films are 45 minutes or longer. Films between 40 and 45 minutes may be classified at the festival's discretion.",
              },
              {
                title: "Language & subtitles",
                body: "Films in all languages are welcome. Films not in English or Italian should include English subtitles to ensure accessibility for our international jury and audience.",
              },
              {
                title: "Rights & permissions",
                body: "Filmmakers are responsible for holding all necessary rights to the submitted work, including music, visuals, and any third-party content. Submissions found to be in violation of copyright may be withdrawn from consideration.",
              },
              {
                title: "Multiple entries & categories",
                body: "Filmmakers may submit more than one film. Each film may also be entered in multiple categories, provided it meets the criteria for each. There is no limit on the number of entries per filmmaker.",
              },
              {
                title: "Screening permission",
                body: "Films will not be screened publicly without the express written permission of the filmmaker. By submitting, filmmakers grant the festival permission to use clips, trailers, and stills for promotional and marketing purposes.",
              },
              {
                title: "Screening schedule",
                body: "Longer films and documentaries may be scheduled during afternoon slots rather than peak evening screenings. The festival makes every effort to accommodate preferences, but reserves the right to determine the final programme schedule.",
              },
              {
                title: "Winners & public screenings",
                body: "All winning films are eligible for public screening at festival events. Winners may also be featured in promotional events, retrospectives, or encore screenings. Screening dates are coordinated with filmmakers and may be adjusted based on venue availability — filmmakers are welcome to contact us to find a date that works for them.",
              },
              {
                title: "Submission format",
                body: "All submissions should be in a high-quality digital format suitable for large-screen projection (e.g. MP4 or MOV). Submissions with incomplete files, very low resolution, or significant technical issues may not be considered for the programme.",
              },
              {
                title: "Judging criteria",
                body: "Films are evaluated on creativity, storytelling, technical execution, and originality. Our jury includes both internal and external members with international backgrounds. All decisions are final.",
              },
              {
                title: "Notification",
                body: "Filmmakers will be notified of their selection status by email on the official notification date published on our website. Winners and selected filmmakers will receive full details — including award category and screening information — within a few days of notification.",
              },
            ].map((rule) => (
              <div key={rule.title} className="bg-bg p-7 flex flex-col gap-3">
                <p className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-accent">{rule.title}</p>
                <p className="text-sm text-text-muted leading-relaxed">{rule.body}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────── */}
      <section>
        <div className="container-x py-14 flex flex-col items-center text-center gap-6">
          <p className="font-display text-3xl uppercase tracking-tight">Ready to submit?</p>
          <p className="text-sm text-text-muted max-w-sm">
            Join filmmakers from around the world already submitting to the Sicilian Film Awards.
          </p>
          {festival.filmfreeway.submitUrl ? (
            <a
              href={festival.filmfreeway.submitUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Click to submit on FilmFreeway"
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
            <a
              href={`mailto:${festival.contact.email}`}
              className="bg-wine-red text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors"
            >
              Contact us →
            </a>
          )}
        </div>
      </section>

    </div>
  );
}
