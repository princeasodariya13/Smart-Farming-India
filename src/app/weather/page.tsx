"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, SessionProvider } from 'next-auth/react';

import { Leaf } from 'lucide-react';
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
  ClipboardList
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
  location: { city: "Ahmedabad", state: "Gujarat", lastUpdated: "Updating..." },
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
  const { data: session } = useSession();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read current lang from cookie
    const cookieLang = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (cookieLang && cookieLang[1]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentLang(cookieLang[1]);
    }

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (lang: string) => {
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/`;
    window.location.reload();
  };

  const [liveWeather, setLiveWeather] = useState(currentWeather);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchWeatherByCoords = async (lat: number, lon: number, locName: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "02785a68098150e0254c7a9e7321daac";
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      const data = await res.json();
      if (data && data.weather && data.weather.length > 0) {
        const code = data.weather[0].icon;
        const condition = data.weather[0].main;
        let icon = Sun;
        if (code.startsWith("01")) icon = Sun;
        else if (code.startsWith("02")) icon = CloudSun;
        else if (code.startsWith("03") || code.startsWith("04")) icon = Cloud;
        else if (code.startsWith("09") || code.startsWith("10")) icon = CloudRain;
        else if (code.startsWith("11")) icon = CloudRain;
        else if (code.startsWith("13")) icon = CloudSnow;
        else icon = Cloud;

        setLiveWeather(prev => ({
          ...prev,
          location: { ...prev.location, city: locName, state: "", lastUpdated: new Date().toLocaleTimeString() },
          temperatureC: Math.round(data.main.temp),
          feelsLikeC: Math.round(data.main.feels_like),
          highC: Math.round(data.main.temp_max),
          lowC: Math.round(data.main.temp_min),
          condition,
          icon
        }));
      }
    } catch (err) {
      console.warn("Weather API unavailable", err);
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



  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-full w-48 bg-surface-container-low border-r border-outline-variant p-2.5 gap-2 z-50">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="p-1 rounded-lg bg-primary text-on-primary">
            <Leaf size={16} strokeWidth={2.5} />
          </div>
          <h1 className="text-[13px] font-extrabold tracking-tight text-on-surface">
            Smart Farming<span className="text-primary">.</span>
          </h1>
        </div>
        <nav data-lenis-prevent="true" className="flex-1 mt-2 space-y-1 overflow-y-auto custom-scrollbar">
          {/* Dashboard Active */}
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/dashboard">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="text-[12px] font-medium">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">agriculture</span>
            <span className="text-[12px] font-medium">My Farm</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg transition-all" href="/weather"
          >
            <span className="material-symbols-outlined text-[18px]">early_on</span>
            <span className="text-[12px] font-medium">Weather</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">shutter_speed</span>
            <span className="text-[12px] font-medium">Scanner</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/market">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span className="text-[12px] font-medium">Market</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="text-[12px] font-medium">Settings</span>
          </Link>
        </nav>
        <div className="mt-auto pt-3 border-t border-outline-variant space-y-1">
          <button className="w-full mb-3 py-2.5 bg-primary text-on-primary rounded-lg text-[12px] font-bold shadow-sm active:scale-95 transition-all">
            Consult Expert
          </button>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
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
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 sticky top-0 z-40 flex items-center justify-between px-6 w-full max-w-container-max mx-auto shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex md:hidden items-center gap-2 mr-2">
              <div className="p-1 rounded-lg bg-primary text-on-primary">
                <Leaf size={14} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-extrabold tracking-tight text-on-surface">
                Smart Farming<span className="text-primary">.</span>
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-5">
              <Link className="text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors" href="/market">Marketplace</Link>
              <Link className="text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors" href="/schemes">Schemes</Link>
              <Link className="text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors" href="/community">Community</Link>
              <Link className="text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Analytics</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">language</span>
              </button>
              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 rounded-xl border border-outline-variant bg-white p-1 shadow-lg overflow-hidden">
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`w-full text-left px-3 py-2 text-[12px] rounded-lg transition-colors ${currentLang === 'en' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => switchLanguage('gu')}
                    className={`w-full text-left px-3 py-2 text-[12px] rounded-lg transition-colors ${currentLang === 'gu' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                  >
                    ગુજરાતી
                  </button>
                </div>
              )}
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-outline-variant mx-1"></div>
            <div className="flex items-center gap-2 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-on-surface leading-none">{session?.user?.name || "Farmer"}</p>
              </div>
              {session?.user?.image ? (
                <Image width={32} height={32} className="w-8 h-8 rounded-full border border-outline-variant object-cover" alt="Farmer Portrait" src={session.user.image} />
              ) : (
                <div className="w-8 h-8 rounded-full border border-outline-variant bg-primary-container text-on-primary-container flex items-center justify-center text-[12px] font-bold tracking-wider">
                  {getInitials(session?.user?.name)}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 md:p-6 pb-24">
  <div className="max-w-container-max mx-auto space-y-6">
      
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 md:w-64 bg-surface text-on-surface border border-outline rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
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
        {metrics.map((metric) => (
          <WeatherMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <HourlyForecast items={hourly} />

      <RainfallChart data={rainfallData} />

      <SevenDayForecast days={sevenDay} />

      <FarmingAdvisoryCard advisory={advisory} />

      <section aria-label="Weather alerts" className="space-y-4">
        <h3 className="text-xl font-semibold text-on-surface">Weather Alerts</h3>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <WeatherAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>

      <section aria-label="Crop weather impact" className="space-y-4">
        <h3 className="text-xl font-semibold text-on-surface">Crop Weather Impact</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cropImpacts.map((crop) => (
            <CropImpactCard key={crop.cropName} crop={crop} />
          ))}
        </div>
      </section>

      <WeatherMapCard />

      <QuickActions actions={[
        { id: "refresh", label: "Refresh Weather", icon: RefreshCw, onClick: () => window.location.reload() },
        { id: "download", label: "Download Report", icon: Download, onClick: () => window.print() },
        { id: "radar", label: "View Radar", icon: Radar, onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },
        { id: "advisory", label: "Farm Advisory", icon: ClipboardList, onClick: () => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' }) },
      ]} />
    
  </div>

          {/* Footer (Standard Shared) */}
          <footer className="w-full py-6 px-margin-desktop flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant mt-8">
            <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
              <h4 className="font-body-lg text-body-lg font-bold text-primary">Smart Farming India</h4>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 text-center md:text-left max-w-sm">© 2026 Smart Farming India. Empowering the roots of our nation.</p>
            </div>
            <div className="flex items-center justify-center gap-4 md:gap-8 whitespace-nowrap overflow-x-auto custom-scrollbar pb-2 md:pb-0 max-w-full">
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link>
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/terms">Terms of Service</Link>
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/contact">Contact Us</Link>
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/about">About Us</Link>
            </div>
          </footer>
        </main>

        {/* Floating Action Button for AI Detection (Mobile) */}
        <button className="md:hidden fixed bottom-12 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary-container transition-colors">
          <span className="material-symbols-outlined">camera</span>
        </button>

      </div>

      {/* Live Market Ticker */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-on-surface text-secondary-fixed-dim z-[60] flex items-center overflow-hidden whitespace-nowrap border-t border-white/5 pointer-events-none md:left-64">
        <div className="flex ticker-animate font-label-sm text-[11px] tracking-wide gap-12 items-center">
          {dbData.mandiPrices.length > 0 ? (
            // Duplicate the array a few times to ensure the ticker spans the whole screen
            [...dbData.mandiPrices, ...dbData.mandiPrices, ...dbData.mandiPrices, ...dbData.mandiPrices].map((price, index) => (
              <span key={index}>{price.cropName.toUpperCase()}: ₹{price.price.toLocaleString('en-IN')} ({price.trendDirection === 'UP' ? '+' : ''}{price.trendPercent}%)</span>
            ))
          ) : (
            <span>Loading live market data...</span>
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
