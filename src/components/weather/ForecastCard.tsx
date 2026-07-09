"use client";

import { motion } from "framer-motion";
import { Droplet } from "lucide-react";
import type { DailyForecastItem } from "@/types/weather";

interface ForecastCardProps {
  day: DailyForecastItem;
}

/** Single day forecast tile: day, icon, high/low, rain chance. */
export function ForecastCard({ day }: ForecastCardProps) {
  const { icon: Icon } = day;
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-white/40 bg-white/50 p-4 transition-colors hover:bg-white/80"
    >
      <span className="text-sm text-on-surface-variant">{day.day}</span>
      <Icon size={30} className="text-primary" aria-hidden="true" />
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-on-surface">{day.highC}°</span>
        <span className="text-sm text-on-surface-variant">{day.lowC}°</span>
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
        <Droplet size={12} aria-hidden="true" />
        <span>{day.rainChance}%</span>
      </div>
    </motion.div>
  );
}

interface SevenDayForecastProps {
  days: DailyForecastItem[];
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

/** 7-day forecast section built from ForecastCard tiles. */
export default function SevenDayForecast({ days }: SevenDayForecastProps) {
  return (
    <section className="space-y-6 rounded-[20px] border border-white/30 bg-white/70 p-6 shadow-sm backdrop-blur-xl md:p-8">
      <h3 className="text-xl font-semibold text-on-surface">7-Day Forecast</h3>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7"
      >
        {days.map((day) => (
          <motion.div key={day.day} variants={item}>
            <ForecastCard day={day} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
