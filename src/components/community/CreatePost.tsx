"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Video, HelpCircle, BarChart2, Sprout, MapPin } from "lucide-react";
import type { CropCategory } from "@/types/community";

interface CreatePostProps {
  authorAvatarUrl: string;
  authorName: string;
  categories: CropCategory[];
  onSubmit?: (payload: { text: string; crop: string | null; mode: string }) => void;
}

type ComposerMode = "post" | "question" | "poll";

const ACTIONS: { mode: ComposerMode | "image" | "video"; label: string; icon: typeof ImageIcon }[] = [
  { mode: "image", label: "Photo", icon: ImageIcon },
  { mode: "video", label: "Video", icon: Video },
  { mode: "question", label: "Ask Question", icon: HelpCircle },
  { mode: "poll", label: "Add Poll", icon: BarChart2 },
];

export function CreatePost({ authorAvatarUrl, authorName, categories, onSubmit }: CreatePostProps) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<ComposerMode>("post");
  const [crop, setCrop] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const placeholder =
    mode === "question"
      ? "What's puzzling you in the field? Ask the community…"
      : "Share your farming experience…";

  const handlePost = () => {
    if (!text.trim()) return;
    onSubmit?.({ text, crop, mode });
    setText("");
  };

  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <img
          src={authorAvatarUrl}
          alt={`${authorName}'s avatar`}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
        />
        <div className="flex-1">
          <label htmlFor="composer-text" className="sr-only">
            {placeholder}
          </label>
          <textarea
            id="composer-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            rows={focused || text ? 3 : 1}
            placeholder={placeholder}
            className="w-full resize-none rounded-xl border-none bg-surface-container-low p-4 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          />

          <AnimatePresence>
            {(focused || text) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
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
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/50 px-3 py-1.5 text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
                  >
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Add location
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1">
              {ACTIONS.map((action) => {
                const Icon = action.icon;
                const isModeAction = action.mode === "question" || action.mode === "poll";
                const isActive = isModeAction && mode === action.mode;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      setFocused(true);
                      if (isModeAction) setMode(isActive ? "post" : (action.mode as ComposerMode));
                    }}
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
              disabled={!text.trim()}
              whileTap={{ scale: 0.96 }}
              className="rounded-full bg-primary px-6 py-2 text-label-md font-label-md text-on-primary shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
            >
              {mode === "question" ? "Post Question" : "Post"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
