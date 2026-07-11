"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import FloatingControls from "./FloatingControls";
import type { DrawTool, FieldStats } from "@/types/gps-calculator";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
});

interface MapContainerProps {
  activeTool?: DrawTool;
  onToolChange?: (tool: DrawTool) => void;
  onAreaCalculated?: (stats: FieldStats | null) => void;
  center?: [number, number];
  searchBBox?: [number, number, number, number];
}

export default function MapContainer({
  activeTool = "polygon",
  onToolChange,
  onAreaCalculated,
  center,
  searchBBox,
}: MapContainerProps) {
  const [currentStats, setCurrentStats] = useState<FieldStats | null>(null);

  const handleAreaChange = (stats: FieldStats | null) => {
    setCurrentStats(stats);
    if (onAreaCalculated) {
      onAreaCalculated(stats);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-surface-container-highest overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 w-full h-full"
      >
        <InteractiveMap 
          activeTool={activeTool}
          onToolChange={onToolChange}
          onAreaChange={handleAreaChange} 
          center={center}
          searchBBox={searchBBox}
        />
      </motion.div>

      {/* Area Label Overlay (similar to PolygonOverlay but decoupled) */}
      {currentStats && currentStats.totalAreaAcres > 0 && (
        <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400]">
          <div className="bg-primary text-white text-[12px] font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white whitespace-nowrap">
            {currentStats.totalAreaAcres.toFixed(2)} Acres
          </div>
        </div>
      )}
    </div>
  );
}
