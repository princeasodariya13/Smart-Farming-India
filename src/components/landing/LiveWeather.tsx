"use client";

import { useEffect, useState } from "react";
import { CloudSun, Cloud, Sun, CloudRain, Wind, Loader2 } from "lucide-react";

interface WeatherData {
  temp: number;
  windSpeed: number;
  condition: string;
  icon: any;
}

export default function LiveWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Fetch live weather for Gujarat (Ahmedabad coordinates) using Open-Meteo (No API Key required)
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=23.0225&longitude=72.5714&current=temperature_2m,wind_speed_10m,weather_code"
        );
        const data = await res.json();
        
        const code = data.current.weather_code;
        let condition = "Clear";
        let Icon = Sun;

        // WMO Weather interpretation codes
        if (code >= 1 && code <= 3) {
          condition = "Partly Cloudy";
          Icon = CloudSun;
        } else if (code === 45 || code === 48) {
          condition = "Fog";
          Icon = Cloud;
        } else if (code >= 51 && code <= 67) {
          condition = "Rain";
          Icon = CloudRain;
        } else if (code >= 71 && code <= 77) {
          condition = "Snow";
          Icon = Cloud;
        } else if (code >= 80 && code <= 82) {
          condition = "Showers";
          Icon = CloudRain;
        } else if (code >= 95) {
          condition = "Thunderstorm";
          Icon = CloudRain;
        }

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          condition,
          icon: Icon,
        });
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="flex gap-4">
      <div className="hidden shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex w-32 h-32">
        {weather ? (
          <>
            <span className="text-4xl font-extrabold leading-none text-amber-500">
              {weather.temp}&deg;
            </span>
            <span className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
              {weather.condition}
            </span>
          </>
        ) : (
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        )}
      </div>

      <div className="hidden shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex w-32 h-32">
        {weather ? (
          <>
            <Wind className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-xl font-bold text-slate-700">
              {weather.windSpeed} <span className="text-xs text-slate-500">km/h</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center mt-1">
              Wind
            </span>
          </>
        ) : (
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        )}
      </div>
    </div>
  );
}
