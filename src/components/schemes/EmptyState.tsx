"use client";

import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No schemes found.",
  description = "Try adjusting your search, state, or category filters.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-outline-variant/60">
      <span className="w-16 h-16 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center mb-4">
        <SearchX size={28} />
      </span>
      <p className="font-bold text-on-surface">{title}</p>
      <p className="text-sm text-on-surface-variant mt-1 max-w-xs">{description}</p>
    </div>
  );
}
