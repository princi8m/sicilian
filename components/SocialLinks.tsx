import { festival } from "@/lib/festival";

const socials = [
  {
    label: "Instagram",
    href: festival.socials.instagram,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

/** variant="icon" — bare icon squares (footer)
 *  variant="button" — icon + label pill (contact page)
 *  variant="cta" — full-width strip (home page, rendered externally) */
export default function SocialLinks({ variant = "icon" }: { variant?: "icon" | "button" }) {
  return (
    <div className="flex items-center gap-4">
      {socials.filter((s) => s.href).map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className={
            variant === "button"
              ? "flex items-center gap-3 border border-rule px-6 py-3 text-xs font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
              : "w-4 h-4 text-text-muted hover:text-accent transition-colors"
          }
        >
          {variant === "button" && (
            <span className="w-4 h-4 shrink-0">{s.icon}</span>
          )}
          {variant === "icon" && s.icon}
          {variant === "button" && s.label}
        </a>
      ))}
    </div>
  );
}
