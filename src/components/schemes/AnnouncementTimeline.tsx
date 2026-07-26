"use client";

import { motion } from "framer-motion";
import { Sparkles, RefreshCw, CalendarClock, TrendingUp, FileText } from "lucide-react";
import type { Announcement } from "@/types/schemes";

interface AnnouncementTimelineProps {
  announcements?: Announcement[];
}

const iconMap: Record<Announcement["type"], typeof Sparkles> = {
  new_scheme: Sparkles,
  reopened: RefreshCw,
  deadline_extended: CalendarClock,
  subsidy_increased: TrendingUp,
  policy_update: FileText,
};

const defaultAnnouncements: Announcement[] = [
  {
    id: "an1",
    type: "new_scheme",
    title: "New Scheme Launched: Natural Farming Mission",
    description: "Financial support for farmers transitioning to natural farming methods.",
    date: "2 days ago",
  },
  {
    id: "an2",
    type: "deadline_extended",
    title: "PM Fasal Bima Yojana Deadline Extended",
    description: "Application window extended by 15 days for Kharif season.",
    date: "5 days ago",
  },
  {
    id: "an3",
    type: "subsidy_increased",
    title: "Solar Pump Subsidy Increased to 90%",
    description: "PM Kusum Yojana subsidy rates revised for small farmers.",
    date: "1 week ago",
  },
  {
    id: "an4",
    type: "reopened",
    title: "Kisan Credit Card Applications Reopened",
    description: "Online applications reopened after portal maintenance.",
    date: "2 weeks ago",
  },
];

export default function AnnouncementTimeline({
  announcements = defaultAnnouncements,
}: AnnouncementTimelineProps) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-sm p-6 md:p-8">
      <h2 className="text-lg font-bold text-on-surface mb-6">Latest Announcements</h2>
      <ol className="relative border-l-2 border-outline-variant/50 pl-6 space-y-6">
        {announcements.map((a, i) => {
          const Icon = iconMap[a.type];
          return (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative"
            >
              <span className="absolute -left-[31px] top-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-white">
                <Icon size={14} />
              </span>
              <p className="text-sm font-semibold text-on-surface">{a.title}</p>
              <p className="text-sm text-on-surface-variant">{a.description}</p>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">{a.date}</p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
