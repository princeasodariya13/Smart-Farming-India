"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';
import PageLoader from '@/components/PageLoader';
import NotificationBell from '@/components/NotificationBell';
import { Sidebar } from "@/components/layout/Sidebar";

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [weather, setWeather] = useState({ temp: '32°C', condition: 'Humid', humidity: '68%', wind: '12 km/h', rain: '15%', location: 'Gujarat' });

  useEffect(() => {
    const fetchWeather = async (lat = 23.0225, lon = 72.5714, locName = "Gujarat") => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`);
        const data = await res.json();

        const code = data.current.weather_code;
        let condition = "Clear";
        let rain = "0%";
        if (code >= 1 && code <= 3) condition = "Cloudy";
        else if (code >= 51 && code <= 67) { condition = "Rain"; rain = "80%"; }
        else if (code >= 71 && code <= 77) { condition = "Snow"; rain = "0%"; }
        else if (code >= 80) { condition = "Showers"; rain = "90%"; }
        else if (code >= 95) { condition = "Storm"; rain = "100%"; }

        setWeather({
          temp: `${Math.round(data.current.temperature_2m)}°C`,
          wind: `${Math.round(data.current.wind_speed_10m)} km/h`,
          humidity: `${Math.round(data.current.relative_humidity_2m)}%`,
          condition,
          rain,
          location: locName
        });
      } catch (err) {
        // Silently fall back to default mock data if the API is blocked (e.g. by adblockers or offline)
        console.warn("Weather API unavailable, using local fallback data.");
      }
    };

    if (typeof window !== 'undefined' && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
            const geoData = await geoRes.json();
            const locName = geoData.city || geoData.locality || geoData.principalSubdivision || "Current Location";
            fetchWeather(position.coords.latitude, position.coords.longitude, locName);
          } catch (e) {
            fetchWeather(position.coords.latitude, position.coords.longitude, "Current Location");
          }
        },
        (error) => {
          fetchWeather(); // Fallback to Gujarat if denied
        }
      );
    } else {
      fetchWeather();
    }
  }, []);

  const [dbData, setDbData] = useState<{
    mandiPrices: any[];
    crops: any[];
    tasks: any[];
    soilHealth: any;
    irrigation: any;
  }>({
    mandiPrices: [],
    crops: [],
    tasks: [],
    soilHealth: null,
    irrigation: null
  });
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    const fetchDbData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.success) {
          setDbData({
            mandiPrices: data.mandiPrices || [],
            crops: data.crops || [],
            tasks: data.tasks || [],
            soilHealth: data.soilHealth || null,
            irrigation: data.irrigation || null
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard DB data", err);
      } finally {
        setLoadingDb(false);
      }
    };
    fetchDbData();
  }, []);

  const toggleTask = async (id: string) => {
    // Optimistic UI update
    setDbData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t)
    }));

    try {
      await fetch('/api/tasks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const [isTogglingIrrigation, setIsTogglingIrrigation] = useState(false);
  const toggleIrrigation = async () => {
    if (!dbData.irrigation || isTogglingIrrigation) return;
    setIsTogglingIrrigation(true);
    const isCurrentlyActive = dbData.irrigation.status === "Active";
    const newStatus = isCurrentlyActive ? "Off" : "Active";

    // Optimistic UI update
    setDbData(prev => ({
      ...prev,
      irrigation: {
        ...prev.irrigation,
        status: newStatus
      }
    }));

    // Simulate network delay for effect (assuming no real API exists yet)
    await new Promise(r => setTimeout(r, 600));
    setIsTogglingIrrigation(false);
  };

  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskLabel.trim()) return;

    setIsSubmittingTask(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newTaskLabel })
      });
      const data = await res.json();
      if (data.success) {
        setDbData(prev => ({
          ...prev,
          tasks: [...prev.tasks, data.task]
        }));
        setNewTaskLabel("");
        setIsAddingTask(false);
      } else {
        alert(data.error || "Failed to add task");
      }
    } catch (err) {
      console.error("Failed to add task", err);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic delete
    const previousTasks = [...dbData.tasks];
    setDbData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));

    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        setDbData(prev => ({ ...prev, tasks: previousTasks }));
        alert(data.error || "Failed to delete task");
      }
    } catch (err) {
      console.error("Failed to delete task", err);
      setDbData(prev => ({ ...prev, tasks: previousTasks }));
    }
  };

  if (loadingDb) {
    return <PageLoader />;
  }

  // Derive dynamic, real notifications from the current live database state
  const getDynamicNotifications = () => {
    if (!dbData) return [];

    const notifs = [];

    // 1. Irrigation Alert
    if (dbData.irrigation?.status === 'Active') {
      notifs.push({
        id: 'irrigation_active',
        type: 'info',
        icon: 'water_drop',
        title: 'Irrigation Currently Active',
        desc: `Pump running in ${dbData.irrigation.sector}. Using ${dbData.irrigation.waterUsage}L.`,
        time: 'Just now',
        colorClass: 'bg-primary-container text-on-primary-container'
      });
    }

    // 2. Soil Health Alert
    if (dbData.soilHealth && dbData.soilHealth.status !== 'Balanced') {
      notifs.push({
        id: 'soil_health',
        type: 'warning',
        icon: 'science',
        title: 'Soil Nutrient Imbalance',
        desc: `Action needed: ${dbData.soilHealth.action}`,
        time: 'Today',
        colorClass: 'bg-error-container text-on-error-container'
      });
    } else if (dbData.soilHealth) {
      notifs.push({
        id: 'soil_health',
        type: 'success',
        icon: 'verified',
        title: 'Soil Health Optimal',
        desc: 'N-P-K levels are perfectly balanced.',
        time: 'Today',
        colorClass: 'bg-primary/20 text-primary'
      });
    }

    // 3. Task Alert
    const pendingTasks = dbData.tasks.filter((t: any) => !t.checked);
    if (pendingTasks.length > 0) {
      notifs.push({
        id: 'tasks_pending',
        type: 'warning',
        icon: 'assignment',
        title: 'Pending Tasks',
        desc: `You have ${pendingTasks.length} uncompleted task(s) remaining for today.`,
        time: '2 hours ago',
        colorClass: 'bg-amber-100 text-amber-700'
      });
    }

    // 4. Market Alert (Find highest trend)
    if (dbData.mandiPrices.length > 0) {
      const highestSpike = [...dbData.mandiPrices].sort((a, b) => b.trendPercent - a.trendPercent)[0];
      if (highestSpike && highestSpike.trendPercent > 1) {
        notifs.push({
          id: 'market_spike',
          type: 'success',
          icon: 'trending_up',
          title: 'Market Spike Alert',
          desc: `${highestSpike.cropName} prices surged by ${highestSpike.trendPercent}% today!`,
          time: '4 hours ago',
          colorClass: 'bg-success-container text-on-success-container'
        });
      }
    }

    return notifs;
  };

  const dynamicNotifications = getDynamicNotifications();

  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">
      {/* Mobile Sidebar Overlay — above header (z-30) but below sidebar (z-50) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[45] md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

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
            <NotificationBell />
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
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 md:p-6 space-y-4 pb-10">
          {/* Welcome Header */}
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface truncate">Namaste, {session?.user?.name?.split(' ')[0] || "Farmer"}.</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {dbData.soilHealth && dbData.soilHealth.status !== 'Balanced' ? 'Action required for soil health.' : 'Farm is healthy.'} <span className="text-primary font-semibold">
                    {dbData.tasks.filter((t: any) => !t.checked).length === 0
                      ? "All caught up today"
                      : `${dbData.tasks.filter((t: any) => !t.checked).length} pending action${dbData.tasks.filter((t: any) => !t.checked).length === 1 ? '' : 's'}`}
                  </span>.
                </p>
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
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Live: {weather.location}</p>
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
                  <h3 className="font-headline-sm text-headline-sm font-bold text-primary">{dbData.soilHealth?.status || "Loading..."}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{dbData.soilHealth?.action || "..."}</p>
                </div>
                <span className="material-symbols-outlined text-primary text-2xl">science</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span>Nitrogen (N)</span>
                    <span className="text-primary font-bold">{dbData.soilHealth?.nitrogen || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${dbData.soilHealth?.nitrogen || 0}%` }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span>Phosphorus (P)</span>
                    <span className="text-primary font-bold">{dbData.soilHealth?.phosphorus || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${dbData.soilHealth?.phosphorus || 0}%` }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span>Potassium (K)</span>
                    <span className="text-primary font-bold">{dbData.soilHealth?.potassium || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${dbData.soilHealth?.potassium || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Irrigation Status */}
            <div className="bento-card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-wider">Smart Irrigation</p>
                  <h3 className={`font-headline-sm text-headline-sm font-bold ${dbData.irrigation?.status === 'Active' ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {dbData.irrigation?.status || "Loading..."}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {dbData.irrigation?.pumpName || "Pump"} • {dbData.irrigation?.sector || "Sector"}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dbData.irrigation?.status === 'Active' ? 'bg-primary/10 text-primary animate-pulse' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {dbData.irrigation?.status === 'Active' ? 'water_drop' : 'water'}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] text-on-surface-variant">Water Usage Today</p>
                    <p className="text-[18px] font-bold text-on-surface">{dbData.irrigation?.waterUsage?.toLocaleString() || 0}L</p>
                  </div>
                  <button
                    onClick={toggleIrrigation}
                    disabled={isTogglingIrrigation}
                    className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-colors disabled:opacity-50 ${dbData.irrigation?.status === 'Active'
                        ? 'bg-error-container text-on-error-container hover:bg-error-container/80'
                        : 'bg-primary text-on-primary hover:bg-primary/90'
                      }`}
                  >
                    {isTogglingIrrigation ? '...' : (dbData.irrigation?.status === 'Active' ? 'Shut Off' : 'Turn On')}
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
                <Link className="text-primary text-[12px] font-bold hover:bg-primary/10 px-2 py-1 rounded transition-colors" href="/analytics">View History</Link>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
                {dbData.crops.length > 0 ? dbData.crops.map((crop, index) => (
                  <Link href={`/analytics?cropId=${crop.id}`} key={index} className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all hover:scale-[1.02] cursor-pointer group border border-transparent hover:border-outline-variant/30">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container-highest shrink-0 relative shadow-sm">
                      {crop.imageUrl ? (
                        <Image fill className="object-cover group-hover:scale-110 transition-transform duration-500" alt={crop.name} src={crop.imageUrl} sizes="64px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold text-xl">{crop.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="font-label-md text-[14px] font-bold text-on-surface truncate">{crop.name}</h5>
                        <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded text-[10px] text-on-surface-variant font-medium shrink-0">
                          <span className="material-symbols-outlined text-[12px]">calendar_month</span> {crop.harvestDays}d
                        </div>
                      </div>
                      <p className="font-label-sm text-[11px] text-on-surface-variant mt-0.5 truncate">
                        {crop.area} Acres • Stage: <span className="text-on-surface font-medium">{crop.stage}</span>
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${crop.healthScore > 80 ? 'bg-primary' : crop.healthScore > 50 ? 'bg-amber-500' : 'bg-error'}`}
                            style={{ width: `${crop.healthScore}%` }}
                          ></div>
                        </div>
                        <span className={`text-[10px] font-bold ${crop.healthScore > 80 ? 'text-primary' : crop.healthScore > 50 ? 'text-amber-500' : 'text-error'}`}>
                          {crop.healthScore}%
                        </span>
                      </div>
                    </div>
                  </Link>
                )) : loadingDb ? (
                  <div className="space-y-3">
                    {[1, 2].map((skeleton) => (
                      <div key={skeleton} className="flex gap-3 p-3 rounded-2xl bg-surface-container-low animate-pulse">
                        <div className="w-14 h-14 rounded-xl bg-surface-container-high shrink-0"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-3 w-1/2 bg-surface-container-high rounded-full"></div>
                          <div className="h-2 w-3/4 bg-surface-container-high rounded-full"></div>
                          <div className="h-1.5 w-full bg-surface-container-high rounded-full mt-2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">psychiatry</span>
                    <p className="text-sm">No active crops tracked.</p>
                    <Link href="/analytics" className="mt-3 text-primary text-xs font-bold hover:underline">Add a Crop</Link>
                  </div>
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
                {dbData.mandiPrices.length > 0 ? dbData.mandiPrices.slice(0, 4).map((price, index) => (
                  <div key={index} className="flex justify-between items-center pb-3 border-b border-outline-variant/40 last:border-0 last:pb-0">
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant text-[11px] truncate w-[100px] sm:w-[150px] md:w-auto">{price.cropName} ({price.market})</p>
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
                <Link href="/market-insights" className="text-primary text-[12px] font-bold hover:underline">View Market Insights</Link>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Today's Tasks */}
            <div className="bento-card p-4 flex flex-col h-[320px]">
              <div className="flex items-center gap-2 mb-4 shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
                <h4 className="font-label-lg text-label-lg font-bold text-on-surface">Today's Tasks</h4>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1" data-lenis-prevent>
                {dbData.tasks.length > 0 ? dbData.tasks.map(task => (
                  <label key={task.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        className="w-4 h-4 rounded-md border-outline text-primary focus:ring-primary shrink-0"
                        type="checkbox"
                        checked={task.checked}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className={`font-body-sm text-[13px] text-on-surface transition-all ${task.checked ? 'line-through opacity-50' : ''}`}>
                        {task.label}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-error hover:bg-error-container rounded transition-all shrink-0"
                      title="Delete task"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </label>
                )) : loadingDb ? (
                  <p className="text-sm text-gray-500 py-2">Loading tasks...</p>
                ) : (
                  <p className="text-sm text-gray-500 py-2">No tasks assigned.</p>
                )}
              </div>
              <div className="shrink-0 mt-2 pt-2 border-t border-outline-variant/20">
                {isAddingTask ? (
                  <form onSubmit={handleAddTask} className="mt-4 flex items-center gap-2">
                    <input
                      type="text"
                      value={newTaskLabel}
                      onChange={(e) => setNewTaskLabel(e.target.value)}
                      placeholder="E.g. Check irrigation pipes..."
                      className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingTask || !newTaskLabel.trim()}
                      className="p-1.5 bg-primary text-on-primary rounded-lg disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="mt-4 w-full text-center py-1.5 text-[12px] font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    + Add New Task
                  </button>
                )}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bento-card p-4 flex flex-col h-[320px]">
              <div className="flex items-center gap-2 mb-4 shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                <h4 className="font-label-lg text-label-lg font-bold text-on-surface">Live Notifications</h4>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1" data-lenis-prevent>
                {dynamicNotifications.length > 0 ? (
                  dynamicNotifications.map((notif) => (
                    <div key={notif.id} className="flex gap-3 items-start animate-fade-in">
                      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${notif.colorClass}`}>
                        <span className="material-symbols-outlined text-[16px]">{notif.icon}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-on-surface leading-tight">{notif.title}</p>
                        <p className="text-[11px] text-on-surface-variant leading-snug mt-1">{notif.desc}</p>
                        <span className="text-[9px] font-bold text-primary opacity-80 mt-1 block uppercase tracking-wider">{notif.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-60">
                    <span className="material-symbols-outlined text-3xl mb-2">done_all</span>
                    <p className="text-xs">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Government Scheme alerts */}
            <div className="bento-card p-4 bg-surface-container-high border border-primary/20 flex flex-col h-[320px]">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                  <h4 className="font-label-lg text-label-lg font-bold text-on-surface">Govt. Schemes</h4>
                </div>
                <span className="text-[10px] font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full">4 Active</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1" data-lenis-prevent>
                {/* PM-KISAN */}
                <div className="bg-white p-3 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="text-[13px] font-bold text-primary group-hover:underline cursor-pointer">PM-KISAN</h5>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-md">₹6,000/yr</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 mb-2 leading-tight">Direct income support for farmer families.</p>
                  <button onClick={() => router.push('/schemes')} className="w-full py-1.5 bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface rounded-lg text-[11px] font-bold transition-colors">Apply / Check Status</button>
                </div>

                {/* PMFBY */}
                <div className="bg-white p-3 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="text-[13px] font-bold text-primary group-hover:underline cursor-pointer">PM Fasal Bima</h5>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">Insurance</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 mb-2 leading-tight">Comprehensive crop insurance coverage.</p>
                  <button onClick={() => router.push('/schemes')} className="w-full py-1.5 bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface rounded-lg text-[11px] font-bold transition-colors">Apply for Kharif</button>
                </div>

                {/* Kisan Credit Card */}
                <div className="bg-white p-3 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="text-[13px] font-bold text-primary group-hover:underline cursor-pointer">Kisan Credit Card</h5>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">Loan</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 mb-2 leading-tight">Low-interest credit up to ₹3 Lakh.</p>
                  <button onClick={() => router.push('/schemes')} className="w-full py-1.5 bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface rounded-lg text-[11px] font-bold transition-colors">Check Eligibility</button>
                </div>

                {/* Soil Health Card */}
                <div className="bg-white p-3 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="text-[13px] font-bold text-primary group-hover:underline cursor-pointer">Soil Health Card</h5>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-md">Testing</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 mb-2 leading-tight">Subsidized N-P-K soil testing kits.</p>
                  <button onClick={() => router.push('/schemes')} className="w-full py-1.5 bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface rounded-lg text-[11px] font-bold transition-colors">Request Test</button>
                </div>
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
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/support">Contact Us</Link>
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/about">About Us</Link>
            </div>
          </footer>
        </main>


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

export default function Dashboard() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  );
}






