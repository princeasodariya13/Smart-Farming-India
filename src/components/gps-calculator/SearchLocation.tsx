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
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox?: [string, string, string, string];
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
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      } finally {
        setLoading(false);
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (s: Suggestion) => {
    setQuery(s.display_name);
    setShowSuggestions(false);
    if (onLocationSelect) {
      let bbox: [number, number, number, number] | undefined = undefined;
      if (s.boundingbox && s.boundingbox.length === 4) {
        bbox = [
          parseFloat(s.boundingbox[0]), 
          parseFloat(s.boundingbox[1]), 
          parseFloat(s.boundingbox[2]), 
          parseFloat(s.boundingbox[3])
        ];
      }
      onLocationSelect(parseFloat(s.lat), parseFloat(s.lon), s.display_name, bbox);
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
          placeholder="Search field location..."
          className="pl-10 pr-4 py-2.5 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary/30 w-64 md:w-80 text-sm outline-none"
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && (query.trim().length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-outline-variant rounded-xl shadow-xl z-[500] max-h-64 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="px-4 py-3 text-sm text-on-surface-variant text-center">Searching...</div>
            ) : suggestions.length > 0 ? (
              <ul>
                {suggestions.map((s) => (
                  <li key={s.place_id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(s)}
                      className="w-full text-left px-4 py-2 hover:bg-surface-container-low transition-colors flex items-start gap-2 border-b border-outline-variant/30 last:border-0"
                    >
                      <MapPin size={16} className="mt-1 flex-shrink-0 text-primary" />
                      <span className="text-sm text-on-surface line-clamp-2">{s.display_name}</span>
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
