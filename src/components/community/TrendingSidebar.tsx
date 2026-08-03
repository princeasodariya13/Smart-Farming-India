import { useState } from "react";
import { CloudRain, Landmark, LineChart, Sprout, Bug } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TrendingTopic } from "@/types/community";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<TrendingTopic["category"], LucideIcon> = {
  crop: Sprout,
  pest: Bug,
  weather: CloudRain,
  scheme: Landmark,
  market: LineChart,
};

interface TrendingSidebarProps {
  topics: TrendingTopic[];
  onTopicClick?: (topic: string) => void;
  onSeeAll?: () => void;
  activeQuery?: string;
}

export function TrendingSidebar({ topics, onTopicClick, onSeeAll, activeQuery }: TrendingSidebarProps) {
  const [expanded, setExpanded] = useState(false);
  
  const displayedTopics = expanded ? topics : topics.slice(0, 5);

  const handleSeeAllToggle = () => {
    if (expanded) {
      setExpanded(false);
    } else {
      setExpanded(true);
      onSeeAll?.();
    }
  };

  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-headline-md text-lg font-bold text-on-surface">Trending Discussions</h3>
        {topics.length > 5 && (
          <button 
            onClick={handleSeeAllToggle}
            className="text-label-md font-label-md text-primary hover:underline"
          >
            {expanded ? "Show Less" : "See All"}
          </button>
        )}
      </div>
      <ul className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {displayedTopics.map((topic) => {
            const Icon = CATEGORY_ICON[topic.category];
            const query = topic.title.replace("Discussions about ", "");
            const isActive = activeQuery === query;
            
            return (
              <motion.li 
                key={topic.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  onClick={() => onTopicClick?.(topic.title)}
                  className="group flex w-full text-left items-center gap-3"
                >
                  <span className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-on-primary" 
                      : "bg-surface-container text-on-surface-variant group-hover:bg-primary-container group-hover:text-on-primary-container"
                  )}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-label-sm text-outline">
                      <span className="font-bold text-on-surface-variant">#{topic.rank}</span>
                    </span>
                    <h4 className={cn(
                      "truncate text-label-md font-label-md transition-colors",
                      isActive ? "text-primary" : "text-on-surface group-hover:text-primary"
                    )}>
                      {topic.title}
                    </h4>
                    <p className="text-label-sm text-outline">{topic.meta}</p>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
