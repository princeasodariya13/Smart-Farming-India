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
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "02785a68098150e0254c7a9e7321daac";
  
  const layerMap: Record<string, string> = {
    radar: "precipitation_new",
    wind: "wind_new",
    temperature: "temp_new",
    satellite: "clouds_new" 
  };

  const weatherLayerUrl = `https://tile.openweathermap.org/map/${layerMap[layer]}/{z}/{x}/{y}.png?appid=${apiKey}`;
  const defaultPosition: [number, number] = [lat || 23.0225, lon || 72.5714];

  return (
    <MapContainer
      center={defaultPosition}
      zoom={7}
      scrollWheelZoom={true}
      className="h-full w-full rounded-2xl z-0"
      style={{ minHeight: "100%", minWidth: "100%" }}
    >
      <Recenter lat={defaultPosition[0]} lon={defaultPosition[1]} />
      
      {layer === "satellite" ? (
        <TileLayer
          attribution='&copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      ) : (
        <TileLayer
          attribution='&copy; CartoDB'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
      )}

      <TileLayer
        key={layer} 
        url={weatherLayerUrl}
        opacity={layer === 'satellite' ? 0.7 : 0.9} 
        attribution='&copy; OpenWeatherMap'
      />

      <Marker position={defaultPosition} icon={pulseIcon}>
        <Popup className="rounded-xl overflow-hidden font-sans">
          <div className="font-semibold text-primary text-center px-1">Selected Location</div>
          <div className="text-xs text-on-surface-variant text-center border-t border-outline-variant/30 mt-1 pt-1">Lat: {defaultPosition[0].toFixed(2)}, Lon: {defaultPosition[1].toFixed(2)}</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
