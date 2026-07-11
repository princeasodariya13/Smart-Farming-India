"use client";

import { motion } from "framer-motion";
import { MoreVertical } from "lucide-react";
import type { SavedField } from "@/types/gps-calculator";

interface FieldCardProps {
  field: SavedField;
  onSelect?: (id: string) => void;
  onMenu?: (id: string) => void;
}

const statusStyles: Record<SavedField["status"], string> = {
  active: "bg-secondary-container text-on-secondary-container",
  archived: "bg-surface-container-high text-on-surface-variant",
  draft: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

export default function FieldCard({ field, onSelect, onMenu }: FieldCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onSelect?.(field.id)}
      className="p-2.5 bg-white hover:bg-primary/5 rounded-xl border border-outline-variant transition-colors cursor-pointer group"
    >
      <div className="flex gap-2.5">
        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={field.imageUrl}
            alt={`Satellite thumbnail of ${field.name}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className="font-bold text-xs truncate">{field.name}</p>
            <span className="text-[10px] text-on-surface-variant shrink-0">{field.date}</span>
          </div>
          <p className="text-xs text-primary font-bold">{field.areaAcres} Acres</p>
          <div className="flex gap-1.5 mt-0.5 flex-wrap">
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusStyles[field.status]}`}
            >
              {field.status}
            </span>
            {field.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant"
              >
                #{tag}
              </span>
            ))}
            <span className="text-[10px] text-on-surface-variant">{field.location}</span>
          </div>
        </div>
        <button
          type="button"
          aria-label={`More options for ${field.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onMenu?.(field.id);
          }}
          className="text-on-surface-variant opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shrink-0"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </motion.div>
  );
}
