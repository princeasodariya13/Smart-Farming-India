"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, Plus } from "lucide-react";

type Platform = "android" | "ios" | "desktop" | null;

function detectPlatform(): Platform {
  if (typeof window === "undefined") return null;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isAndroid = /Android/.test(ua);
  if (isIOS) return "ios";
  if (isAndroid) return "android";
  return "desktop";
}

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export default function PWAInstallBanner() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed as PWA
    if (isInStandaloneMode()) return;
    // Don't show if user already dismissed
    if (sessionStorage.getItem("pwa-banner-dismissed")) return;

    const p = detectPlatform();
    setPlatform(p);

    if (p === "ios") {
      // iOS: always show the banner (no install event exists)
      setTimeout(() => setShowBanner(true), 2000);
    } else if (p === "android" || p === "desktop") {
      // Android/Desktop: wait for browser install event
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowBanner(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleInstallClick = async () => {
    if (platform === "ios") {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  if (dismissed) return null;

  return (
    <>
      {/* ── Main Install Banner ─────────────────────────────── */}
      <AnimatePresence>
        {showBanner && !showIOSGuide && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:bottom-6 md:left-auto md:right-6 md:max-w-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden">
              {/* Green accent bar */}
              <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
              <div className="p-4 flex items-center gap-3">
                {/* App icon */}
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-2xl">🌿</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface leading-tight">Smart Farming India</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {platform === "ios" ? "Add to your home screen" : "Install the app — free!"}
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                >
                  <Download size={15} />
                  {platform === "ios" ? "How to Install" : "Install Now"}
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── iOS Step-by-Step Guide ──────────────────────────── */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={handleDismiss}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm border border-outline-variant/30 mb-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-on-surface">Install on iPhone / iPad</h3>
                <button onClick={handleDismiss} className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-on-surface-variant mb-5">Follow these 3 quick steps to add Smart Farming India to your home screen:</p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">1</div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Tap the Share button</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Find the <Share size={12} className="inline" /> Share icon at the bottom of Safari's browser bar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">2</div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Scroll down and tap</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Select <strong>"Add to Home Screen"</strong> <Plus size={12} className="inline" /> from the popup menu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">3</div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Tap "Add"</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Confirm by tapping <strong>"Add"</strong> in the top-right corner. Done! 🎉</p>
                  </div>
                </div>
              </div>

              {/* Arrow pointing down (simulating iOS share bar) */}
              <div className="mt-5 py-3 bg-surface-container-lowest rounded-xl text-center border border-outline-variant/30">
                <p className="text-xs text-on-surface-variant">👇 Tap the <strong>Share</strong> button at the bottom of your screen</p>
              </div>

              <button
                onClick={handleDismiss}
                className="mt-4 w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
