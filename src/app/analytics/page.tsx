"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Leaf, TrendingUp, IndianRupee, ArrowUpRight, ArrowDownRight, Sprout, Landmark, Wallet } from "lucide-react";
import PageLoader from '@/components/PageLoader';
import NotificationBell from '@/components/NotificationBell';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";

// --- Mock Data ---
const yieldData = [
  { name: 'Jan', Cotton: 400, Wheat: 240, Sugarcane: 240 },
  { name: 'Feb', Cotton: 300, Wheat: 139, Sugarcane: 221 },
  { name: 'Mar', Cotton: 200, Wheat: 980, Sugarcane: 229 },
  { name: 'Apr', Cotton: 278, Wheat: 390, Sugarcane: 200 },
  { name: 'May', Cotton: 189, Wheat: 480, Sugarcane: 218 },
  { name: 'Jun', Cotton: 239, Wheat: 380, Sugarcane: 250 },
  { name: 'Jul', Cotton: 349, Wheat: 430, Sugarcane: 210 },
];

const priceData = [
  { name: 'Jan', Price: 6500 },
  { name: 'Feb', Price: 6600 },
  { name: 'Mar', Price: 6800 },
  { name: 'Apr', Price: 6750 },
  { name: 'May', Price: 7100 },
  { name: 'Jun', Price: 7300 },
  { name: 'Jul', Price: 7500 },
];

const transactionHistory = [
  { id: 1, date: "2024-05-12", description: "Cotton Sale (Mandi)", amount: "+₹45,000", type: "income", status: "Completed" },
  { id: 2, date: "2024-05-10", description: "Urea Fertilizer Purchase", amount: "-₹3,200", type: "expense", status: "Completed" },
  { id: 3, date: "2024-05-08", description: "Tractor Rental (Marketplace)", amount: "-₹1,500", type: "expense", status: "Completed" },
  { id: 4, date: "2024-05-05", description: "PM-KISAN Subsidy", amount: "+₹2,000", type: "income", status: "Completed" },
  { id: 5, date: "2024-05-01", description: "Water Pump Maintenance", amount: "-₹800", type: "expense", status: "Pending" },
];

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

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
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-8 md:pb-0">
        
        {/* TopNavBar */}
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 sticky top-0 shrink-0 z-30 flex items-center justify-between px-6 w-full shadow-sm">
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
            <div className="h-6 w-px bg-outline-variant mx-1" />
            <div className="flex items-center gap-2 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-on-surface leading-none">{session?.user?.name ?? "Farmer"}</p>
              </div>
              <Link href="/profile" className="block relative cursor-pointer hover:opacity-80 transition-opacity">
                {session?.user?.image ? (
                  <Image 
                    width={32} height={32}
                    className="w-8 h-8 rounded-full border border-outline-variant object-cover" 
                    alt="User profile" 
                    src={session.user.image} 
                  />
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
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 max-w-[1400px] mx-auto flex flex-col gap-8"
          >
            {/* Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-2">Farm Analytics</h1>
              <p className="text-on-surface-variant text-[14px]">Monitor your crop yields, market prices, and financial history.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface p-5 rounded-2xl shadow-sm border border-outline-variant/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <IndianRupee size={64} />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Wallet size={16} />
                  </div>
                  <h3 className="text-[13px] font-medium text-on-surface-variant">Total Revenue</h3>
                </div>
                <p className="text-2xl font-bold text-on-surface mb-1">₹4,25,000</p>
                <div className="flex items-center gap-1 text-[12px] text-success font-medium">
                  <ArrowUpRight size={14} /> <span>+12.5% from last year</span>
                </div>
              </div>

              <div className="bg-surface p-5 rounded-2xl shadow-sm border border-outline-variant/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Landmark size={64} />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Landmark size={16} />
                  </div>
                  <h3 className="text-[13px] font-medium text-on-surface-variant">Subsidies Claimed</h3>
                </div>
                <p className="text-2xl font-bold text-on-surface mb-1">₹65,000</p>
                <div className="flex items-center gap-1 text-[12px] text-success font-medium">
                  <ArrowUpRight size={14} /> <span>+2 schemes approved</span>
                </div>
              </div>

              <div className="bg-surface p-5 rounded-2xl shadow-sm border border-outline-variant/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <TrendingUp size={64} />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error">
                    <ArrowDownRight size={16} />
                  </div>
                  <h3 className="text-[13px] font-medium text-on-surface-variant">Operational Costs</h3>
                </div>
                <p className="text-2xl font-bold text-on-surface mb-1">₹1,12,400</p>
                <div className="flex items-center gap-1 text-[12px] text-error font-medium">
                  <ArrowUpRight size={14} /> <span>+4.2% from last year</span>
                </div>
              </div>

              <div className="bg-surface p-5 rounded-2xl shadow-sm border border-outline-variant/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sprout size={64} />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Sprout size={16} />
                  </div>
                  <h3 className="text-[13px] font-medium text-on-surface-variant">Net Profit</h3>
                </div>
                <p className="text-2xl font-bold text-on-surface mb-1">₹3,77,600</p>
                <div className="flex items-center gap-1 text-[12px] text-success font-medium">
                  <ArrowUpRight size={14} /> <span>+15.3% overall margin</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Crop Yield Chart */}
              <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                <h3 className="font-bold text-[16px] text-on-surface mb-6">Crop Yield Estimates (Quintals)</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yieldData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                      <Bar dataKey="Cotton" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Wheat" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Sugarcane" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Market Price Trends */}
              <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                <h3 className="font-bold text-[16px] text-on-surface mb-6">Market Price Trends (Cotton - ₹/Qtl)</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis domain={['dataMin - 200', 'dataMax + 200']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="Price" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Financial History Table */}
            <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden mb-8">
              <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between">
                <h3 className="font-bold text-[16px] text-on-surface">Financial History</h3>
                <button className="text-[13px] text-primary font-bold hover:underline">Download CSV</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-surface-container-lowest text-on-surface-variant text-[12px] uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Description</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {transactionHistory.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                        <td className="px-6 py-4 text-[13px] text-on-surface whitespace-nowrap">{tx.date}</td>
                        <td className="px-6 py-4 text-[13px] font-medium text-on-surface">{tx.description}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold \${
                            tx.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-[13px] font-bold text-right \${
                          tx.type === 'income' ? 'text-success' : 'text-on-surface'
                        }`}>
                          {tx.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        </main>
      </div>
    </div>
  );
}
