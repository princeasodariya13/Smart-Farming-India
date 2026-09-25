"use client";
import { LayoutGrid, List, SlidersHorizontal, ShoppingCart, X } from "lucide-react";
import type { SortOption, ViewMode } from "./types";

interface Props {
  productCount: number;
  totalCount: number;
  sortBy: SortOption;
  viewMode: ViewMode;
  onSortChange: (s: SortOption) => void;
  onViewModeChange: (v: ViewMode) => void;
  onAddPost: () => void;
  onMobileFilterOpen: () => void;
  cartCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function MarketplaceHeader({
  productCount,
  totalCount,
  sortBy,
  viewMode,
  onSortChange,
  onViewModeChange,
  onAddPost,
  onMobileFilterOpen,
  cartCount,
  hasActiveFilters,
  onClearFilters,
  searchQuery,
  onSearchChange,
}: Props) {
  return (
    <header className="mb-6 space-y-4">
      {/* Title Row */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1
            className="font-bold text-on-surface"
            style={{ fontSize: "clamp(24px, 4vw, 40px)", lineHeight: "1.2" }}
          >
            Agricultural Marketplace &amp; Equipment Rental
          </h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Rent tractors, buy certified seeds, and trade farm supplies across India.
            {" "}
            <span className="text-label-md text-outline">
              {hasActiveFilters
                ? `${productCount} of ${totalCount} products`
                : `${productCount} products`}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Cart Badge */}
          <a
            href="#cart"
            className="relative flex items-center gap-1.5 rounded-full border border-outline-variant px-3 py-2 text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </a>

          {/* Add Post Button */}
          <button
            onClick={onAddPost}
            id="marketplace-add-post-btn"
            className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-label-md font-bold text-white transition hover:brightness-110 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Post
          </button>
        </div>
      </div>

      {/* Toolbar Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={onMobileFilterOpen}
          className="md:hidden flex items-center gap-2 rounded-full border border-outline-variant px-3 py-2 text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-white font-bold">
              ✓
            </span>
          )}
        </button>

        {/* Active filter chip */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="hidden md:flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1.5 text-label-sm text-primary font-semibold hover:bg-error/10 hover:border-error/30 hover:text-error transition-colors"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}

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
              <option key={o.value} value={o.value}>{o.label}</option>
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
            className={`px-3 py-2 transition-colors ${
              viewMode === "grid"
                ? "bg-surface-container-high text-primary"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            onClick={() => onViewModeChange("list")}
            className={`px-3 py-2 transition-colors ${
              viewMode === "list"
                ? "bg-surface-container-high text-primary"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
