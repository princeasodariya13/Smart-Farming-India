"use client";

import { motion } from "framer-motion";
import { Droplets, Tractor, Sun, Sprout, ArrowRight } from "lucide-react";
import type { RecommendedScheme } from "@/types/schemes";

interface RecommendationCardProps {
  recommendations?: RecommendedScheme[];
  onApply?: (id: string) => void;
}

const iconMap: Record<string, typeof Droplets> = {
  droplets: Droplets,
  tractor: Tractor,
  sun: Sun,
  sprout: Sprout,
};

const defaultRecommendations: RecommendedScheme[] = [
  {
    id: "r1",
    name: "Micro-Irrigation Subsidy",
    icon: "droplets",
    matchPercentage: 92,
    reason: "Matches your 2.5 hectare wheat farm in Gujarat",
  },
  {
    id: "r2",
    name: "Machinery Rental Grant",
    icon: "tractor",
    matchPercentage: 84,
    reason: "You've rented equipment 3 times this season",
  },
  {
    id: "r3",
    name: "PM Kusum Yojana",
    icon: "sun",
    matchPercentage: 77,
    reason: "Solar pump subsidy available in your district",
  },
];

export default function RecommendationCard({
  recommendations = defaultRecommendations,
  onApply,
}: RecommendationCardProps) {
  return (
    <section>
      <h2 className="text-lg font-bold text-on-surface mb-4">Recommended for Your Farm</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((r) => {
          const Icon = iconMap[r.icon] ?? Sprout;
          return (
            <motion.div
              key={r.id}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl border border-outline-variant/60 shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={20} />
                </span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {r.matchPercentage}% Match
                </span>
              </div>
              <h3 className="font-bold text-sm text-on-surface mb-1">{r.name}</h3>
              <p className="text-xs text-on-surface-variant mb-4">{r.reason}</p>
              <button
                type="button"
                onClick={() => onApply?.(r.id)}
                className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
              >
                Apply Now <ArrowRight size={14} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
