"use client";

import { motion } from "framer-motion";
import {
  Wheat,
  Sprout,
  Flower2,
  Grape,
  Carrot,
  Bean,
  Leaf,
  Cherry,
  Trees,
  type LucideIcon,
} from "lucide-react";
import type { CropCategory, CropKey } from "@/types/community";

const CROP_ICON: Record<CropKey, LucideIcon> = {
  wheat: Wheat,
  rice: Sprout,
  cotton: Trees,
  sugarcane: Leaf,
  maize: Wheat,
  fruits: Cherry,
  vegetables: Carrot,
  pulses: Bean,
  flowers: Flower2,
  organic: Grape,
};

interface CategoryCardProps {
  category: CropCategory;
  onSelect?: (key: CropKey) => void;
}

export function CategoryCard({ category, onSelect }: CategoryCardProps) {
  const Icon = CROP_ICON[category.key];
  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(category.key)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-center shadow-sm transition-shadow hover:shadow-md"
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-full ${category.accent.bg} ${category.accent.text}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-label-md font-label-md text-on-surface">{category.label}</span>
      <span className="text-label-sm text-outline">{category.postCount.toLocaleString()} posts</span>
    </motion.button>
  );
}

export function CategoryGrid({
  categories,
  onSelect,
}: {
  categories: CropCategory[];
  onSelect?: (key: CropKey) => void;
}) {
  return (
    <section aria-label="Browse by crop category">
      <h3 className="mb-4 font-headline-md text-lg font-bold text-on-surface">Browse by Crop</h3>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {categories.map((c) => (
          <CategoryCard key={c.key} category={c} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
