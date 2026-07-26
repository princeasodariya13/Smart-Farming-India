"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityEvent } from "@/types/community";

export function CommunityEventCard({ event }: { event: CommunityEvent }) {
  const [joined, setJoined] = useState(false);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
      <div className="relative aspect-[16/9] bg-surface-container">
        {event.bannerUrl && (
          <img src={event.bannerUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-surface-container-lowest/90 px-2.5 py-1 text-label-sm font-label-md text-on-surface backdrop-blur">
          {event.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h4 className="text-label-md font-label-md text-on-surface">{event.title}</h4>
        <p className="flex items-center gap-1.5 text-label-sm text-outline">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {event.date}
        </p>
        <p className="flex items-center gap-1.5 text-label-sm text-outline">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {event.time}
        </p>
        <p className="flex items-center gap-1.5 text-label-sm text-outline">
          {event.isOnline ? <Video className="h-3.5 w-3.5" aria-hidden="true" /> : <MapPin className="h-3.5 w-3.5" aria-hidden="true" />}
          {event.location}
        </p>

        <button
          type="button"
          onClick={() => setJoined((v) => !v)}
          aria-pressed={joined}
          className={cn(
            "mt-2 w-full rounded-full py-2 text-label-md font-label-md transition-colors",
            joined
              ? "border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high"
              : "bg-primary text-on-primary hover:shadow-md"
          )}
        >
          {joined ? "Joined" : "Join"}
        </button>
      </div>
    </div>
  );
}

export function CommunityEventsSection({ events }: { events: CommunityEvent[] }) {
  return (
    <section aria-label="Community events">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-headline-md text-lg font-bold text-on-surface">Community Events</h3>
        <button className="text-label-md font-label-md text-primary hover:underline">See All</button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <CommunityEventCard key={e.id} event={e} />
        ))}
      </div>
    </section>
  );
}
