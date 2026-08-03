"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  CheckCircle2,
  HelpCircle,
  Image as ImageIcon,
  MapPin,
  MessagesSquare,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CommunityStat } from "@/types/community";

const ICONS: Record<string, LucideIcon> = {
  Users,
  Activity,
  HelpCircle,
  CheckCircle2,
  Image: ImageIcon,
  BadgeCheck,
  MapPin,
  MessagesSquare,
};

interface StatsOverviewProps {
  stats: CommunityStat[];
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <section aria-label="Community statistics" className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {stats.map((stat, i) => {
        const Icon = ICONS[stat.icon] ?? Users;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            whileHover={{ y: -2 }}
            className="flex flex-col gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 sm:p-4 shadow-sm"
          >
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="font-headline-md text-base sm:text-lg font-bold leading-none text-on-surface">{stat.value}</p>
              <p className="mt-1 text-[11px] sm:text-label-sm text-outline leading-tight">{stat.label}</p>
            </div>
            {stat.deltaLabel && (
              <p className="text-[11px] sm:text-label-sm font-label-md text-primary leading-tight">{stat.deltaLabel}</p>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}
