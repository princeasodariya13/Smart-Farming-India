"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WeatherMetric } from "@/types/weather";

const STATUS_STYLES = {
  primary: "bg-primary/10 text-primary",
  warning: "bg-tertiary/10 text-tertiary",
  danger: "bg-error/10 text-error",
  info: "bg-blue-500/10 text-blue-600",
};

const TREND_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus };

interface WeatherMetricCardProps {
  metric: WeatherMetric;
  className?: string;
}

/** Premium metric card: icon, value/unit, optional trend and status badge. */
export default function WeatherMetricCard({ metric, className }: WeatherMetricCardProps) {
  const { label, value, unit, icon: Icon, trend, trendValue, status } = metric;
  const TrendIcon = trend ? TREND_ICON[trend] : null;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "space-y-4 rounded-[20px] border border-white/30 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-lg",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          {label}
        </span>
        <Icon size={20} className="text-primary" aria-hidden="true" />
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-on-surface">{value}</span>
          {unit && <span className="text-sm text-on-surface-variant">{unit}</span>}
        </div>
        {status && (
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              STATUS_STYLES[status.tone]
            )}
          >
            {status.label}
          </span>
        )}
      </div>

      {trend && TrendIcon && (
        <div className="flex items-center gap-1 text-sm text-on-surface-variant">
          <TrendIcon
            size={16}
            className={trend === "up" ? "text-error" : trend === "down" ? "text-primary" : ""}
            aria-hidden="true"
          />
          <span>{trendValue}</span>
        </div>
      )}
    </motion.article>
  );
}
