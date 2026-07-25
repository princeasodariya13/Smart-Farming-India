"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Leaf,
  Cpu,
  Trophy,
  Wrench,
  Rocket,
  Users,
} from "lucide-react";
import type { Achievement } from "@/types/profile";

interface AchievementCardProps {
  achievements?: Achievement[];
}

const iconMap: Record<string, typeof ShieldCheck> = {
  verified: ShieldCheck,
  organic: Leaf,
  smart: Cpu,
  seller: Trophy,
  equipment: Wrench,
  early: Rocket,
  community: Users,
};

const tierStyles: Record<Achievement["tier"], string> = {
  gold: "from-tertiary-fixed to-tertiary-container text-on-tertiary-fixed-variant",
  silver: "from-surface-container-high to-surface-container text-on-surface",
  bronze: "from-primary-fixed to-primary-fixed-dim text-on-primary-fixed-variant",
};

const defaultAchievements: Achievement[] = [
  { id: "b1", title: "Verified Farmer", description: "Identity & land verified", icon: "verified", tier: "gold", earned: true },
  { id: "b2", title: "Organic Farming", description: "Certified organic practices", icon: "organic", tier: "silver", earned: true },
  { id: "b3", title: "Smart Farmer", description: "Uses AI diagnostics regularly", icon: "smart", tier: "silver", earned: true },
  { id: "b4", title: "Top Seller", description: "50+ marketplace orders", icon: "seller", tier: "gold", earned: false },
  { id: "b5", title: "Equipment Owner", description: "Listed 3+ equipment items", icon: "equipment", tier: "bronze", earned: true },
  { id: "b6", title: "Early Adopter", description: "Joined in the first year", icon: "early", tier: "bronze", earned: true },
  { id: "b7", title: "Community Helper", description: "10+ helpful community posts", icon: "community", tier: "silver", earned: false },
];

export default function AchievementCard({ achievements = defaultAchievements }: AchievementCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm">
      <h2 className="text-lg font-bold text-on-surface mb-6">Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.length === 0 ? (
          <div className="col-span-full py-6 text-center text-on-surface-variant bg-surface-container-low/50 border border-dashed border-outline-variant/60 rounded-xl">
            No achievements yet.
          </div>
        ) : achievements.map((a) => {
          const Icon = iconMap[a.icon];
          return (
            <motion.div
              key={a.id}
              whileHover={{ y: -3 }}
              className={`p-4 rounded-2xl text-center border border-outline-variant/40 ${
                a.earned ? "" : "opacity-40 grayscale"
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${tierStyles[a.tier]} flex items-center justify-center mb-2`}
              >
                <Icon size={20} />
              </div>
              <p className="text-xs font-bold text-on-surface">{a.title}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{a.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
