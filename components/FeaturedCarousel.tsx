"use client";
import { useEffect, useRef } from "react";

type Item = { id: string; title: string; previewImage: string; linkUrl?: string | null };

const STEP  = 192; // 176px card + 16px gap
const SPEED = 40;  // px per second

export default function FeaturedCarousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offset   = useRef(0);
  const paused   = useRef(false);
  const total    = items.length * STEP; // width of one full set

  useEffect(() => {
    if (!total) return;
    let last: number | undefined;
    let rafId: number;

    const tick = (t: number) => {
      if (last !== undefined && !paused.current) {
        const dt = t - last;
        offset.current = (offset.current + (SPEED * dt) / 1000) % total;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${offset.current}px)`;
        }
      }
      last = t;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [total]);

  if (!items.length) return null;

  const doubled = [...items, ...items];

  const jump = (dir: number) => {
    offset.current = ((offset.current + dir * STEP) % total + total) % total;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${offset.current}px)`;
    }
  };

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div
        ref={trackRef}
        className="flex gap-4 pb-2"
        style={{ width: "max-content", willChange: "transform" }}
      >
        {doubled.map((f, i) => {
          const card = (
            <div className="shrink-0 w-44">
              <div className="aspect-[2/3] overflow-hidden bg-bg border border-rule flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.previewImage}
                  alt={f.title}
                  className="w-full h-full object-contain grayscale"
                />
              </div>
              <p className="mt-2 text-[0.6rem] font-black tracking-[0.15em] text-text-muted uppercase leading-snug">
                {f.title}
              </p>
            </div>
          );
          return f.linkUrl ? (
            <a key={i} href={f.linkUrl} className="block">{card}</a>
          ) : (
            <div key={i}>{card}</div>
          );
        })}
      </div>

      <button
        onClick={() => jump(-1)}
        aria-label="Previous"
        className="absolute left-0 top-[42%] -translate-y-1/2 bg-surface border border-rule hover:bg-wine-red hover:border-wine-red hover:text-white w-8 h-8 text-base leading-none flex items-center justify-center transition-colors z-10"
      >
        ‹
      </button>
      <button
        onClick={() => jump(1)}
        aria-label="Next"
        className="absolute right-0 top-[42%] -translate-y-1/2 bg-surface border border-rule hover:bg-wine-red hover:border-wine-red hover:text-white w-8 h-8 text-base leading-none flex items-center justify-center transition-colors z-10"
      >
        ›
      </button>
    </div>
  );
}
