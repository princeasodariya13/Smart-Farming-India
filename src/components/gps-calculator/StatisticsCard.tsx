"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import type { FieldStats } from "@/types/gps-calculator";

interface StatisticsCardProps {
  stats?: FieldStats;
}

const defaultStats: FieldStats = {
  totalAreaAcres: 1,
  totalAreaHectares: 0.4047,
  totalAreaBigha: 2.5,
  totalAreaGuntha: 40,
  totalAreaSqm: 4047,
  totalAreaSqFt: 43560,
  totalAreaVar: 4840,
  perimeterMeters: 250,
  vertexCount: 4,
};

function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [value, mv]);

  return <motion.span>{rounded}</motion.span>;
}

export default function StatisticsCard({ stats = defaultStats }: StatisticsCardProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="col-span-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
        <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
          Total Area
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-primary">
            <Counter value={stats.totalAreaAcres} decimals={2} />
          </span>
          <span className="text-sm font-semibold text-on-surface-variant">Acres</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-y-1 text-xs font-medium text-on-surface-variant/80">
          <span>{stats.totalAreaHectares.toFixed(2)} Ha</span>
          <span>{stats.totalAreaBigha.toFixed(2)} Bigha</span>
          <span>{stats.totalAreaSqFt.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Sq.Ft</span>
          <span>{stats.totalAreaGuntha?.toFixed(2) || 0} Guntha</span>
        </div>
      </div>
      <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
        <p className="text-[10px] font-semibold text-on-surface-variant uppercase mb-0.5">
          Perimeter
        </p>
        <span className="text-lg font-bold text-on-surface">{stats.perimeterMeters} m</span>
      </div>
      <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
        <p className="text-[10px] font-semibold text-on-surface-variant uppercase mb-0.5">
          Vertices
        </p>
        <span className="text-lg font-bold text-on-surface">{stats.vertexCount} Points</span>
      </div>
    </div>
  );
}
