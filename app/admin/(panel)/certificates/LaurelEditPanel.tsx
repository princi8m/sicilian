"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { saveLaurelOverrides } from "./actions";
import type { LaurelOverrides } from "@/lib/laurel";

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1.5 text-xs rounded bg-wine-red text-white font-medium disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save & preview"}
    </button>
  );
}

function SizeControl({ name, label }: { name: string; label: string }) {
  const [val, setVal] = useState(100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/40 w-20">{label} size</span>
      <input
        type="range"
        min={60}
        max={140}
        step={5}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-28 accent-accent"
      />
      <span className="text-xs text-white/60 w-8">{val}%</span>
      {/* Only this hidden field is actually submitted — see EditPanel.tsx's SizeControl
          for why the range input above is deliberately unnamed. */}
      <input type="hidden" name={name} value={(val / 100).toFixed(2)} />
    </div>
  );
}

export function LaurelEditPanel({
  winnerId,
  defaultCategory,
  defaultDate,
  currentOverrides,
  onSaved,
}: {
  winnerId:         string;
  defaultCategory:  string;
  defaultDate?:     string;
  currentOverrides: LaurelOverrides | null;
  onSaved:          () => void;
}) {
  const [state, action] = useFormState(saveLaurelOverrides, null);

  if (state?.ok) { onSaved(); }

  return (
    <form action={action} className="mt-3 p-4 bg-[#111] border border-white/10 rounded-lg space-y-4">
      <input type="hidden" name="winnerId" value={winnerId} />

      <p className="text-xs text-white/40 leading-relaxed">
        Customise how text appears on the laurel. Use <kbd className="bg-white/10 px-1 rounded">Enter</kbd> to force a line break.
        Leave a field empty to use the automatic layout.
      </p>

      <div className="space-y-1">
        <label className="text-xs text-white/60 font-medium">Award / category</label>
        <textarea
          name="category"
          rows={2}
          defaultValue={currentOverrides?.category ?? defaultCategory.toUpperCase()}
          className="w-full bg-panel border border-white/15 rounded px-3 py-2 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-accent font-mono"
        />
        <SizeControl name="categorySizeMultiplier" label="Award" />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-white/60 font-medium">Date</label>
        <textarea
          name="date"
          rows={1}
          placeholder={defaultDate}
          defaultValue={currentOverrides?.date ?? ""}
          className="w-full bg-panel border border-white/15 rounded px-3 py-2 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-accent font-mono"
        />
        <SizeControl name="dateSizeMultiplier" label="Date" />
      </div>

      <div className="flex items-center gap-3">
        <SaveBtn />
        <button
          type="button"
          onClick={async () => {
            const fd = new FormData();
            fd.append("winnerId", winnerId);
            await saveLaurelOverrides(null, fd);
            onSaved();
          }}
          className="px-3 py-1.5 text-xs rounded border border-white/20 text-white/60 hover:border-white/40"
        >
          Reset to auto
        </button>
        {state?.error && <span className="text-xs text-red-400">{state.error}</span>}
      </div>
    </form>
  );
}
