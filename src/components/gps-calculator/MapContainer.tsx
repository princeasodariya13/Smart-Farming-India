"use client";

import { useState, useEffect, useRef } from "react";
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
  initialPoints?: any[];
}

export default function MapContainer({
  activeTool = "marker",
  onToolChange,
  onAreaCalculated,
  center,
  searchBBox,
  initialPoints,
}: MapContainerProps) {
  const [currentStats, setCurrentStats] = useState<FieldStats | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAreaChange = (stats: FieldStats | null) => {
    setCurrentStats(stats);
    if (onAreaCalculated) {
      onAreaCalculated(stats);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full min-h-[400px] bg-surface-container-highest overflow-hidden transition-all duration-300 ease-in-out ${
        isFullscreen ? "rounded-none" : "rounded-3xl"
      }`}
    >
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
          initialPoints={initialPoints}
        />
      </motion.div>

      {/* Area Label Overlay (similar to PolygonOverlay but decoupled) */}
      {currentStats && currentStats.totalAreaAcres > 0 && (
        <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
          <div className="bg-primary text-white text-[12px] font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white whitespace-nowrap">
            {currentStats.totalAreaAcres.toFixed(2)} Acres
          </div>
        </div>
      )}

      {/* Fullscreen Toggle Button */}
      <button 
        onClick={toggleFullscreen}
        className="absolute bottom-6 right-6 z-[500] p-3 bg-white/90 backdrop-blur-sm text-primary rounded-xl shadow-lg border border-outline-variant hover:bg-white transition-all active:scale-95 flex items-center justify-center"
        aria-label="Toggle Fullscreen"
      >
        <span className="material-symbols-outlined font-bold text-[22px]">
          {isFullscreen ? "fullscreen_exit" : "fullscreen"}
        </span>
      </button>
    </div>
  );
}
