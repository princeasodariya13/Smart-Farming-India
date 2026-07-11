"use client";

import { LayoutGrid, MapPinned, Ruler, Wheat } from "lucide-react";
import type { AnalyticsSummary } from "@/types/gps-calculator";

interface AnalyticsCardProps {
  summary?: AnalyticsSummary;
}

const defaultSummary: AnalyticsSummary = {
  totalFields: 8,
  totalAreaManaged: 61.8,
  averageFieldSize: 7.7,
  mostGrownCrop: "Wheat",
};

export default function AnalyticsCard({ summary = defaultSummary }: AnalyticsCardProps) {
  const items = [
    { icon: LayoutGrid, label: "Total Fields", value: summary.totalFields.toString() },
    { icon: MapPinned, label: "Area Managed", value: `${summary.totalAreaManaged} Ac` },
    { icon: Ruler, label: "Avg. Field Size", value: `${summary.averageFieldSize} Ac` },
    { icon: Wheat, label: "Top Crop", value: summary.mostGrownCrop },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="p-3 bg-white rounded-xl border border-outline-variant/60 flex flex-col gap-1.5"
        >
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Icon size={14} />
          </div>
          <p className="text-sm font-bold text-on-surface mt-1">{value}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">{label}</p>
        </div>
      ))}
    </div>
  );
}
