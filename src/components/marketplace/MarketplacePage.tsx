"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../landing/Header";
import FilterSidebar from "./FilterSidebar";
import MarketplaceHeader from "./MarketplaceHeader";
import ProductGrid from "./ProductGrid";
import PromoBanner from "./PromoBanner";
import MarketplaceNotifications from "./MarketplaceNotifications";
import { ToastProvider } from "./MarketplaceToast";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";

const ProductModal = dynamic(() => import("./ProductModal"));
const AddProductModal = dynamic(() => import("./AddProductModal"));
const MyBookings = dynamic(() => import("./MyBookings"));

import type { Product, SortOption, ViewMode } from "./types";

export interface FilterState {
  maxPrice: number;
  location: string;
  minRating: number;
  searchQuery: string;
}

const DEFAULT_FILTERS: FilterState = {
  maxPrice: 100000,
  location: "all",
  minRating: 0,
  searchQuery: "",
};

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/marketplace");
      const data = await res.json();
      if (data.success && data.products) {
        setDbProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) setCartCount(data.cartItems?.length || 0);
    } catch {}
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (data.success) {
        setWishlistIds(new Set(data.wishlistItems?.map((w: any) => w.productId) || []));
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
    fetchWishlist();
  }, [fetchProducts, fetchCartCount, fetchWishlist]);

  const handleCartUpdate = useCallback(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  const handleWishlistUpdate = useCallback((productId: string, wishlisted: boolean) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (wishlisted) next.add(productId);
      else next.delete(productId);
      return next;
    });
  }, []);

  // Category counts from real DB data
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dbProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [dbProducts]);

  const filteredProducts = useMemo(() => {
    let list = activeCategory === "all"
      ? dbProducts
      : dbProducts.filter((p) => p.category === activeCategory);

    // Apply search
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Apply price filter
    list = list.filter((p) => p.price <= filters.maxPrice);

    // Apply location filter
    if (filters.location !== "all") {
      list = list.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating);
    }

    // Apply sort
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeCategory, sortBy, dbProducts, filters]);

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.maxPrice < 100000 ||
    filters.location !== "all" ||
    filters.minRating > 0;

  const resetAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setActiveCategory("all");
  };

  return (
    <ToastProvider>
      <div className="flex h-screen flex-col bg-background-sage text-on-surface overflow-hidden">
        <Header />

        <div className="mx-auto flex w-full max-w-container-max flex-1 overflow-hidden relative">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            filters={filters}
            onFiltersChange={setFilters}
            categoryCounts={categoryCounts}
            totalProducts={dbProducts.length}
          />

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <>
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                />
                <motion.div
                  key="drawer"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 35 }}
                  className="fixed left-0 top-0 bottom-0 z-50 w-72 overflow-y-auto bg-surface shadow-2xl md:hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-outline-variant">
                    <h2 className="font-bold text-on-surface text-lg">Filters</h2>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="rounded-full p-2 hover:bg-surface-container-high transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterSidebar
                      activeCategory={activeCategory}
                      onCategoryChange={(cat) => {
                        setActiveCategory(cat);
                        setIsMobileFilterOpen(false);
                      }}
                      filters={filters}
                      onFiltersChange={setFilters}
                      categoryCounts={categoryCounts}
                      totalProducts={dbProducts.length}
                      mobile
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <main
            data-lenis-prevent="true"
            className="flex-1 p-margin-desktop overflow-y-auto custom-scrollbar flex flex-col relative"
          >
            <div className="flex-1">
              <MarketplaceNotifications />
              <MarketplaceHeader
                productCount={filteredProducts.length}
                totalCount={dbProducts.length}
                sortBy={sortBy}
                viewMode={viewMode}
                onSortChange={setSortBy}
                onViewModeChange={setViewMode}
                onAddPost={() => setIsAddModalOpen(true)}
                onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
                cartCount={cartCount}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={resetAllFilters}
                searchQuery={filters.searchQuery}
                onSearchChange={(q) => setFilters((f) => ({ ...f, searchQuery: q }))}
              />

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  viewMode={viewMode}
                  onQuickView={setSelectedProduct}
                  wishlistIds={wishlistIds}
                  onWishlistUpdate={handleWishlistUpdate}
                  onCartUpdate={handleCartUpdate}
                  onClearFilters={resetAllFilters}
                />
              )}
              <PromoBanner />
              <MyBookings />
            </div>

            {/* Footer */}
            <footer className="w-full py-6 flex flex-col md:flex-row justify-between items-center border-t border-outline-variant mt-12">
              <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
                <h4 className="font-body-lg text-body-lg font-bold text-primary">
                  Smart Farming India
                </h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 text-center md:text-left max-w-sm">
                  © 2026 Smart Farming India. Empowering the roots of our nation.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 md:gap-8 whitespace-nowrap overflow-x-auto custom-scrollbar pb-2 md:pb-0 max-w-full">
                <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/market-insights">Market Insights</Link>
                <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/gps-area-calculator">GPS Calculator</Link>
                <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/support">Help & Support</Link>
                <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link>
                <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/terms">Terms</Link>
              </div>
            </footer>
          </main>
        </div>

        {/* Mobile Filter FAB */}
        <div className="md:hidden fixed bottom-6 left-6 z-30">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-primary text-white px-4 py-3 shadow-xl font-bold text-sm"
          >
            <SlidersHorizontal size={18} />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary text-xs font-bold">
                •
              </span>
            )}
          </button>
        </div>

        {/* FAB */}
        <motion.button
          type="button"
          aria-label="Get help"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="group fixed bottom-8 right-8 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-2xl"
          onClick={() => window.open("/support", "_blank")}
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
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onCartUpdate={handleCartUpdate}
          wishlistIds={wishlistIds}
          onWishlistUpdate={handleWishlistUpdate}
        />

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(newProduct) => {
            setDbProducts((prev) => [newProduct, ...prev]);
            fetchCartCount();
          }}
        />
      </div>
    </ToastProvider>
  );
}
