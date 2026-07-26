"use client";

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-surface-container-high rounded-xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}

export function SchemeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 space-y-3">
      <Shimmer className="w-14 h-14 rounded-xl" />
      <Shimmer className="h-5 w-2/3" />
      <Shimmer className="h-3 w-1/3" />
      <Shimmer className="h-16 w-full" />
      <Shimmer className="h-10 w-full" />
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <Shimmer key={i} className="h-28" />
      ))}
    </div>
  );
}

export function RecommendationSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Shimmer key={i} className="h-40" />
      ))}
    </div>
  );
}

export function TrackerSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/60 p-8 space-y-4">
      <Shimmer className="h-6 w-1/2" />
      <Shimmer className="h-2 w-full" />
      {[1, 2, 3].map((i) => (
        <Shimmer key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
