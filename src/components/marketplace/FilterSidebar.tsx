"use client";
import { CATEGORIES } from "./data";

interface Props {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export default function FilterSidebar({ activeCategory, onCategoryChange }: Props) {
  return (
    <aside
      data-lenis-prevent="true"
      className="hidden w-64 shrink-0 flex-col gap-8 border-r border-outline-variant bg-surface-container-low p-6 md:flex sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar"
    >
      {/* Categories */}
      <FilterSection title="Categories">
        <ul className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
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
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    {cat.icon}
                  </span>
                  {cat.label}
                </span>
                {cat.count !== undefined && (
                  <span className="rounded-full bg-outline-variant/30 px-2 py-0.5 text-xs font-bold">
                    {cat.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="px-2">
          <input
            type="range"
            min={0}
            max={100000}
            defaultValue={50000}
            aria-label="Maximum price"
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-outline-variant accent-primary"
          />
          <div className="mt-2 flex justify-between text-label-sm text-on-surface-variant">
            <span>₹0</span>
            <span>₹1,00,000+</span>
          </div>
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location">
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline"
            aria-hidden
          >
            location_on
          </span>
          <select
            aria-label="Filter by location"
            className="w-full appearance-none rounded-xl border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 text-body-md outline-none focus:ring-1 focus:ring-primary"
          >
            <option>Punjab, IN</option>
            <option>Haryana, IN</option>
            <option>Maharashtra, IN</option>
            <option>Karnataka, IN</option>
          </select>
        </div>
      </FilterSection>

      {/* Ratings */}
      <FilterSection title="Min Rating">
        <div className="flex gap-1">
          {[3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-outline-variant py-1.5 text-label-sm text-on-surface-variant transition-all hover:border-primary hover:text-primary"
            >
              ★ {r}+
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Reset */}
      <button
        type="button"
        onClick={() => onCategoryChange("all")}
        className="rounded-xl border border-outline-variant py-2 text-label-md text-on-surface-variant transition-colors hover:border-error hover:text-error"
      >
        Reset Filters
      </button>

      {/* Expert CTA */}
      <div className="mt-auto flex flex-col gap-3 rounded-2xl bg-primary-container p-4 text-on-primary-container">
        <span className="material-symbols-outlined text-4xl" aria-hidden>
          support_agent
        </span>
        <div>
          <p className="font-bold text-label-md">Expert Consultation</p>
          <p className="text-[12px] opacity-90">Need help choosing the right equipment?</p>
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-on-primary-container py-2 text-sm font-bold text-primary-container transition-transform hover:scale-105"
        >
          Chat Now
        </button>
      </div>
    </aside>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-4 font-label-md text-label-md uppercase tracking-wider text-primary">
        {title}
      </h3>
      {children}
    </div>
  );
}
