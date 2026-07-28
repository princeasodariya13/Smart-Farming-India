"use client";

import { useState, useEffect } from "react";
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
  fields: initialFields,
  analytics,
  measurements,
}: GPSLayoutProps) {
  const [activeTool, setActiveTool] = useState<DrawTool>("marker");
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.033, 72.585]);
  const [searchBBox, setSearchBBox] = useState<[number, number, number, number] | undefined>();
  const [currentLocName, setCurrentLocName] = useState(currentLocation || "Gujarat, India");
  const [liveStats, setLiveStats] = useState<FieldStats | undefined>(stats);
  const [realFields, setRealFields] = useState<SavedField[]>(initialFields || []);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPoints, setEditingPoints] = useState<any[] | undefined>();

  useEffect(() => {
    fetch('/api/gps')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.fields) {
          const mapped: SavedField[] = data.fields.map((f: any) => ({
            id: f.id,
            name: f.name,
            areaAcres: f.totalAreaAcres,
            date: new Date(f.createdAt).toLocaleDateString(),
            cropName: "Unknown",
            location: "Mapped Area",
            tags: [],
            status: "active" as const,
            imageUrl: "",
            coordinates: f.coordinates
          }));
          setRealFields(mapped);
        }
      })
      .catch(err => console.error("Failed to fetch fields:", err));
  }, []);

  const handleSaveField = async () => {
    if (!liveStats || liveStats.totalAreaAcres === 0) {
      alert("Please draw a field boundary on the map first.");
      return;
    }
    const name = prompt("Enter a name for this field (e.g. North Plot):", "New Field");
    if (!name) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/gps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          totalAreaAcres: liveStats.totalAreaAcres,
          totalAreaHectares: liveStats.totalAreaHectares,
          perimeterMeters: liveStats.perimeterMeters,
          coordinates: liveStats.points
        })
      });
      const data = await res.json();
      if (data.success && data.field) {
        const newField: SavedField = {
          id: data.field.id,
          name: data.field.name,
          areaAcres: data.field.totalAreaAcres,
          date: new Date(data.field.createdAt).toLocaleDateString(),
          cropName: "Unknown",
          location: currentLocName || "Mapped Area",
          tags: [],
          status: "active" as const,
          imageUrl: "",
          coordinates: liveStats.points ? JSON.stringify(liveStats.points) : undefined
        };
        setRealFields(prev => [newField, ...prev]);
        alert("Field saved successfully!");
      } else {
        alert(data.error || "Failed to save field");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving field.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPdf = () => {
    if (!liveStats || liveStats.totalAreaAcres === 0) {
      alert("No measurement available to export. Please draw a field boundary first.");
      return;
    }
    
    // Native print approach cleanly bypasses all CORS and canvas tainting issues
    window.print();
  };

  const handleShare = async () => {
    if (!liveStats || liveStats.totalAreaAcres === 0) {
      alert("No measurement available to share.");
      return;
    }
    
    const text = `Farm Field Measurement from Smart Farming India:\n\nLocation: ${currentLocName}\nArea: ${liveStats.totalAreaAcres.toFixed(2)} Acres (${liveStats.totalAreaHectares.toFixed(2)} Hectares)\nPerimeter: ${liveStats.perimeterMeters}m`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Smart Farming Field Measurement',
          text: text,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Measurement details copied to clipboard!");
    }
  };

  const handleRenameField = async () => {
    if (realFields.length === 0) {
      alert("No fields saved yet to rename. Please draw and save a field first.");
      return;
    }
    const fieldToRename = realFields[0];
    const newName = prompt(`Enter a new name for "${fieldToRename.name}":`, fieldToRename.name);
    if (!newName || newName === fieldToRename.name) return;

    try {
      const res = await fetch(`/api/gps/${fieldToRename.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      const data = await res.json();
      if (data.success) {
        setRealFields(prev => prev.map(f => f.id === fieldToRename.id ? { ...f, name: newName } : f));
        alert("Field renamed successfully!");
      } else {
        alert(data.error || "Failed to rename field.");
      }
    } catch (err) {
      console.error(err);
      alert("Error renaming field.");
    }
  };

  const handleMenuAction = async (id: string, action: "rename" | "edit" | "delete") => {
    const field = realFields.find(f => f.id === id);
    if (!field) return;
    
    if (action === "edit") {
      let pts;
      if (field.coordinates) {
        try {
          pts = JSON.parse(field.coordinates);
        } catch(e) {
          console.error("Failed to parse coordinates", e);
        }
      }
      
      // Magical Fallback for Legacy Fields (No alert popup!)
      // Uses a deterministic offset so old fields don't generate on top of each other
      if (!pts || pts.length === 0) {
        const offsetLat = (field.name.length * 0.002) || 0;
        const offsetLng = (field.name.length * 0.003) || 0;
        const centerLat = (mapCenter[0] || 23.033) + offsetLat;
        const centerLng = (mapCenter[1] || 72.585) + offsetLng;
        const areaSqMeters = (field.areaAcres || 1) * 4046.86;
        const sideMeters = Math.sqrt(areaSqMeters);
        const halfSideMeters = sideMeters / 2;
        
        const latOffset = halfSideMeters / 111320;
        const lngOffset = halfSideMeters / (111320 * Math.cos(centerLat * (Math.PI / 180)));
        
        pts = [
          { lat: centerLat + latOffset, lng: centerLng - lngOffset },
          { lat: centerLat + latOffset, lng: centerLng + lngOffset },
          { lat: centerLat - latOffset, lng: centerLng + lngOffset },
          { lat: centerLat - latOffset, lng: centerLng - lngOffset }
        ];
      }

      setEditingPoints(pts);
      setCurrentLocName(field.name);
      setActiveTool("marker"); // Automatically activate marker tool
    } else if (action === "rename") {
      const newName = prompt("Enter a new name:", field.name);
      if (!newName || newName === field.name) return;
      try {
        const res = await fetch(`/api/gps/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
        });
        const data = await res.json();
        if (data.success) {
          setRealFields(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
        }
      } catch (err) {}
    } else if (action === "delete") {
      if (confirm(`Are you sure you want to delete ${field.name}?`)) {
        try {
          const res = await fetch(`/api/gps/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setRealFields(prev => prev.filter(f => f.id !== id));
          }
        } catch(e) {}
      }
    }
  };

  const handleLocationSelect = (lat: number, lon: number, displayName: string, bbox?: [number, number, number, number]) => {
    setMapCenter([lat, lon]);
    setCurrentLocName(displayName);
    if (bbox) {
      setSearchBBox(bbox);
    }
  };

  const handleAreaCalculated = (stats: FieldStats | null) => {
    if (stats) {
      setLiveStats(stats);
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
        points: []
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col lg:h-full print:bg-white"
    >
      {/* Print-only Report Header */}
      <div className="hidden print:block w-full px-8 pt-8 pb-4 bg-white">
        <h1 className="text-3xl font-bold text-[#0d631b] border-b-2 border-[#0d631b] pb-2 mb-6">Field Measurement Report</h1>
        <p className="mb-1 text-black"><strong>Location:</strong> {currentLocName}</p>
        <p className="mb-6 text-black"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
        
        <div className="grid grid-cols-2 gap-6 mt-6 mb-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Area (Acres)</p>
            <p className="text-2xl font-bold text-slate-900">{liveStats?.totalAreaAcres.toFixed(2) || "0.00"}</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Area (Hectares)</p>
            <p className="text-2xl font-bold text-slate-900">{liveStats?.totalAreaHectares.toFixed(4) || "0.0000"}</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Perimeter</p>
            <p className="text-2xl font-bold text-slate-900">{liveStats?.perimeterMeters || 0} meters</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Coordinates</p>
            <p className="text-2xl font-bold text-slate-900">{liveStats?.vertexCount || 0} vertices</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-[9999] px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-outline-variant/60 bg-white/60 backdrop-blur-sm print:hidden">
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
      <div className="flex flex-col lg:flex-row lg:flex-1 lg:min-h-0 lg:overflow-hidden bg-surface-container-lowest print:block print:overflow-visible print:bg-white">

        {/* Map wrapper - creates a padded "card" around the map */}
        <div className="w-full lg:flex-1 p-4 lg:p-6 lg:min-h-0 flex flex-col items-center justify-center relative overflow-y-auto lg:overflow-hidden bg-[#f4f7f4] print:p-8 print:pt-0 print:bg-white print:overflow-visible">
          <div id="map-capture-area" className="w-full h-[350px] min-h-[350px] lg:h-full lg:min-h-[500px] lg:max-h-[75vh] max-w-5xl rounded-3xl overflow-hidden shadow-sm border border-outline-variant/60 relative flex flex-col shrink-0 print:border-2 print:border-slate-200 print:shadow-none print:h-[500px] print:max-h-none print:w-full print:rounded-xl">
            <MapContainer
              activeTool={activeTool}
              onToolChange={setActiveTool}
              center={mapCenter}
              searchBBox={searchBBox}
              onAreaCalculated={handleAreaCalculated}
              initialPoints={editingPoints}
            />
          </div>
        </div>

        <aside data-lenis-prevent="true" className="w-full lg:w-[320px] bg-surface-glass backdrop-blur-xl border-l border-outline-variant z-10 lg:h-full overflow-y-auto custom-scrollbar shrink-0 block print:hidden">
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
            <ExportMenu onSave={handleSaveField} onExportPdf={handleExportPdf} onShare={handleShare} onRename={handleRenameField} />
          </div>

          <SavedFields fields={realFields} onMenuAction={handleMenuAction} />

          <div className="px-4 pt-4 pb-12 lg:pb-4 space-y-4 border-t border-outline-variant/50">
            <MeasurementCard 
              measurements={realFields.slice(0, 20).map(f => ({
                id: f.id,
                fieldName: f.name,
                areaAcres: Number(f.areaAcres.toFixed(2)),
                timestamp: f.date
              }))} 
            />
            <div>
              <h3 className="font-bold text-xs text-on-surface mb-2">Analytics</h3>
              <AnalyticsCard summary={{
                totalFields: realFields.length,
                totalAreaManaged: Number(realFields.reduce((sum, f) => sum + (f.areaAcres || 0), 0).toFixed(2)),
                averageFieldSize: realFields.length > 0 ? Number((realFields.reduce((sum, f) => sum + (f.areaAcres || 0), 0) / realFields.length).toFixed(2)) : 0,
                mostGrownCrop: realFields.length > 0 ? "Wheat" : "None",
              }} />
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
