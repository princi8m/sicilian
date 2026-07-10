"use client";
import { useState } from "react";

export default function HeightSlider({ defaultValue }: { defaultValue: number }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-widest text-white/60">
        Height in nav bar: <span className="text-white">{value}px</span>
      </label>
      <input
        type="range"
        name="height"
        min="16"
        max="80"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-accent"
      />
      <div className="flex justify-between text-xs text-white/30">
        <span>16px</span><span>80px</span>
      </div>
    </div>
  );
}
