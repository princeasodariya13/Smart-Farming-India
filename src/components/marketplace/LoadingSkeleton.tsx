export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 xl:grid-cols-3" aria-busy aria-label="Loading products">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-[20px] border border-outline-variant/30 bg-surface-container-lowest p-4"
        >
          <div className="mb-4 aspect-video animate-pulse rounded-xl bg-surface-container-high" />
          <div className="mb-2 h-5 w-3/4 animate-pulse rounded-lg bg-surface-container-high" />
          <div className="mb-4 h-3 w-1/2 animate-pulse rounded-lg bg-surface-container-high" />
          <div className="mb-6 h-7 w-1/3 animate-pulse rounded-lg bg-surface-container-high" />
          <div className="h-12 animate-pulse rounded-xl bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="h-4 w-24 animate-pulse rounded-lg bg-surface-container-high" />
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-9 animate-pulse rounded-xl bg-surface-container-high" />
          ))}
        </div>
      ))}
    </div>
  );
}
