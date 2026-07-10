"use client";
import { useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";

export default function SubmitButton({
  children,
  pendingLabel = "Saving…",
  savedLabel = "Saved",
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  savedLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
    prevPending.current = pending;
  }, [pending]);

  const isGray = pending || saved;

  return (
    <button
      type="submit"
      disabled={pending}
      className={`transition-opacity ${className}${isGray ? " !opacity-40 !pointer-events-none" : ""}`}
    >
      {pending ? pendingLabel : saved ? savedLabel : children}
    </button>
  );
}
