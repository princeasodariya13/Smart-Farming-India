import { FeedSkeletonList, CategorySkeleton, EventSkeleton } from "@/components/community/SkeletonLoader";

export default function CommunityLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-sage">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex flex-col w-48 bg-surface-container-low border-r border-outline-variant p-2.5 gap-2 animate-pulse">
        <div className="h-10 rounded-lg bg-surface-container-high" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 rounded-lg bg-surface-container-high" />
        ))}
      </div>
      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 bg-surface-container-low border-b border-outline-variant animate-pulse" />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
            <div className="h-56 animate-pulse rounded-2xl bg-surface-container-high" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-surface-container-high" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-8">
                <FeedSkeletonList count={3} />
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <CategorySkeleton key={i} />
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <EventSkeleton key={i} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-6 lg:col-span-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-xl bg-surface-container-high" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
