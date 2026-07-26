"use client";

import { motion } from "framer-motion";
import {
  Banknote,
  Umbrella,
  Droplets,
  Sun,
  Wrench,
  Leaf,
  PawPrint,
  Fish,
  Landmark,
  GraduationCap,
} from "lucide-react";
import type { SchemeCategory } from "@/types/schemes";

interface CategoryCardProps {
  categories?: SchemeCategory[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

const iconMap: Record<string, typeof Banknote> = {
  income: Banknote,
  insurance: Umbrella,
  irrigation: Droplets,
  solar: Sun,
  equipment: Wrench,
  organic: Leaf,
  livestock: PawPrint,
  fisheries: Fish,
  loans: Landmark,
  training: GraduationCap,
};

const defaultCategories: SchemeCategory[] = [
  { id: "income", label: "Income Support", icon: "income", schemeCount: 6 },
  { id: "insurance", label: "Crop Insurance", icon: "insurance", schemeCount: 4 },
  { id: "irrigation", label: "Irrigation", icon: "irrigation", schemeCount: 5 },
  { id: "solar", label: "Solar Energy", icon: "solar", schemeCount: 3 },
  { id: "equipment", label: "Equipment Subsidy", icon: "equipment", schemeCount: 7 },
  { id: "organic", label: "Organic Farming", icon: "organic", schemeCount: 2 },
  { id: "livestock", label: "Livestock", icon: "livestock", schemeCount: 4 },
  { id: "fisheries", label: "Fisheries", icon: "fisheries", schemeCount: 2 },
  { id: "loans", label: "Loans", icon: "loans", schemeCount: 8 },
  { id: "training", label: "Training Programs", icon: "training", schemeCount: 5 },
];

export default function CategoryCard({
  categories = defaultCategories,
  activeId,
  onSelect,
}: CategoryCardProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon] ?? Banknote;
        const active = activeId === cat.id;
        return (
          <motion.button
            key={cat.id}
            type="button"
            whileHover={{ y: -3 }}
            onClick={() => onSelect?.(cat.id)}
            aria-pressed={active}
            className={`flex flex-col items-center text-center gap-2 p-4 rounded-2xl border transition-colors ${
              active
                ? "bg-primary text-white border-primary"
                : "bg-white border-outline-variant/60 hover:border-primary/40 text-on-surface"
            }`}
          >
            <span
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                active ? "bg-white/20" : "bg-primary/10 text-primary"
              }`}
            >
              <Icon size={20} />
            </span>
            <span className="text-xs font-semibold">{cat.label}</span>
            <span className={`text-[10px] ${active ? "text-white/80" : "text-on-surface-variant"}`}>
              {cat.schemeCount} schemes
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
