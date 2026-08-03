"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Map, Edit2, PenSquare, Trash2, Share2 } from "lucide-react";
import type { SavedField } from "@/types/gps-calculator";

interface FieldCardProps {
  field: SavedField;
  onSelect?: (id: string) => void;
  onMenuAction?: (id: string, action: "rename" | "edit" | "delete" | "export_pdf" | "share_apps") => void;
  isNearBottom?: boolean;
}

const statusStyles: Record<SavedField["status"], string> = {
  active: "bg-secondary-container text-on-secondary-container",
  archived: "bg-surface-container-high text-on-surface-variant",
  draft: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

export default function FieldCard({ field, onSelect, onMenuAction, isNearBottom = false }: FieldCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ top: 0, right: 0, isUp: false });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Dynamically compute the ArcGIS Satellite Thumbnail URL
  let thumbnailSrc = field.imageUrl;
  if (!thumbnailSrc && field.coordinates) {
    try {
      const pts = typeof field.coordinates === 'string' ? JSON.parse(field.coordinates) : field.coordinates;
      if (pts && pts.length >= 3) {
        let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
        pts.forEach((p: any) => {
          if (p.lng < minLng) minLng = p.lng;
          if (p.lng > maxLng) maxLng = p.lng;
          if (p.lat < minLat) minLat = p.lat;
          if (p.lat > maxLat) maxLat = p.lat;
        });
        
        const padLng = (maxLng - minLng) * 0.2 || 0.001;
        const padLat = (maxLat - minLat) * 0.2 || 0.001;
        
        const bbox = `${minLng - padLng},${minLat - padLat},${maxLng + padLng},${maxLat + padLat}`;
        thumbnailSrc = `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${bbox}&bboxSR=4326&imageSR=4326&size=150,150&format=jpg&f=image`;
      }
    } catch (e) {
      console.error("Failed to parse coordinates for thumbnail", e);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        portalRef.current && !portalRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }
    
    function handleScroll() {
      if (showMenu) setShowMenu(false);
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [showMenu]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const isUp = spaceBelow < 200; // Open upwards if less than 200px space below
      
      setMenuCoords({
        top: isUp ? rect.top - 170 : rect.bottom + 5,
        right: window.innerWidth - rect.right,
        isUp,
      });
    }
    setShowMenu(!showMenu);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onSelect?.(field.id)}
      className={`relative p-2.5 bg-white hover:bg-primary/5 rounded-xl border border-outline-variant transition-colors cursor-pointer group ${showMenu ? "z-[9999]" : "z-10"}`}
    >
      <div className="flex gap-2.5">
        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 flex items-center justify-center text-on-surface-variant/40">
          {thumbnailSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={thumbnailSrc}
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
        <div>
          <button
            type="button"
            ref={buttonRef}
            aria-label={`More options for ${field.name}`}
            onClick={toggleMenu}
            className={`text-on-surface-variant transition-opacity shrink-0 p-1 rounded-md hover:bg-surface-container ${showMenu ? "bg-surface-container" : ""}`}
          >
            <MoreVertical size={18} />
          </button>

          {mounted && createPortal(
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  ref={portalRef}
                  initial={{ opacity: 0, scale: 0.95, y: menuCoords.isUp ? 10 : -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: menuCoords.isUp ? 10 : -10 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "fixed",
                    top: menuCoords.top,
                    right: menuCoords.right,
                  }}
                  className={`w-36 bg-white rounded-lg shadow-lg border border-outline-variant py-1 z-[99999] overflow-hidden ${
                    menuCoords.isUp ? "origin-bottom-right" : "origin-top-right"
                  }`}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onMenuAction?.(field.id, "edit"); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-surface-container-lowest text-on-surface transition-colors"
                  >
                    <Edit2 size={14} className="text-primary" /> Load to Map
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onMenuAction?.(field.id, "export_pdf"); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-surface-container-lowest text-on-surface transition-colors"
                  >
                    <Map size={14} className="text-secondary" /> Export PDF
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onMenuAction?.(field.id, "share_apps"); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-surface-container-lowest text-on-surface transition-colors"
                  >
                    <Share2 size={14} className="text-secondary" /> Share to Apps
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
            </AnimatePresence>,
            document.body
          )}
        </div>
      </div>
    </motion.div>
  );
}
