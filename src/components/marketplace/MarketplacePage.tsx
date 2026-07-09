"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../landing/Header";
import FilterSidebar from "./FilterSidebar";
import MarketplaceHeader from "./MarketplaceHeader";
import ProductGrid from "./ProductGrid";
import PromoBanner from "./PromoBanner";
import ProductModal from "./ProductModal";
import Link from "next/link";

import type { Product, SortOption, ViewMode } from "./types";

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/marketplace');
        const data = await res.json();
        if (data.success && data.products) {
          setDbProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const products = useMemo(() => {
    let list = activeCategory === "all"
      ? dbProducts
      : dbProducts.filter((p) => p.category === activeCategory);

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeCategory, sortBy, dbProducts]);

  return (
    <div className="flex min-h-screen flex-col bg-background-sage text-on-surface">
      <Header />

      <div className="mx-auto flex w-full max-w-container-max flex-1">
        <FilterSidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <main className="flex-1 p-margin-desktop">
          <MarketplaceHeader
            productCount={products.length}
            sortBy={sortBy}
            viewMode={viewMode}
            onSortChange={setSortBy}
            onViewModeChange={setViewMode}
          />
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <ProductGrid products={products} viewMode={viewMode} onQuickView={setSelectedProduct} />
          )}
          <PromoBanner />
        </main>
      </div>

      {/* Compact Dashboard Footer */}
      <footer className="w-full py-6 px-margin-desktop flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant mt-auto z-10 relative">
        <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
          <h4 className="font-body-lg text-body-lg font-bold text-primary">Smart Farming India</h4>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 text-center md:text-left max-w-sm">© 2026 Smart Farming India. Empowering the roots of our nation.</p>
        </div>
        <div className="flex items-center justify-center gap-4 md:gap-8 whitespace-nowrap overflow-x-auto custom-scrollbar pb-2 md:pb-0 max-w-full">
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/terms">Terms of Service</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/contact">Contact Us</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/about">About Us</Link>
        </div>
      </footer>

      {/* FAB */}
      <motion.button
        type="button"
        aria-label="Get help"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="group fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-2xl"
      >
        <span
          className="material-symbols-outlined text-[28px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden
        >
          chat_bubble
        </span>
        <span className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-lg bg-on-surface px-3 py-1 text-sm font-bold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
          Get Help
        </span>
      </motion.button>

      {/* Quick View Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
