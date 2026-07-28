"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Leaf, BookOpen, Layers, Zap, Search, ShieldCheck } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

export default function DocumentationPage() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('getting-started');

  if (status === "loading") {
    return <PageLoader />;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: <Zap size={16} /> },
    { id: 'gps-calculator', title: 'GPS Calculator', icon: <Layers size={16} /> },
    { id: 'marketplace', title: 'Marketplace Rules', icon: <BookOpen size={16} /> },
    { id: 'security', title: 'Data & Security', icon: <ShieldCheck size={16} /> },
  ];

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
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/dashboard">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="text-[12px] font-medium">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/gps-area-calculator">
            <span className="material-symbols-outlined text-[18px]">map</span>
            <span className="text-[12px] font-medium">GPS Area Calculator</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/weather">
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
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 md:p-6 pb-24">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="bg-surface-glass border border-outline-variant/60 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
              <div>
                <h2 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface mb-2">Platform Documentation</h2>
                <p className="text-on-surface-variant font-body-sm max-w-lg">
                  Everything you need to know about using Smart Farming India, from setting up your account to calculating field areas precisely.
                </p>
              </div>
              <div className="relative w-full md:w-64 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                  type="text" 
                  placeholder="Search docs..." 
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Layout */}
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Doc Navigation Tabs */}
              <div className="w-full md:w-64 shrink-0">
                <div className="bg-surface-glass border border-outline-variant/60 rounded-2xl p-3 space-y-1 sticky top-6 shadow-sm">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                        activeTab === section.id 
                        ? 'bg-primary text-on-primary shadow-sm' 
                        : 'text-on-surface-variant hover:bg-surface hover:text-on-surface'
                      }`}
                    >
                      {section.icon}
                      {section.title}
                    </button>
                  ))}
                  
                  <div className="mt-4 pt-4 border-t border-outline-variant/50 px-3 pb-2">
                    <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Need more help?</p>
                    <Link href="/support" className="text-[12px] text-primary font-medium hover:underline flex items-center gap-1">
                      Contact Support &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Doc Content Body */}
              <div className="flex-1 bg-surface border border-outline-variant/60 rounded-2xl p-6 md:p-8 shadow-sm doc-content">
                {activeTab === 'getting-started' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface mb-2 border-b border-outline-variant/30 pb-2">Getting Started</h3>
                      <p className="text-[14px] text-on-surface-variant leading-relaxed mt-4">
                        Welcome to Smart Farming India! Our platform is designed to digitize your agricultural operations, bringing cutting-edge tools directly to your browser.
                      </p>
                    </div>
                    
                    <div className="space-y-3 mt-6">
                      <h4 className="font-bold text-on-surface text-[15px]">1. Complete your profile</h4>
                      <p className="text-[13px] text-on-surface-variant leading-relaxed bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40">
                        Go to the <strong>Profile</strong> tab to fill out your farm details, state, and preferred crops. This helps us tailor Government Schemes and Disease Detection data to your specific region.
                      </p>
                      
                      <h4 className="font-bold text-on-surface text-[15px] mt-4">2. Monitor your dashboard</h4>
                      <p className="text-[13px] text-on-surface-variant leading-relaxed bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40">
                        Your dashboard shows a real-time overview of your farm, including <strong>Mandi Prices</strong> at the bottom ticker, pending tasks, and live weather conditions.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'gps-calculator' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface mb-2 border-b border-outline-variant/30 pb-2">Using the GPS Calculator</h3>
                      <p className="text-[14px] text-on-surface-variant leading-relaxed mt-4">
                        The GPS Area Calculator allows you to map your farm fields precisely using satellite imagery without buying expensive hardware.
                      </p>
                    </div>
                    
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 text-on-surface my-4">
                      <Layers className="text-primary shrink-0" size={20} />
                      <p className="text-[13px] leading-relaxed">
                        <strong>Pro Tip:</strong> Zoom in closely on the map before dropping pins. The closer you zoom, the more accurate your boundaries (and resulting calculations) will be.
                      </p>
                    </div>

                    <ul className="space-y-3 list-disc pl-5 text-[13px] text-on-surface-variant mt-4">
                      <li>Use the <strong>Search Bar</strong> to fly to your specific village or state.</li>
                      <li>Select the <strong>Polygon Tool</strong> to draw your field. Click on every corner of your land.</li>
                      <li>Close the shape by clicking your first point again.</li>
                      <li>Read your results in the <strong>Statistics Card</strong>, available in Acres, Hectares, and Bigha.</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'marketplace' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface mb-2 border-b border-outline-variant/30 pb-2">Marketplace Guidelines</h3>
                      <p className="text-[14px] text-on-surface-variant leading-relaxed mt-4">
                        The marketplace is designed to eliminate middlemen, allowing farmers to sell directly to wholesale buyers securely.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="border border-outline-variant/50 rounded-xl p-4 bg-surface-container-lowest">
                        <h4 className="font-bold text-[14px] text-on-surface mb-2 text-green-600">Do's</h4>
                        <ul className="text-[12px] text-on-surface-variant space-y-2 list-disc pl-4">
                          <li>Provide clear, well-lit photos of your produce.</li>
                          <li>Mention the exact grade and moisture content.</li>
                          <li>Update your stock availability regularly.</li>
                        </ul>
                      </div>
                      <div className="border border-outline-variant/50 rounded-xl p-4 bg-surface-container-lowest">
                        <h4 className="font-bold text-[14px] text-on-surface mb-2 text-red-600">Don'ts</h4>
                        <ul className="text-[12px] text-on-surface-variant space-y-2 list-disc pl-4">
                          <li>Do not share bank OTPs with buyers.</li>
                          <li>Do not list synthetic or banned chemicals.</li>
                          <li>Avoid using stock images for your produce.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface mb-2 border-b border-outline-variant/30 pb-2">Data & Privacy</h3>
                      <p className="text-[14px] text-on-surface-variant leading-relaxed mt-4">
                        Your farm data is encrypted and secure. We strictly adhere to data protection guidelines.
                      </p>
                    </div>
                    <p className="text-[13px] text-on-surface-variant leading-relaxed">
                      All geographical boundaries (GPS coordinates), production estimates, and personal financial data mapped on our platform are stored on secured databases. 
                      Smart Farming India does not sell your private agricultural data to third-party advertisers. 
                    </p>
                    <p className="text-[13px] text-on-surface-variant leading-relaxed mt-3">
                      Authentication is managed securely via NextAuth and standard OAuth protocols. Sessions are strictly mapped to individual accounts to prevent unauthorized access.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
