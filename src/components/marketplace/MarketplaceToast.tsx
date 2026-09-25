"use client";
import { useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (opts: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev.slice(-3), { ...opts, id }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const ctx: ToastContextType = {
    toast: addToast,
    success: (title, message) => addToast({ type: "success", title, message }),
    error: (title, message) => addToast({ type: "error", title, message }),
    info: (title, message) => addToast({ type: "info", title, message }),
    warning: (title, message) => addToast({ type: "warning", title, message }),
  };

  const ICONS = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-blue-500" />,
    warning: <AlertTriangle size={18} className="text-orange-500" />,
  };

  const BG = {
    success: "border-green-200 bg-green-50",
    error: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50",
    warning: "border-orange-200 bg-orange-50",
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl min-w-[260px] max-w-[340px] ${BG[t.type]}`}
            >
              <span className="mt-0.5 shrink-0">{ICONS[t.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-on-surface leading-tight">
                  {t.title}
                </p>
                {t.message && (
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-full p-0.5 text-on-surface-variant hover:bg-black/10 transition-colors"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
