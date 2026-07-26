"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const typeConfig: Record<ToastType, { icon: any; style: string }> = {
  success: { icon: CheckCircle2, style: "bg-success-soft text-primary border-primary/20" },
  info: { icon: Info, style: "bg-surface-container-high text-on-surface border-outline-variant/40" },
  warning: { icon: AlertTriangle, style: "bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary/20" },
  error: { icon: XCircle, style: "bg-error-container text-on-error-container border-error/20" },
};

export default function Toast({ message, type = "info", isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center pointer-events-none px-4"
        >
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-xl pointer-events-auto ${config.style}`}
          >
            <Icon size={20} className="shrink-0" />
            <p className="text-sm font-semibold pr-4">{message}</p>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 rounded-full transition-colors ml-auto"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
