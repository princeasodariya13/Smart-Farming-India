"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Landmark,
  Wrench,
  ShoppingCart,
  PackageCheck,
  ScanSearch,
  MapPinned,
  FileText,
  MessageSquare,
} from "lucide-react";
import type { ProfileStat } from "@/types/profile";

interface ProfileStatsProps {
  stats?: ProfileStat[];
}

const iconMap: Record<string, typeof Landmark> = {
  landmark: Landmark,
  wrench: Wrench,
  cart: ShoppingCart,
  rental: PackageCheck,
  scan: ScanSearch,
  gps: MapPinned,
  scheme: FileText,
  community: MessageSquare,
};

const defaultStats: ProfileStat[] = [
  { id: "farms", label: "Farms Registered", value: 3, icon: "landmark" },
  { id: "equipment", label: "Equipment Listed", value: 5, icon: "wrench" },
  { id: "orders", label: "Marketplace Orders", value: 27, icon: "cart" },
  { id: "rentals", label: "Rentals Completed", value: 12, icon: "rental" },
  { id: "scans", label: "Disease Scans", value: 41, icon: "scan" },
  { id: "fields", label: "GPS Fields Saved", value: 8, icon: "gps" },
  { id: "schemes", label: "Schemes Applied", value: 14, icon: "scheme" },
  { id: "posts", label: "Community Posts", value: 19, icon: "community" },
];

function Counter({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [value, mv]);

  return <motion.span>{rounded}</motion.span>;
}

export default function ProfileStats({ stats = defaultStats }: ProfileStatsProps) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] ?? Landmark;
        return (
          <motion.div
            key={stat.id}
            whileHover={{ y: -4 }}
            className="bg-white p-5 rounded-2xl border border-outline-variant/60 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Icon size={18} />
              </span>
            </div>
            <p className="text-2xl font-bold text-on-surface">
              <Counter value={stat.value} />
            </p>
            <p className="text-[11px] text-on-surface-variant uppercase tracking-wide mt-1">
              {stat.label}
            </p>
          </motion.div>
        );
      })}
    </section>
  );
}
