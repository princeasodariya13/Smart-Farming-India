"use client";

import { useState } from "react";
import { Search, ShieldCheck, ChevronDown } from "lucide-react";

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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
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
            className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-sm outline-none transition-all hover:bg-surface-container-low font-medium text-on-surface"
          />
        </div>

        <div className="grid grid-cols-2 md:flex gap-3 md:w-auto w-full shrink-0">
          <label className="sr-only" htmlFor="state-select">
            Select state
          </label>
          <div className="relative group">
            <select
              id="state-select"
              onChange={(e) => onStateChange?.(e.target.value)}
              className="appearance-none w-full pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-[13px] md:text-sm outline-none cursor-pointer transition-all hover:bg-surface-container-low font-semibold text-on-surface"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none group-hover:text-primary transition-colors" 
              size={18} 
            />
          </div>

          <label className="sr-only" htmlFor="category-select">
            Select category
          </label>
          <div className="relative group">
            <select
              id="category-select"
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="appearance-none w-full pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-[13px] md:text-sm outline-none cursor-pointer transition-all hover:bg-surface-container-low font-semibold text-on-surface"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none group-hover:text-primary transition-colors" 
              size={18} 
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onCheckEligibility}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-sm shrink-0"
        >
          <ShieldCheck size={18} strokeWidth={2.5} /> Check Eligibility
        </button>
      </div>
    </div>
  );
}
