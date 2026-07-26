"use client";

import { motion } from "framer-motion";
import { Sprout } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No posts yet",
  description = "Be the first to share something with the community — a question, a photo from the field, or a tip that worked for you.",
  actionLabel = "Create the first post",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-outline-variant/50 bg-surface-container-lowest px-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-container"
      >
        <Sprout className="h-9 w-9 text-on-primary-container" aria-hidden="true" />
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary"
          aria-hidden="true"
        />
      </motion.div>
      <div>
        <h3 className="font-headline-md text-lg font-bold text-on-surface">{title}</h3>
        <p className="mx-auto mt-1 max-w-sm text-body-md text-on-surface-variant">{description}</p>
      </div>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-full bg-primary px-6 py-2.5 text-label-md font-label-md text-on-primary shadow-sm transition-shadow hover:shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
