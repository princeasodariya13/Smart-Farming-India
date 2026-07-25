"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Tractor,
  ScanSearch,
  CloudLightning,
  FileText,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import type { TimelineEvent } from "@/types/profile";

interface TimelineProps {
  events?: TimelineEvent[];
}

const iconMap: Record<TimelineEvent["type"], typeof ShoppingBag> = {
  purchase: ShoppingBag,
  rental: Tractor,
  scan: ScanSearch,
  weather: CloudLightning,
  scheme: FileText,
  community: MessageSquare,
  payment: CreditCard,
};

const defaultEvents: TimelineEvent[] = [
  {
    id: "e1",
    type: "purchase",
    title: "Purchased Fertilizer",
    description: "Ordered 2 bags of DAP fertilizer from Marketplace",
    timestamp: "2 hours ago",
  },
  {
    id: "e2",
    type: "rental",
    title: "Equipment Rented",
    description: "Rotavator 6ft rented for 3 days",
    timestamp: "Yesterday",
  },
  {
    id: "e3",
    type: "scan",
    title: "Disease Scan Completed",
    description: "Rice Blast detected with 98.4% confidence",
    timestamp: "2 days ago",
  },
  {
    id: "e4",
    type: "weather",
    title: "Weather Alert Viewed",
    description: "Heavy rainfall warning for Karnal district",
    timestamp: "3 days ago",
  },
  {
    id: "e5",
    type: "scheme",
    title: "Scheme Applied",
    description: "Applied for PM-KISAN installment",
    timestamp: "5 days ago",
  },
  {
    id: "e6",
    type: "community",
    title: "Community Post",
    description: "Shared tips on drip irrigation setup",
    timestamp: "1 week ago",
  },
  {
    id: "e7",
    type: "payment",
    title: "Payment Completed",
    description: "Annual Premium subscription renewed",
    timestamp: "2 weeks ago",
  },
];

export default function Timeline({ events = defaultEvents }: TimelineProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm">
      <h2 className="text-lg font-bold text-on-surface mb-6">Activity Timeline</h2>
      <ol className="relative border-l-2 border-outline-variant/50 pl-6 space-y-6">
        {events.length === 0 ? (
          <li className="py-4 text-sm text-on-surface-variant -ml-6">No recent activity.</li>
        ) : events.map((event, i) => {
          const Icon = iconMap[event.type];
          return (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative"
            >
              <span className="absolute -left-[31px] top-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-white">
                <Icon size={14} />
              </span>
              <p className="text-sm font-semibold text-on-surface">{event.title}</p>
              <p className="text-sm text-on-surface-variant">{event.description}</p>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">{event.timestamp}</p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
