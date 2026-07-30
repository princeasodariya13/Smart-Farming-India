"use client";

import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";

interface SearchBarProps {
  states?: string[];
  categories?: string[];
  onSearch?: (query: string) => void;
  onStateChange?: (state: string) => void;
  onCategoryChange?: (category: string) => void;
  onCheckEligibility?: () => void;
}

const defaultStates = [
  "Gujarat",
];

const defaultCategories = [
  "All Categories",
  "Income Support",
  "Crop Insurance",
  "Irrigation",
  "Solar Energy",
  "Equipment Subsidy",
  "Organic Farming",
  "Livestock",
  "Fisheries",
  "Loans",
  "Training Programs",
];

export default function SearchBar({
  states = defaultStates,
  categories = defaultCategories,
  onSearch,
  onStateChange,
  onCategoryChange,
  onCheckEligibility,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-outline-variant/50 p-4 md:p-5 shadow-sm">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            size={18}
            aria-hidden="true"
          />
          <label htmlFor="scheme-search" className="sr-only">
            Search government schemes
          </label>
          <input
            id="scheme-search"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Search schemes by name or benefit..."
            className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/30 text-sm outline-none"
          />
        </div>

        <div className="grid grid-cols-2 md:flex gap-3 md:w-auto w-full shrink-0">
          <label className="sr-only" htmlFor="state-select">
            Select state
          </label>
          <select
            id="state-select"
            onChange={(e) => onStateChange?.(e.target.value)}
            className="w-full px-3 md:px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/30 text-[13px] md:text-sm outline-none"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="category-select">
            Select category
          </label>
          <select
            id="category-select"
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className="w-full px-3 md:px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/30 text-[13px] md:text-sm outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onCheckEligibility}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-transform shrink-0"
        >
          <ShieldCheck size={17} /> Check Eligibility
        </button>
      </div>
    </div>
  );
}
