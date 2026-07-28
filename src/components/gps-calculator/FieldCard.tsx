"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Map, Edit2, PenSquare, Trash2 } from "lucide-react";
import type { SavedField } from "@/types/gps-calculator";

interface FieldCardProps {
  field: SavedField;
  onSelect?: (id: string) => void;
  onMenuAction?: (id: string, action: "rename" | "edit" | "delete") => void;
}

const statusStyles: Record<SavedField["status"], string> = {
  active: "bg-secondary-container text-on-secondary-container",
  archived: "bg-surface-container-high text-on-surface-variant",
  draft: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

export default function FieldCard({ field, onSelect, onMenuAction }: FieldCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onSelect?.(field.id)}
      className={`relative p-2.5 bg-white hover:bg-primary/5 rounded-xl border border-outline-variant transition-colors cursor-pointer group ${showMenu ? "z-[999]" : "z-10"}`}
    >
      <div className="flex gap-2.5">
        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 flex items-center justify-center text-on-surface-variant/40">
          {field.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={field.imageUrl}
              alt={`Satellite thumbnail of ${field.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Map size={24} strokeWidth={1.5} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className="font-bold text-xs truncate">{field.name}</p>
            <span className="text-[10px] text-on-surface-variant shrink-0">{field.date}</span>
          </div>
          <p className="text-xs text-primary font-bold">{field.areaAcres.toFixed(2)} Acres</p>
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
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label={`More options for ${field.name}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`text-on-surface-variant transition-opacity shrink-0 p-1 rounded-md hover:bg-surface-container ${showMenu ? "opacity-100 bg-surface-container" : "opacity-0 group-hover:opacity-100 focus:opacity-100"}`}
          >
            <MoreVertical size={18} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-outline-variant py-1 z-[100] overflow-hidden"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onMenuAction?.(field.id, "edit"); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-surface-container-lowest text-on-surface transition-colors"
                >
                  <Edit2 size={14} className="text-primary" /> Load to Map
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onMenuAction?.(field.id, "rename"); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-surface-container-lowest text-on-surface transition-colors"
                >
                  <PenSquare size={14} className="text-secondary" /> Rename
                </button>
                <div className="h-[1px] bg-outline-variant/50 my-1"></div>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onMenuAction?.(field.id, "delete"); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-error/10 text-error transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
