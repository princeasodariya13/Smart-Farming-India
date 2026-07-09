"use client";

import { motion } from "framer-motion";
import type { QuickAction } from "@/types/weather";

interface QuickActionCardProps {
  action: QuickAction;
}

function QuickActionCard({ action }: QuickActionCardProps) {
  const Icon = action.icon;
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={action.onClick}
      className="flex flex-col items-center gap-3 rounded-2xl border border-white/30 bg-white/70 p-6 text-center shadow-sm backdrop-blur-xl transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon size={22} aria-hidden="true" />
      </span>
      <span className="text-sm font-medium text-on-surface">{action.label}</span>
    </motion.button>
  );
}

interface QuickActionsProps {
  actions: QuickAction[];
}

/** Grid of quick-action buttons (refresh, download report, radar, advisory). */
export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section aria-label="Quick actions" className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {actions.map((action) => (
        <QuickActionCard key={action.id} action={action} />
      ))}
    </section>
  );
}
