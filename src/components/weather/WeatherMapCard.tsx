"use client";

import { useState } from "react";
import { Satellite, CloudRain, Wind, Thermometer, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";

type MapLayer = "satellite" | "radar" | "wind" | "temperature";

const LAYERS: { key: MapLayer; label: string; icon: typeof Satellite }[] = [
  { key: "satellite", label: "Satellite View", icon: Satellite },
  { key: "radar", label: "Rain Radar", icon: CloudRain },
  { key: "wind", label: "Wind Layer", icon: Wind },
  { key: "temperature", label: "Temperature Layer", icon: Thermometer },
];

/**
 * Placeholder for the interactive weather map. No map logic — this is a
 * visual shell with layer toggles ready to wire up to a real map provider.
 */
export default function WeatherMapCard() {
  const [layer, setLayer] = useState<MapLayer>("satellite");

  return (
    <section className="space-y-6 rounded-[20px] border border-white/30 bg-white/70 p-6 shadow-sm backdrop-blur-xl md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-xl font-semibold text-on-surface">Interactive Weather Map</h3>
        <div role="tablist" aria-label="Map layer" className="flex flex-wrap gap-1 rounded-xl bg-surface-container-low p-1">
          {LAYERS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              role="tab"
              aria-selected={layer === key}
              onClick={() => setLayer(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                layer === key ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
              )}
            >
              <Icon size={14} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant">
        <MapPinned size={40} className="text-primary" aria-hidden="true" />
        <p className="text-sm">
          {LAYERS.find((l) => l.key === layer)?.label} — map integration connects here
        </p>
      </div>
    </section>
  );
}
