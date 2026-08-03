"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, SessionProvider } from 'next-auth/react';
import { useNotification } from '@/contexts/NotificationContext';
import { Leaf } from 'lucide-react';
import PageLoader from '@/components/PageLoader';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Thermometer,
  Sprout,
  RefreshCw,
  Download,
  Radar,
  ClipboardList,
  X
} from "lucide-react";
import WeatherHero from "@/components/weather/WeatherHero";
import WeatherMetricCard from "@/components/weather/WeatherMetricCard";
import HourlyForecast from "@/components/weather/HourlyForecast";
import SevenDayForecast from "@/components/weather/ForecastCard";
import RainfallChart from "@/components/weather/RainfallChart";
import WeatherAlertCard from "@/components/weather/WeatherAlertCard";
import FarmingAdvisoryCard from "@/components/weather/FarmingAdvisoryCard";
import CropImpactCard from "@/components/weather/CropImpactCard";
import WeatherMapCard from "@/components/weather/WeatherMapCard";
import QuickActions from "@/components/weather/QuickActionCard";
import type {
  CurrentWeather,
  WeatherMetric,
  HourlyForecastItem,
  DailyForecastItem,
  RainfallDataPoint,
  FarmingAdvisory,
  WeatherAlert,
  CropWeatherImpact,
  QuickAction,
} from "@/types/weather";



/* ---------------------------------------------------------------------- */

const currentWeather: CurrentWeather = {
  location: { city: "Ahmedabad", state: "Gujarat", lastUpdated: "Updating...", lat: 23.0225, lon: 72.5714 },
  temperatureC: 31,
  feelsLikeC: 34,
  highC: 34,
  lowC: 24,
  condition: "Clear",
  icon: Sun,
};

const metrics: WeatherMetric[] = [
  { id: "humidity", label: "Humidity", value: 45, unit: "%", icon: Droplets, trend: "up", trendValue: "+3% vs yesterday" },
  { id: "wind", label: "Wind Speed", value: 12, unit: "km/h", icon: Wind, trend: "flat", trendValue: "Stable" },
  { id: "pressure", label: "Air Pressure", value: 1013, unit: "hPa", icon: Gauge, trend: "down", trendValue: "-2 hPa" },
  { id: "uv", label: "UV Index", value: 6.8, icon: Sun, status: { label: "High Risk", tone: "warning" } },
  { id: "visibility", label: "Visibility", value: 10, unit: "km", icon: Eye, status: { label: "Clear", tone: "primary" } },
  { id: "dewpoint", label: "Dew Point", value: 18, unit: "°C", icon: Thermometer },
  { id: "soil", label: "Soil Moisture", value: 70, unit: "%", icon: Droplets, status: { label: "Optimal", tone: "primary" } },
  { id: "et", label: "Evapotranspiration", value: 4.2, unit: "mm/day", icon: Sprout, trend: "up", trendValue: "+0.4 mm" },
];

const hourly: HourlyForecastItem[] = [
  { time: "Now", icon: CloudSun, temperatureC: 31, rainChance: 12, windKmh: 12 },
  { time: "1 PM", icon: Sun, temperatureC: 33, rainChance: 8, windKmh: 14 },
  { time: "2 PM", icon: Sun, temperatureC: 34, rainChance: 5, windKmh: 15 },
  { time: "3 PM", icon: CloudSun, temperatureC: 33, rainChance: 10, windKmh: 13 },
  { time: "4 PM", icon: Cloud, temperatureC: 31, rainChance: 20, windKmh: 11 },
  { time: "5 PM", icon: CloudRain, temperatureC: 28, rainChance: 45, windKmh: 16 },
  { time: "6 PM", icon: CloudRain, temperatureC: 26, rainChance: 60, windKmh: 18 },
];

const sevenDay: DailyForecastItem[] = [
  { day: "Today", icon: CloudSun, highC: 31, lowC: 24, rainChance: 12 },
  { day: "Wed", icon: Sun, highC: 34, lowC: 25, rainChance: 5 },
  { day: "Thu", icon: Cloud, highC: 29, lowC: 23, rainChance: 40 },
  { day: "Fri", icon: CloudRain, highC: 26, lowC: 21, rainChance: 85 },
  { day: "Sat", icon: CloudSnow, highC: 24, lowC: 18, rainChance: 15 },
  { day: "Sun", icon: Sun, highC: 32, lowC: 22, rainChance: 0 },
  { day: "Mon", icon: Sun, highC: 35, lowC: 26, rainChance: 2 },
];

const rainfallData: Record<"weekly" | "monthly" | "forecast", RainfallDataPoint[]> = {
  weekly: [
    { label: "Mon", actualMm: 2, forecastMm: null },
    { label: "Tue", actualMm: 5, forecastMm: null },
    { label: "Wed", actualMm: 4.5, forecastMm: null },
    { label: "Thu", actualMm: 1, forecastMm: null },
    { label: "Fri", actualMm: 0, forecastMm: null },
    { label: "Sat", actualMm: null, forecastMm: 8 },
    { label: "Sun", actualMm: null, forecastMm: 6 },
  ],
  monthly: [
    { label: "Week 1", actualMm: 18, forecastMm: null },
    { label: "Week 2", actualMm: 24, forecastMm: null },
    { label: "Week 3", actualMm: 12, forecastMm: null },
    { label: "Week 4", actualMm: null, forecastMm: 20 },
  ],
  forecast: [
    { label: "Next 3d", actualMm: null, forecastMm: 14 },
    { label: "Next 7d", actualMm: null, forecastMm: 28 },
    { label: "Next 14d", actualMm: null, forecastMm: 45 },
  ],
};

const advisory: FarmingAdvisory = {
  irrigation:
    "High evapotranspiration (4.2mm) and low predicted rainfall suggest increasing irrigation by 15% for your Wheat crop over the next 48 hours.",
  spraying: "Humidity levels are ideal for organic pest control application this evening.",
  fertilizer: "Hold nitrogen top-dressing until after Friday's expected rainfall.",
  harvest: "No harvest-critical weather expected in the next 7 days.",
  pestRisk: "moderate",
  diseaseRisk: "low",
};

const alerts: WeatherAlert[] = [
  {
    id: "alert-1",
    type: "Heavy Rain",
    severity: "high",
    description: "Heavy rainfall expected Friday afternoon — 85% chance, up to 40mm.",
    timestamp: "Valid until Fri, 8:00 PM",
    actionLabel: "View Details",
  },
  {
    id: "alert-2",
    type: "Heatwave",
    severity: "moderate",
    description: "Temperatures may exceed 35°C Monday — protect sensitive crops.",
    timestamp: "Valid Mon, 12:00–5:00 PM",
    actionLabel: "Advisory",
  },
];

