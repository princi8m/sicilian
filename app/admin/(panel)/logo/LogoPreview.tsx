"use client";
import { useState } from "react";

export default function LogoPreview({ src, height }: { src: string; height: number }) {
  const [dark, setDark] = useState(true);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Current logo</p>
        <button
          type="button"
          onClick={() => setDark((v) => !v)}
          className="text-[0.6rem] font-bold uppercase tracking-widest px-3 py-1 border border-white/20 text-white/40 hover:text-white/70 hover:border-white/40 transition-colors"
        >
          {dark ? "White bg" : "Dark bg"}
        </button>
      </div>
      <div
        className="p-4 inline-block transition-colors duration-200"
        style={{ background: dark ? "#111111" : "#ffffff" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Current logo" style={{ height: `${height}px` }} className="w-auto" />
      </div>
      <p className="text-xs text-white/30">Displayed at {height}px height in the nav bar</p>
    </div>
  );
}
