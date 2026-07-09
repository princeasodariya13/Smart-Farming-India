"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';

function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();

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

  const [weather, setWeather] = useState({ temp: '32°C', condition: 'Humid', humidity: '68%', wind: '12 km/h', rain: '15%' });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=23.0225&longitude=72.5714&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code");
        const data = await res.json();

        const code = data.current.weather_code;
        let condition = "Clear";
        let rain = "0%";
        if (code >= 1 && code <= 3) condition = "Cloudy";
        else if (code >= 51 && code <= 67) { condition = "Rain"; rain = "80%"; }
        else if (code >= 80) { condition = "Showers"; rain = "90%"; }

        setWeather({
          temp: `${Math.round(data.current.temperature_2m)}°C`,
          wind: `${Math.round(data.current.wind_speed_10m)} km/h`,
          humidity: `${Math.round(data.current.relative_humidity_2m)}%`,
          condition,
          rain
        });
      } catch (err) {
        // Silently fall back to default mock data if the API is blocked (e.g. by adblockers or offline)
        console.warn("Weather API unavailable, using local fallback data.");
      }
    };
    fetchWeather();
  }, []);
  
  const [dbData, setDbData] = useState<{ mandiPrices: any[]; crops: any[] }>({ mandiPrices: [], crops: [] });
  const [loadingDb, setLoadingDb] = useState(true);

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
        setLoadingDb(false);
      }
    };
    fetchDbData();
  }, []);

  const [tasks, setTasks] = useState([
    { id: 1, label: 'Fertilize Sector B with N-P-K', checked: false },
    { id: 2, label: 'Check Soil Moisture (Acres 4-8)', checked: false },
    { id: 3, label: 'Schedule Water Pump #2', checked: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

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
          <Link className="flex items-center gap-2 px-3 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg transition-all" href="/dashboard">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="text-[12px] font-medium">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">agriculture</span>
            <span className="text-[12px] font-medium">My Farm</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/weather">
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
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 md:p-6 space-y-4 pb-24">
          {/* Welcome Header */}
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Namaste, {session?.user?.name?.split(' ')[0] || "Farmer"}.</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Farm is healthy. <span className="text-primary font-semibold">2 pending actions</span>.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-success-soft text-secondary px-3 py-1.5 rounded-full text-[12px] font-bold border border-secondary/10">
                  <span className="material-symbols-outlined text-[16px]">verified</span> Audit: Optimal
                </span>
              </div>
            </div>
          </div>

          {/* Top Row: Core Metrics */}
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Weather Widget */}
            <div className="bento-card relative overflow-hidden group p-4">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-wider">Weather Forecast</p>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{weather.temp} <span className="text-title-md font-normal text-on-surface-variant">/ {weather.condition}</span></h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Live: Gujarat</p>
                </div>
                <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>early_on</span>
              </div>
              <div className="mt-3 flex justify-between gap-2 relative z-10">
                <div className="flex-1 bg-surface-container p-1.5 rounded-xl text-center">
                  <p className="text-[10px] text-on-surface-variant">Humidity</p>
                  <p className="font-label-sm text-[12px] font-bold text-on-surface">{weather.humidity}</p>
                </div>
                <div className="flex-1 bg-surface-container p-1.5 rounded-xl text-center">
                  <p className="text-[10px] text-on-surface-variant">Wind</p>
                  <p className="font-label-sm text-[12px] font-bold text-on-surface">{weather.wind}</p>
                </div>
                <div className="flex-1 bg-surface-container p-1.5 rounded-xl text-center">
                  <p className="text-[10px] text-on-surface-variant">Rain</p>
                  <p className="font-label-sm text-[12px] font-bold text-on-surface">{weather.rain}</p>
                </div>
              </div>
            </div>

            {/* Soil Health */}
            <div className="bento-card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-wider">Soil Health (N-P-K)</p>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Balanced</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Fertilize in 4 days</p>
                </div>
                <span className="material-symbols-outlined text-primary text-2xl">science</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span>Nitrogen (N)</span>
                    <span className="text-primary font-bold">82%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "82%" }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span>Phosphorus (P)</span>
                    <span className="text-primary font-bold">65%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Irrigation Status */}
            <div className="bento-card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-wider">Smart Irrigation</p>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Active</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Pump #4 • Sector A-12</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] text-on-surface-variant">Water Usage Today</p>
                    <p className="text-[18px] font-bold text-on-surface">1,240L</p>
                  </div>
                  <button className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-lg text-[12px] font-bold hover:bg-secondary-container/80 transition-colors">
                    Shut Off
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: Bento Grid */}
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* AI Disease Detection */}
            <div className="lg:col-span-3 bento-row bento-card p-4 flex flex-col justify-between border-2 border-dashed border-outline-variant hover:border-primary/50 transition-colors bg-surface-container-low/50">
              <div>
                <div className="w-8 h-8 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[16px]">camera</span>
                </div>
                <h4 className="text-[13px] font-bold text-on-surface">AI Scanner</h4>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-tight">Upload photo to detect disease.</p>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <button onClick={() => router.push('/disease-detection')} className="w-full py-2 bg-primary text-on-primary rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[14px]">upload_file</span> Open Scanner
                </button>
              </div>
            </div>

            {/* My Crops */}
            <div className="lg:col-span-6 bento-card p-4 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-label-lg text-label-lg font-bold text-on-surface">Active Crops</h4>
                <Link className="text-primary text-[12px] font-bold hover:underline" href="#">View History</Link>
              </div>
              <div className="space-y-2 flex-1">
                {dbData.crops.length > 0 ? dbData.crops.map((crop, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors group">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-highest shrink-0 relative">
                      {crop.imageUrl ? (
                        <Image fill className="object-cover" alt={crop.name} src={crop.imageUrl} sizes="64px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700 font-bold">{crop.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-label-md text-label-md font-bold text-on-surface">{crop.name}</h5>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{crop.stage}</span>
                      </div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Area: {crop.area} Acres • Health: {crop.healthScore}%</p>
                      <div className="mt-2 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${crop.healthScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                )) : loadingDb ? (
                   <p className="text-sm text-gray-500 py-4 text-center">Loading crops...</p>
                ) : (
                   <p className="text-sm text-gray-500 py-4 text-center">No active crops found.</p>
                )}
              </div>
            </div>

            {/* Market Prices */}
            <div className="lg:col-span-3 bento-card flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h4 className="font-label-lg text-label-lg font-bold text-on-surface">Live Mandi</h4>
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                  <span className="w-1 h-1 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(13,99,27,0.6)]"></span> Live
                </span>
              </div>
              <div className="space-y-4 flex-1 relative z-10">
                {dbData.mandiPrices.length > 0 ? dbData.mandiPrices.map((price, index) => (
                  <div key={index} className="flex justify-between items-center pb-3 border-b border-outline-variant/40 last:border-0 last:pb-0">
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">{price.cropName} ({price.market})</p>
                      <p className="font-label-lg text-label-lg font-bold text-on-surface mt-0.5">₹{price.price.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-on-surface-variant">/ {price.unit}</span></p>
                    </div>
                    <div className={`flex items-center gap-0.5 px-1.5 py-1 rounded-md ${price.trendDirection === 'UP' ? 'text-primary bg-primary/10' : 'text-error bg-error/10'}`}>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{price.trendDirection === 'UP' ? 'trending_up' : 'trending_down'}</span> 
                      <span className="font-label-sm text-[11px]">{price.trendDirection === 'UP' ? '+' : ''}{price.trendPercent}%</span>
                    </div>
                  </div>
                )) : loadingDb ? (
                   <p className="text-sm text-gray-500 text-center py-4">Loading prices...</p>
                ) : (
                   <p className="text-sm text-gray-500 text-center py-4">No prices available.</p>
                )}
              </div>
              <div className="mt-4 pt-3 text-center relative z-10 border-t border-outline-variant/20">
                <button onClick={() => router.push('/market')} className="font-label-sm text-[11px] font-bold text-primary hover:text-primary-container transition-colors flex items-center justify-center gap-1 mx-auto uppercase tracking-wide">
                  Market Insights <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Today's Tasks */}
            <div className="bento-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
                <h4 className="font-label-lg text-label-lg font-bold text-on-surface">Today's Tasks</h4>
              </div>
              <div className="space-y-2">
                {tasks.map(task => (
                  <label key={task.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer group">
                    <input
                      className="w-4 h-4 rounded-md border-outline text-primary focus:ring-primary"
                      type="checkbox"
                      checked={task.checked}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className={`font-body-sm text-body-sm text-on-surface transition-all ${task.checked ? 'line-through opacity-50' : ''}`}>
                      {task.label}
                    </span>
                  </label>
                ))}
              </div>
              <button className="mt-4 w-full text-center py-1.5 text-[12px] font-bold text-primary hover:bg-primary/5 rounded-lg">
                + Add New Task
              </button>
            </div>

            {/* Recent Notifications */}
            <div className="bento-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                <h4 className="font-label-lg text-label-lg font-bold text-on-surface">Notifications</h4>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 shrink-0 bg-error-container text-on-error-container rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold">Pest Warning (Aphids)</p>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">Detected nearby. Inspect mustard.</p>
                    <span className="text-[9px] text-on-surface-variant opacity-60">2 hours ago</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 shrink-0 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">payments</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold">Subsidy Credited</p>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">₹15,000 credited to account.</p>
                    <span className="text-[9px] text-on-surface-variant opacity-60">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Government Scheme alerts */}
            <div className="bento-card p-4 bg-surface-container-high border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-[20px]">gavel</span>
                <h4 className="font-label-lg text-label-lg font-bold text-on-surface">Schemes For You</h4>
              </div>
              <div className="bg-white p-3 rounded-xl border border-primary/10 mb-3">
                <h5 className="text-[13px] font-bold text-primary">PM Kisan Samman Nidhi</h5>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Application deadline near.</p>
                <button className="mt-2 w-full py-1.5 bg-primary text-on-primary rounded-lg text-[12px] font-bold">Apply Now</button>
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-[11px] text-on-surface-variant">3 more schemes</p>
                <span className="material-symbols-outlined text-primary text-[16px]">arrow_forward</span>
              </div>
            </div>
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

export default function Dashboard() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  );
}
