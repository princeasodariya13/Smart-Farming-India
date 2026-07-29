"use client";

import { motion } from "framer-motion";
import type { QuickAction } from "@/types/weather";

interface QuickActionCardProps {
  action: QuickAction;
  isLoading?: boolean;
}

function QuickActionCard({ action, isLoading }: QuickActionCardProps) {
  const Icon = action.icon;
  const showLoading = isLoading;

  return (
    <motion.button
      whileHover={showLoading ? {} : { y: -2 }}
      whileTap={showLoading ? {} : { scale: 0.97 }}
      onClick={action.onClick}
      disabled={showLoading}
      className="flex flex-col items-center gap-3 rounded-2xl border border-white/30 bg-white/70 p-6 text-center shadow-sm backdrop-blur-xl transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:opacity-70 disabled:cursor-wait"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon size={22} className={showLoading ? "animate-spin" : ""} aria-hidden="true" />
      </span>
      <span className="text-sm font-medium text-on-surface">{showLoading ? "Processing..." : action.label}</span>
    </motion.button>
  );
}

interface QuickActionsProps {
  actions: QuickAction[];
  loadingActionId?: string | null;
}

/** Grid of quick-action buttons (refresh, download report, radar, advisory). */
export default function QuickActions({ actions, loadingActionId }: QuickActionsProps) {
  return (
    <section aria-label="Quick actions" className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {actions.map((action) => (
        <QuickActionCard key={action.id} action={action} isLoading={loadingActionId === action.id} />
      ))}
    </section>
  );
}
