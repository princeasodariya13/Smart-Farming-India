"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { MapPin } from "lucide-react";
import type { CurrentWeather } from "@/types/weather";

interface WeatherHeroProps {
  data: CurrentWeather;
}

function AnimatedTemperature({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => `${Math.round(v)}°C`);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1, ease: "easeOut" });
    return () => controls.stop();
  }, [value, motionValue]);

  return <motion.span className="font-bold leading-none">{rounded}</motion.span>;
}

/** Hero card showing location, current temperature, condition, and high/low. */
export default function WeatherHero({ data }: WeatherHeroProps) {
  const { location, temperatureC, feelsLikeC, highC, lowC, condition, icon: Icon } = data;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-label="Current weather"
      className="relative flex min-h-[320px] flex-col items-center justify-between gap-8 overflow-hidden rounded-[20px] border border-white/30 bg-white/70 p-8 shadow-sm backdrop-blur-xl md:flex-row"
    >
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary-container/20 blur-2xl"
      />

      <div className="relative z-10 space-y-4 text-center md:text-left">
        <div className="flex items-center justify-center gap-2 md:justify-start">
          <MapPin size={32} className="text-primary" aria-hidden="true" />
          <div>
            <h1 className="text-3xl font-semibold text-on-surface">
              {location.city}{location.state ? `, ${location.state}` : ''}
            </h1>
            <p className="text-sm text-on-surface-variant">Last updated: {location.lastUpdated}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 md:justify-start">
          <span className="text-5xl text-primary md:text-6xl">
            <AnimatedTemperature value={temperatureC} />
          </span>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-on-surface">{condition}</span>
            <span className="text-on-surface-variant">Feels like {feelsLikeC}°C</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 md:items-end">
        <Icon size={110} className="text-primary" aria-hidden="true" />
        <div className="rounded-full border border-white/50 bg-white/40 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-bold text-primary">
            H: {highC}° L: {lowC}°
          </span>
        </div>
      </div>
    </motion.section>
  );
}
