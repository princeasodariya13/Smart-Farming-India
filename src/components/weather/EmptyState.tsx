"use client";

import { CloudOff } from "lucide-react";

interface WeatherEmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

/** Empty state shown when no weather data / location is available yet. */
export default function WeatherEmptyState({
  title = "No weather data yet",
  description = "Enable location access or add your farm's address to see live weather intelligence.",
  action,
}: WeatherEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[20px] border border-dashed border-outline-variant bg-white/70 p-16 text-center backdrop-blur-xl">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CloudOff size={28} aria-hidden="true" />
      </span>
      <h3 className="text-xl font-semibold text-on-surface">{title}</h3>
      <p className="max-w-md text-sm text-on-surface-variant">{description}</p>
      {action}
    </div>
  );
}
