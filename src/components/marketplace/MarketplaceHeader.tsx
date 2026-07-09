"use client";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import type { SortOption, ViewMode } from "./types";

interface Props {
  productCount: number;
  sortBy: SortOption;
  viewMode: ViewMode;
  onSortChange: (s: SortOption) => void;
  onViewModeChange: (v: ViewMode) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function MarketplaceHeader({
  productCount,
  sortBy,
  viewMode,
  onSortChange,
  onViewModeChange,
}: Props) {
  return (
    <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="font-bold text-display-lg text-on-surface md:text-display-lg" style={{ fontSize: "clamp(32px,5vw,48px)" }}>
          Agri-Marketplace
        </h1>
        <p className="mt-1 text-body-lg text-on-surface-variant">
          Find premium equipment and high-yield supplies for your farm.
          <span className="ml-2 text-label-md text-outline">
            ({productCount} products)
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Sort */}
        <div className="relative flex items-center gap-2 rounded-full border border-outline-variant px-4 py-2 text-label-md hover:bg-surface-container-high">
          <SlidersHorizontal size={16} className="text-on-surface-variant" aria-hidden />
          <label htmlFor="sort-select" className="sr-only">Sort by</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="cursor-pointer bg-transparent text-label-md outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div className="flex overflow-hidden rounded-full border border-outline-variant">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            onClick={() => onViewModeChange("grid")}
            className={`px-3 py-2 transition-colors ${viewMode === "grid" ? "bg-surface-container-high text-primary" : "text-on-surface-variant hover:bg-surface-container-high"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            onClick={() => onViewModeChange("list")}
            className={`px-3 py-2 transition-colors ${viewMode === "list" ? "bg-surface-container-high text-primary" : "text-on-surface-variant hover:bg-surface-container-high"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
