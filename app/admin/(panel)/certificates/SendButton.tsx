"use client";
import { useFormState, useFormStatus } from "react-dom";
import { sendCertificate } from "./actions";

function SubmitBtn({ alreadySent }: { alreadySent: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`text-xs px-3 py-1.5 rounded font-medium transition-opacity disabled:opacity-50 ${
        alreadySent
          ? "bg-white/10 text-white/60 hover:bg-accent/20 hover:text-accent"
          : "bg-wine-red text-white hover:bg-wine-red/80"
      }`}
    >
      {pending ? "Sending…" : alreadySent ? "Re-send" : "Send"}
    </button>
  );
}

export function SendButton({
  winnerId,
  alreadySent,
  msgSubject,
  msgBody,
  includeMessage,
}: {
  winnerId:       string;
  alreadySent:    boolean;
  msgSubject?:    string;
  msgBody?:       string;
  includeMessage?: boolean;
}) {
  const [state, action] = useFormState(sendCertificate, null);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="winnerId"       value={winnerId} />
      <input type="hidden" name="includeMessage" value={includeMessage ? "1" : "0"} />
      <input type="hidden" name="messageSubject" value={msgSubject ?? ""} />
      <input type="hidden" name="messageBody"    value={msgBody ?? ""} />
      <SubmitBtn alreadySent={alreadySent} />
      {state?.ok    && <span className="text-xs text-green-400">Sent ✓</span>}
      {state?.error && <span className="text-xs text-red-400">{state.error}</span>}
    </form>
  );
}
