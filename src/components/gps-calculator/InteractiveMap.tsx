"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer as LeafletMap, TileLayer, Polygon, Marker, useMapEvents, FeatureGroup, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as turf from "@turf/turf";
import type { DrawTool } from "@/types/gps-calculator";

// Fix leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import FloatingControls from "./FloatingControls";

import type { FieldStats } from "@/types/gps-calculator";

interface InteractiveMapProps {
  activeTool: DrawTool;
  onToolChange?: (tool: DrawTool) => void;
  onAreaChange?: (stats: FieldStats | null) => void;
  center?: [number, number];
  searchBBox?: [number, number, number, number];
}

function MapUpdater({ center, searchBBox }: { center?: [number, number], searchBBox?: [number, number, number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (searchBBox) {
      const bounds: L.LatLngBoundsExpression = [
        [searchBBox[0], searchBBox[2]],
        [searchBBox[1], searchBBox[3]]
      ];
      map.fitBounds(bounds, { animate: true, duration: 1.5, padding: [40, 40] });
    } else if (center) {
      map.flyTo(center, 15, { animate: true, duration: 1.5 });
    }
  }, [center, searchBBox, map]);
  return null;
}

export default function InteractiveMap({ activeTool, onToolChange, onAreaChange, center, searchBBox }: InteractiveMapProps) {
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const [redoStack, setRedoStack] = useState<L.LatLng[]>([]);
  const [mousePos, setMousePos] = useState<L.LatLng | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [mapLayer, setMapLayer] = useState<"y" | "m">("y"); // y=hybrid, m=roadmap

  // Calculate area whenever points change
  useEffect(() => {
    if (points.length >= 3) {
      const coordinates = points.map(p => [p.lng, p.lat]);
      // Close the polygon
      coordinates.push([points[0].lng, points[0].lat]);
      
      const polygon = turf.polygon([coordinates]);
      const lineString = turf.polygonToLine(polygon);
      
      const areaSqMeters = turf.area(polygon);
      const perimeterMeters = turf.length(lineString, { units: 'meters' });
      
      const areaAcres = areaSqMeters * 0.000247105;
      const totalAreaHectares = areaSqMeters / 10000;
      const totalAreaBigha = areaAcres * 1.6; // Common Indian conversion
      const totalAreaSqFt = areaSqMeters * 10.7639;
      const totalAreaVar = areaSqMeters * 1.19599;
      
      if (onAreaChange) {
        onAreaChange({
          totalAreaAcres: areaAcres,
          totalAreaHectares: totalAreaHectares,
          totalAreaBigha: totalAreaBigha,
          totalAreaSqm: areaSqMeters,
          totalAreaSqFt: totalAreaSqFt,
          totalAreaVar: totalAreaVar,
          perimeterMeters: Math.round(perimeterMeters),
          vertexCount: points.length
        });
      }
    } else {
      if (onAreaChange) {
        onAreaChange(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  const handleClear = useCallback(() => {
    setPoints([]);
    setRedoStack([]);
    setMousePos(null);
  }, []);
  
  const handleUndo = useCallback(() => {
    setPoints(prev => {
      if (prev.length === 0) return prev;
      const lastPoint = prev[prev.length - 1];
      setRedoStack(redo => [...redo, lastPoint]);
      return prev.slice(0, -1);
    });
  }, []);

  const handleRedo = useCallback(() => {
    setRedoStack(prev => {
      if (prev.length === 0) return prev;
      const lastUndo = prev[prev.length - 1];
      setPoints(points => [...points, lastUndo]);
      return prev.slice(0, -1);
    });
  }, []);

  function MapEvents() {
    useMapEvents({
      click(e) {
        if (activeTool === "polygon") {
          setPoints(prev => [...prev, e.latlng]);
          setRedoStack([]);
        } else if (activeTool === "marker") {
           // just placing a single marker logic could go here
        }
      },
      mousemove(e) {
        if (activeTool === "polygon" && points.length > 0) {
          setMousePos(e.latlng);
        }
      },
      contextmenu(e) {
        e.originalEvent.preventDefault();
        handleUndo();
      }
    });
    return null;
  }

  const displayPoints = [...points];
  if (activeTool === "polygon" && mousePos && points.length > 0) {
    displayPoints.push(mousePos);
  }

  const handleZoomIn = () => mapInstance?.zoomIn();
  const handleZoomOut = () => mapInstance?.zoomOut();
  const handleLocate = () => {
    mapInstance?.locate().on("locationfound", (e) => {
      mapInstance.flyTo(e.latlng, 16);
    });
  };
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handleFullscreen = () => {
    const container = wrapperRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen().catch(err => console.log(err));
    }
  };
  const handleLayersToggle = () => {
    setMapLayer(prev => prev === "y" ? "m" : "y");
  };

  return (
    <div ref={wrapperRef} className="w-full h-full relative group bg-[#f4f7f4]">
      <LeafletMap 
        center={center || [23.033, 72.585]}
        zoom={7} 
        zoomControl={false}
        className="w-full h-full z-0"
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        ref={setMapInstance}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps/">Google Maps</a>'
          url={`https://mt1.google.com/vt/lyrs=${mapLayer}&x={x}&y={y}&z={z}`}
          maxZoom={20}
        />
        <MapUpdater center={center} searchBBox={searchBBox} />
        <MapEvents />
        
        {/* Search Result Highlights */}
        {center && (center[0] !== 23.033 || center[1] !== 72.585) && (
          <Marker position={center} />
        )}
        
        {searchBBox && (
          <Rectangle 
            bounds={[
              [searchBBox[0], searchBBox[2]],
              [searchBBox[1], searchBBox[3]]
            ]}
            pathOptions={{ 
              color: '#0d631b', 
              weight: 2, 
              fillColor: '#0d631b', 
              fillOpacity: 0.1, 
              dashArray: '5, 5' 
            }} 
          />
        )}
        
        {points.length > 0 && (
          <FeatureGroup>
            <Polygon 
              positions={displayPoints} 
              pathOptions={{ 
                color: "#0d631b", 
                fillColor: "rgba(13, 99, 27, 0.4)", 
                weight: 2,
                dashArray: mousePos ? "5, 5" : undefined
              }} 
            />
            {points.map((p, i) => (
              <Marker key={i} position={p} />
            ))}
          </FeatureGroup>
        )}
      </LeafletMap>
      
      <FloatingControls 
        activeTool={activeTool} 
        onToolChange={onToolChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onMyLocation={handleLocate}
        onFullscreen={handleFullscreen}
        isFullscreen={isFullscreen}
        onLayersToggle={handleLayersToggle}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDelete={handleClear}
      />
    </div>
  );
}
