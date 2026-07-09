"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import type { RainfallDataPoint } from "@/types/weather";

type RangeOption = "weekly" | "monthly" | "forecast";

interface RainfallChartProps {
  /** Keyed by range so the parent can supply real data later. */
  data: Record<RangeOption, RainfallDataPoint[]>;
}

const RANGE_LABELS: Record<RangeOption, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  forecast: "Forecast",
};

/** Rainfall accumulation chart with weekly/monthly/forecast tabs. UI only. */
export default function RainfallChart({ data }: RainfallChartProps) {
  const [range, setRange] = useState<RangeOption>("weekly");
  const activeData = data[range];

  return (
    <section className="space-y-6 rounded-[20px] border border-white/30 bg-white/70 p-6 shadow-sm backdrop-blur-xl md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold text-on-surface">Rainfall Accumulation</h3>
          <p className="text-sm text-on-surface-variant">Actual vs predicted precipitation</p>
        </div>
        <div
          role="tablist"
          aria-label="Rainfall time range"
          className="flex gap-1 rounded-xl bg-surface-container-low p-1"
        >
          {(Object.keys(RANGE_LABELS) as RangeOption[]).map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={range === key}
              onClick={() => setRange(key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                range === key
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              {RANGE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full" role="img" aria-label={`${RANGE_LABELS[range]} rainfall chart`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={activeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#bfcaba" opacity={0.3} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#40493d" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#40493d" }} axisLine={false} tickLine={false} unit="mm" />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #bfcaba", fontSize: 13 }}
              formatter={(value: any, name: any) => [`${value} mm`, name]}
            />
            <Bar dataKey="actualMm" name="Actual" fill="#0d631b" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Line
              dataKey="forecastMm"
              name="Forecast"
              stroke="#0d631b"
              strokeDasharray="6 4"
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-3 w-3 rounded-full bg-primary" aria-hidden="true" />
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="h-3 w-3 rounded-full border-2 border-dashed border-primary" aria-hidden="true" />
          <span>Forecast</span>
        </div>
      </div>
    </section>
  );
}
