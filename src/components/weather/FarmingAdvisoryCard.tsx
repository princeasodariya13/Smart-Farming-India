"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Droplets, SprayCan, Wheat, Sprout, Bug, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FarmingAdvisory, RiskLevel } from "@/types/weather";

const RISK_STYLES: Record<RiskLevel, string> = {
  low: "bg-white/20 text-white",
  moderate: "bg-white/30 text-white",
  high: "bg-white/40 text-white",
};

interface FarmingAdvisoryCardProps {
  advisory: FarmingAdvisory;
  onOptimize?: () => void;
}

const ROWS: { key: keyof FarmingAdvisory; label: string; icon: typeof Droplets }[] = [
  { key: "irrigation", label: "Irrigation", icon: Droplets },
  { key: "spraying", label: "Spraying", icon: SprayCan },
  { key: "fertilizer", label: "Fertilizer", icon: Sprout },
  { key: "harvest", label: "Harvest", icon: Wheat },
];

/** AI farming advisory card: irrigation/spraying/fertilizer/harvest + risk badges. */
export default function FarmingAdvisoryCard({ advisory, onOptimize }: FarmingAdvisoryCardProps) {
  return (
    <motion.section
      whileHover={{ y: -2 }}
      className="relative flex flex-col items-start gap-6 overflow-hidden rounded-[20px] bg-primary p-8 text-white shadow-lg md:flex-row md:items-center md:justify-between"
    >
      <div aria-hidden="true" className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col gap-6">
        <div className="flex items-start gap-4">
          <span className="rounded-2xl bg-white/20 p-4 backdrop-blur-md">
            <BrainCircuit size={32} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold">AI Farming Advisory</h2>
            <p className="mt-1 max-w-2xl text-sm text-white/90">{advisory.irrigation}</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROWS.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-start gap-2 rounded-xl bg-white/10 p-3">
              <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-white/70">{label}</dt>
                <dd className="text-sm">{advisory[key] as string}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-3">
          <span className={cn("flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium", RISK_STYLES[advisory.pestRisk])}>
            <Bug size={14} aria-hidden="true" /> Pest risk: {advisory.pestRisk}
          </span>
          <span className={cn("flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium", RISK_STYLES[advisory.diseaseRisk])}>
            <ShieldAlert size={14} aria-hidden="true" /> Disease risk: {advisory.diseaseRisk}
          </span>
        </div>
      </div>

      <button
        onClick={onOptimize}
        className="relative z-10 whitespace-nowrap rounded-xl bg-white px-8 py-4 font-bold text-primary shadow-sm transition-colors hover:bg-secondary-container active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
      >
        Optimize Irrigation
      </button>
    </motion.section>
  );
}
