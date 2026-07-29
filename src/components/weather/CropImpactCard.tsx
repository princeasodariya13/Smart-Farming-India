"use client";

import { motion } from "framer-motion";
import { Wheat, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CropWeatherImpact, RiskLevel } from "@/types/weather";

const RISK_STYLES: Record<RiskLevel, string> = {
  low: "bg-primary/10 text-primary",
  moderate: "bg-tertiary/10 text-tertiary",
  high: "bg-error/10 text-error",
};

interface CropImpactCardProps {
  crop: CropWeatherImpact;
}

/** Card summarizing how current/forecast weather affects a specific crop. */
export default function CropImpactCard({ crop }: CropImpactCardProps) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="space-y-4 rounded-2xl border border-white/30 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Wheat size={20} className="text-primary shrink-0" aria-hidden="true" />
          <h4 className="font-semibold text-on-surface truncate whitespace-nowrap">{crop.cropName}</h4>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-medium capitalize shrink-0 whitespace-nowrap", RISK_STYLES[crop.riskLevel])}>
          {crop.riskLevel} risk
        </span>
      </div>
      <p className="text-sm text-on-surface-variant break-words">{crop.impact}</p>
      <div className="flex items-start gap-2 text-sm text-on-surface">
        <ArrowRight size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <span>{crop.recommendedAction}</span>
      </div>
    </motion.article>
  );
}
