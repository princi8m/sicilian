"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "biff_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-rule bg-surface">
      <div className="container-x py-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <p className="text-xs text-text-muted leading-relaxed max-w-2xl">
          This website uses cookies to ensure basic functionality and to understand how visitors use the site.
          By continuing you agree to our use of cookies.{" "}
          <Link href="/impressum" className="underline underline-offset-2 hover:text-accent transition-colors">
            Legal information
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors px-4 py-2 border border-rule hover:border-white/30"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-[0.65rem] font-black uppercase tracking-widest bg-wine-red text-white px-5 py-2 hover:bg-wine-red/80 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
