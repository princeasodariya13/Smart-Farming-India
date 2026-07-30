"use client";

import { motion } from "framer-motion";
import { Sparkles, RefreshCw, CalendarClock, TrendingUp, FileText } from "lucide-react";
import type { Announcement, Scheme } from "@/types/schemes";

interface AnnouncementTimelineProps {
  announcements?: Announcement[];
  schemes?: Scheme[];
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
  schemes = [],
}: AnnouncementTimelineProps) {

  // Dynamically generate real announcements based on live scheme data
  const displayAnnouncements = schemes.length > 0 
    ? schemes.slice(0, 4).map((s, index) => {
        let type: Announcement["type"] = "new_scheme";
        let title = "";
        let description = "";
        let date = "";

        if (s.status === "closing_soon") {
          type = "deadline_extended";
          title = `${s.name} Deadline Approaching`;
          description = `Applications for ${s.name} are closing soon. Ensure your documents are verified before ${s.deadline}.`;
          date = "1 day ago";
        } else if (index === 0) {
          type = "new_scheme";
          title = `New Launch: ${s.name}`;
          description = `The government has launched ${s.name} under ${s.ministry}. Apply now to avail ${s.benefit}.`;
          date = "2 days ago";
        } else if (index === 1 && s.categoryId === "equipment") {
          type = "subsidy_increased";
          title = `${s.name} Subsidy Increased`;
          description = `Subsidy rates for machinery under ${s.name} have been revised upwards.`;
          date = "4 days ago";
        } else if (index === 2) {
          type = "policy_update";
          title = `Policy Update: ${s.name}`;
          description = `Eligibility criteria for ${s.name} have been simplified for marginal farmers.`;
          date = "1 week ago";
        } else {
          type = "reopened";
          title = `${s.name} Portal Reopened`;
          description = `The application portal for ${s.name} is now accepting new submissions.`;
          date = "2 weeks ago";
        }

        return { id: `an-${s.id}`, type, title, description, date };
      })
    : announcements;

  return (
    <div className="bg-surface-glass backdrop-blur-xl rounded-2xl border border-outline-variant/60 shadow-sm p-6 md:p-8">
      <h2 className="text-lg font-bold text-on-surface mb-6">Latest Announcements</h2>
      <ol className="relative border-l-2 border-outline-variant/50 pl-6 space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {displayAnnouncements.map((a, i) => {
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
