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

export function ProfileHeaderSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white">
      <Shimmer className="h-32 md:h-44 w-full rounded-none" />
      <div className="p-8 -mt-14 flex gap-6 items-end">
        <Shimmer className="w-28 h-28 rounded-full border-4 border-white" />
        <div className="flex-1 space-y-2 pt-4">
          <Shimmer className="h-6 w-48" />
          <Shimmer className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}

export function ProfileStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Shimmer key={i} className="h-24" />
      ))}
    </div>
  );
}

export function CardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 space-y-4">
      <Shimmer className="h-5 w-40" />
      {Array.from({ length: rows }).map((_, i) => (
        <Shimmer key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
