"use client";

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-surface-container-high rounded-xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export function MapSkeleton() {
  return <Shimmer className="flex-1 min-h-[420px] lg:min-h-0 rounded-none" />;
}

export function StatisticsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Shimmer className="col-span-2 h-24" />
      <Shimmer className="h-20" />
      <Shimmer className="h-20" />
    </div>
  );
}

export function SavedFieldsSkeleton() {
  return (
    <div className="px-4 space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 p-3">
          <Shimmer className="w-16 h-16 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <Shimmer className="h-3 w-2/3" />
            <Shimmer className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <Shimmer key={i} className="h-24" />
      ))}
    </div>
  );
}
