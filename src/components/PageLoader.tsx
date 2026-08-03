"use client";

import { Leaf } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans w-full">
      {/* Sidebar Skeleton (hidden on mobile, visible md+) */}
      <aside className="hidden md:flex flex-col h-full w-48 lg:w-64 bg-surface-container-low border-r border-outline-variant p-2.5 gap-2 shrink-0">
        <div className="flex items-center gap-2 px-2 py-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high animate-pulse shrink-0"></div>
          <div className="h-5 w-24 bg-surface-container-high rounded-full animate-pulse"></div>
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-5 h-5 rounded bg-surface-container-high animate-pulse shrink-0"></div>
            <div className="h-3 w-20 bg-surface-container-high rounded-full animate-pulse"></div>
          </div>
        ))}
        <div className="mt-auto border-t border-outline-variant/50 pt-4 space-y-3">
          <div className="h-10 w-full bg-surface-container-high rounded-lg animate-pulse"></div>
          <div className="h-10 w-full bg-surface-container-high rounded-lg animate-pulse"></div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* TopNavBar Skeleton */}
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 flex items-center justify-between px-6 w-full shrink-0">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-surface-container-high animate-pulse shrink-0"></div>
            <div className="w-6 h-6 rounded bg-surface-container-high animate-pulse shrink-0"></div>
          </div>
          <div className="hidden md:block"></div>
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 rounded-full bg-surface-container-high animate-pulse shrink-0"></div>
            <div className="w-8 h-8 rounded-full bg-surface-container-high animate-pulse shrink-0"></div>
          </div>
        </header>

        {/* Content Area Skeleton - YouTube style generic grid */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          {/* Header text skeleton */}
          <div className="space-y-3">
            <div className="h-8 w-48 sm:w-64 bg-surface-container-high rounded-full animate-pulse"></div>
            <div className="h-4 w-3/4 sm:w-96 bg-surface-container-high rounded-full animate-pulse"></div>
          </div>
          
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-outline-variant/60 shadow-sm p-5 animate-pulse flex flex-col min-h-[220px]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-surface-container-high shrink-0"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-3/4 bg-surface-container-high rounded-full"></div>
                    <div className="h-3 w-1/2 bg-surface-container-high rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2.5 mb-4">
                  <div className="h-3 w-full bg-surface-container-highest rounded-full"></div>
                  <div className="h-3 w-5/6 bg-surface-container-highest rounded-full"></div>
                </div>
                <div className="mt-auto pt-4 border-t border-outline-variant/40 flex justify-between gap-2">
                  <div className="h-9 flex-1 bg-surface-container-high rounded-lg"></div>
                  <div className="h-9 flex-1 bg-surface-container-high rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
