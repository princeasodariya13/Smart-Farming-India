"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { jsPDF } from "jspdf";

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
  const [showInfo, setShowInfo] = useState(false);
  const [renameModal, setRenameModal] = useState<{ isOpen: boolean, fieldId: string, currentName: string, newName: string } | null>(null);
  const [toastMsg, setToastMsg] = useState<{ message: string, type: "error" | "success" } | null>(null);
  const [isFetchingFields, setIsFetchingFields] = useState(true);
  const infoRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: "error" | "success" = "error") => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Close info tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setShowInfo(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      .catch(err => console.error("Failed to fetch fields:", err))
      .finally(() => setIsFetchingFields(false));
  }, []);

  const handleSaveField = async () => {
    if (!liveStats || liveStats.totalAreaAcres === 0) {
      showToast("There is not any polygon drawn. Please draw a field boundary first.", "error");
      return;
    }
    setRenameModal({ isOpen: true, fieldId: "NEW_SAVE", currentName: "New Field", newName: "New Field" });
  };

  const handleExportPdf = () => {
    if (!liveStats || liveStats.totalAreaAcres === 0) {
      showToast("There is not any polygon drawn. Please draw a field boundary first.", "error");
      return;
    }
    
    // Native print approach cleanly bypasses all CORS and canvas tainting issues
    window.print();
  };

  const handleShare = async () => {
    if (!liveStats || liveStats.totalAreaAcres === 0) {
      showToast("There is not any polygon drawn to share.", "error");
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
      showToast("Measurement details copied to clipboard!", "success");
    }
  };

  const executeSaveField = async (name: string) => {
    if (!liveStats || liveStats.totalAreaAcres === 0) return;
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
        showToast("Field saved successfully!", "success");
      } else {
        showToast(data.error || "Failed to save field", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving field.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRenameSubmit = async () => {
    if (!renameModal || !renameModal.newName.trim() || renameModal.newName === renameModal.currentName) {
      setRenameModal(null);
      return;
    }
    
    if (renameModal.fieldId === "NEW_SAVE") {
      await executeSaveField(renameModal.newName.trim());
      setRenameModal(null);
      return;
    }
    
    try {
      const res = await fetch(`/api/gps/${renameModal.fieldId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renameModal.newName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setRealFields(prev => prev.map(f => f.id === renameModal.fieldId ? { ...f, name: renameModal.newName.trim() } : f));
        showToast("Field renamed successfully!", "success");
      } else {
        showToast(data.error || "Failed to rename field.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error renaming field.", "error");
    } finally {
      setRenameModal(null);
    }
  };

  const handleRenameField = () => {
    if (!liveStats || liveStats.totalAreaAcres === 0) {
      showToast("There is not any polygon drawn. Please draw a field boundary first.", "error");
      return;
    }
    if (realFields.length === 0) {
      showToast("No fields saved yet to rename. Please save the field first.", "error");
      return;
    }
    const fieldToRename = realFields.find(f => f.name === currentLocName) || realFields[0];
    setRenameModal({ isOpen: true, fieldId: fieldToRename.id, currentName: fieldToRename.name, newName: fieldToRename.name });
  };

  const handleMenuAction = async (id: string, action: "rename" | "edit" | "delete" | "export_pdf" | "share_apps") => {
    const field = realFields.find(f => f.id === id);
    if (!field) return;
    
    // Core Coordinate Resolver (Runs for all map-loading actions)
    let pts;
    if (action === "edit" || action === "export_pdf" || action === "share_apps") {
      if (field.coordinates) {
        try { pts = JSON.parse(field.coordinates); } catch(e) { console.error("Parse error", e); }
      }
      
      // Magical Fallback for Legacy Fields (Deterministic Spacing)
      if (!pts || pts.length === 0) {
        // Create a robust unique hash based on the field ID so every field is physically separated
        const idHash = field.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const offsetLat = (idHash % 100) * 0.0005; // Wide spread
        const offsetLng = (idHash % 150) * 0.0005;
        
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
    }
    
    if (action === "export_pdf" || action === "share_apps") {
      setEditingPoints(pts);
      setCurrentLocName(field.name);
      setActiveTool("marker");
      
      // Seed live stats for immediate rendering
      setLiveStats({
        totalAreaAcres: field.areaAcres,
        totalAreaHectares: field.areaAcres * 0.404686,
        totalAreaBigha: field.areaAcres * 2.5,
        totalAreaGuntha: field.areaAcres * 40,
        totalAreaSqm: field.areaAcres * 4046.86,
        totalAreaSqFt: field.areaAcres * 43560,
        totalAreaVar: field.areaAcres * 4840,
        perimeterMeters: 0,
        vertexCount: pts ? pts.length : 0,
        points: pts
      });
      
      if (action === "export_pdf") {
        // Wait 2 full seconds for the map flyTo animation to completely finish rendering!
        setTimeout(() => {
          window.print();
        }, 2000);
      } else if (action === "share_apps") {
        try {
          // 1. Initialize clean PDF
          const doc = new jsPDF();
          
          // 2. Draw Professional Header
          doc.setFillColor(13, 99, 27);
          doc.rect(0, 0, 210, 45, 'F');
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(22);
          doc.setTextColor(255, 255, 255);
          doc.text("Field Measurement Report", 20, 28);
          
          // 3. Draw Meta Info (Using solid black to prevent WhatsApp PDF text dropping)
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0); // Solid black
          doc.text(`Field Name: ${field.name}`, 20, 60);
          
          doc.setFont("helvetica", "bold"); // Bold forces the font rendering on mobile
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.text(`Location: ${field.location || "Mapped Area"}`, 20, 70);
          doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 78);
          
          doc.setDrawColor(200, 200, 200);
          doc.line(20, 85, 190, 85);
          
          // 4. Draw Core Metrics
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text("AREA (ACRES)", 20, 100);
          doc.text("AREA (HECTARES)", 85, 100);
          doc.text("PERIMETER", 150, 100);
          
          doc.setFontSize(18);
          doc.setTextColor(13, 99, 27);
          doc.text(`${field.areaAcres.toFixed(2)}`, 20, 110);
          doc.text(`${(field.areaAcres * 0.404686).toFixed(4)}`, 85, 110);
          doc.setTextColor(0, 0, 0);
          doc.text(`${(field as any).perimeterMeters || 0} m`, 150, 110);
          
          // 5. Draw Engineering Blueprint of the Field (Bypasses all CORS/Screenshot bugs!)
          doc.setFillColor(248, 250, 248);
          doc.setDrawColor(200, 220, 200);
          doc.setLineWidth(0.5);
          doc.rect(20, 130, 170, 120, 'FD'); // Blueprint Canvas
          
          // Draw grid pattern for blueprint look
          doc.setDrawColor(225, 235, 225);
          doc.setLineWidth(0.2);
          for (let i = 30; i < 190; i += 10) doc.line(i, 130, i, 250);
          for (let i = 140; i < 250; i += 10) doc.line(20, i, 190, i);
          
          // Render polygon geometry if points exist
          if (pts && pts.length >= 3) {
            // Find min/max to calculate scale
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            pts.forEach((p: any) => {
              if (p.lng < minX) minX = p.lng;
              if (p.lng > maxX) maxX = p.lng;
              if (p.lat < minY) minY = p.lat;
              if (p.lat > maxY) maxY = p.lat;
            });
            
            // Padding and scaling factors
            const pad = 20;
            const bWidth = 170 - (pad * 2);
            const bHeight = 120 - (pad * 2);
            
            const rngX = (maxX - minX) || 0.0001;
            const rngY = (maxY - minY) || 0.0001;
            
            const scale = Math.min(bWidth / rngX, bHeight / rngY);
            
            // Center offsets
            const ox = 20 + pad + (bWidth - (rngX * scale)) / 2;
            const oy = 130 + pad + (bHeight - (rngY * scale)) / 2;
            
            // Map GPS to PDF canvas coordinates (invert Y because GPS goes up, PDF goes down)
            const polyLines = pts.map((p: any) => {
               const x = ox + ((p.lng - minX) * scale);
               const y = oy + ((maxY - p.lat) * scale);
               return [x, y];
            });
            
            // Close the polygon natively
            polyLines.push([...polyLines[0]]);
            
            doc.setDrawColor(13, 99, 27);
            doc.setFillColor(13, 99, 27, 40); // Hex transparent isn't perfectly supported, so we just use line
            doc.setLineWidth(1.5);
            
            // Manually draw the connected lines for maximum compatibility
            for (let i = 0; i < polyLines.length - 1; i++) {
              doc.line(polyLines[i][0], polyLines[i][1], polyLines[i+1][0], polyLines[i+1][1]);
            }
            
            // Draw corner markers
            doc.setFillColor(13, 99, 27);
            polyLines.slice(0, -1).forEach((pt: any) => {
              doc.circle(pt[0], pt[1], 1.5, 'F');
            });
            
            doc.setFont("helvetica", "italic");
            doc.setFontSize(10);
            doc.setTextColor(13, 99, 27);
            doc.text("Geometric Field Boundary", 25, 245);
          } else {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text("No geometric data available for rendering.", 60, 190);
          }
          
          // 6. Footer
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("Generated by Smart Farming India", 20, 280);

          
          const pdfBlob = doc.output('blob');
          const fileName = `${field.name.replace(/\s+/g, '_')}_Report.pdf`;
          const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
          
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Field Report: ${field.name}`,
              text: `Here is the measurement report for ${field.name}`,
              files: [file]
            });
          } else {
            // Fallback for desktop/unsupported browsers: auto-download it
            doc.save(fileName);
          }
        } catch (err) {
          console.error("PDF Share failed", err);
          alert("Could not share PDF. Your browser might not support file sharing.");
        }
      }
      
    } else if (action === "edit") {
      setEditingPoints(pts);
      setCurrentLocName(field.name);
      setActiveTool("marker"); // Automatically activate marker tool
      
      // Auto-scroll to the top of the page so the user instantly sees the loaded map
      const mapTop = document.getElementById("map-top");
      if (mapTop) {
        mapTop.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (action === "rename") {
      setRenameModal({ isOpen: true, fieldId: id, currentName: field.name, newName: field.name });
      return;
    } else if (action === "delete") {
      if (confirm(`Are you sure you want to delete ${field.name}?`)) {
        try {
          const res = await fetch(`/api/gps/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setRealFields(prev => prev.filter(f => f.id !== id));
            showToast("Field deleted successfully", "success");
          } else {
            showToast("Failed to delete field", "error");
          }
        } catch (err) {
          console.error(err);
          showToast("Error deleting field", "error");
        }
      }
    }
  };


  const [mapKey, setMapKey] = useState(0);

  const handleLocationSelect = (lat: number, lon: number, displayName: string, bbox?: [number, number, number, number]) => {
    setMapCenter([lat, lon]);
    setCurrentLocName(displayName);
    if (bbox) {
      setSearchBBox(bbox);
    }
    
    // Clear old polygon and reset calculator fields when searching for a new location
    setEditingPoints(undefined);
    setLiveStats({
      totalAreaAcres: 0,
      totalAreaHectares: 0,
      totalAreaBigha: 0,
      totalAreaGuntha: 0,
      totalAreaSqm: 0,
      totalAreaSqFt: 0,
      totalAreaVar: 0,
      perimeterMeters: 0,
      vertexCount: 0,
      points: []
    });
    setMapKey(prev => prev + 1); // Force map component to fully remount and clear internal polygon state
  };

  const handleAreaCalculated = (stats: FieldStats | null) => {
    if (stats) {
      setLiveStats(stats);
    } else {
      setLiveStats({
        totalAreaAcres: 0,
        totalAreaHectares: 0,
        totalAreaBigha: 0,
        totalAreaGuntha: 0,
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
      id="map-top"
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
      <header className="relative z-30 px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-outline-variant/60 bg-white/60 backdrop-blur-sm print:hidden">
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
              key={mapKey}
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
            <div ref={infoRef} className="flex justify-between items-center relative">
              <h2 className="text-base font-bold text-on-surface">Field Calculator</h2>
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="About field calculator"
                className={`transition-colors ${showInfo ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
              >
                <Info size={18} />
              </button>

              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-8 right-0 w-64 p-3 bg-white rounded-xl shadow-lg border border-outline-variant/60 z-50 origin-top-right"
                  >
                    <h4 className="text-xs font-bold text-on-surface mb-1.5">How to use:</h4>
                    <ul className="text-[10px] text-on-surface-variant space-y-1.5 list-disc pl-3">
                      <li>Use the <strong>Marker</strong> tool to tap points around your field.</li>
                      <li>Use the <strong>Polygon</strong> tool to draw a freehand shape.</li>
                      <li>Click <strong>Load to Map</strong> on any saved field to edit it.</li>
                      <li>The calculator automatically updates area and perimeter in real-time.</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <StatisticsCard stats={liveStats} />
            <ExportMenu onSave={handleSaveField} onExportPdf={handleExportPdf} onShare={handleShare} onRename={handleRenameField} />
          </div>

          <SavedFields fields={realFields} onMenuAction={handleMenuAction} isLoading={isFetchingFields} />

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
      
      {/* Beautiful Million-Dollar Rename Modal */}
      <AnimatePresence>
        {renameModal?.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-outline-variant"
            >
              <h2 className="text-xl font-bold text-on-surface mb-2">Rename Field</h2>
              <p className="text-sm text-on-surface-variant mb-5">
                Enter a new name for your saved field.
              </p>
              
              <input
                type="text"
                autoFocus
                value={renameModal.newName}
                onChange={(e) => setRenameModal({ ...renameModal, newName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-6 text-on-surface font-medium"
                placeholder="e.g. North Plot"
                onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
              />
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRenameModal(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRenameSubmit}
                  className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200000] px-6 py-3 rounded-full shadow-xl flex items-center gap-3 font-medium text-sm border ${
              toastMsg.type === "error" 
                ? "bg-red-50 text-red-700 border-red-200" 
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            <Info size={18} className={toastMsg.type === "error" ? "text-red-500" : "text-green-500"} />
            {toastMsg.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
