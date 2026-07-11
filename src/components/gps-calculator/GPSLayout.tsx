"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

import SearchLocation from "./SearchLocation";
import MapContainer from "./MapContainer";
import StatisticsCard from "./StatisticsCard";
import ExportMenu from "./ExportMenu";
import SavedFields from "./SavedFields";
import MeasurementCard from "./MeasurementCard";
import AnalyticsCard from "./AnalyticsCard";

import type {
  DrawTool,
  FieldStats,
  SavedField,
  AnalyticsSummary,
  RecentMeasurement,
  GpsStatus,
} from "@/types/gps-calculator";

interface GPSLayoutProps {
  currentLocation?: string;
  gpsStatus?: GpsStatus;
  stats?: FieldStats;
  fields?: SavedField[];
  analytics?: AnalyticsSummary;
  measurements?: RecentMeasurement[];
  isLoading?: boolean;
}

export default function GPSLayout({
  currentLocation,
  gpsStatus,
  stats,
  fields,
  analytics,
  measurements,
}: GPSLayoutProps) {
  const [activeTool, setActiveTool] = useState<DrawTool>("polygon");
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.033, 72.585]);
  const [searchBBox, setSearchBBox] = useState<[number, number, number, number] | undefined>();
  const [currentLocName, setCurrentLocName] = useState(currentLocation || "Gujarat, India");
  const [liveStats, setLiveStats] = useState<FieldStats | undefined>(stats);

  const handleLocationSelect = (lat: number, lon: number, displayName: string, bbox?: [number, number, number, number]) => {
    setMapCenter([lat, lon]);
    setCurrentLocName(displayName);
    setSearchBBox(bbox);
  };

  const handleAreaCalculated = (newStats: FieldStats | null) => {
    if (newStats) {
      setLiveStats(newStats);
    } else {
      setLiveStats({
        totalAreaAcres: 0,
        totalAreaHectares: 0,
        totalAreaBigha: 0,
        totalAreaSqm: 0,
        totalAreaSqFt: 0,
        totalAreaVar: 0,
        perimeterMeters: 0,
        vertexCount: 0,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col lg:h-full"
    >
      {/* Header */}
      <header className="relative z-50 px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-outline-variant/60 bg-white/60 backdrop-blur-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
            GPS Area Calculator
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Draw field boundaries and get instant, precise area measurements.
          </p>
        </div>
        <SearchLocation
          gpsStatus={gpsStatus}
          currentLocation={currentLocName}
          onLocationSelect={handleLocationSelect}
        />
      </header>

      {/* Body: map + right panel */}
      <div className="flex flex-col lg:flex-row lg:flex-1 lg:min-h-0 lg:overflow-hidden bg-surface-container-lowest">

        {/* Map wrapper - creates a padded "card" around the map */}
        <div className="w-full lg:flex-1 p-4 lg:p-6 lg:min-h-0 flex flex-col items-center justify-center relative overflow-y-auto lg:overflow-hidden bg-[#f4f7f4]">
          <div className="w-full h-[500px] lg:h-full lg:max-h-[75vh] max-w-5xl rounded-3xl overflow-hidden shadow-sm border border-outline-variant/60 relative flex flex-col shrink-0">
            <MapContainer
              activeTool={activeTool}
              onToolChange={setActiveTool}
              center={mapCenter}
              searchBBox={searchBBox}
              onAreaCalculated={handleAreaCalculated}
            />
          </div>
        </div>

        <aside data-lenis-prevent="true" className="w-full lg:w-[320px] bg-surface-glass backdrop-blur-xl border-l border-outline-variant z-10 lg:h-full overflow-y-auto custom-scrollbar shrink-0 block">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-on-surface">Field Calculator</h2>
              <button
                type="button"
                aria-label="About field calculator"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <Info size={18} />
              </button>
            </div>

            <StatisticsCard stats={liveStats} />
            <ExportMenu />
          </div>

          <SavedFields fields={fields} />

          <div className="px-4 pt-4 pb-12 lg:pb-4 space-y-4 border-t border-outline-variant/50">
            <MeasurementCard measurements={measurements} />
            <div>
              <h3 className="font-bold text-xs text-on-surface mb-2">Analytics</h3>
              <AnalyticsCard summary={analytics} />
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
