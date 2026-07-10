"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { sendAllCertificates } from "./actions";
import { festival } from "@/lib/festival";

interface PastMessage {
  id: string;
  subject: string | null;
  body: string;
  createdAt: Date;
}

function SendAllBtn({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-wine-red text-white text-xs font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors disabled:opacity-50"
    >
      {pending ? "Sending…" : `Send all (${count} with email)`}
    </button>
  );
}

function EmailPreview({ body, include }: { body: string; include: boolean }) {
  const middle = include && body.trim()
    ? body.trim()
    : "It has been a pleasure to have your work selected. We look forward to seeing you at future editions.";

  return (
    <div className="bg-[#0b0b0b] border border-white/10 rounded p-4 text-sm text-white/70 leading-relaxed space-y-3">
      <p className="text-[0.6rem] font-black uppercase tracking-widest text-white/30 mb-2">Email preview</p>
      <p>Dear <span className="text-white/50 italic">[Recipient Name]</span>,</p>
      <p>
        Congratulations on winning{" "}
        <strong className="text-white/80"><span className="italic">[Category]</span></strong>{" "}
        at the {festival.name}!<br />
        Please find your official award certificate attached.
      </p>
      {middle.split("\n").filter(Boolean).map((line, i) => (
        <p key={i} className={include && body.trim() ? "text-white/90" : "text-white/40 italic"}>
          {line}
        </p>
      ))}
      <p className="text-white/50">
        Best regards,<br />
        <strong className="text-white/70">{festival.name}</strong>
      </p>
    </div>
  );
}

export function MessageComposer({
  editionId,
  emailCount,
  pastMessages,
  onMessageChange,
}: {
  editionId: string;
  emailCount: number;
  pastMessages: PastMessage[];
  onMessageChange: (subject: string, body: string, include: boolean) => void;
}) {
  const [subject,     setSubject]     = useState("");
  const [body,        setBody]        = useState("");
  const [include,     setInclude]     = useState(true);
  const [showPast,    setShowPast]    = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [state, action] = useFormState(sendAllCertificates, null);

  function applyPast(msg: PastMessage) {
    const s = msg.subject ?? "";
    const b = msg.body;
    setSubject(s);
    setBody(b);
    setInclude(true);
    onMessageChange(s, b, true);
    setShowPast(false);
  }

  function notify(newSubject: string, newBody: string, newInclude: boolean) {
    onMessageChange(newSubject, newBody, newInclude);
  }

  return (
    <div className="border border-white/10 bg-panel rounded-lg p-5 mb-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-widest text-white/60">Email message</p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-xs text-accent hover:text-white transition-colors"
          >
            {showPreview ? "Hide preview" : "Preview email"}
          </button>
          {pastMessages.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPast((v) => !v)}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              {showPast ? "Hide past" : `Past messages (${pastMessages.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Past messages */}
      {showPast && (
        <div className="space-y-2 border-t border-white/10 pt-4">
          {pastMessages.map((m) => (
            <div key={m.id} className="bg-white/5 border border-white/10 rounded p-3 flex gap-3">
              <div className="flex-1 min-w-0">
                {m.subject && (
                  <p className="text-xs font-black text-white/70 mb-1">{m.subject}</p>
                )}
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{m.body}</p>
                <p className="text-[0.6rem] text-white/25 mt-1">
                  {new Date(m.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => applyPast(m)}
                className="shrink-0 text-xs px-3 py-1 border border-accent/40 text-accent hover:bg-wine-red hover:text-white transition-colors self-start"
              >
                Use
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Include checkbox */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={include}
          onChange={(e) => {
            setInclude(e.target.checked);
            notify(subject, body, e.target.checked);
          }}
          className="w-4 h-4 accent-[#c9a84c]"
        />
        <span className="text-sm text-white/80">Include a personal message in the email</span>
      </label>

      {/* Composer fields */}
      {include && (
        <div className="space-y-3">
          <div>
            <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/40 block mb-1">
              Subject (optional — leave blank for default)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); notify(e.target.value, body, include); }}
              placeholder={`Your ${festival.name} Certificate — [category]`}
              className="w-full bg-[#0b0b0b] border border-white/10 px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/40 block mb-1">
              Message body
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => { setBody(e.target.value); notify(subject, e.target.value, include); }}
              placeholder="Write a personal message to accompany the certificate…"
              className="w-full bg-[#0b0b0b] border border-white/10 px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 resize-y"
            />
          </div>
        </div>
      )}

      {/* Live preview */}
      {showPreview && <EmailPreview body={body} include={include} />}

      {/* Send all */}
      <div className="border-t border-white/10 pt-4">
        <form action={action} className="flex items-center gap-4 flex-wrap">
          <input type="hidden" name="editionId"      value={editionId} />
          <input type="hidden" name="includeMessage" value={include ? "1" : "0"} />
          <input type="hidden" name="messageSubject" value={subject} />
          <input type="hidden" name="messageBody"    value={body} />
          <SendAllBtn count={emailCount} />
          {state && (
            <span className={`text-xs ${state.ok ? "text-green-400" : "text-yellow-400"}`}>
              {state.sent} sent
              {state.errors.length > 0 &&
                ` · ${state.errors.length} error${state.errors.length > 1 ? "s" : ""}`}
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
