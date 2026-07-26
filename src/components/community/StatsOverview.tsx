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
    <section aria-label="Community statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {stats.map((stat, i) => {
        const Icon = ICONS[stat.icon] ?? Users;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            whileHover={{ y: -2 }}
            className="flex flex-col gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="font-headline-md text-lg font-bold leading-none text-on-surface">{stat.value}</p>
              <p className="mt-1 text-label-sm text-outline">{stat.label}</p>
            </div>
            {stat.deltaLabel && (
              <p className="text-label-sm font-label-md text-primary">{stat.deltaLabel}</p>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}
