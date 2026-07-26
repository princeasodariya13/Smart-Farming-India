"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface WeatherMapProps {
  layer: "satellite" | "radar" | "wind" | "temperature";
}

export default function WeatherMap({ layer }: WeatherMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "02785a68098150e0254c7a9e7321daac";
  
  // Mapping our app's layer state to OpenWeatherMap layer names
  const layerMap: Record<string, string> = {
    radar: "precipitation_new",
    wind: "wind_new",
    temperature: "temp_new",
    satellite: "clouds_new" // We'll show clouds on top of satellite
  };

  const weatherLayerUrl = `https://tile.openweathermap.org/map/${layerMap[layer]}/{z}/{x}/{y}.png?appid=${apiKey}`;

  // Default coordinate (Gujarat / Central India)
  const defaultPosition: [number, number] = [23.0225, 72.5714];

  return (
    <MapContainer
      center={defaultPosition}
      zoom={5}
      scrollWheelZoom={true}
      className="h-full w-full rounded-2xl z-0"
      style={{ minHeight: "100%", minWidth: "100%" }}
    >
      {/* Base Layer: Satellite vs Standard depending on selected tab for best contrast */}
      {layer === "satellite" ? (
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
      )}

      {/* Weather Overlay */}
      <TileLayer
        key={layer} // Force re-render when layer changes
        url={weatherLayerUrl}
        opacity={layer === 'satellite' ? 0.7 : 0.9} // Adjust opacity for better visibility
        attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
      />
    </MapContainer>
  );
}
