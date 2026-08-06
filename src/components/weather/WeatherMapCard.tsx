"use client";

import { useState, useEffect, useRef } from "react";
import { Satellite, CloudRain, Wind, Thermometer, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";

type MapLayer = "satellite" | "radar" | "wind" | "temperature";

const LAYERS: { key: MapLayer; label: string; icon: typeof Satellite }[] = [
  { key: "satellite", label: "Satellite View", icon: Satellite },
  { key: "radar", label: "Rain Radar", icon: CloudRain },
  { key: "wind", label: "Wind Layer", icon: Wind },
  { key: "temperature", label: "Temperature Layer", icon: Thermometer },
];

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./WeatherMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-sm font-medium">Loading live satellite data...</p>
    </div>
  ),
});

/**
 * Interactive weather map with OpenWeatherMap tile integration.
 */
export default function WeatherMapCard({ lat, lon }: { lat?: number; lon?: number }) {
  const [layer, setLayer] = useState<MapLayer>("satellite");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <section id="weather-radar-section" className="space-y-6 rounded-[20px] border border-white/30 bg-white/70 p-6 shadow-sm backdrop-blur-xl md:p-8 relative z-0">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-xl font-semibold text-on-surface">Live Weather Radar</h3>
        <div role="tablist" aria-label="Map layer" className="flex flex-wrap gap-1 rounded-xl bg-surface-container-low p-1">
          {LAYERS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              role="tab"
              aria-selected={layer === key}
              onClick={() => setLayer(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                layer === key ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
              )}
            >
              <Icon size={14} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div 
        ref={containerRef}
        data-lenis-prevent="true" 
        className={`w-full overflow-hidden border border-outline-variant/30 shadow-inner relative z-0 bg-surface-container-highest transition-all duration-300 ${
          isFullscreen ? "h-screen rounded-none" : "h-96 rounded-2xl"
        }`}
      >
        <MapComponent layer={layer} lat={lat} lon={lon} />
        
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
    </section>
  );
}