const cropImpacts: CropWeatherImpact[] = [
  {
    cropName: "Wheat",
    impact: "Rising evapotranspiration is increasing water demand.",
    riskLevel: "moderate",
    recommendedAction: "Increase irrigation frequency by 15% this week.",
  },
  {
    cropName: "Cotton",
    impact: "Upcoming rain may delay planned pesticide spraying.",
    riskLevel: "low",
    recommendedAction: "Reschedule spraying to after Friday's rainfall.",
  },
  {
    cropName: "Sugarcane",
    impact: "High humidity raises fungal disease risk.",
    riskLevel: "high",
    recommendedAction: "Apply preventive fungicide before Thursday.",
  },
];


const gujaratDistricts = [
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { name: "Amreli", lat: 21.6032, lon: 71.2221 },
  { name: "Anand", lat: 22.5645, lon: 72.9289 },
  { name: "Aravalli", lat: 23.4241, lon: 73.3100 },
  { name: "Banaskantha", lat: 24.1723, lon: 71.8493 },
  { name: "Bharuch", lat: 21.7051, lon: 72.9959 },
  { name: "Bhavnagar", lat: 21.7645, lon: 72.1519 },
  { name: "Botad", lat: 22.1706, lon: 71.6684 },
  { name: "Chhota Udaipur", lat: 22.3082, lon: 74.0044 },
  { name: "Dahod", lat: 22.8315, lon: 74.2566 },
  { name: "Dang", lat: 20.8062, lon: 73.6934 },
  { name: "Devbhoomi Dwarka", lat: 22.2442, lon: 68.9685 },
  { name: "Gandhinagar", lat: 23.2156, lon: 72.6369 },
  { name: "Gir Somnath", lat: 20.8872, lon: 70.4026 },
  { name: "Jamnagar", lat: 22.4707, lon: 70.0577 },
  { name: "Junagadh", lat: 21.5222, lon: 70.4579 },
  { name: "Kheda", lat: 22.7538, lon: 72.6841 },
  { name: "Kutch", lat: 23.7337, lon: 69.8597 },
  { name: "Mahisagar", lat: 23.2842, lon: 73.4913 },
  { name: "Mehsana", lat: 23.5880, lon: 72.3693 },
  { name: "Morbi", lat: 22.8120, lon: 70.8320 },
  { name: "Narmada", lat: 21.8703, lon: 73.5356 },
  { name: "Navsari", lat: 20.9467, lon: 72.9520 },
  { name: "Panchmahal", lat: 22.7663, lon: 73.6167 },
  { name: "Patan", lat: 23.8493, lon: 72.1266 },
  { name: "Porbandar", lat: 21.6417, lon: 69.6293 },
  { name: "Rajkot", lat: 22.3039, lon: 70.8022 },
  { name: "Sabarkantha", lat: 23.6393, lon: 73.1119 },
  { name: "Surat", lat: 21.1702, lon: 72.8311 },
  { name: "Surendranagar", lat: 22.7276, lon: 71.6371 },
  { name: "Tapi", lat: 21.1714, lon: 73.6186 },
  { name: "Vadodara", lat: 22.3072, lon: 73.1812 },
  { name: "Valsad", lat: 20.5992, lon: 72.9342 }
];

