"use client";

import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import type { EquipmentItem } from "@/types/profile";

interface EquipmentCardProps {
  items?: EquipmentItem[];
  onEdit?: (id: string) => void;
}

const statusStyles: Record<EquipmentItem["status"], string> = {
  available: "bg-secondary-container text-on-secondary-container",
  rented: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  maintenance: "bg-error-container text-error",
};

const defaultItems: EquipmentItem[] = [
  {
    id: "eq1",
    imageUrl:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=400&auto=format&fit=crop",
    name: "Mahindra 575 Tractor",
    category: "Tractor",
    status: "rented",
    rentalPricePerDay: 1800,
    availability: "Booked till Aug 2",
    earnings: 24600,
  },
  {
    id: "eq2",
    imageUrl:
      "https://images.unsplash.com/photo-1591086072693-a2ce18a19dc6?q=80&w=400&auto=format&fit=crop",
    name: "Rotavator 6ft",
    category: "Tillage",
    status: "available",
    rentalPricePerDay: 600,
    availability: "Available now",
    earnings: 9200,
  },
  {
    id: "eq3",
    imageUrl:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=400&auto=format&fit=crop",
    name: "Combine Harvester",
    category: "Harvesting",
    status: "maintenance",
    rentalPricePerDay: 4200,
    availability: "Under service",
    earnings: 61200,
  },
];

export default function EquipmentCard({ items = defaultItems, onEdit }: EquipmentCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm">
      <h2 className="text-lg font-bold text-on-surface mb-6">My Equipment</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full py-8 text-center border-2 border-dashed border-outline-variant/60 rounded-2xl bg-surface-container-low/50">
            <p className="text-on-surface-variant font-medium">No equipment listed yet.</p>
          </div>
        ) : items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-outline-variant/50 overflow-hidden bg-surface-container-low"
          >
            <div className="h-32 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-bold text-sm text-on-surface">{item.name}</p>
                <button
                  type="button"
                  aria-label={`Edit ${item.name}`}
                  onClick={() => onEdit?.(item.id)}
                  className="text-on-surface-variant hover:text-primary transition-colors shrink-0"
                >
                  <Pencil size={14} />
                </button>
              </div>
              <p className="text-xs text-on-surface-variant mb-2">{item.category}</p>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${statusStyles[item.status]}`}
              >
                {item.status}
              </span>
              <div className="flex justify-between text-xs pt-2 border-t border-outline-variant/40">
                <span className="text-on-surface-variant">₹{item.rentalPricePerDay}/day</span>
                <span className="font-semibold text-primary">
                  ₹{item.earnings.toLocaleString("en-IN")} earned
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
