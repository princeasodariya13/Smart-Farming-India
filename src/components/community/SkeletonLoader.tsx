import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-container-high",
        className
      )}
    />
  );
}

export function FeedCardSkeleton() {
  return (
    <div className="flex overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 sm:p-6">
      <div className="flex-1">
        <div className="mb-4 flex items-center gap-3">
          <Shimmer className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-3 w-32" />
            <Shimmer className="h-2.5 w-24" />
          </div>
        </div>
        <Shimmer className="mb-2 h-4 w-2/3" />
        <Shimmer className="mb-1.5 h-3 w-full" />
        <Shimmer className="mb-4 h-3 w-4/5" />
        <Shimmer className="mb-4 aspect-video w-full rounded-xl" />
        <div className="flex gap-3">
          <Shimmer className="h-6 w-16" />
          <Shimmer className="h-6 w-16" />
          <Shimmer className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
      <Shimmer className="h-11 w-11 rounded-full" />
      <Shimmer className="h-3 w-14" />
      <Shimmer className="h-2.5 w-10" />
    </div>
  );
}

export function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
      <Shimmer className="aspect-[16/9] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Shimmer className="h-3.5 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
        <Shimmer className="h-3 w-1/3" />
        <Shimmer className="mt-2 h-8 w-full rounded-full" />
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Shimmer className="h-8 w-8 rounded-full" />
      <Shimmer className="h-9 w-9 rounded-full" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-2.5 w-32" />
      </div>
      <Shimmer className="h-3 w-10" />
    </div>
  );
}

export function FeedSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: count }).map((_, i) => (
        <FeedCardSkeleton key={i} />
      ))}
    </div>
  );
}
