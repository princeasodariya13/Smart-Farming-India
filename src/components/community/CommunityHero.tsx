"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, TrendingUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CropCategory } from "@/types/community";

interface CommunityHeroProps {
  farmerFirstName?: string;
  categories: CropCategory[];
  trendingQueries: string[];
  onCreatePost?: () => void;
  onSearch?: (query: string, category: string | null) => void;
}

export function CommunityHero({
  farmerFirstName = "Ramesh",
  categories,
  trendingQueries,
  onCreatePost,
  onSearch,
}: CommunityHeroProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, activeCategory);
  };

  return (
    <section
      aria-labelledby="community-hero-heading"
      className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest"
    >
      {/* Field-row texture: quiet diagonal furrows, not a stock gradient blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, currentColor 0px, currentColor 1.5px, transparent 1.5px, transparent 22px)",
        }}
      />
      <div className="relative z-10 flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container px-3 py-1 text-label-sm font-label-md text-on-primary-container">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              48,230 farmers growing together
            </span>
            <h1
              id="community-hero-heading"
              className="mt-3 font-headline-md text-3xl font-bold leading-tight text-on-surface sm:text-4xl"
            >
              Good to see you, {farmerFirstName}.
            </h1>
            <p className="mt-2 max-w-xl text-body-md text-on-surface-variant">
              Ask a question, share what&apos;s working in your field, or see what the rest of the
              community is harvesting this week.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={onCreatePost}
            whileTap={{ scale: 0.96 }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Post
          </motion.button>
        </div>

        {/* Search */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="community-search" className="sr-only">
            Search posts
          </label>
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-outline"
              aria-hidden="true"
            />
            <input
              id="community-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, crops, or questions…"
              className="w-full rounded-full border border-outline-variant/50 bg-surface-container-low py-3 pl-11 pr-4 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-full border border-outline-variant/50 bg-surface-container px-5 py-3 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-high"
          >
            Search
          </button>
        </form>

        {/* Trending search chips */}
        <div className="flex flex-wrap items-center gap-2 text-label-sm text-outline">
          <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {trendingQueries.map((tq) => (
            <button
              key={tq}
              type="button"
              onClick={() => {
                setQuery(tq);
                onSearch?.(tq, activeCategory);
              }}
              className="rounded-full px-2.5 py-1 transition-colors hover:bg-surface-container-high hover:text-on-surface"
            >
              {tq}
            </button>
          ))}
        </div>

        {/* Category selector */}
        <div
          role="tablist"
          aria-label="Filter by crop category"
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            role="tab"
            aria-selected={activeCategory === null}
            onClick={() => {
              setActiveCategory(null);
              onSearch?.(query, null);
            }}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-label-md font-label-md whitespace-nowrap transition-colors",
              activeCategory === null
                ? "bg-primary text-on-primary"
                : "border border-outline-variant/50 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            All crops
          </button>
          {categories.map((cat) => (
            <button
              key={cat.key}
              role="tab"
              aria-selected={activeCategory === cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                onSearch?.(query, cat.key);
              }}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-label-md font-label-md whitespace-nowrap transition-colors",
                activeCategory === cat.key
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant/50 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
