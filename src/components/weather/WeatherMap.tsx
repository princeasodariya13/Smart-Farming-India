"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const pulseIcon = L.divIcon({
  className: 'custom-pulse-icon bg-transparent border-0',
  html: `<div style="position: relative; display: flex; height: 32px; width: 32px; align-items: center; justify-content: center;">
          <span style="position: absolute; display: inline-flex; height: 100%; width: 100%; border-radius: 9999px; background-color: #0d631b; opacity: 0.75; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <span style="position: relative; display: inline-flex; height: 16px; width: 16px; border-radius: 9999px; background-color: #0d631b; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></span>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface WeatherMapProps {
  layer: "satellite" | "radar" | "wind" | "temperature";
  lat?: number;
  lon?: number;
}

function Recenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], map.getZoom(), { animate: true, duration: 1.5 });
  }, [lat, lon, map]);
  return null;
}

export default function WeatherMap({ layer, lat, lon }: WeatherMapProps) {
  const defaultPosition: [number, number] = [lat || 23.0225, lon || 72.5714];

  // Map our internal layer names to Windy.com overlay names
  const windyOverlayMap: Record<string, string> = {
    satellite: "satellite",
    radar: "radar", // Windy supports 'radar' natively for rain radar
    wind: "wind",
    temperature: "temp"
  };

  const windyOverlay = windyOverlayMap[layer] || "wind";

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden relative z-0 bg-surface-container-high">
      <iframe
        width="100%"
        height="100%"
        src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=7&overlay=${windyOverlay}&product=ecmwf&level=surface&lat=${defaultPosition[0]}&lon=${defaultPosition[1]}&detailLat=${defaultPosition[0]}&detailLon=${defaultPosition[1]}&marker=true`}
        frameBorder="0"
        title={`Live ${layer} Map`}
        className="w-full h-full border-0"
      ></iframe>
    </div>
  );
}
