import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-surface-container-low via-surface-container-highest to-surface-container-low bg-[length:200%_100%]",
        className
      )}
    />
  );
}

/** Skeleton for the hero weather card. */
export function HeroSkeleton() {
  return (
    <div className="flex min-h-[320px] flex-col justify-between gap-8 rounded-[20px] border border-white/30 bg-white/70 p-8 md:flex-row">
      <div className="space-y-4">
        <Shimmer className="h-8 w-56" />
        <Shimmer className="h-12 w-40" />
      </div>
      <Shimmer className="h-28 w-28 rounded-full" />
    </div>
  );
}

/** Skeleton for a metric card grid. */
export function MetricGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-[20px] border border-white/30 bg-white/70 p-6">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton for a chart section. */
export function ChartSkeleton() {
  return (
    <div className="space-y-6 rounded-[20px] border border-white/30 bg-white/70 p-8">
      <Shimmer className="h-6 w-48" />
      <Shimmer className="h-64 w-full" />
    </div>
  );
}

/** Skeleton for the forecast strip. */
export function ForecastSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-[20px] border border-white/30 bg-white/70 p-8 sm:grid-cols-4 lg:grid-cols-7">
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer key={i} className="h-32 w-full rounded-2xl" />
      ))}
    </div>
  );
}

/** Skeleton for the AI advisory card. */
export function AdvisorySkeleton() {
  return (
    <div className="space-y-4 rounded-[20px] bg-surface-container-low p-8">
      <Shimmer className="h-6 w-64" />
      <Shimmer className="h-4 w-full max-w-xl" />
      <Shimmer className="h-4 w-full max-w-md" />
    </div>
  );
}