function WeatherContent() {
  const { data: session, status } = useSession();


  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { addNotification } = useNotification();



  const [liveWeather, setLiveWeather] = useState(currentWeather);
  const [liveMetrics, setLiveMetrics] = useState(metrics);
  const [liveHourly, setLiveHourly] = useState(hourly);
  const [liveSevenDay, setLiveSevenDay] = useState(sevenDay);
  const [liveRainfall, setLiveRainfall] = useState(rainfallData);
  const [liveAdvisory, setLiveAdvisory] = useState<FarmingAdvisory>(advisory);
  const [liveAlerts, setLiveAlerts] = useState<WeatherAlert[]>(alerts);
  const [liveCropImpacts, setLiveCropImpacts] = useState<CropWeatherImpact[]>(cropImpacts);
  
  const [irrigationPlan, setIrrigationPlan] = useState<{
    et: number;
    rain: number;
    isDeficit: boolean;
    amount: string;
  } | null>(null);

  const getIconComponent = (name: string) => {
    switch(name) {
      case 'Sun': return Sun;
      case 'CloudSun': return CloudSun;
      case 'Cloud': return Cloud;
      case 'CloudRain': return CloudRain;
      case 'CloudSnow': return CloudSnow;
      case 'CloudLightning': return Radar;
      case 'CloudFog': return Cloud;
      case 'Droplets': return Droplets;
      case 'Wind': return Wind;
      case 'Gauge': return Gauge;
      case 'Eye': return Eye;
      case 'Thermometer': return Thermometer;
      case 'Sprout': return Sprout;
      default: return Sun;
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const [liveSuggestions, setLiveSuggestions] = useState<Array<{name: string, lat: number, lon: number, subtitle: string}>>([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim() || searchQuery.length < 3) {
        setLiveSuggestions([]);
        return;
      }
      try {
        // Using Geoapify for highly accurate village/taluka/district autocomplete
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "38d8652905324ef49e93358b6ac82f40";
        const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchQuery)}&apiKey=${apiKey}&format=json&filter=countrycode:in&limit=10`);
        const data = await res.json();
        
        if (data && data.results && Array.isArray(data.results)) {
          const formatted = data.results.map((item: any) => {
            const mainName = item.name || item.city || item.county || item.address_line1 || "Unknown Location";
            const subName = item.address_line2 || [item.state, item.country].filter(Boolean).join(', ');
            return {
              name: mainName,
              subtitle: subName,
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon)
            };
          });
          setLiveSuggestions(formatted);
        }
      } catch (err) {
        console.error("Autocomplete fetch error", err);
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchWeatherByCoords = async (lat: number, lon: number, locName: string) => {
    try {
      const owmApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "02785a68098150e0254c7a9e7321daac";
      const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration,uv_index_clear_sky_max,uv_index_max,sunshine_duration,daylight_duration,sunset,sunrise,rain_sum,showers_sum,snowfall_sum,precipitation_sum,precipitation_hours,precipitation_probability_max&hourly=temperature_2m,relative_humidity_2m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m,visibility,cloud_cover_high,cloud_cover_low,cloud_cover,weather_code,evapotranspiration,vapour_pressure_deficit,et0_fao_evapotranspiration,cloud_cover_mid,surface_pressure,pressure_msl&timezone=auto&past_days=28&forecast_days=14`;
      
      const [owmRes, owmForecastRes, meteoRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${owmApiKey}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${owmApiKey}&units=metric`),
        fetch(meteoUrl)
      ]);

      const owmData = await owmRes.json();
      const owmForecast = await owmForecastRes.json();
      const meteoData = await meteoRes.json();

      // Get current hour index for meteo
      const now = new Date();
      let currentHourIndex = meteoData?.hourly?.time?.findIndex((t: string) => new Date(t).getTime() > now.getTime()) - 1;
      if (currentHourIndex < 0 || isNaN(currentHourIndex)) currentHourIndex = 0;

      // OWM Icons
      let icon = Sun;
      let condition = "Clear";
      if (owmData?.weather?.length > 0) {
        const code = owmData.weather[0].icon;
        condition = owmData.weather[0].main;
        if (code.startsWith("01")) icon = Sun;
        else if (code.startsWith("02")) icon = CloudSun;
        else if (code.startsWith("03") || code.startsWith("04")) icon = Cloud;
        else if (code.startsWith("09") || code.startsWith("10")) icon = CloudRain;
        else if (code.startsWith("11")) icon = CloudRain;
        else if (code.startsWith("13")) icon = CloudSnow;
        else icon = Cloud;
      }

      setLiveWeather(prev => ({
        ...prev,
        location: { city: locName.split(',')[0], state: locName.split(',')[1]?.trim() || '', lastUpdated: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), lat, lon },
        temperatureC: owmData?.main?.temp ? Math.round(owmData.main.temp) : 0,
        feelsLikeC: owmData?.main?.feels_like ? Math.round(owmData.main.feels_like) : 0,
        highC: owmData?.main?.temp_max ? Math.round(owmData.main.temp_max) : 0,
        lowC: owmData?.main?.temp_min ? Math.round(owmData.main.temp_min) : 0,
        condition,
        icon
      }));

      setLiveMetrics(prev => {
        const updated = [...prev];
        // OWM: Humidity, Wind, Pressure, Visibility
        updated[0] = { ...updated[0], value: owmData?.main?.humidity ?? "N/A" };
        updated[1] = { ...updated[1], value: owmData?.wind?.speed ? Math.round(owmData.wind.speed * 3.6) : "N/A" };
        updated[2] = { ...updated[2], value: owmData?.main?.pressure ?? "N/A" };
        updated[4] = { ...updated[4], value: owmData?.visibility ? Number((owmData.visibility / 1000).toFixed(1)) : "N/A" };
        
        // OWM: UV Index & Dew Point (Not natively in free OWM, calc dew point)
        updated[3] = { ...updated[3], value: "N/A", status: { label: "OWM N/A", tone: "info" } };
        const dp = owmData?.main?.temp && owmData?.main?.humidity ? Math.round(owmData.main.temp - ((100 - owmData.main.humidity) / 5)) : "N/A";
        updated[5] = { ...updated[5], value: dp };
        
        // Open-Meteo: Soil Moisture & ET0
        let sm = meteoData?.hourly?.soil_moisture_9_to_27cm?.[currentHourIndex];
        updated[6] = { ...updated[6], value: sm !== undefined ? Math.round(sm * 100) : "N/A" };
        let et0 = meteoData?.daily?.et0_fao_evapotranspiration?.[0];
        updated[7] = { ...updated[7], value: et0 !== undefined ? Number(et0.toFixed(1)) : "N/A" };
        
        return updated;
      });

      // OWM: Hourly Forecast
      if (owmForecast && owmForecast.list) {
        const newHourly = owmForecast.list.slice(0, 7).map((item: any, idx: number) => {
          const dt = new Date(item.dt * 1000);
          let timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          if (idx === 0) timeStr = "Now";
          
          let hrIcon = Sun;
          if (item.weather?.[0]) {
            const code = item.weather[0].icon;
            if (code.startsWith("01")) hrIcon = Sun;
            else if (code.startsWith("02")) hrIcon = CloudSun;
            else if (code.startsWith("03") || code.startsWith("04")) hrIcon = Cloud;
            else if (code.startsWith("09") || code.startsWith("10")) hrIcon = CloudRain;
            else if (code.startsWith("11")) hrIcon = CloudRain;
            else if (code.startsWith("13")) hrIcon = CloudSnow;
            else hrIcon = Cloud;
          }
          
          return {
            time: timeStr,
            icon: hrIcon,
            temperatureC: Math.round(item.main.temp),
            rainChance: Math.round((item.pop || 0) * 100),
            windKmh: Math.round(item.wind.speed * 3.6)
          };
        });
        setLiveHourly(newHourly);
      }

      // OWM: Daily Forecast
      if (owmForecast && owmForecast.list) {
        const dailyMap = new Map();
        owmForecast.list.forEach((item: any) => {
          const dateStr = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          if (!dailyMap.has(dateStr)) {
            dailyMap.set(dateStr, { min: item.main.temp_min, max: item.main.temp_max, pop: item.pop || 0, icon: item.weather[0]?.icon });
          } else {
            const existing = dailyMap.get(dateStr);
            existing.min = Math.min(existing.min, item.main.temp_min);
            existing.max = Math.max(existing.max, item.main.temp_max);
            existing.pop = Math.max(existing.pop, item.pop || 0);
          }
        });
        
        const newSevenDay = Array.from(dailyMap.entries()).slice(0, 7).map(([day, val], idx) => {
          let dIcon = Sun;
          if (val.icon) {
            const code = val.icon;
            if (code.startsWith("01")) dIcon = Sun;
            else if (code.startsWith("02")) dIcon = CloudSun;
            else if (code.startsWith("03") || code.startsWith("04")) dIcon = Cloud;
            else if (code.startsWith("09") || code.startsWith("10")) dIcon = CloudRain;
            else if (code.startsWith("11")) dIcon = CloudRain;
            else if (code.startsWith("13")) dIcon = CloudSnow;
            else dIcon = Cloud;
          }
          return {
            day: idx === 0 ? "Today" : day,
            icon: dIcon,
            highC: Math.round(val.max),
            lowC: Math.round(val.min),
            rainChance: Math.round(val.pop * 100)
          };
        });
        setLiveSevenDay(newSevenDay);
      }

      // Open-Meteo: Rainfall Forecast & Historical
      if (meteoData && meteoData.daily && meteoData.daily.time) {
        // Today is index 28 (0-27 are past 28 days)
        const todayIdx = 28;
        
        // 1. Weekly (Past 3 days, Today, Next 3 days)
        const newWeeklyRain = [];
        for (let i = todayIdx - 3; i <= todayIdx + 3; i++) {
          const dt = new Date(meteoData.daily.time[i]);
          const day = i === todayIdx ? "Today" : dt.toLocaleDateString('en-US', { weekday: 'short' });
          const val = meteoData.daily.precipitation_sum[i] || 0;
          
          let actual: number | null = null;
          let forecast: number | null = null;
          
          if (i < todayIdx) {
            actual = Number(val.toFixed(1));
            // Create a seamless anchor for Recharts so the dashed line connects perfectly to the last solid bar
            if (i === todayIdx - 1) {
              forecast = Number(val.toFixed(1));
            }
          } else {
            forecast = Number(val.toFixed(1));
          }

          newWeeklyRain.push({
            label: day,
            actualMm: actual,
            forecastMm: forecast
          });
        }
        
        // 2. Monthly (Past 4 Weeks)
        const newMonthlyRain = [];
        for (let w = 0; w < 4; w++) {
          let sum = 0;
          for (let d = 0; d < 7; d++) {
            sum += meteoData.daily.precipitation_sum[w * 7 + d] || 0;
          }
          newMonthlyRain.push({
            label: `Week ${w + 1}`,
            actualMm: Number(sum.toFixed(1)),
            forecastMm: null
          });
        }
        
        // 3. Forecast Accumulations (Next 3d, Next 7d, Next 14d)
        const getSum = (days: number) => {
          let sum = 0;
          for (let i = todayIdx + 1; i <= todayIdx + days && i < meteoData.daily.precipitation_sum.length; i++) {
            sum += meteoData.daily.precipitation_sum[i] || 0;
          }
          return Number(sum.toFixed(1));
        };
        const newForecastRain = [
          { label: "Next 3d", actualMm: null, forecastMm: getSum(3) },
          { label: "Next 7d", actualMm: null, forecastMm: getSum(7) },
          { label: "Next 14d", actualMm: null, forecastMm: getSum(13) },
        ];
        
        setLiveRainfall({
          weekly: newWeeklyRain,
          monthly: newMonthlyRain,
          forecast: newForecastRain
        });
        
        // Dynamically calculate Alerts based on OpenWeather + OpenMeteo
        const newAlerts: WeatherAlert[] = [];
        const maxWind = meteoData.daily.wind_gusts_10m_max?.[todayIdx];
        const maxRain = meteoData.daily.precipitation_sum?.[todayIdx];
        const maxTemp = meteoData.daily.temperature_2m_max?.[todayIdx];
        
        if (maxRain > 25) {
          newAlerts.push({ id: "dyn-rain", type: "Heavy Rain", severity: "high", description: `Heavy rainfall expected (${maxRain}mm) today.`, timestamp: "Valid Today", actionLabel: "View Radar" });
        }
        if (maxTemp > 35) {
          newAlerts.push({ id: "dyn-heat", type: "Heatwave", severity: "moderate", description: `High temperatures expected (${maxTemp}°C). Protect sensitive crops.`, timestamp: "Valid Today", actionLabel: "View Advisory" });
        }
        if (maxWind > 40) {
          newAlerts.push({ id: "dyn-wind", type: "Strong Wind", severity: "high", description: `Strong wind gusts up to ${maxWind}km/h today.`, timestamp: "Valid Today", actionLabel: "View Details" });
        }
        setLiveAlerts(newAlerts);

        // Dynamically calculate Advisory & Crop Impacts
        const pop = meteoData.daily.precipitation_probability_max?.[todayIdx] || 0;
        const et = meteoData.daily.et0_fao_evapotranspiration?.[todayIdx] || 0;
        
        setLiveAdvisory({
          summary: `Our AI has analyzed today's ${maxTemp}°C peak temperature and ${et.toFixed(1)}mm evaporation rate against the projected ${maxRain}mm of rainfall.`,
          irrigation: et > 4 ? `High evapotranspiration (${et.toFixed(1)}mm) requires increased irrigation.` : `Evapotranspiration is stable (${et.toFixed(1)}mm). Normal irrigation.`,
          spraying: pop > 50 ? `High rain chance (${pop}%). Reschedule spraying.` : `Low rain chance (${pop}%). Good conditions for spraying.`,
          fertilizer: pop > 50 ? `Hold nitrogen top-dressing until after rainfall.` : `Ideal conditions for fertilizer application.`,
          harvest: maxRain > 10 ? `Delay harvest due to expected rain (${maxRain}mm).` : `Clear weather expected. Safe to harvest.`,
          pestRisk: maxTemp > 30 ? "high" : "moderate",
          diseaseRisk: owmData?.main?.humidity > 80 ? "high" : "low"
        });

        // Dynamically choose 6 crops based on Indian State/Region
        let localCrops = ["Wheat", "Rice", "Sugarcane", "Cotton", "Maize", "Tomato"]; // Default
        const locLower = locName.toLowerCase();
        
        if (locLower.includes("gujarat")) {
          localCrops = ["Cotton", "Groundnut", "Wheat", "Mango", "Cumin", "Onion"];
        } else if (locLower.includes("punjab") || locLower.includes("haryana")) {
          localCrops = ["Wheat", "Rice", "Mustard", "Sugarcane", "Maize", "Cotton"];
        } else if (locLower.includes("maharashtra")) {
          localCrops = ["Sugarcane", "Cotton", "Soybean", "Onion", "Grapes", "Pomegranate"];
        } else if (locLower.includes("kerala") || locLower.includes("tamil nadu") || locLower.includes("andhra") || locLower.includes("karnataka")) {
          localCrops = ["Rice", "Coconut", "Banana", "Coffee", "Cardamom", "Mango"];
        } else if (locLower.includes("assam") || locLower.includes("west bengal") || locLower.includes("meghalaya") || locLower.includes("tripura")) {
          localCrops = ["Tea", "Rice", "Jute", "Pineapple", "Arecanut", "Ginger"];
        } else if (locLower.includes("himachal") || locLower.includes("jammu") || locLower.includes("uttarakhand") || locLower.includes("kashmir")) {
          localCrops = ["Apple", "Potato", "Wheat", "Cherry", "Walnut", "Saffron"];
        } else if (locLower.includes("rajasthan") || locLower.includes("madhya pradesh")) {
          localCrops = ["Mustard", "Wheat", "Cotton", "Soybean", "Millets", "Chickpea"];
        } else if (locLower.includes("uttar pradesh") || locLower.includes("bihar")) {
          localCrops = ["Sugarcane", "Wheat", "Rice", "Maize", "Potato", "Mango"];
        }

        const humidity = owmData?.main?.humidity || 50;
        const sm = (meteoData.hourly.soil_moisture_9_to_27cm?.[todayIdx] || 0.3) * 100;

        const getCropImpact = (crop: string): CropWeatherImpact => {
          if (crop === "Wheat") return { cropName: "Wheat", impact: et > 4 ? "High water demand due to heat." : "Favorable conditions.", riskLevel: et > 4 ? "moderate" : "low", recommendedAction: et > 4 ? "Increase irrigation." : "Monitor growth." };
          if (crop === "Cotton") return { cropName: "Cotton", impact: pop > 50 ? "Rain may wash away pesticides." : "Good spraying conditions.", riskLevel: pop > 50 ? "high" : "low", recommendedAction: pop > 50 ? "Delay spraying." : "Proceed with spraying." };
          if (crop === "Sugarcane") return { cropName: "Sugarcane", impact: humidity > 80 ? "High humidity raises fungal risk." : "Optimal growth conditions.", riskLevel: humidity > 80 ? "high" : "low", recommendedAction: humidity > 80 ? "Apply preventive fungicide." : "Maintain normal routine." };
          if (crop === "Rice") return { cropName: "Rice", impact: maxRain < 5 ? "Low rainfall might affect paddy water levels." : "Rainfall is supporting paddy fields.", riskLevel: maxRain < 5 ? "high" : "low", recommendedAction: maxRain < 5 ? "Ensure artificial flooding." : "Maintain current water level." };
          if (crop === "Groundnut") return { cropName: "Groundnut", impact: sm < 40 ? "Low soil moisture at root zone." : "Adequate soil moisture.", riskLevel: sm < 40 ? "moderate" : "low", recommendedAction: sm < 40 ? "Schedule light irrigation." : "No immediate action." };
          if (crop === "Mustard") return { cropName: "Mustard", impact: maxTemp > 30 ? "Heat stress may affect flowering." : "Favorable cool conditions.", riskLevel: maxTemp > 30 ? "moderate" : "low", recommendedAction: maxTemp > 30 ? "Apply light evening irrigation." : "Standard care." };
          if (crop === "Soybean") return { cropName: "Soybean", impact: maxRain > 20 ? "Heavy rain risks waterlogging." : "Good growing conditions.", riskLevel: maxRain > 20 ? "high" : "low", recommendedAction: maxRain > 20 ? "Ensure field drainage." : "Continue standard schedule." };
          if (crop === "Coconut") return { cropName: "Coconut", impact: maxWind > 30 ? "Strong winds might drop young nuts." : "Favorable coastal weather.", riskLevel: maxWind > 30 ? "moderate" : "low", recommendedAction: maxWind > 30 ? "Inspect for fallen debris." : "Normal routine." };
          if (crop === "Banana") return { cropName: "Banana", impact: maxWind > 40 ? "High wind risks uprooting." : "Good humid conditions.", riskLevel: maxWind > 40 ? "high" : "low", recommendedAction: maxWind > 40 ? "Provide physical propping/support." : "Monitor bunches." };
          if (crop === "Tea") return { cropName: "Tea", impact: maxRain < 5 ? "Lack of rain affects leaf flush." : "Good rainfall for leaf growth.", riskLevel: maxRain < 5 ? "moderate" : "low", recommendedAction: maxRain < 5 ? "Use sprinkler irrigation." : "Plan for plucking." };
          if (crop === "Jute") return { cropName: "Jute", impact: humidity < 60 ? "Dry air restricts growth." : "Ideal humid environment.", riskLevel: humidity < 60 ? "moderate" : "low", recommendedAction: humidity < 60 ? "Ensure adequate water supply." : "Optimal." };
          if (crop === "Apple") return { cropName: "Apple", impact: maxTemp > 32 ? "High heat causes sunburn on fruits." : "Favorable chilling/growth conditions.", riskLevel: maxTemp > 32 ? "high" : "low", recommendedAction: maxTemp > 32 ? "Use shade netting or overhead sprinklers." : "Prune as scheduled." };
          if (crop === "Potato") return { cropName: "Potato", impact: humidity > 85 ? "High risk of late blight disease." : "Good tuber development.", riskLevel: humidity > 85 ? "high" : "low", recommendedAction: humidity > 85 ? "Apply prophylactic fungicide." : "Monitor soil moisture." };
          if (crop === "Mango") return { cropName: "Mango", impact: maxWind > 30 ? "High wind may drop flowers/fruits." : "Good orchard conditions.", riskLevel: maxWind > 30 ? "high" : "low", recommendedAction: maxWind > 30 ? "Deploy windbreaks if possible." : "Monitor standard growth." };
          if (crop === "Cumin") return { cropName: "Cumin", impact: humidity > 70 ? "High humidity causes blight/mildew." : "Dry conditions are favorable.", riskLevel: humidity > 70 ? "high" : "low", recommendedAction: humidity > 70 ? "Apply sulfur-based fungicide." : "Maintain current routine." };
          if (crop === "Onion") return { cropName: "Onion", impact: maxRain > 15 ? "Excess rain causes bulb rot." : "Optimal bulb development.", riskLevel: maxRain > 15 ? "high" : "low", recommendedAction: maxRain > 15 ? "Ensure excellent field drainage." : "Standard care." };
          if (crop === "Maize") return { cropName: "Maize", impact: et > 5 ? "Water stress impacts silking." : "Favorable growth environment.", riskLevel: et > 5 ? "moderate" : "low", recommendedAction: et > 5 ? "Increase irrigation frequency." : "Continue standard schedule." };
          if (crop === "Grapes") return { cropName: "Grapes", impact: maxRain > 5 ? "Rain risks berry cracking." : "Optimal vineyard weather.", riskLevel: maxRain > 5 ? "high" : "low", recommendedAction: maxRain > 5 ? "Use protective covers." : "Routine pruning/care." };
          if (crop === "Pomegranate") return { cropName: "Pomegranate", impact: maxTemp > 38 ? "Extreme heat causes fruit cracking." : "Excellent fruit development.", riskLevel: maxTemp > 38 ? "high" : "low", recommendedAction: maxTemp > 38 ? "Apply light irrigation & shading." : "Normal maintenance." };
          if (crop === "Coffee") return { cropName: "Coffee", impact: maxTemp > 30 ? "Heat stress affects berry development." : "Favorable plantation conditions.", riskLevel: maxTemp > 30 ? "moderate" : "low", recommendedAction: maxTemp > 30 ? "Ensure shade tree coverage." : "Monitor berry borer." };
          if (crop === "Cardamom") return { cropName: "Cardamom", impact: humidity < 60 ? "Dry air causes poor capsule setting." : "Ideal humid plantation weather.", riskLevel: humidity < 60 ? "high" : "low", recommendedAction: humidity < 60 ? "Use mist irrigation." : "Maintain schedule." };
          if (crop === "Pineapple") return { cropName: "Pineapple", impact: maxTemp < 10 ? "Risk of chilling injury." : "Great tropical conditions.", riskLevel: maxTemp < 10 ? "high" : "low", recommendedAction: maxTemp < 10 ? "Use frost protection covers." : "Standard care." };
          if (crop === "Arecanut") return { cropName: "Arecanut", impact: maxWind > 40 ? "High wind causes crown damage." : "Favorable growth weather.", riskLevel: maxWind > 40 ? "moderate" : "low", recommendedAction: maxWind > 40 ? "Inspect plantation for damage." : "Normal care." };
          if (crop === "Ginger") return { cropName: "Ginger", impact: maxRain > 30 ? "High rain causes rhizome rot." : "Optimal soil conditions.", riskLevel: maxRain > 30 ? "high" : "low", recommendedAction: maxRain > 30 ? "Improve trench drainage." : "Continue regular care." };
          if (crop === "Cherry") return { cropName: "Cherry", impact: maxRain > 10 ? "Rain causes fruit cracking." : "Excellent orchard weather.", riskLevel: maxRain > 10 ? "high" : "low", recommendedAction: maxRain > 10 ? "Consider protective canopies." : "Routine maintenance." };
          if (crop === "Walnut") return { cropName: "Walnut", impact: maxTemp > 35 ? "High heat causes hull shriveling." : "Favorable growth." , riskLevel: maxTemp > 35 ? "moderate" : "low", recommendedAction: maxTemp > 35 ? "Increase deep watering." : "Monitor standard growth." };
          if (crop === "Saffron") return { cropName: "Saffron", impact: maxRain > 5 ? "Rain damages delicate flowers." : "Optimal blooming weather.", riskLevel: maxRain > 5 ? "high" : "low", recommendedAction: maxRain > 5 ? "Protect fields if possible." : "Harvest immediately." };
          if (crop === "Millets") return { cropName: "Millets", impact: maxRain > 25 ? "Heavy rain causes lodging." : "Highly resilient, optimal growth.", riskLevel: maxRain > 25 ? "moderate" : "low", recommendedAction: maxRain > 25 ? "Ensure water drains quickly." : "No action needed." };
          if (crop === "Chickpea") return { cropName: "Chickpea (Gram)", impact: maxTemp > 35 ? "High heat causes pod abortion." : "Excellent field conditions.", riskLevel: maxTemp > 35 ? "high" : "low", recommendedAction: maxTemp > 35 ? "Apply supplementary irrigation." : "Routine care." };
          if (crop === "Tomato") return { cropName: "Tomato", impact: humidity > 75 ? "High humidity risks early blight." : "Favorable growth.", riskLevel: humidity > 75 ? "high" : "low", recommendedAction: humidity > 75 ? "Apply appropriate fungicides." : "Monitor soil moisture." };

          return { cropName: crop, impact: "Weather conditions are neutral.", riskLevel: "low", recommendedAction: "Monitor as usual." };
        };

        setLiveCropImpacts(localCrops.map(getCropImpact));
      }

    } catch (err) {
      console.warn("Weather APIs unavailable", err);
    }
  };

  const handleCitySelect = async (city: {name: string, lat: number, lon: number}) => {
    setSearchQuery("");
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setIsSearching(true);
    await fetchWeatherByCoords(city.lat, city.lon, city.name);
    setIsSearching(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeSuggestionIndex < liveSuggestions.length - 1) {
        setActiveSuggestionIndex(prev => prev + 1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeSuggestionIndex > 0) {
        setActiveSuggestionIndex(prev => prev - 1);
      }
    } else if (e.key === 'Enter') {
      if (showSuggestions && activeSuggestionIndex >= 0 && activeSuggestionIndex < liveSuggestions.length) {
        e.preventDefault();
        const selected = liveSuggestions[activeSuggestionIndex];
        handleCitySelect(selected);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "02785a68098150e0254c7a9e7321daac";
      const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)},IN&limit=1&appid=${apiKey}`);
      const geoData = await geoRes.json();
      if (geoData && geoData.length > 0) {
        const { lat, lon, name, state } = geoData[0];
        let cleanState = "";
        if (state) {
          cleanState = state.split(",")[0].trim();
        }
        await fetchWeatherByCoords(lat, lon, `${name}${cleanState ? `, ${cleanState}` : ''}`);
        setSearchQuery(""); // Clear the search bar
      } else {
        alert("Location not found in India. Please try another city.");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
      alert("Error searching location.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      // By default show Ahmedabad, Gujarat weather
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchWeatherByCoords(23.0225, 72.5714, "Ahmedabad, Gujarat");
    }
    return () => { isMounted = false; };
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbData, setDbData] = useState<{ mandiPrices: any[]; crops: any[] }>({ mandiPrices: [], crops: [] });

  useEffect(() => {
    const fetchDbData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (data.success) {
          setDbData({ mandiPrices: data.mandiPrices, crops: data.crops });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard DB data", err);
      } finally {
        // loadingDb omitted
      }
    };
    fetchDbData();
  }, []);



  if (status === "loading") {
    return <PageLoader />;
  }

  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[45] md:hidden backdrop-blur-sm" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* SideNavBar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full w-64 md:w-48 bg-surface-container-low border-r border-outline-variant p-2.5 gap-2 shadow-2xl md:shadow-none`}>
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary text-on-primary">
              <Leaf size={16} strokeWidth={2.5} />
            </div>
            <h1 className="text-[13px] font-extrabold tracking-tight text-on-surface">
              Smart Farming<span className="text-primary">.</span>
            </h1>
          </div>
          <button 
            className="md:hidden text-on-surface hover:bg-surface-container-high p-1 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <nav data-lenis-prevent="true" className="flex-1 mt-2 space-y-1 overflow-y-auto custom-scrollbar">
          {/* Dashboard Active */}
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/dashboard">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="text-[12px] font-medium">Dashboard</span>
          </Link>
          
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/gps-area-calculator">
            <span className="material-symbols-outlined text-[18px]">map</span>
            <span className="text-[12px] font-medium">GPS Area Calculator</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg transition-all" href="/weather"
          >
            <span className="material-symbols-outlined text-[18px]">early_on</span>
            <span className="text-[12px] font-medium">Weather</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/disease-detection">
            <span className="material-symbols-outlined text-[18px]">shutter_speed</span>
            <span className="text-[12px] font-medium">Scanner</span>
          </Link>
          
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/market">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span className="text-[12px] font-medium">Marketplace</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/schemes">
            <span className="material-symbols-outlined text-[18px]">article</span>
            <span className="text-[12px] font-medium">Schemes</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/community">
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span className="text-[12px] font-medium">Community</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span className="text-[12px] font-medium">Analytics</span>
          </Link>

          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/settings">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="text-[12px] font-medium">Settings</span>
          </Link>
        </nav>
        <div className="mt-auto pt-3 border-t border-outline-variant space-y-1">
          <button className="w-full mb-3 py-2.5 bg-primary text-on-primary rounded-lg text-[12px] font-bold shadow-sm active:scale-95 transition-all">
            Consult Expert
          </button>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/support">
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span className="text-[12px] font-medium">Support</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all w-full text-left">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-[12px] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-8 md:pb-0">
        {/* TopNavBar */}
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 sticky top-0 shrink-0 z-30 flex items-center justify-between px-6 w-full max-w-container-max mx-auto shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex md:hidden items-center gap-2 mr-2">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 -ml-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
              <div className="p-1 rounded-lg bg-primary text-on-primary">
                <Leaf size={14} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-extrabold tracking-tight text-on-surface">
                Smart Farming<span className="text-primary">.</span>
              </span>
            </div>
                      </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-outline-variant mx-1"></div>
            <div className="flex items-center gap-2 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-on-surface leading-none">{session?.user?.name || "Farmer"}</p>
              </div>
              <Link href="/profile" className="block relative cursor-pointer hover:opacity-80 transition-opacity">
                {session?.user?.image ? (
                  <Image width={32} height={32} className="w-8 h-8 rounded-full border border-outline-variant object-cover" alt="Farmer Portrait" src={session.user.image} />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-outline-variant bg-primary-container text-on-primary-container flex items-center justify-center text-[12px] font-bold tracking-wider">
                    {getInitials(session?.user?.name)}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 md:p-6 pb-24 lg:pb-24">
  <div id="weather-dashboard-content" className="max-w-container-max mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
        <div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Live Weather</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time updates for any location in India.</p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto relative">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">search</span>
          <input 
            type="text"
            placeholder="Search city in India..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
              setActiveSuggestionIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            className="flex-1 md:w-64 bg-surface text-on-surface border border-outline rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          {showSuggestions && liveSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-outline-variant rounded-lg shadow-xl overflow-hidden z-50">
              {liveSuggestions.map((city, index) => (
                <div
                  key={`${city.name}-${index}`}
                  onClick={() => handleCitySelect(city)}
                  className={`px-4 py-2.5 cursor-pointer text-sm transition-colors flex items-center justify-between gap-4 ${
                    index === activeSuggestionIndex 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span className="truncate flex-shrink-0">{city.name}</span>
                  <span className="text-[10px] text-on-surface-variant font-medium truncate text-right">{city.subtitle}</span>
                </div>
              ))}
            </div>
          )}
          <button 
            type="submit" 
            disabled={isSearching}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </form>
      </div>

      <WeatherHero data={liveWeather} />

      <section aria-label="Weather metrics" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {liveMetrics.map((metric) => (
          <WeatherMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <HourlyForecast items={liveHourly} />

      <RainfallChart data={liveRainfall} />

      <SevenDayForecast days={liveSevenDay} />

      <div id="weather-advisory-section">
        <FarmingAdvisoryCard 
          advisory={liveAdvisory} 
          onOptimize={() => {
            const et = Number(liveMetrics.find(m => m.id === "et")?.value) || 0;
            const rain = Number(liveRainfall.weekly.find(w => w.label === "Today")?.forecastMm) || 0;
            
            if (et > rain) {
              const amount = (et - rain).toFixed(1);
              setIrrigationPlan({ et, rain, isDeficit: true, amount });
              addNotification({
                title: "Water Deficit Alert",
                message: `AI recommends applying ${amount} liters/m² today to maintain optimal soil moisture.`,
                type: "system"
              });
            } else {
              setIrrigationPlan({ et, rain, isDeficit: false, amount: "0" });
              addNotification({
                title: "Water Surplus Alert",
                message: `Expected rainfall fully offsets today's evaporation. Halt irrigation to prevent waterlogging.`,
                type: "system"
              });
            }
          }}
        />
      </div>

      <section aria-label="Weather alerts" className="space-y-4">
        <h3 className="text-xl font-semibold text-on-surface">Weather Alerts</h3>
        <div className="space-y-4">
          {liveAlerts.length === 0 ? (
            <div className="flex items-center gap-4 rounded-2xl border border-white/30 bg-primary/5 p-5 shadow-sm backdrop-blur-xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sun size={20} aria-hidden="true" />
              </span>
              <div>
                <h4 className="font-semibold text-on-surface">All Clear</h4>
                <p className="text-sm text-on-surface-variant">No severe weather alerts for your area today. Safe to proceed with normal farming activities.</p>
              </div>
            </div>
          ) : (
            liveAlerts.map((alert) => (
              <WeatherAlertCard 
                key={alert.id} 
                alert={alert} 
                onAction={(alertInfo) => {
                  if (alertInfo.actionLabel === "View Radar") {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  } else if (alertInfo.actionLabel === "View Advisory") {
                    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                  } else {
                    addNotification({
                      title: alertInfo.type,
                      message: alertInfo.description,
                      type: "system"
                    });
                  }
                }}
              />
            ))
          )}
        </div>
      </section>

      <section aria-label="Crop weather impact" className="space-y-4">
        <h3 className="text-xl font-semibold text-on-surface">Crop Weather Impact</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {liveCropImpacts.map((crop) => (
            <CropImpactCard key={crop.cropName} crop={crop} />
          ))}
        </div>
      </section>

      <WeatherMapCard lat={liveWeather.location.lat} lon={liveWeather.location.lon} />

      <QuickActions loadingActionId={loadingActionId} actions={[
        { 
          id: "refresh", 
          label: "Refresh Weather", 
          icon: RefreshCw, 
          onClick: async () => {
            if (liveWeather.location.lat && liveWeather.location.lon) {
              setLoadingActionId("refresh");
              await fetchWeatherByCoords(liveWeather.location.lat, liveWeather.location.lon, `${liveWeather.location.city}, ${liveWeather.location.state}`);
              setLoadingActionId(null);
              addNotification({
                title: "Weather Synchronized",
                message: `Successfully synchronized live atmospheric data for ${liveWeather.location.city}.`,
                type: "system"
              });
            }
          } 
        },
        { 
          id: "download", 
          label: "Download Report", 
          icon: Download, 
          onClick: async () => {
            setLoadingActionId("download");
            try {
              const { jsPDF } = await import('jspdf');
              const autoTable = (await import('jspdf-autotable')).default;
              
              const doc = new jsPDF('p', 'mm', 'a4');
              
              // Top Banner
              doc.setFillColor(0, 0, 0); // Black
              doc.rect(10, 10, 190, 8, 'F');
              doc.setTextColor(255, 255, 255); // White
              doc.setFontSize(12);
              doc.setFont("helvetica", "bold");
              doc.text("AGROMETEOROLOGICAL FORECAST", 105, 16, { align: 'center' });
              
              // Date Issued
              doc.setTextColor(0, 0, 0);
              doc.setFontSize(10);
              doc.setFont("helvetica", "normal");
              const now = new Date();
              const dateStr = now.toLocaleDateString('en-GB') + " " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
              doc.text(`Issued at ${dateStr} LT for ${liveWeather.location.city}, ${liveWeather.location.state}`, 10, 24);
              
              let currentY = 32;

              // Table 1: Current Weather & Metrics
              const humidity = liveMetrics.find(m => m.id === 'humidity')?.value || 'N/A';
              const wind = liveMetrics.find(m => m.id === 'wind')?.value || 'N/A';
              const pressure = liveMetrics.find(m => m.id === 'pressure')?.value || 'N/A';
              
              autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                styles: { font: 'times', fontSize: 10, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0] },
                headStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [0, 0, 0] },
                head: [['Current Conditions', 'Values', 'Atmospheric Metrics', 'Values']],
                body: [
                  ['Location', `${liveWeather.location.city}, ${liveWeather.location.state}`, 'Humidity', `${humidity} %`],
                  ['Temperature', `${liveWeather.temperatureC} °C (Feels like ${liveWeather.feelsLikeC} °C)`, 'Wind Speed', `${wind} km/h`],
                  ['Condition', liveWeather.condition, 'Pressure', `${pressure} hPa`],
                  ['High / Low', `${liveWeather.highC} °C / ${liveWeather.lowC} °C`, 'Coordinates', `Lat: ${liveWeather.location.lat}, Lon: ${liveWeather.location.lon}`],
                ],
                margin: { left: 10, right: 10 }
              });
              
              // @ts-expect-error - jspdf-autotable adds lastAutoTable to doc
              currentY = doc.lastAutoTable.finalY + 8;

              // Table 2: AI Farming Advisory
              autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                styles: { font: 'times', fontSize: 10, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0] },
                headStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [0, 0, 0] },
                head: [['AI Farming Advisory', 'Actionable Recommendation']],
                columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
                body: [
                  ['Irrigation', liveAdvisory.irrigation],
                  ['Spraying', liveAdvisory.spraying],
                  ['Fertilizer', liveAdvisory.fertilizer],
                  ['Harvest', liveAdvisory.harvest],
                  ['Risk Assessment', `Pest Risk: ${liveAdvisory.pestRisk.toUpperCase()} | Disease Risk: ${liveAdvisory.diseaseRisk.toUpperCase()}`]
                ],
                margin: { left: 10, right: 10 }
              });

              // @ts-expect-error - jspdf-autotable adds lastAutoTable to doc
              currentY = doc.lastAutoTable.finalY + 8;

              // Table 3: Crop Weather Impact
              const cropBody = liveCropImpacts.map(crop => [
                crop.cropName, 
                crop.riskLevel.toUpperCase(), 
                crop.impact, 
                crop.recommendedAction
              ]);

              autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                styles: { font: 'times', fontSize: 10, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0] },
                headStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [0, 0, 0] },
                head: [['Crop', 'Risk Level', 'Weather Impact', 'Action Required']],
                columnStyles: { 
                  0: { fontStyle: 'bold', cellWidth: 25 },
                  1: { cellWidth: 25 },
                  2: { cellWidth: 70 },
                  3: { cellWidth: 70 }
                },
                body: cropBody,
                margin: { left: 10, right: 10 }
              });

              doc.setFont("times", "bold");
              doc.text(`Sr. Meteorologist: Smart Farming India`, 190, 285, { align: 'right' });

              doc.save(`SmartFarming_OfficialReport_${liveWeather.location.city.replace(/[^a-zA-Z0-9]/g, '')}.pdf`);
              
              addNotification({
                title: "Report Downloaded",
                message: `Your formal weather report for ${liveWeather.location.city} has been generated as a PDF.`,
                type: "system"
              });
            } catch (err) {
              console.error("PDF generation failed", err);
            } finally {
              setLoadingActionId(null);
            }
          } 
        },
        { 
          id: "radar", 
          label: "View Radar", 
          icon: Radar, 
          onClick: () => {
            const el = document.getElementById("weather-radar-section");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } 
        },
        { 
          id: "advisory", 
          label: "Farm Advisory", 
          icon: ClipboardList, 
          onClick: () => {
            const el = document.getElementById("weather-advisory-section");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } 
        },
      ]} />
      
      {/* Dynamic Irrigation Plan Modal */}
      {irrigationPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-surface shadow-2xl border border-outline-variant">
            
            <div className={`p-6 text-white ${irrigationPlan.isDeficit ? 'bg-primary' : 'bg-[#40493d]'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Droplets size={24} />
                  Irrigation Plan
                </h3>
                <button onClick={() => setIrrigationPlan(null)} className="rounded-full p-1 hover:bg-white/20 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <p className="mt-2 text-sm opacity-90">AI computation for {liveWeather.location.city}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-surface-container-lowest p-4 text-center shadow-sm border border-outline-variant/30">
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Evaporation</p>
                  <p className="mt-1 text-2xl font-bold text-danger">{irrigationPlan.et} mm</p>
                </div>
                <div className="rounded-xl bg-surface-container-lowest p-4 text-center shadow-sm border border-outline-variant/30">
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Expected Rain</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{irrigationPlan.rain} mm</p>
                </div>
              </div>
              
              <div className="rounded-xl border border-outline-variant p-4 bg-surface-container-lowest">
                <h4 className="font-semibold text-on-surface mb-1">
                  {irrigationPlan.isDeficit ? "Water Deficit Detected" : "Water Surplus Detected"}
                </h4>
                <p className="text-sm text-on-surface-variant">
                  {irrigationPlan.isDeficit 
                    ? `Recommendation: Apply ${irrigationPlan.amount} liters of water per square meter immediately to maintain optimal soil moisture.`
                    : `Recommendation: Halt irrigation. Expected rainfall completely offsets today's evaporation.`
                  }
                </p>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setIrrigationPlan(null)} 
                  className="px-4 py-2 rounded-xl font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    setLoadingActionId("irrigation");
                    
                    // Simulate IoT connection sequence
                    addNotification({
                      title: "Connecting to Field IoT...",
                      message: "Authenticating with smart irrigation valves.",
                      type: "system"
                    });
                    
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    addNotification({
                      title: irrigationPlan.isDeficit ? "Irrigation Scheduled" : "Irrigation Halted",
                      message: irrigationPlan.isDeficit 
                        ? `Successfully deployed ${irrigationPlan.amount}L/m² schedule to smart valves.` 
                        : "Smart valves have been sealed for today to prevent waterlogging.",
                      type: "system"
                    });
                    
                    setLoadingActionId(null);
                    setIrrigationPlan(null);
                  }}
                  disabled={loadingActionId === "irrigation"}
                  className="px-4 py-2 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingActionId === "irrigation" ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Deploying...
                    </>
                  ) : irrigationPlan.isDeficit ? (
                    <>
                      <Droplets size={16} />
                      Execute Plan
                    </>
                  ) : (
                    <>
                      <X size={16} />
                      Halt Systems
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    
  </div>

          {/* Footer (Standard Shared) */}
          <footer className="w-full py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant mt-12">
            <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-lg font-bold text-primary">Smart Farming India</h4>
              <p className="text-sm text-on-surface-variant mt-1 max-w-sm">© 2026 Smart Farming India. Empowering the roots of our nation.</p>
            </div>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <li><Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="/terms">Terms of Service</Link></li>
              <li><Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="/contact">Contact Us</Link></li>
              <li><Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="/about">About Us</Link></li>
            </ul>
          </footer>
        </main>

        {/* Floating Action Button for AI Detection (Mobile) */}
        <button className="md:hidden fixed bottom-12 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary-container transition-colors">
          <span className="material-symbols-outlined">camera</span>
        </button>

      </div>

      {/* Live Market Ticker */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-on-surface text-surface z-30 flex items-center overflow-hidden whitespace-nowrap border-t border-white/10 pointer-events-none">
        <div className="flex ticker-animate font-label-sm text-[11px] tracking-wide gap-12 items-center">
          {dbData.mandiPrices.length > 0 ? (
            // Duplicate the array a few times to ensure the ticker spans the whole screen
            [...dbData.mandiPrices, ...dbData.mandiPrices, ...dbData.mandiPrices, ...dbData.mandiPrices].map((price, index) => (
              <span key={index} className="shrink-0 font-medium">
                {price.cropName.toUpperCase()}: <span className="text-primary-container font-bold">₹{price.price.toLocaleString('en-IN')}</span> 
                <span className={price.trendDirection === 'UP' ? 'text-green-400' : 'text-red-400'}>
                  {' '}({price.trendDirection === 'UP' ? '+' : ''}{price.trendPercent}%)
                </span>
              </span>
            ))
          ) : (
            <span className="shrink-0 text-on-surface-variant">Loading live market data...</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Weather() {
  return (
    <SessionProvider>
      <WeatherContent />
    </SessionProvider>
  );
}











