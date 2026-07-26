"use client";
import Image from "next/image";
import { Heart, ShoppingCart, CalendarDays, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Product } from "./types";
import RatingStars from "./RatingStars";

interface Props {
  product: Product;
  viewMode?: string;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, viewMode = "grid", onQuickView }: Props) {
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isRental = product.type === "rental";

  const handleWishlist = async () => {
    try {
      setWishlisted(!wishlisted); // Optimistic UI
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      });
      const data = await res.json();
      if (!data.success) {
        setWishlisted(wishlisted); // Revert on failure
        if (data.error === 'Unauthorized') alert('Please login to wishlist items');
      }
    } catch (err) {
      setWishlisted(wishlisted);
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      const data = await res.json();
      if (data.success) {
        alert('Added to cart successfully!');
      } else {
        if (data.error === 'Unauthorized') alert('Please login to add items to cart');
        else alert(data.error || 'Failed to add to cart');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`group flex rounded-[14px] border border-outline-variant/30 bg-surface-container-lowest p-2.5 shadow-sm transition-shadow duration-300 hover:shadow-lg ${
        viewMode === "list" ? "flex-row items-center gap-4" : "h-full flex-col"
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden rounded-lg bg-surface-container-high ${
        viewMode === "list" ? "aspect-square w-32 shrink-0 mb-0" : "aspect-video mb-2.5"
      }`}>
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Rating badge */}
        <div className="absolute right-2 top-2">
          <RatingStars rating={product.rating} />
        </div>
        {/* Rental badge */}
        {product.badge && (
          <div className="absolute bottom-1.5 left-1.5 rounded-full bg-secondary px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
            {product.badge}
          </div>
        )}
        {/* Wishlist */}
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlist}
          className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface-glass text-on-surface-variant opacity-0 shadow backdrop-blur-md transition-all group-hover:opacity-100 hover:text-error"
        >
          <Heart
            size={11}
            className={wishlisted ? "fill-error text-error" : ""}
          />
        </button>
        {/* Quick View */}
        <button
          type="button"
          aria-label="Quick view"
          onClick={() => onQuickView?.(product)}
          className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-md bg-surface-glass px-1.5 py-0.5 text-[9px] font-semibold text-on-surface-variant opacity-0 shadow backdrop-blur-md transition-all group-hover:opacity-100 hover:text-primary"
        >
          <Eye size={10} /> View
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5">
        <h3 className="line-clamp-1 text-[12px] font-semibold text-on-surface">{product.name}</h3>
        <p className="text-[10px] text-on-surface-variant">
          {product.seller && `Sold by ${product.seller.split('||')[0]} • `}
          {product.stock ?? product.location}
        </p>
        {product.location && product.seller && (
          <p className="text-[10px] text-on-surface-variant">{product.location}</p>
        )}
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-sm font-bold text-primary">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.priceUnit && (
            <span className="text-[10px] text-on-surface-variant">{product.priceUnit}</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <motion.button
        type="button"
        onClick={isRental ? () => onQuickView?.(product) : handleAddToCart}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
          viewMode === "list" ? "w-32 shrink-0 mt-0" : "w-full mt-3"
        } ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        } ${
          isRental
            ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-md hover:shadow-primary/20"
            : "border border-primary text-primary hover:bg-primary/5"
        }`}
      >
        {isRental ? (
          <>
            <CalendarDays size={13} aria-hidden /> Rent Now
          </>
        ) : (
          <>
            <ShoppingCart size={13} aria-hidden /> Buy Now
          </>
        )}
      </motion.button>
    </motion.article>
  );
}
