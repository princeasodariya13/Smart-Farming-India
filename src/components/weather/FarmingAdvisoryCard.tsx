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
      className="relative flex flex-col gap-8 overflow-hidden rounded-[20px] bg-primary p-6 md:p-8 text-white shadow-lg"
    >
      <div aria-hidden="true" className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <span className="rounded-2xl bg-white/20 p-4 backdrop-blur-md shrink-0">
              <BrainCircuit size={32} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold">AI Farming Advisory</h2>
              <p className="mt-1 max-w-2xl text-sm text-white/90 leading-relaxed">{advisory.summary || advisory.irrigation}</p>
            </div>
          </div>
          <button
            onClick={onOptimize}
            className="shrink-0 whitespace-nowrap rounded-xl bg-white px-6 py-3 font-bold text-primary shadow-sm transition-colors hover:bg-white/90 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            Optimize Irrigation
          </button>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {ROWS.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/15">
              <Icon size={20} className="mt-0.5 shrink-0 text-white/80" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <dt className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">{label}</dt>
                <dd className="text-sm text-white leading-relaxed">{advisory[key] as string}</dd>
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
    </motion.section>
  );
}
