"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import type { GpsStatus } from "@/types/gps-calculator";

interface SearchLocationProps {
  gpsStatus?: GpsStatus;
  currentLocation?: string;
  onLocationSelect?: (lat: number, lon: number, displayName: string, boundingbox?: [number, number, number, number]) => void;
}

const statusConfig: Record<GpsStatus, { label: string; dot: string }> = {
  locked: { label: "GPS Locked", dot: "bg-primary" },
  searching: { label: "Searching…", dot: "bg-tertiary" },
  unavailable: { label: "GPS Unavailable", dot: "bg-error" },
};

interface Suggestion {
  place_id: number | string;
  display_name: string;
  subtitle?: string;
  lat: string | number;
  lon: string | number;
  boundingbox?: [number, number, number, number];
}

export default function SearchLocation({
  gpsStatus = "locked",
  currentLocation = "Punjab, India",
  onLocationSelect
}: SearchLocationProps) {
  const status = statusConfig[gpsStatus];
  
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions, query]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "38d8652905324ef49e93358b6ac82f40";
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${apiKey}&format=json&filter=countrycode:in&limit=10`);
        const data = await response.json();
        
        if (data && data.results && Array.isArray(data.results)) {
          const formatted = data.results.map((item: any, i: number) => {
            const mainName = item.name || item.city || item.county || item.address_line1 || "Unknown Location";
            const subName = item.address_line2 || [item.state, item.country].filter(Boolean).join(', ');
            
            let bbox: [number, number, number, number] | undefined = undefined;
            if (item.bbox && item.bbox.length === 4) {
              // Geoapify bbox is [minLon, minLat, maxLon, maxLat]
              // We need [minLat, maxLat, minLon, maxLon] for Leaflet bounds
              bbox = [item.bbox[1], item.bbox[3], item.bbox[0], item.bbox[2]];
            }
            
            return {
              place_id: item.place_id || i,
              display_name: mainName,
              subtitle: subName,
              lat: item.lat,
              lon: item.lon,
              boundingbox: bbox
            };
          });
          setSuggestions(formatted);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      } finally {
        setLoading(false);
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (s: Suggestion) => {
    setQuery("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onLocationSelect) {
      onLocationSelect(
        typeof s.lat === 'string' ? parseFloat(s.lat) : s.lat, 
        typeof s.lon === 'string' ? parseFloat(s.lon) : s.lon, 
        s.display_name, 
        s.boundingbox
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0)); // Don't go below 0
    } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < suggestions.length) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative" ref={dropdownRef}>
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          size={18}
          aria-hidden="true"
        />
        <label htmlFor="field-search" className="sr-only">
          Search field location
        </label>
        <input
          id="field-search"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search field location..."
          className="pl-10 pr-4 py-2.5 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary/30 w-64 md:w-80 text-sm outline-none"
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && (query.trim().length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-outline-variant rounded-xl shadow-xl z-[9999] max-h-64 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="px-4 py-3 text-sm text-on-surface-variant text-center">Searching...</div>
            ) : suggestions.length > 0 ? (
              <ul>
                {suggestions.map((s, index) => (
                  <li key={s.place_id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(s)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-4 py-2 transition-colors flex items-start justify-between gap-3 border-b border-outline-variant/30 last:border-0 ${
                        index === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-start gap-2 overflow-hidden">
                        <MapPin size={16} className={`mt-0.5 flex-shrink-0 ${index === selectedIndex ? "text-primary" : "text-primary"}`} />
                        <span className={`text-sm truncate flex-shrink-0 ${index === selectedIndex ? "font-bold" : "font-medium text-on-surface"}`}>
                          {s.display_name}
                        </span>
                      </div>
                      {s.subtitle && (
                        <span className="text-[10px] text-on-surface-variant font-medium truncate text-right shrink-0 max-w-[140px] mt-0.5">
                          {s.subtitle}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-on-surface-variant text-center">No locations found.</div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-outline-variant rounded-full text-xs font-medium text-on-surface-variant">
        <span
          className={`w-2 h-2 rounded-full ${status.dot} ${gpsStatus === "locked" ? "animate-pulse" : ""}`}
          aria-hidden="true"
        />
        {status.label}
      </div>
      <span className="text-xs text-on-surface-variant truncate max-w-[200px]" title={currentLocation}>{currentLocation}</span>
    </div>
  );
}
