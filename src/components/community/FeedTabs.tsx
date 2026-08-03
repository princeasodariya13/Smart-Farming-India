"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FeedTabKey } from "@/types/community";

const TABS: { key: FeedTabKey; label: string }[] = [
  { key: "for-you", label: "For You" },
  { key: "trending", label: "Trending" },
  { key: "following", label: "Following" },
  { key: "nearby", label: "Nearby" },
  { key: "questions", label: "Questions" },
  { key: "photos", label: "Photos" },
  { key: "videos", label: "Videos" },
  { key: "latest", label: "Latest" },
  { key: "saved", label: "Saved" },
];

interface FeedTabsProps {
  active: FeedTabKey;
  onChange: (tab: FeedTabKey) => void;
}

export function FeedTabs({ active, onChange }: FeedTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Community feed filters"
      className="flex gap-1 overflow-x-auto border-b border-outline-variant/30 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            role="tab"
            id={`feed-tab-${tab.key}`}
            aria-selected={isActive}
            aria-controls="community-feed-panel"
            onClick={() => onChange(tab.key)}
            className={cn(
              "relative shrink-0 px-4 py-3 text-label-md font-label-md whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {tab.label}
            {isActive && (
              <motion.span
                layoutId="feed-tab-underline"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
