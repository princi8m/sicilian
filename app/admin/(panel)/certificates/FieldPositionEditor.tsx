"use client";
import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { FieldLayout } from "festival-engine-core";
import type { FieldPositionState } from "./field-position-actions";

export interface FieldSpec {
  key:      string;
  label:    string;
  sizeMin:  number; // slider bounds, in percent of image height
  sizeMax:  number;
}

type SaveAction = (prevState: FieldPositionState, formData: FormData) => Promise<FieldPositionState>;

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1.5 text-xs rounded bg-accent text-white font-medium disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save layout"}
    </button>
  );
}

// Certificate fields are anchor:"center" (yFrac measured from the BOTTOM, pdf-lib's
// origin) — the on-screen drag position is naturally distance-from-top, so it has to be
// inverted. Laurel fields are anchor:"top" (yFrac measured from the top already) and map
// directly. Getting this backwards would make dragging a certificate field up on screen
// move it DOWN in the generated PDF.
function pctFromLayout(l: FieldLayout): number {
  return l.anchor === "top" ? l.yFrac : 1 - l.yFrac;
}
function yFracFromPct(l: FieldLayout, pct: number): number {
  return l.anchor === "top" ? pct : 1 - pct;
}

export function FieldPositionEditor({
  title,
  previewUrl,
  fields,
  initialLayout,
  codeDefaultLayout,
  saveAction,
  resetAction,
}: {
  title:             string;
  previewUrl:        string;
  fields:            FieldSpec[];
  /** What's shown on load — the admin-saved layout if one exists, else the code default. */
  initialLayout:     Record<string, FieldLayout>;
  /** The pure code default, always — used by "Reset to default" so it doesn't need a page
   *  refresh to show correctly when initialLayout was itself an admin-saved override. */
  codeDefaultLayout: Record<string, FieldLayout>;
  saveAction:        SaveAction;
  resetAction:       () => Promise<void>;
}) {
  const [layout, setLayout] = useState<Record<string, FieldLayout>>(initialLayout);
  const [state, formAction] = useFormState(saveAction, null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingKey = useRef<string | null>(null);

  function updateField(key: string, patch: Partial<FieldLayout>) {
    setLayout((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  function onPointerDown(key: string) {
    return (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      draggingKey.current = key;
    };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const key = draggingKey.current;
    if (!key || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    setLayout((prev) => ({ ...prev, [key]: { ...prev[key], yFrac: yFracFromPct(prev[key], pct) } }));
  }
  function onPointerUp() {
    draggingKey.current = null;
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <h2 className="text-sm font-semibold mb-3">{title}</h2>

      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative w-full max-w-md rounded border border-white/10 overflow-hidden select-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt={title} className="w-full block pointer-events-none" draggable={false} />
        {fields.map((f) => {
          const l = layout[f.key];
          const pct = pctFromLayout(l) * 100;
          return (
            <div
              key={f.key}
              onPointerDown={onPointerDown(f.key)}
              style={{ top: `${pct}%`, left: "50%", transform: "translate(-50%, -50%)" }}
              className="absolute cursor-ns-resize touch-none whitespace-nowrap rounded border border-white/40 bg-accent/85 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg"
            >
              {f.label}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-white/30 mt-2">Drag a label up or down to reposition it. Width and size below.</p>

      <div className="mt-4 space-y-3">
        {fields.map((f) => {
          const l = layout[f.key];
          return (
            <div key={f.key} className="flex items-center gap-4 flex-wrap text-xs">
              <span className="w-20 shrink-0 text-white/50">{f.label}</span>
              <label className="flex items-center gap-1.5 text-white/40">
                Width
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={1}
                  value={Math.round(l.maxWidthFrac * 100)}
                  onChange={(e) => updateField(f.key, { maxWidthFrac: Number(e.target.value) / 100 })}
                  className="w-24 accent-accent"
                />
                <span className="w-9 text-white/60">{Math.round(l.maxWidthFrac * 100)}%</span>
              </label>
              <label className="flex items-center gap-1.5 text-white/40">
                Size
                <input
                  type="range"
                  min={f.sizeMin}
                  max={f.sizeMax}
                  step={0.1}
                  value={Number((l.sizeFrac * 100).toFixed(1))}
                  onChange={(e) => updateField(f.key, { sizeFrac: Number(e.target.value) / 100 })}
                  className="w-24 accent-accent"
                />
                <span className="w-10 text-white/60">{(l.sizeFrac * 100).toFixed(1)}%</span>
              </label>
            </div>
          );
        })}
      </div>

      <form action={formAction} className="mt-4 flex items-center gap-3">
        <input type="hidden" name="layout" value={JSON.stringify(layout)} />
        <SaveBtn />
        <button
          type="button"
          onClick={async () => {
            await resetAction();
            setLayout(codeDefaultLayout);
          }}
          className="px-3 py-1.5 text-xs rounded border border-white/20 text-white/60 hover:border-white/40"
        >
          Reset to default
        </button>
        {state?.ok && <span className="text-xs text-green-400">Saved</span>}
        {state && !state.ok && <span className="text-xs text-red-400">{state.error}</span>}
      </form>
    </div>
  );
}
