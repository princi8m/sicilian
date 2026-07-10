interface FactItem {
  value?: string;
  label: string;
  sub?: string;
  /** Optional decorative motif (ceramic-tile icon) shown faintly in the card. */
  icon?: string;
}

/**
 * Bordered grid of small info cards — big value, mono uppercase label,
 * optional muted sub-line. Used for stats, festival facts, and rule cards.
 */
export default function FactGrid({
  items,
  cols = 4,
}: {
  items: FactItem[];
  cols?: 2 | 3 | 4;
}) {
  const colsClass =
    cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 md:grid-cols-4";

  return (
    <div className={`grid grid-cols-2 ${colsClass}`}>
      {items.map((it, i) => (
        <div key={i} className="relative bg-bg border border-rule p-6 flex flex-col justify-center gap-3 min-h-[110px] overflow-hidden">
          {it.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={it.icon}
              alt=""
              aria-hidden="true"
              className="absolute -top-2 -right-2 w-14 h-14 object-contain opacity-25 pointer-events-none"
            />
          )}
          <span
            className={`w-7 h-7 shrink-0 ${i % 2 === 0 ? "bg-wine-red" : "bg-accent"}`}
            aria-hidden="true"
          />
          {it.value ? (
            <p className="font-display text-3xl md:text-4xl text-accent leading-none">{it.value}</p>
          ) : null}
          <p
            className={`font-mono text-[0.62rem] tracking-[0.15em] uppercase ${
              it.value ? "text-text-muted" : "text-text-primary text-xs leading-snug"
            }`}
          >
            {it.label}
          </p>
          {it.sub && <p className="font-mono text-[0.58rem] text-text-muted/70">{it.sub}</p>}
        </div>
      ))}
    </div>
  );
}
