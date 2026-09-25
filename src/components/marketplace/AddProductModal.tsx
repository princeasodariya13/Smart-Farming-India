"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, ImageIcon, AlertCircle } from "lucide-react";
import { useToast } from "./MarketplaceToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: any) => void;
}

const CATEGORIES = [
  { value: "equipment", label: "Equipment" },
  { value: "seeds", label: "Seeds" },
  { value: "fertilizers", label: "Fertilizers" },
  { value: "irrigation", label: "Irrigation" },
  { value: "smart", label: "Smart Devices" },
  { value: "supplies", label: "Farm Supplies" },
  { value: "rental", label: "Rental (Other)" },
];

const PRICE_UNITS = [
  { value: "/ day", label: "Per Day (Rental)" },
  { value: "/ kg", label: "Per Kg" },
  { value: "/ 50kg bag", label: "Per 50kg Bag" },
  { value: "/ unit", label: "Per Unit" },
  { value: "/ litre", label: "Per Litre" },
  { value: "", label: "Fixed Price" },
];

const DEFAULT_IMAGES: Record<string, string> = {
  equipment: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=600&auto=format&fit=crop",
  seeds: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=600&auto=format&fit=crop",
  fertilizers: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop",
  irrigation: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop",
  smart: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
  supplies: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop",
  rental: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=600&auto=format&fit=crop",
};

export default function AddProductModal({ isOpen, onClose, onSuccess }: Props) {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "equipment",
    type: "rental",
    price: "",
    priceUnit: "/ day",
    location: "",
    stock: "Available Now",
    image: "",
  });

  if (!isOpen) return null;

  const update = (patch: Partial<typeof formData>) =>
    setFormData((f) => ({ ...f, ...patch }));

  const effectiveImage = formData.image.trim() || DEFAULT_IMAGES[formData.category] || DEFAULT_IMAGES.equipment;

  const handleCategoryChange = (cat: string) => {
    const suggestedType = cat === "equipment" || cat === "rental" ? "rental" : "buy";
    const suggestedUnit = suggestedType === "rental" ? "/ day" : "/ unit";
    update({ category: cat, type: suggestedType, priceUnit: suggestedUnit });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error("Missing name", "Please enter a product name.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      error("Invalid price", "Please enter a valid price.");
      return;
    }
    if (!formData.location.trim()) {
      error("Missing location", "Please enter a location.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: effectiveImage,
          price: parseFloat(formData.price),
        }),
      });
      const data = await res.json();
      if (data.success) {
        success("Product posted!", `${formData.name} is now live on the marketplace.`);
        onSuccess(data.product);
        onClose();
        setFormData({
          name: "",
          category: "equipment",
          type: "rental",
          price: "",
          priceUnit: "/ day",
          location: "",
          stock: "Available Now",
          image: "",
        });
      } else {
        error("Failed to post", data.error || "Please try again.");
      }
    } catch {
      error("Network error", "Could not post your product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-surface shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Package size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-title-lg font-bold text-on-surface">List on Marketplace</h2>
                <p className="text-xs text-on-surface-variant">Sell or rent your farm equipment & supplies</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Product Name */}
            <div>
              <label className="block text-label-md font-bold text-on-surface mb-1">
                Product Name <span className="text-error">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => update({ name: e.target.value })}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="e.g. Mahindra Tractor 575 DI, Wheat Seeds HD-2967"
              />
            </div>

            {/* Category & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-bold text-on-surface mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-label-md font-bold text-on-surface mb-1">Listing Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => update({ type: e.target.value })}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary"
                >
                  <option value="rental">For Rent</option>
                  <option value="buy">For Sale</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-bold text-on-surface mb-1">
                  Price (₹) <span className="text-error">*</span>
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={formData.price}
                  onChange={(e) => update({ price: e.target.value })}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary"
                  placeholder="e.g. 2500"
                />
              </div>
              <div>
                <label className="block text-label-md font-bold text-on-surface mb-1">Price Unit</label>
                <select
                  value={formData.priceUnit}
                  onChange={(e) => update({ priceUnit: e.target.value })}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary"
                >
                  {PRICE_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-label-md font-bold text-on-surface mb-1">
                Location <span className="text-error">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.location}
                onChange={(e) => update({ location: e.target.value })}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary"
                placeholder="e.g. Rajkot, Gujarat"
              />
            </div>

            {/* Stock / Availability */}
            <div>
              <label className="block text-label-md font-bold text-on-surface mb-1">Availability / Stock Info</label>
              <input
                type="text"
                value={formData.stock}
                onChange={(e) => update({ stock: e.target.value })}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary"
                placeholder="e.g. Available Now, In Stock, 5 Units Left"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-label-md font-bold text-on-surface mb-1">
                Image URL (optional)
              </label>
              <div className="relative">
                <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => { update({ image: e.target.value }); setImagePreviewError(false); }}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-9 pr-4 text-body-md outline-none focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <p className="mt-1 text-xs text-on-surface-variant flex items-center gap-1">
                <AlertCircle size={11} /> Leave blank to use a default image for this category.
              </p>
              {/* Image Preview */}
              <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={effectiveImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImagePreviewError(true)}
                />
                {imagePreviewError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-high text-on-surface-variant">
                    <ImageIcon size={24} className="mb-1" />
                    <span className="text-xs">Invalid image URL</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white font-semibold">
                  Preview
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="add-product-submit-btn"
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 font-bold text-white transition hover:brightness-110 disabled:opacity-50 shadow-sm"
            >
              {loading ? "Posting..." : "Post to Marketplace"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
