"use client";
import { useState } from "react";
import { EditPanel } from "./EditPanel";
import { LaurelEditPanel } from "./LaurelEditPanel";
import { SendButton } from "./SendButton";
import type { CertOverrides } from "@/lib/certificate";
import type { LaurelOverrides } from "@/lib/laurel";

interface Winner {
  id:                string;
  recipient:         string | null;
  filmTitle:         string | null;
  category:          string;
  email:             string | null;
  certificateSent:   boolean;
  certificateSentAt: Date | null;
  certOverrides:     string | null;
  laurelOverrides:   string | null;
}

export function WinnerRow({
  winner,
  hasTemplate,
  hasLaurel,
  editionDateLabel,
  msgSubject,
  msgBody,
  includeMessage,
}: {
  winner:            Winner;
  hasTemplate:       boolean;
  hasLaurel:         boolean;
  editionDateLabel:  string;
  msgSubject?:       string;
  msgBody?:          string;
  includeMessage?:   boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editingLaurel, setEditingLaurel] = useState(false);

  const currentOverrides: CertOverrides | null = (() => {
    if (!winner.certOverrides) return null;
    try { return JSON.parse(winner.certOverrides); } catch { return null; }
  })();

  const currentLaurelOverrides: LaurelOverrides | null = (() => {
    if (!winner.laurelOverrides) return null;
    try { return JSON.parse(winner.laurelOverrides); } catch { return null; }
  })();

  const hasOverrides = currentOverrides !== null;
  const hasLaurelOverrides = currentLaurelOverrides !== null;

  function openPreview() {
    window.open(`/api/certificate/preview/${winner.id}`, "_blank");
  }

  function openLaurelPreview() {
    window.open(`/api/laurel/preview/${winner.id}`, "_blank");
  }

  return (
    <div className="bg-panel border border-white/10 rounded-lg px-4 py-3">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {winner.recipient || "—"}
            {hasOverrides && (
              <span className="ml-2 text-xs text-accent/70 font-normal">custom layout</span>
            )}
            {hasLaurelOverrides && (
              <span className="ml-2 text-xs text-accent/70 font-normal">custom laurel</span>
            )}
          </p>
          <p className="text-xs text-white/50 truncate">{winner.filmTitle || "—"}</p>
          <p className="text-xs text-accent/80 truncate">{winner.category}</p>
        </div>

        {winner.email && (
          <div className="text-xs text-white/40 shrink-0 hidden sm:block">{winner.email}</div>
        )}

        {winner.certificateSent && (
          <span className="text-xs text-green-400 shrink-0">
            Sent{" "}
            {winner.certificateSentAt
              ? new Date(winner.certificateSentAt).toLocaleDateString()
              : ""}
          </span>
        )}

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {hasTemplate && (
            <>
              <button
                onClick={() => setEditing((v) => !v)}
                className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                  editing
                    ? "border-accent text-accent"
                    : "border-white/20 text-white/60 hover:border-white/40"
                }`}
              >
                {editing ? "Close" : "Edit layout"}
              </button>
              <button
                onClick={openPreview}
                className="text-xs px-3 py-1.5 rounded border border-white/20 text-white/70 hover:border-accent hover:text-accent"
              >
                Preview
              </button>
              <a
                href={`/api/certificate/preview/${winner.id}?download=1`}
                className="text-xs px-3 py-1.5 rounded border border-white/20 text-white/70 hover:border-accent hover:text-accent"
              >
                ↓ Download
              </a>
              {winner.email ? (
                <SendButton
                  winnerId={winner.id}
                  alreadySent={winner.certificateSent}
                  msgSubject={msgSubject}
                  msgBody={msgBody}
                  includeMessage={includeMessage}
                />
              ) : (
                <span className="text-xs text-white/25 italic">no email</span>
              )}
            </>
          )}

          {hasLaurel && (
            <>
              <button
                onClick={() => setEditingLaurel((v) => !v)}
                className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                  editingLaurel
                    ? "border-accent text-accent"
                    : "border-white/20 text-white/60 hover:border-white/40"
                }`}
              >
                {editingLaurel ? "Close" : "Edit laurel"}
              </button>
              <button
                onClick={openLaurelPreview}
                className="text-xs px-3 py-1.5 rounded border border-white/20 text-white/70 hover:border-accent hover:text-accent"
              >
                Preview laurel
              </button>
              <a
                href={`/api/laurel/preview/${winner.id}?download=1`}
                className="text-xs px-3 py-1.5 rounded border border-white/20 text-white/70 hover:border-accent hover:text-accent"
              >
                ↓ Laurel
              </a>
            </>
          )}
        </div>
      </div>

      {editing && (
        <EditPanel
          winnerId={winner.id}
          defaultName={winner.recipient || ""}
          defaultFilm={winner.filmTitle || ""}
          defaultCategory={winner.category}
          currentOverrides={currentOverrides}
          onSaved={() => {
            setEditing(false);
            openPreview();
          }}
        />
      )}

      {editingLaurel && (
        <LaurelEditPanel
          winnerId={winner.id}
          defaultCategory={winner.category}
          defaultDate={editionDateLabel}
          currentOverrides={currentLaurelOverrides}
          onSaved={() => {
            setEditingLaurel(false);
            openLaurelPreview();
          }}
        />
      )}
    </div>
  );
}
