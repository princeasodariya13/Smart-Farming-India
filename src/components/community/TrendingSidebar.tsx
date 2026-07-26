import { CloudRain, Landmark, LineChart, Sprout, Bug } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TrendingTopic } from "@/types/community";

const CATEGORY_ICON: Record<TrendingTopic["category"], LucideIcon> = {
  crop: Sprout,
  pest: Bug,
  weather: CloudRain,
  scheme: Landmark,
  market: LineChart,
};

interface TrendingSidebarProps {
  topics: TrendingTopic[];
}

export function TrendingSidebar({ topics }: TrendingSidebarProps) {
  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-headline-md text-lg font-bold text-on-surface">Trending Discussions</h3>
        <button className="text-label-md font-label-md text-primary hover:underline">See All</button>
      </div>
      <ul className="flex flex-col gap-4">
        {topics.map((topic) => {
          const Icon = CATEGORY_ICON[topic.category];
          return (
            <li key={topic.id}>
              <a href="#" className="group flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant transition-colors group-hover:bg-primary-container group-hover:text-on-primary-container">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-label-sm text-outline">
                    <span className="font-bold text-on-surface-variant">#{topic.rank}</span>
                  </span>
                  <h4 className="truncate text-label-md font-label-md text-on-surface transition-colors group-hover:text-primary">
                    {topic.title}
                  </h4>
                  <p className="text-label-sm text-outline">{topic.meta}</p>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
