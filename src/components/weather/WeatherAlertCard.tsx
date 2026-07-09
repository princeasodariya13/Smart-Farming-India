"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CloudRain, Sun, Wind, Snowflake, CloudLightning } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WeatherAlert } from "@/types/weather";

const TYPE_ICON: Record<WeatherAlert["type"], typeof CloudRain> = {
  "Heavy Rain": CloudRain,
  Heatwave: Sun,
  "Strong Wind": Wind,
  Frost: Snowflake,
  Storm: CloudLightning,
};

const SEVERITY_STYLES: Record<WeatherAlert["severity"], string> = {
  low: "bg-primary/10 text-primary",
  moderate: "bg-tertiary/10 text-tertiary",
  high: "bg-orange-500/10 text-orange-600",
  severe: "bg-error/10 text-error",
};

interface WeatherAlertCardProps {
  alert: WeatherAlert;
  onAction?: (alert: WeatherAlert) => void;
}

/** Alert card for severe-weather notifications, e.g. heavy rain or frost. */
export default function WeatherAlertCard({ alert, onAction }: WeatherAlertCardProps) {
  const Icon = TYPE_ICON[alert.type];

  return (
    <motion.article
      whileHover={{ y: -2 }}
      role="alert"
      className="flex flex-col gap-4 rounded-2xl border border-white/30 bg-white/70 p-5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-4">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", SEVERITY_STYLES[alert.severity])}>
          <Icon size={20} aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-on-surface">{alert.type}</h4>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", SEVERITY_STYLES[alert.severity])}>
              <AlertTriangle size={12} className="mr-1 inline" aria-hidden="true" />
              {alert.severity}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant">{alert.description}</p>
          <p className="text-xs text-outline">{alert.timestamp}</p>
        </div>
      </div>
      {alert.actionLabel && (
        <button
          onClick={() => onAction?.(alert)}
          className="shrink-0 rounded-xl border border-outline-variant px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-on-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          {alert.actionLabel}
        </button>
      )}
    </motion.article>
  );
}
