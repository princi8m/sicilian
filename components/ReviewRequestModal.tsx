"use client";
import { useState } from "react";

export default function ReviewRequestModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Banner */}
      <div className="border border-rule mt-16 p-8 flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-2">For Filmmakers</p>
          <p className="text-lg font-black uppercase tracking-tight leading-snug">
            Have your film featured in our reviews
          </p>
          <p className="text-sm text-text-muted mt-2 max-w-md">
            We work with independent filmmakers worldwide. If you would like your film considered for a review, get in touch — we&apos;ll be happy to hear from you.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 bg-wine-red text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors"
        >
          Request a Review
        </button>
      </div>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-surface border border-rule w-full max-w-lg">
            <div className="flex items-center justify-between border-b border-rule px-6 py-4">
              <p className="text-xs font-black uppercase tracking-[0.2em]">Request a Review</p>
              <button
                onClick={() => setOpen(false)}
                className="text-text-muted hover:text-white text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-10 text-center flex flex-col items-center gap-5">
              <p className="text-sm text-text-muted leading-relaxed max-w-sm">
                Write to us directly and we will get back to you as soon as possible — usually within one working day.
              </p>
              <a
                href={`mailto:${"info"}@${"sicilianfilmawards"}.com`}
                className="group flex items-center gap-2 border border-rule px-6 py-3 hover:border-accent transition-colors"
              >
                <span className="text-sm font-black uppercase tracking-tight group-hover:text-accent transition-colors">
                  info&#64;sicilianfilmawards.com
                </span>
              </a>
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-text-muted hover:text-white transition-colors uppercase tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
