"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ShoppingCart, CalendarDays, MessageSquare, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "./types";
import RatingStars from "./RatingStars";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setLoading(true);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: qty })
      });
      const data = await res.json();
      if (data.success) {
        alert('Added to cart successfully!');
        onClose();
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

  // Trap focus inside modal and close on Escape
  useEffect(() => {
    if (product) {
      dialogRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-sm"
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal
            aria-label={`Quick view: ${product.name}`}
            ref={dialogRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 bottom-0 z-50 mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] bg-surface-container-lowest p-6 shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[28px]"
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-5 top-5 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col gap-6 md:flex-row">
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-container-high md:w-56 md:shrink-0">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
                {product.badge && (
                  <div className="absolute bottom-2 left-2 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col gap-4">
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                      {product.name}
                    </h2>
                    <RatingStars rating={product.rating} />
                  </div>
                  <p className="text-label-sm text-on-surface-variant">
                    {product.seller} • {product.location}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.priceUnit && (
                    <span className="text-label-sm text-on-surface-variant">{product.priceUnit}</span>
                  )}
                </div>

                {/* Specs placeholder */}
                <div className="rounded-xl bg-surface-container-low p-4">
                  <p className="mb-2 font-semibold text-label-md text-on-surface">Specifications</p>
                  <div className="grid grid-cols-2 gap-2 text-label-sm text-on-surface-variant">
                    <span>Category</span><span className="font-medium text-on-surface capitalize">{product.category}</span>
                    <span>Availability</span><span className="font-medium text-on-surface">{product.stock ?? "In Stock"}</span>
                    <span>Type</span><span className="font-medium text-on-surface capitalize">{product.type}</span>
                  </div>
                </div>

                {/* Quantity */}
                {product.type === "buy" && (
                  <div className="flex items-center gap-4">
                    <span className="text-label-md text-on-surface-variant">Quantity</span>
                    <div className="flex items-center gap-2 rounded-full border border-outline-variant px-2 py-1">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="rounded-full p-1 hover:bg-surface-container-high"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-bold text-label-md">{qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty((q) => q + 1)}
                        className="rounded-full p-1 hover:bg-surface-container-high"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={loading}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white transition-all ${
                      loading ? "opacity-70 cursor-not-allowed bg-surface-container-highest text-on-surface-variant" : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20"
                    }`}
                  >
                    {product.type === "rental" ? (
                      <><CalendarDays size={18} /> Rent Now</>
                    ) : (
                      <><ShoppingCart size={18} /> Add to Cart</>
                    )}
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary py-3 font-bold text-primary hover:bg-primary/5"
                  >
                    <MessageSquare size={18} /> Contact Seller
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
