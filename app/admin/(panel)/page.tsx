import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [editions, winners, photos, dates, reviews, carousel, testimonials, messages] =
    await Promise.all([
      prisma.edition.count(),
      prisma.winner.count(),
      prisma.eventPhoto.count(),
      prisma.eventDate.count(),
      prisma.filmReview.count(),
      prisma.seasonImage.count({ where: { featuredInCarousel: true } }),
      prisma.testimonial.count(),
      prisma.contactMessage.count({ where: { handled: false } }),
    ]);

  const contentCards = [
    { label: "Editions",          value: editions,     href: "/admin/editions" },
    { label: "Winners",           value: winners,      href: "/admin/editions" },
    { label: "Photos",            value: photos,       href: "/admin/photos" },
    { label: "Dates & Deadlines", value: dates,        href: "/admin/dates" },
    { label: "Film Reviews",      value: reviews,      href: "/admin/reviews" },
    { label: "Carousel",          value: carousel,     href: "/admin/carousel" },
    { label: "Testimonials",      value: testimonials, href: "/admin/testimonials" },
    { label: "Unread messages",   value: messages,     href: "/admin/settings" },
  ];

  const designCards = [
    { label: "Site Content", href: "/admin/content",  sub: "Edit text on every page"      },
    { label: "Site Logo",    href: "/admin/logo",     sub: "Upload logo & set size"        },
    { label: "Text Fonts",   href: "/admin/fonts",    sub: "Choose site-wide typeface"     },
    { label: "Certificates", href: "/admin/certificates", sub: "Generate & send certificates" },
    { label: "Settings",     href: "/admin/settings", sub: "Notification email and more"   },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-white/40">Sicilian Film Awards — admin panel</p>
      </div>

      <section>
        <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Content</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {contentCards.map((c) => (
            <Link key={c.label} href={c.href} className="bg-panel border border-white/10 p-5 hover:border-accent transition-colors">
              <p className="text-3xl font-bold text-accent">{c.value}</p>
              <p className="text-white/60 text-sm mt-1">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Design &amp; Settings</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {designCards.map((c) => (
            <Link key={c.label} href={c.href} className="bg-panel border border-white/10 p-5 hover:border-accent transition-colors flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-white">{c.label}</p>
                <p className="text-xs text-white/40 mt-1">{c.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
