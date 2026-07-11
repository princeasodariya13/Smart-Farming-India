"use client";

import { Ruler } from "lucide-react";
import type { RecentMeasurement } from "@/types/gps-calculator";

interface MeasurementCardProps {
  measurements?: RecentMeasurement[];
}

const defaultMeasurements: RecentMeasurement[] = [
  { id: "m1", fieldName: "West Block Wheat", areaAcres: 8.2, timestamp: "Today, 9:14 AM" },
  { id: "m2", fieldName: "New Sugarcane Plot", areaAcres: 14.5, timestamp: "Yesterday, 4:02 PM" },
  { id: "m3", fieldName: "Border Perimeter", areaAcres: 2.1, timestamp: "Oct 12, 11:30 AM" },
];

export default function MeasurementCard({
  measurements = defaultMeasurements,
}: MeasurementCardProps) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant p-4">
      <h3 className="font-bold text-xs text-on-surface mb-3 flex items-center gap-2">
        <Ruler size={14} className="text-primary" /> Recent Measurements
      </h3>
      <ol className="relative border-l border-outline-variant/60 pl-4 space-y-3">
        {measurements.map((m) => (
          <li key={m.id} className="relative">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
            <p className="text-xs font-semibold text-on-surface">{m.fieldName}</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              {m.areaAcres} Acres · {m.timestamp}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
