"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "./types";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
  viewMode: string;
  onQuickView: (product: Product) => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export default function ProductGrid({ products, viewMode, onQuickView }: Props) {
  if (products.length === 0) return <EmptyState />;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={
        viewMode === "list"
          ? "flex flex-col gap-4"
          : "grid grid-cols-1 gap-gutter sm:grid-cols-2 xl:grid-cols-3"
      }
    >
      <AnimatePresence mode="popLayout">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} viewMode={viewMode} onQuickView={onQuickView} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 rounded-[20px] border border-outline-variant/30 bg-surface-container-lowest py-24 text-center"
    >
      <span className="material-symbols-outlined text-[64px] text-outline-variant" aria-hidden>
        search_off
      </span>
      <h3 className="font-headline-md text-headline-md text-on-surface">No products found</h3>
      <p className="max-w-xs text-body-md text-on-surface-variant">
        Try adjusting your filters or search terms to find what you&apos;re looking for.
      </p>
      <button
        type="button"
        className="mt-2 rounded-full border border-outline-variant px-6 py-2 text-label-md text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
      >
        Clear filters
      </button>
    </motion.div>
  );
}
