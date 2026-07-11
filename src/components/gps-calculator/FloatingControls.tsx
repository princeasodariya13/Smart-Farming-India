"use client";


import {
  PenLine,
  MapPinPlus,
  Undo2,
  Redo2,
  Trash2,
  Plus,
  Minus,
  Layers,
  LocateFixed,
  Maximize,
  Minimize,
} from "lucide-react";
import type { DrawTool } from "@/types/gps-calculator";

interface FloatingControlsProps {
  activeTool?: DrawTool;
  onToolChange?: (tool: DrawTool) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onLayersToggle?: () => void;
  onMyLocation?: () => void;
  onFullscreen?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  isFullscreen?: boolean;
}

const drawTools: { id: DrawTool; icon: typeof PenLine; label: string }[] = [
  { id: "polygon", icon: PenLine, label: "Draw Polygon" },
  { id: "marker", icon: MapPinPlus, label: "Add Marker" },
];

export default function FloatingControls({
  activeTool = "polygon",
  onToolChange,
  onZoomIn,
  onZoomOut,
  onLayersToggle,
  onMyLocation,
  onFullscreen,
  onUndo,
  onRedo,
  onDelete,
  isFullscreen,
}: FloatingControlsProps) {
  return (
    <>
      {/* Drawing tools - top left */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
        <div className="bg-surface-glass backdrop-blur-xl border border-white/30 p-1.5 rounded-xl flex flex-col gap-1 shadow-lg">
          {drawTools.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={activeTool === id}
              onClick={() => onToolChange?.(id)}
              className={`p-2 rounded-lg transition-colors ${
                activeTool === id
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <Icon size={16} />
            </button>
          ))}
          <hr className="border-outline-variant/40 my-0.5" />
          <div className="flex gap-1">
            <button
              type="button"
              title="Undo"
              aria-label="Undo"
              onClick={onUndo}
              className="p-1.5 flex-1 text-on-surface-variant hover:bg-surface-container-high rounded-md transition-colors flex justify-center"
            >
              <Undo2 size={16} />
            </button>
            <button
              type="button"
              title="Redo"
              aria-label="Redo"
              onClick={onRedo}
              className="p-1.5 flex-1 text-on-surface-variant hover:bg-surface-container-high rounded-md transition-colors flex justify-center"
            >
              <Redo2 size={16} />
            </button>
          </div>
          <button
            type="button"
            title="Clear All"
            aria-label="Clear all drawings"
            onClick={onDelete}
            className="p-2 text-danger-burnt hover:bg-error-container rounded-lg transition-colors flex justify-center"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Zoom / layers - bottom right */}
      <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-20">
        <div className="bg-surface-glass backdrop-blur-xl border border-white/30 p-1.5 rounded-xl flex flex-col gap-1 shadow-lg">
          <button
            type="button"
            title="Zoom in"
            aria-label="Zoom in"
            onClick={onZoomIn}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex justify-center"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            title="Zoom out"
            aria-label="Zoom out"
            onClick={onZoomOut}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex justify-center"
          >
            <Minus size={16} />
          </button>
        </div>
        <div className="bg-surface-glass backdrop-blur-xl border border-white/30 p-1.5 rounded-xl flex flex-col gap-1 shadow-lg relative">
          <button
            type="button"
            title="Toggle Map View"
            aria-label="Toggle map view"
            onClick={onLayersToggle}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex justify-center"
          >
            <Layers size={16} />
          </button>
          <button
            type="button"
            title="My location"
            aria-label="Go to my location"
            onClick={onMyLocation}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex justify-center"
          >
            <LocateFixed size={16} />
          </button>
          <button
            type="button"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            aria-label="Toggle fullscreen"
            onClick={onFullscreen}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex justify-center"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </>
  );
}
