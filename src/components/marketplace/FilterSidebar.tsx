"use client";
import { CATEGORIES } from "./data";
import type { FilterState } from "./MarketplacePage";
import { Search, X } from "lucide-react";

interface Props {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  categoryCounts: Record<string, number>;
  totalProducts: number;
  mobile?: boolean;
}

const LOCATIONS = [
  { value: "all", label: "All India" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Haryana", label: "Haryana" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
];

export default function FilterSidebar({
  activeCategory,
  onCategoryChange,
  filters,
  onFiltersChange,
  categoryCounts,
  totalProducts,
  mobile = false,
}: Props) {
  const update = (patch: Partial<FilterState>) =>
    onFiltersChange({ ...filters, ...patch });

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.maxPrice < 100000 ||
    filters.location !== "all" ||
    filters.minRating > 0;

  const content = (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div>
        <h3 className="mb-3 font-label-md text-label-md uppercase tracking-wider text-primary">Search</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="search"
            placeholder="Seeds, tractor, sprayer..."
            value={filters.searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-body-md outline-none focus:ring-1 focus:ring-primary placeholder:text-outline"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => update({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 font-label-md text-label-md uppercase tracking-wider text-primary">Categories</h3>
        <ul className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => {
            const count = cat.id === "all" ? totalProducts : (categoryCounts[cat.id] || 0);
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => onCategoryChange(cat.id)}
                  className={`flex w-full items-center justify-between rounded-xl p-2 text-left transition-all active:scale-95 ${
                    activeCategory === cat.id
                      ? "bg-secondary-container text-on-secondary-container"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                      {cat.icon}
                    </span>
                    {cat.label}
                  </span>
                  <span className="rounded-full bg-outline-variant/30 px-2 py-0.5 text-xs font-bold">
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-label-md text-label-md uppercase tracking-wider text-primary">Price Range</h3>
        <div className="px-1">
          <input
            type="range"
            min={0}
            max={100000}
            step={500}
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: Number(e.target.value) })}
            aria-label="Maximum price"
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-outline-variant accent-primary"
          />
          <div className="mt-2 flex justify-between text-label-sm text-on-surface-variant">
            <span>₹0</span>
            <span className="font-bold text-primary">Up to ₹{filters.maxPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="mb-3 font-label-md text-label-md uppercase tracking-wider text-primary">Location</h3>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline" aria-hidden>
            location_on
          </span>
          <select
            aria-label="Filter by location"
            value={filters.location}
            onChange={(e) => update({ location: e.target.value })}
            className="w-full appearance-none rounded-xl border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 text-body-md outline-none focus:ring-1 focus:ring-primary"
          >
            {LOCATIONS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ratings */}
      <div>
        <h3 className="mb-3 font-label-md text-label-md uppercase tracking-wider text-primary">Min Rating</h3>
        <div className="flex gap-1.5">
          {[0, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update({ minRating: r })}
              className={`flex flex-1 items-center justify-center gap-1 rounded-xl border py-1.5 text-label-sm transition-all ${
                filters.minRating === r
                  ? "border-primary bg-primary text-white"
                  : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {r === 0 ? "All" : `★ ${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            onFiltersChange({
              maxPrice: 100000,
              location: "all",
              minRating: 0,
              searchQuery: "",
            });
            onCategoryChange("all");
          }}
          className="flex items-center justify-center gap-2 rounded-xl border border-error/40 py-2 text-label-md text-error transition-colors hover:bg-error/5"
        >
          <X size={16} />
          Reset All Filters
        </button>
      )}

      {/* Expert CTA */}
      <div className="mt-auto flex flex-col gap-3 rounded-2xl bg-primary-container p-4 text-on-primary-container">
        <span className="material-symbols-outlined text-4xl" aria-hidden>
          support_agent
        </span>
        <div>
          <p className="font-bold text-label-md">Expert Consultation</p>
          <p className="text-[12px] opacity-90">Need help choosing the right equipment?</p>
        </div>
        <a
          href="/consult"
          className="w-full text-center rounded-xl bg-on-primary-container py-2 text-sm font-bold text-primary-container transition-transform hover:scale-105"
        >
          Chat Now
        </a>
      </div>
    </div>
  );

  if (mobile) {
    return content;
  }

  return (
    <aside
      data-lenis-prevent="true"
      className="hidden w-64 shrink-0 flex-col gap-8 border-r border-outline-variant bg-surface-container-low p-6 md:flex h-full overflow-y-auto custom-scrollbar"
    >
      {content}
    </aside>
  );
}
