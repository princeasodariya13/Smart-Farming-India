"use client";

import { motion } from "framer-motion";
import { Droplet, Wind } from "lucide-react";
import type { HourlyForecastItem } from "@/types/weather";

interface HourlyForecastProps {
  items: HourlyForecastItem[];
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/** Horizontally scrollable hourly forecast strip. */
export default function HourlyForecast({ items }: HourlyForecastProps) {
  return (
    <section className="space-y-4 rounded-[20px] border border-white/30 bg-white/70 p-6 shadow-sm backdrop-blur-xl md:p-8">
      <h3 className="text-xl font-semibold text-on-surface">Hourly Forecast</h3>
      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex gap-4 overflow-x-auto pb-2"
        role="list"
      >
        {items.map((hour) => (
          <motion.li
            key={hour.time}
            variants={item}
            className="flex min-w-[110px] shrink-0 flex-col items-center gap-3 rounded-2xl border border-white/40 bg-white/50 p-4 transition-all hover:bg-white/80"
          >
            <span className="text-sm text-on-surface-variant">{hour.time}</span>
            <hour.icon size={28} className="text-primary" aria-hidden="true" />
            <span className="text-lg font-bold text-on-surface">{hour.temperatureC}°</span>
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Droplet size={12} aria-hidden="true" />
              <span>{hour.rainChance}%</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              <Wind size={12} aria-hidden="true" />
              <span>{hour.windKmh} km/h</span>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
