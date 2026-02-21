"use client";

import { useState, useEffect } from "react";

const DISMISSED_KEY = "clarito_install_dismissed";

export default function InstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed, already installed, or on desktop
    if (typeof window === "undefined") return;

    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    // Check if running as standalone (already installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        (window.navigator as unknown as { standalone: boolean }).standalone);
    if (isStandalone) return;

    // Only show on mobile/tablet
    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;

    // Show after a short delay so it doesn't flash on load
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // localStorage unavailable
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-30 mx-auto max-w-lg animate-fade-in-up">
      <div className="flex items-center gap-3 rounded-2xl bg-clarito-green-dark p-3.5 shadow-xl ring-1 ring-white/10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-clarito-green/20">
          <svg
            className="h-5 w-5 text-clarito-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">
            Agregá Clarito a tu pantalla
          </p>
          <p className="text-xs text-green-200/60">
            Accedé más rápido, como una app
          </p>
        </div>
        <button
          onClick={dismiss}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-green-200/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Cerrar"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
