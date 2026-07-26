"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: any) => void;
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Equipment",
    type: "rental",
    price: "",
    priceUnit: "per day",
    location: "",
    stock: "1",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=400&auto=format&fit=crop", // default placeholder
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data.product);
        onClose();
      } else {
        alert(data.error || "Failed to add post");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
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
          <div className="flex items-center justify-between border-b border-outline-variant p-4 md:p-6">
            <h2 className="text-title-lg font-bold text-on-surface">Add Equipment / Product</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div>
              <label className="block text-label-md font-bold text-on-surface mb-1">Product Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. Mahindra Tractor 575 DI" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-bold text-on-surface mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary">
                  <option value="Equipment">Equipment</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Fertilizers">Fertilizers</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
              <div>
                <label className="block text-label-md font-bold text-on-surface mb-1">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary">
                  <option value="rental">For Rent</option>
                  <option value="buy">For Sale</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-bold text-on-surface mb-1">Price (₹)</label>
                <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary" placeholder="500" />
              </div>
              <div>
                <label className="block text-label-md font-bold text-on-surface mb-1">Unit</label>
                <input type="text" value={formData.priceUnit} onChange={e => setFormData({...formData, priceUnit: e.target.value})} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary" placeholder="per day / per kg" />
              </div>
            </div>
            <div>
              <label className="block text-label-md font-bold text-on-surface mb-1">Location</label>
              <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md outline-none focus:border-primary" placeholder="e.g. Rajkot, Gujarat" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-primary py-3 font-bold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Item"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
