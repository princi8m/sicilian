"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { festival } from "@/lib/festival";

const ALL_NAV = [
  { href: "/submissions", label: "Submit",       key: "submissions" },
  { href: "/winners",     label: "Winners",      key: "winners"     },
  { href: "/reviews",     label: "Film Reviews", key: "reviews"     },
  { href: "/events",      label: "Events",       key: "events"      },
  { href: "/photos",      label: "Photos",       key: "photos"      },
  { href: "/dates",       label: "Dates",        key: "dates"       },
  { href: "/shop",        label: "Shop",         key: "shop"        },
  { href: "/contact",     label: "Contact",      key: "contact"     },
];

export default function SiteHeader({
  navEnabled = {},
  logoPath = "/uploads/trinacria-logo.png",
  logoHeight = 32,
}: {
  navEnabled?: Record<string, boolean>;
  logoPath?: string;
  logoHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // If a key has no setting stored, default to visible
  const nav = ALL_NAV.filter((n) => navEnabled[n.key] !== false);

  return (
    <header className="border-b border-rule bg-bg sticky top-0 z-40">
      <div className="container-x flex items-center justify-between min-h-14 py-2">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 text-xs font-black tracking-[0.2em] uppercase text-text-primary"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoPath} alt="" style={{ height: logoHeight }} width={logoHeight} className="shrink-0 object-contain" />
          {festival.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-7 text-[0.65rem] font-black tracking-[0.18em] uppercase">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`hover:text-accent transition-colors ${pathname === n.href ? "text-accent" : ""}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 shrink-0"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-full bg-text-primary transition-transform duration-200 origin-center ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`block h-px w-full bg-text-primary transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-full bg-text-primary transition-transform duration-200 origin-center ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden border-t border-rule bg-bg">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`flex items-center px-5 py-4 text-xs font-black uppercase tracking-[0.2em] border-b border-rule hover:text-accent transition-colors ${pathname === n.href ? "text-accent" : "text-text-primary"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
