"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Video, HelpCircle, BarChart2, Sprout, MapPin, X, Loader2, Plus, Search } from "lucide-react";
import type { CropCategory } from "@/types/community";

interface CreatePostProps {
  authorAvatarUrl?: string | null;
  authorName: string;
  categories: CropCategory[];
  onSubmit?: (payload: { 
    text: string; 
    crop: string | null; 
    mode: string; 
    images?: string[];
    location?: string | null;
    pollOptions?: string[];
  }) => void;
}

type ComposerMode = "post" | "question" | "poll";

const ACTIONS: { id: string; mode: ComposerMode | "image" | "video"; label: string; icon: typeof ImageIcon }[] = [
  { id: "action-photo", mode: "image", label: "Photo", icon: ImageIcon },
  { id: "action-video", mode: "video", label: "Video", icon: Video },
  { id: "action-question", mode: "question", label: "Ask Question", icon: HelpCircle },
  { id: "action-poll", mode: "poll", label: "Add Poll", icon: BarChart2 },
];

export function CreatePost({ authorAvatarUrl, authorName, categories, onSubmit }: CreatePostProps) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<ComposerMode>("post");
  const [crop, setCrop] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  
  // File upload state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll state
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  // Location search state
  const [location, setLocation] = useState<string | null>(null);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{name: string, subtitle: string}>>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!locationSearchQuery.trim() || locationSearchQuery.length < 3) {
        setLocationSuggestions([]);
        return;
      }
      setIsSearchingLocation(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "38d8652905324ef49e93358b6ac82f40";
        const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(locationSearchQuery)}&apiKey=${apiKey}&format=json&filter=countrycode:in&limit=5`);
        const data = await res.json();
        
        if (data && data.results && Array.isArray(data.results)) {
          const formatted = data.results.map((item: any) => {
            const mainName = item.name || item.city || item.county || item.address_line1 || "Unknown Location";
            const subName = item.address_line2 || [item.state, item.country].filter(Boolean).join(', ');
            return {
              name: mainName,
              subtitle: subName
            };
          });
          setLocationSuggestions(formatted);
          setActiveSuggestionIndex(-1);
        }
      } catch (err) {
        console.error("Autocomplete fetch error", err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [locationSearchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeSuggestionIndex < locationSuggestions.length - 1) {
        setActiveSuggestionIndex(prev => prev + 1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeSuggestionIndex > 0) {
        setActiveSuggestionIndex(prev => prev - 1);
      }
    } else if (e.key === 'Enter') {
      if (showLocationSearch && activeSuggestionIndex >= 0 && activeSuggestionIndex < locationSuggestions.length) {
        e.preventDefault();
        const sugg = locationSuggestions[activeSuggestionIndex];
        setLocation(`${sugg.name}, ${sugg.subtitle.split(",")[0]}`);
        setShowLocationSearch(false);
        setLocationSearchQuery("");
        setActiveSuggestionIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowLocationSearch(false);
      setActiveSuggestionIndex(-1);
    }
  };

  // Click outside to close location search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showLocationSearch && !(e.target as Element).closest('.location-search-container')) {
        setShowLocationSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLocationSearch]);

  const placeholder =
    mode === "question"
      ? "What's puzzling you in the field? Ask the community…"
      : mode === "poll"
      ? "Ask a question for your poll…"
      : "Share your farming experience…";

  const handlePost = async () => {
    if (!text.trim() && !selectedImage) {
      alert("Please enter some text or add an image before posting.");
      return;
    }
    if (mode === "poll") {
      const validOptions = pollOptions.filter(o => o.trim() !== "");
      if (validOptions.length < 2) {
        alert("Please add at least 2 valid poll options.");
        return;
      }
    }
    
    setIsPosting(true);
    try {
      const validPollOptions = mode === "poll" ? pollOptions.filter(o => o.trim() !== "") : undefined;
      await onSubmit?.({ 
        text, 
        crop, 
        mode,
        images: selectedImage ? [selectedImage] : [],
        location,
        pollOptions: validPollOptions
      });
      setText("");
      setSelectedImage(null);
      setMode("post");
      setLocation(null);
      setPollOptions(["", ""]);
    } finally {
      setIsPosting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setFocused(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActionClick = (actionMode: string) => {
    setFocused(true);
    if (actionMode === "image" || actionMode === "video") {
      fileInputRef.current?.click();
    } else if (actionMode === "question" || actionMode === "poll") {
      const isModeAction = actionMode === "question" || actionMode === "poll";
      const isActive = isModeAction && mode === actionMode;
      setMode(isActive ? "post" : (actionMode as ComposerMode));
    }
  };

  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        {authorAvatarUrl ? (
          <img
            src={authorAvatarUrl}
            alt={`${authorName}'s avatar`}
            className="h-11 w-11 shrink-0 rounded-full object-cover border border-outline-variant/30"
          />
        ) : (
          <div className="h-11 w-11 shrink-0 rounded-full border border-outline-variant/30 bg-primary-container text-on-primary-container flex items-center justify-center text-sm font-bold tracking-wider">
            {authorName ? authorName.substring(0, 2).toUpperCase() : "F"}
          </div>
        )}
        <div className="flex-1">
          <label htmlFor="composer-text" className="sr-only">
            {placeholder}
          </label>
          <textarea
            id="composer-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            rows={focused || text || selectedImage || mode === "poll" ? 3 : 1}
            placeholder={placeholder}
            className="w-full resize-none rounded-xl border-none bg-surface-container-low p-4 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          />

          {/* Image Preview */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative mt-3 inline-block"
              >
                <img src={selectedImage} alt="Upload preview" className="max-h-64 rounded-xl object-cover border border-outline-variant/30" />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors backdrop-blur-sm"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Poll UI */}
          <AnimatePresence>
            {mode === "poll" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="space-y-2 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <p className="text-label-sm font-label-md text-on-surface-variant mb-1">Poll Options</p>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...pollOptions];
                          newOpts[idx] = e.target.value;
                          setPollOptions(newOpts);
                        }}
                        className="flex-1 rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-body-sm text-on-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                      {idx > 1 && (
                        <button 
                          type="button" 
                          onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))} 
                          className="p-2 text-outline hover:text-error hover:bg-error-container/20 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setPollOptions([...pollOptions, ""])}
                      className="inline-flex items-center gap-1 mt-2 text-label-sm font-label-md text-primary hover:text-primary-container transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Option
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(focused || text || selectedImage || mode === "poll") && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto", transitionEnd: { overflow: "visible" } }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              >
                <div className="flex flex-wrap items-center gap-2 pt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/50 px-3 py-1.5 text-label-sm text-on-surface-variant">
                    <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
                    <select
                      aria-label="Select crop"
                      value={crop ?? ""}
                      onChange={(e) => setCrop(e.target.value || null)}
                      className="bg-transparent focus:outline-none"
                    >
                      <option value="">Select crop</option>
                      {categories.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </span>
                  
                  <div className="relative location-search-container">
                    <button
                      type="button"
                      onClick={() => setShowLocationSearch(true)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-label-sm transition-colors ${
                        location 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="max-w-[100px] truncate">{location ? location.split(",")[0] : "Location"}</span>
                      {location && (
                        <span 
                          className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5 transition-colors" 
                          onClick={(e) => { e.stopPropagation(); setLocation(null); }}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {showLocationSearch && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute left-0 z-50 mt-2 w-72 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-2 shadow-lg"
                        >
                          <div className="flex items-center gap-2 rounded-lg border border-outline-variant/50 bg-surface-container-low px-3 py-2">
                            <Search className="h-4 w-4 text-outline shrink-0" />
                            <input
                              type="text"
                              placeholder="Search city or village..."
                              value={locationSearchQuery}
                              onChange={(e) => setLocationSearchQuery(e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-full bg-transparent text-sm text-on-surface focus:outline-none placeholder:text-outline"
                              autoFocus
                            />
                            {isSearchingLocation && <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />}
                          </div>
                          
                          {locationSuggestions.length > 0 && (
                            <ul className="mt-2 max-h-48 overflow-y-auto custom-scrollbar">
                              {locationSuggestions.map((sugg, idx) => (
                                <li key={idx}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setLocation(`${sugg.name}, ${sugg.subtitle.split(",")[0]}`);
                                      setShowLocationSearch(false);
                                      setLocationSearchQuery("");
                                      setActiveSuggestionIndex(-1);
                                    }}
                                    className={`flex w-full flex-col items-start px-3 py-2 text-left rounded-lg transition-colors ${activeSuggestionIndex === idx ? "bg-surface-container-high" : "hover:bg-surface-container-high"}`}
                                  >
                                    <span className="text-sm font-medium text-on-surface">{sugg.name}</span>
                                    <span className="text-xs text-on-surface-variant line-clamp-1">{sugg.subtitle}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          {locationSearchQuery.length >= 3 && locationSuggestions.length === 0 && !isSearchingLocation && (
                            <div className="py-4 text-center text-sm text-on-surface-variant">
                              No locations found
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1">
              {ACTIONS.map((action) => {
                const Icon = action.icon;
                const isModeAction = action.mode === "question" || action.mode === "poll";
                const isActive = isModeAction && mode === action.mode;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleActionClick(action.mode)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-label-md font-label-md transition-colors ${
                      isActive
                        ? "bg-primary-container text-on-primary-container"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    {action.label}
                  </button>
                );
              })}
            </div>

            <motion.button
              type="button"
              onClick={handlePost}
              disabled={(!text.trim() && !selectedImage) || isPosting || (mode === "poll" && pollOptions.filter(o => o.trim() !== "").length < 2)}
              whileTap={{ scale: 0.96 }}
              className="rounded-full bg-primary flex items-center justify-center gap-2 min-w-[100px] h-10 px-6 text-label-md font-label-md text-on-primary shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === "question" ? "Ask" : mode === "poll" ? "Post Poll" : "Post")}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
