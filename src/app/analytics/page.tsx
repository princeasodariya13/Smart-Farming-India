"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  TrendingUp, IndianRupee, ArrowUpRight, ArrowDownRight,
  Sprout, Landmark, Wallet, Leaf, RefreshCw, MapPin,
  Users, BarChart2, MessageSquare, Download
} from "lucide-react";
import PageLoader from "@/components/PageLoader";
import NotificationBell from "@/components/NotificationBell";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";

const COLORS = ["#2E7D32", "#F59E0B", "#3B82F6", "#EC4899", "#8B5CF6", "#14B8A6"];

function KpiCard({ icon: Icon, label, value, sub, up, color }: {
  icon: any; label: string; value: string; sub: string; up?: boolean; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface p-5 rounded-2xl shadow-sm border border-outline-variant/30 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-${color}`}>
        <Icon size={64} />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-xl bg-${color}/10 flex items-center justify-center text-${color}`}>
          <Icon size={18} />
        </div>
        <h3 className="text-[13px] font-medium text-on-surface-variant">{label}</h3>
      </div>
      <p className="text-2xl font-extrabold text-on-surface mb-1">{value}</p>
      <div className={`flex items-center gap-1 text-[12px] font-semibold ${up === false ? "text-error" : "text-success"}`}>
        {up === false ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
        <span>{sub}</span>
      </div>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Real data state
  const [dashData, setDashData] = useState<any>(null);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [gpsFields, setGpsFields] = useState<any[]>([]);
  const [communityStats, setCommunityStats] = useState<any[]>([]);

  const fetchAll = useCallback(async () => {
    try {
      const [dash, market, gps, community] = await Promise.all([
        fetch("/api/dashboard").then(r => r.json()),
        fetch("/api/market-prices?market=Gondal").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/api/gps").then(r => r.json()).catch(() => ({ fields: [] })),
        fetch("/api/community").then(r => r.json()).catch(() => ({ stats: [] })),
      ]);
      if (dash.success) setDashData(dash);
      if (market.data) setMarketData(market.data.slice(0, 8));
      if (gps.fields) setGpsFields(gps.fields);
      if (community.stats) setCommunityStats(community.stats);
    } catch (e) {
      console.error("Analytics fetch error", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { if (status !== "loading") fetchAll(); }, [status, fetchAll]);

  const handleRefresh = () => { setRefreshing(true); fetchAll(); };

  const getInitials = (name?: string | null) => {
    if (!name) return "F";
    const p = name.trim().split(" ");
    return p.length >= 2 ? `${p[0][0]}${p[1][0]}`.toUpperCase() : name[0].toUpperCase();
  };

  if (status === "loading" || loading) return <PageLoader />;

  // Derived KPIs from real data
  const crops = dashData?.crops || [];
  const mandiPrices: any[] = dashData?.mandiPrices || [];
  const soilHealth = dashData?.soilHealth;
  const irrigation = dashData?.irrigation;

  const totalFields = gpsFields.length;
  const totalArea = gpsFields.reduce((s: number, f: any) => s + (f.totalAreaAcres || 0), 0);

  // Price chart data from mandi
  const priceChartData = mandiPrices.slice(0, 7).map((p: any) => ({
    name: p.cropName?.split(" ")[0] || "Crop",
    Price: p.price,
    trend: p.trendDirection === "UP" ? 1 : -1,
  }));

  // Soil chart data
  const soilData = soilHealth ? [
    { name: "Nitrogen", value: soilHealth.nitrogen, fill: "#2E7D32" },
    { name: "Phosphorus", value: soilHealth.phosphorus, fill: "#F59E0B" },
    { name: "Potassium", value: soilHealth.potassium ?? 45, fill: "#3B82F6" },
  ] : [];

  // Crop health data
  const cropChartData = crops.map((c: any) => ({
    name: c.name,
    Health: c.healthScore,
    Area: c.area,
  }));

  // Community KPIs
  const commFarmers = communityStats.find((s: any) => s.id === "farmers")?.value || "—";
  const commDiscussions = communityStats.find((s: any) => s.id === "discussions")?.value || "—";
  const commQuestions = communityStats.find((s: any) => s.id === "asked")?.value || "—";

  const upMandi = mandiPrices.filter((p: any) => p.trendDirection === "UP").length;
  const downMandi = mandiPrices.filter((p: any) => p.trendDirection === "DOWN").length;

  const csvExport = () => {
    const headers = ["Crop", "Market", "Price (₹/qtl)", "Trend Direction", "Trend %"];
    const rows = mandiPrices.map((p: any) => [
      `"${p.cropName || ""}"`,
      `"${p.market || ""}"`,
      p.price,
      p.trendDirection,
      `${p.trendPercent}%`
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    // Add BOM for Excel UTF-8 support
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mandi_prices_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-[45] md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-8 md:pb-0">
        {/* Top Nav */}
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 sticky top-0 shrink-0 z-30 flex items-center justify-between px-6 w-full shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex md:hidden items-center gap-2 mr-2">
              <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 -ml-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
              <div className="p-1 rounded-lg bg-primary text-on-primary"><Leaf size={14} strokeWidth={2.5} /></div>
              <span className="text-[13px] font-extrabold tracking-tight text-on-surface">Smart Farming<span className="text-primary">.</span></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleRefresh} disabled={refreshing} className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50">
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
            <NotificationBell />
            <div className="h-6 w-px bg-outline-variant mx-1" />
            <div className="flex items-center gap-2 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-on-surface leading-none">{session?.user?.name ?? "Farmer"}</p>
              </div>
              <Link href="/profile" className="block relative cursor-pointer hover:opacity-80 transition-opacity">
                {session?.user?.image ? (
                  <Image width={32} height={32} className="w-8 h-8 rounded-full border border-outline-variant object-cover" alt="profile" src={session.user.image} />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-outline-variant bg-primary-container text-on-primary-container flex items-center justify-center text-[12px] font-bold">
                    {getInitials(session?.user?.name)}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage">
          <div className="p-4 md:p-8 max-w-[1400px] mx-auto flex flex-col gap-8">

            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Farm Analytics</h1>
                <p className="text-on-surface-variant text-sm mt-1">Live data from your crops, fields, mandi prices & community.</p>
              </div>
              <button onClick={csvExport} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
                <Download size={15} /> Export CSV
              </button>
            </div>

            {/* KPI Row 1 — Farm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon={MapPin} label="Mapped Fields" value={totalFields.toString()} sub={`${totalArea.toFixed(1)} total acres`} up={true} color="primary" />
              <KpiCard icon={Sprout} label="Active Crops" value={crops.length.toString()} sub={crops.map((c: any) => c.name).join(", ") || "None seeded"} up={true} color="primary" />
              <KpiCard icon={TrendingUp} label="Prices Rising" value={upMandi.toString()} sub={`${downMandi} declining today`} up={true} color="secondary" />
              <KpiCard icon={Wallet} label="Irrigation" value={irrigation?.status || "N/A"} sub={irrigation ? `${irrigation.pumpName} · ${irrigation.waterUsage}L` : "No data"} up={true} color="primary" />
            </div>

            {/* KPI Row 2 — Community */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KpiCard icon={Users} label="Registered Farmers" value={commFarmers} sub="Verified accounts" up={true} color="secondary" />
              <KpiCard icon={MessageSquare} label="Community Discussions" value={commDiscussions} sub="Posts & comments" up={true} color="primary" />
              <KpiCard icon={BarChart2} label="Questions Asked" value={commQuestions} sub="80% resolved rate" up={true} color="primary" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Mandi Price Bar Chart */}
              <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-[16px] text-on-surface">Live Mandi Prices</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">Gondal Market · ₹ per quintal</p>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">LIVE</span>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceChartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                      <RechartsTooltip
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontSize: "12px" }}
                        formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Price"]}
                      />
                      <Bar dataKey="Price" radius={[6, 6, 0, 0]}>
                        {priceChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.trend > 0 ? "#2E7D32" : "#EF4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Soil Health */}
              <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-[16px] text-on-surface">Soil Health</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">NPK levels from your sensor data</p>
                  </div>
                  {soilHealth && (
                    <span className="text-[10px] bg-success/10 text-success font-bold px-2.5 py-1 rounded-full">{soilHealth.status}</span>
                  )}
                </div>
                {soilData.length > 0 ? (
                  <>
                    <div className="flex items-center justify-center h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={soilData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                            {soilData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {soilData.map((s) => (
                        <div key={s.name} className="text-center bg-surface-container-lowest rounded-xl p-3">
                          <div className="w-3 h-3 rounded-full mx-auto mb-1.5" style={{ background: s.fill }} />
                          <p className="text-xs text-on-surface-variant font-medium">{s.name}</p>
                          <p className="text-lg font-bold text-on-surface">{s.value}%</p>
                        </div>
                      ))}
                    </div>
                    {soilHealth?.action && (
                      <p className="mt-3 text-[12px] text-on-surface-variant bg-primary/5 border border-primary/10 rounded-xl px-3 py-2">
                        💡 {soilHealth.action}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-on-surface-variant text-sm">No soil data yet</div>
                )}
              </div>

              {/* Crop Health Bar */}
              <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="mb-5">
                  <h3 className="font-bold text-[16px] text-on-surface">Crop Health Scores</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">AI-analyzed health per active crop</p>
                </div>
                {cropChartData.length > 0 ? (
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cropChartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={(v) => `${v}%`} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#374151" }} width={90} />
                        <RechartsTooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }} formatter={(v: any) => [`${v}%`, "Health Score"]} />
                        <Bar dataKey="Health" radius={[0, 6, 6, 0]} fill="#2E7D32" background={{ fill: "rgba(0,0,0,0.04)", radius: 6 }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-on-surface-variant text-sm">No crop data yet. Add crops from Dashboard.</div>
                )}
              </div>

              {/* GPS Fields */}
              <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="mb-5">
                  <h3 className="font-bold text-[16px] text-on-surface">Mapped Fields</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">From GPS Area Calculator</p>
                </div>
                {gpsFields.length > 0 ? (
                  <>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gpsFields.slice(0, 6).map((f: any) => ({ name: f.name?.slice(0, 10) || "Field", Acres: +f.totalAreaAcres.toFixed(2) }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6B7280" }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                          <RechartsTooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }} formatter={(v: any) => [`${v} Acres`, "Area"]} />
                          <Bar dataKey="Acres" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-surface-container-lowest rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold text-on-surface">{totalFields}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">Total Fields</p>
                      </div>
                      <div className="bg-surface-container-lowest rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold text-on-surface">{totalArea.toFixed(1)}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">Total Acres</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[220px] gap-3">
                    <MapPin size={36} className="text-on-surface-variant/30" />
                    <p className="text-sm text-on-surface-variant">No fields mapped yet.</p>
                    <Link href="/gps-area-calculator" className="text-sm font-bold text-primary hover:underline">Open GPS Calculator →</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Live Mandi Prices Table */}
            <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[16px] text-on-surface">Live Mandi Price Board</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Gondal Market · Real-time data</p>
                </div>
                <button onClick={csvExport} className="text-[13px] text-primary font-bold hover:underline flex items-center gap-1">
                  <Download size={13} /> Download CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-surface-container-lowest text-on-surface-variant text-[11px] uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Crop</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Market</th>
                      <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Price (₹/qtl)</th>
                      <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {mandiPrices.slice(0, 10).map((p: any, i: number) => (
                      <tr key={i} className="hover:bg-surface-container-lowest/50 transition-colors">
                        <td className="px-6 py-4 text-[13px] font-semibold text-on-surface whitespace-nowrap">{p.cropName}</td>
                        <td className="px-6 py-4 text-[13px] text-on-surface-variant whitespace-nowrap">{p.market}</td>
                        <td className="px-6 py-4 text-[14px] font-bold text-on-surface text-right whitespace-nowrap">₹{Number(p.price).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${p.trendDirection === "UP" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                            {p.trendDirection === "UP" ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                            {Math.abs(p.trendPercent)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Irrigation & Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
              <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                <h3 className="font-bold text-[16px] text-on-surface mb-4">Irrigation System</h3>
                {irrigation ? (
                  <div className="space-y-3">
                    {[
                      { label: "Status", value: irrigation.status, badge: true },
                      { label: "Pump", value: irrigation.pumpName },
                      { label: "Sector", value: irrigation.sector },
                      { label: "Water Usage", value: `${Number(irrigation.waterUsage).toLocaleString("en-IN")} L` },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
                        <span className="text-[13px] text-on-surface-variant">{row.label}</span>
                        {row.badge ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-success/10 text-success">{row.value}</span>
                        ) : (
                          <span className="text-[13px] font-semibold text-on-surface">{row.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant">No irrigation data.</p>
                )}
              </div>

              <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                <h3 className="font-bold text-[16px] text-on-surface mb-4">Pending Tasks</h3>
                {(dashData?.tasks || []).length > 0 ? (
                  <div className="space-y-3">
                    {(dashData.tasks as any[]).map((t: any) => (
                      <div key={t.id} className="flex items-center gap-3 py-2 border-b border-outline-variant/20 last:border-0">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${t.checked ? "bg-primary border-primary" : "border-outline-variant"}`}>
                          {t.checked && <span className="text-white text-[10px]">✓</span>}
                        </div>
                        <span className={`text-[13px] ${t.checked ? "line-through text-on-surface-variant" : "text-on-surface font-medium"}`}>{t.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant">All tasks complete!</p>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
