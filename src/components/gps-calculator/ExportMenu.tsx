"use client";

import { Save, FileText, Map as MapIcon, FileJson, Share2, PenSquare } from "lucide-react";

interface ExportMenuProps {
  onSave?: () => void;
  onRename?: () => void;
  onExportPdf?: () => void;
  onExportKml?: () => void;
  onExportGeoJson?: () => void;
  onShare?: () => void;
}

export default function ExportMenu({
  onSave,
  onRename,
  onExportPdf,
  onExportKml,
  onExportGeoJson,
  onShare,
}: ExportMenuProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onSave}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform"
      >
        <Save size={18} /> Save Field Measurement
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onExportPdf}
          className="flex items-center justify-center gap-2 py-2 bg-white border border-outline-variant rounded-lg font-semibold text-xs hover:bg-surface-container-low transition-colors"
        >
          <FileText size={16} /> Export PDF
        </button>
        <button
          type="button"
          onClick={onExportKml}
          className="flex items-center justify-center gap-2 py-2 bg-white border border-outline-variant rounded-lg font-semibold text-xs hover:bg-surface-container-low transition-colors"
        >
          <MapIcon size={16} /> KML File
        </button>
        <button
          type="button"
          onClick={onExportGeoJson}
          className="flex items-center justify-center gap-2 py-2 bg-white border border-outline-variant rounded-lg font-semibold text-xs hover:bg-surface-container-low transition-colors"
        >
          <FileJson size={16} /> GeoJSON
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex items-center justify-center gap-2 py-2 bg-white border border-outline-variant rounded-lg font-semibold text-xs hover:bg-surface-container-low transition-colors"
        >
          <Share2 size={16} /> Share
        </button>
      </div>

      <button
        type="button"
        onClick={onRename}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-primary text-sm font-semibold hover:underline"
      >
        <PenSquare size={15} /> Rename Field
      </button>
    </div>
  );
}
