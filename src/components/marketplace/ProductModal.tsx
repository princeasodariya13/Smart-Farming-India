"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ShoppingCart, CalendarDays, MessageSquare, Plus, Minus, CheckCircle, XCircle, Heart, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "./types";
import RatingStars from "./RatingStars";
import { subscribeBookingStatus, getBookingStatusMap } from "./MarketplaceNotifications";
import BookingCalendar from "./BookingCalendar";
import { useNotification } from "@/contexts/NotificationContext";
import { useToast } from "./MarketplaceToast";

interface Props {
  product: Product | null;
  onClose: () => void;
  onCartUpdate?: () => void;
  wishlistIds?: Set<string>;
  onWishlistUpdate?: (productId: string, wishlisted: boolean) => void;
}

export default function ProductModal({
  product,
  onClose,
  onCartUpdate,
  wishlistIds,
  onWishlistUpdate,
}: Props) {
  const { addNotification } = useNotification();
  const { success, error, info, warning } = useToast();
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [bookingStatusMap, setBookingStatusMap] = useState<Record<string, string>>(
    () => getBookingStatusMap()
  );

  // Date selection states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookedDates, setBookedDates] = useState<{ start: string; end: string }[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const wishlisted = wishlistIds?.has(product?.id ?? "") ?? false;

  // Fetch booked dates for this product
  useEffect(() => {
    if (product?.type === "rental") {
      fetch(`/api/marketplace/availability?productId=${product.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBookedDates(
              data.bookings.map((b: any) => ({
                start: new Date(b.startDate).toISOString().split("T")[0],
                end: new Date(b.endDate).toISOString().split("T")[0],
              }))
            );
          }
        })
        .catch(console.error);
    }
    // Reset dates when product changes
    setStartDate("");
    setEndDate("");
    setQty(1);
  }, [product]);

  useEffect(() => {
    return subscribeBookingStatus(setBookingStatusMap);
  }, []);

  const bookingStatus = product ? bookingStatusMap[product.id] : undefined;

  const handleWishlist = async () => {
    if (!product || wishlistLoading) return;
    try {
      setWishlistLoading(true);
      onWishlistUpdate?.(product.id, !wishlisted);
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (!data.success) {
        onWishlistUpdate?.(product.id, wishlisted);
        if (data.error === "Unauthorized") {
          info("Login required", "Please sign in to save to wishlist.");
        } else {
          error("Failed", data.error || "Could not update wishlist.");
        }
      } else {
        data.wishlisted
          ? success("Saved to wishlist!", `${product.name} added.`)
          : info("Removed from wishlist", `${product.name} removed.`);
      }
    } catch {
      onWishlistUpdate?.(product.id, wishlisted);
      error("Network error", "Could not update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setLoading(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: qty }),
      });
      const data = await res.json();
      if (data.success) {
        success("Added to cart!", `${qty}× ${product.name} added to your cart.`);
        onCartUpdate?.();
        onClose();
      } else {
        if (data.error === "Unauthorized") {
          info("Login required", "Please sign in to add items to your cart.");
        } else {
          error("Failed to add to cart", data.error || "Please try again.");
        }
      }
    } catch {
      error("Network error", "Could not add to cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    if (!product) return;
    if (!startDate) {
      warning("Select a date", "Please select a start date from the calendar.");
      return;
    }

    const finalEndDate = endDate || startDate;

    if (new Date(startDate) > new Date(finalEndDate)) {
      warning("Invalid dates", "End date cannot be before start date.");
      return;
    }

    // Check overlap client-side
    const start = new Date(startDate);
    const end = new Date(finalEndDate);
    for (const b of bookedDates) {
      const bStart = new Date(b.start);
      const bEnd = new Date(b.end);
      if (start <= bEnd && end >= bStart) {
        warning("Dates unavailable", "Selected dates overlap with an existing booking.");
        return;
      }
    }

    try {
      setLoading(true);
      const res = await fetch("/api/marketplace/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, startDate, endDate: finalEndDate }),
      });
      const data = await res.json();
      if (data.success) {
        addNotification({
          title: "Equipment Booked Successfully",
          message: `Your booking for ${product.name} from ${startDate} to ${finalEndDate} is confirmed.`,
          type: "marketplace",
        });
        success("Booking request sent!", `The seller has been notified about your rental request for ${product.name}.`);
        onClose();
      } else {
        if (data.error === "Unauthorized") {
          info("Login required", "Please sign in to book equipment.");
        } else {
          error("Booking failed", data.error || "Please try again.");
        }
      }
    } catch {
      error("Network error", "Could not process your booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (!product) return;
    const sellerName = product.seller.split("||")[0];
    const message = encodeURIComponent(
      `Hi! I am interested in "${product.name}" listed on Smart Farming India. Can you please share more details?`
    );
    // Open WhatsApp or support page as fallback
    window.open(`/support?subject=${encodeURIComponent(`Inquiry: ${product.name}`)}&seller=${encodeURIComponent(sellerName)}`, "_blank");
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Smart Farming India - ₹${product.price.toLocaleString("en-IN")}${product.priceUnit}`,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        success("Link copied!", "Product link copied to clipboard.");
      } catch {
        info("Share", "Copy the page URL to share this product.");
      }
    }
  };

  useEffect(() => {
    if (product) {
      dialogRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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
            data-lenis-prevent="true"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 bottom-0 z-50 mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto custom-scrollbar rounded-t-[28px] bg-surface-container-lowest p-6 shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[28px]"
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          >
            {/* Header Controls */}
            <div className="absolute right-5 top-5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share product"
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                <Share2 size={18} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quick view"
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                <X size={20} />
              </button>
            </div>

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
                {/* Wishlist on image */}
                <button
                  type="button"
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow backdrop-blur-md transition-all hover:scale-110"
                >
                  <Heart
                    size={16}
                    className={`transition-colors ${wishlisted ? "fill-error text-error" : "text-on-surface-variant"}`}
                  />
                </button>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col gap-4">
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2 pr-16">
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                      {product.name}
                    </h2>
                    <RatingStars rating={product.rating} />
                  </div>
                  <p className="text-label-sm text-on-surface-variant">
                    {product.seller.split("||")[0]} • {product.location}
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

                {/* Specs */}
                <div className="rounded-xl bg-surface-container-low p-4">
                  <p className="mb-2 font-semibold text-label-md text-on-surface">Specifications</p>
                  <div className="grid grid-cols-2 gap-2 text-label-sm text-on-surface-variant">
                    <span>Category</span>
                    <span className="font-medium text-on-surface capitalize">{product.category}</span>
                    <span>Availability</span>
                    <span className="font-medium text-on-surface">{product.stock ?? "In Stock"}</span>
                    <span>Type</span>
                    <span className="font-medium text-on-surface capitalize">{product.type}</span>
                    <span>Rating</span>
                    <span className="font-medium text-on-surface">{product.rating.toFixed(1)} / 5.0</span>
                  </div>
                </div>

                {/* Quantity for purchases */}
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

                {/* Date Picker for Rentals */}
                {product.type === "rental" && (
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-label-md text-on-surface">Select Rental Dates</span>
                      {startDate && (
                        <button
                          type="button"
                          onClick={() => { setStartDate(""); setEndDate(""); }}
                          className="text-xs text-on-surface-variant hover:text-error transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <BookingCalendar
                      bookedDates={bookedDates}
                      startDate={startDate}
                      endDate={endDate}
                      onError={(msg) => warning("Dates unavailable", msg)}
                      onChange={(start, end) => {
                        setStartDate(start);
                        setEndDate(end);
                      }}
                    />

                    {startDate && (
                      <div className="flex justify-between items-center bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="text-sm">
                          <span className="text-on-surface-variant font-medium">From: </span>
                          <span className="font-bold text-primary">{new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        </div>
                        {endDate && endDate !== startDate && (
                          <div className="text-sm">
                            <span className="text-on-surface-variant font-medium"> To: </span>
                            <span className="font-bold text-primary">{new Date(endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                          </div>
                        )}
                        {(!endDate || endDate === startDate) && (
                          <span className="text-xs text-on-surface-variant">1 day rental</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  {/* Live booking status badge */}
                  {bookingStatus && (
                    <div
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-sm ${
                        bookingStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : bookingStatus === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {bookingStatus === "approved" ? (
                        <><CheckCircle size={16} /> Booking Approved</>
                      ) : bookingStatus === "rejected" ? (
                        <><XCircle size={16} /> Booking Rejected</>
                      ) : (
                        <><CalendarDays size={16} /> Booking Pending…</>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={product.type === "rental" ? handleBookNow : handleAddToCart}
                    disabled={
                      loading ||
                      bookingStatus === "approved" ||
                      bookingStatus === "pending"
                    }
                    id="product-modal-primary-action"
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white transition-all ${
                      loading || bookingStatus === "approved" || bookingStatus === "pending"
                        ? "opacity-60 cursor-not-allowed bg-surface-container-highest text-on-surface-variant"
                        : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20"
                    }`}
                  >
                    {loading
                      ? "Processing..."
                      : product.type === "rental"
                      ? <><CalendarDays size={18} /> {bookingStatus === "approved" ? "Booked" : "Rent Now"}</>
                      : <><ShoppingCart size={18} /> Add to Cart</>}
                  </button>
                  <button
                    type="button"
                    onClick={handleContactSeller}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary py-3 font-bold text-primary hover:bg-primary/5 transition-colors"
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
