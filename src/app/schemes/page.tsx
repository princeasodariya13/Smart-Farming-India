"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { Leaf } from "lucide-react";
import PageLoader from '@/components/PageLoader';
import SchemesLayout from "@/components/schemes/SchemesLayout";

function SchemesContent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "F";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[45] md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar — reused from dashboard */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full w-64 md:w-48 bg-surface-container-low border-r border-outline-variant p-2.5 gap-2 shadow-2xl md:shadow-none`}
      >
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
          <Link
            className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all"
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="text-[12px] font-medium">Dashboard</span>
          </Link>

          <Link
            className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all"
            href="/gps-area-calculator"
          >
            <span className="material-symbols-outlined text-[18px]">map</span>
            <span className="text-[12px] font-medium">GPS Area Calculator</span>
          </Link>
          <Link
            className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all"
            href="/weather"
          >
            <span className="material-symbols-outlined text-[18px]">early_on</span>
            <span className="text-[12px] font-medium">Weather</span>
          </Link>
          <Link
            className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all"
            href="/disease-detection"
          >
            <span className="material-symbols-outlined text-[18px]">shutter_speed</span>
            <span className="text-[12px] font-medium">Scanner</span>
          </Link>

          {/* Schemes — active */}

          <Link
            className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all"
            href="/market"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span className="text-[12px] font-medium">Marketplace</span>
          </Link>

          <Link
            className="flex items-center gap-2 px-3 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg transition-all"
            href="/schemes"
          >
            <span className="material-symbols-outlined text-[18px]">article</span>
            <span className="text-[12px] font-medium">Schemes</span>
          </Link>

          <Link
            className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all"
            href="/community"
          >
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span className="text-[12px] font-medium">Community</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span className="text-[12px] font-medium">Analytics</span>
          </Link>

          <Link
            className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all"
            href="/settings"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="text-[12px] font-medium">Settings</span>
          </Link>
        </nav>

        <div className="mt-auto pt-3 border-t border-outline-variant space-y-1">
          <button className="w-full mb-3 py-2.5 bg-primary text-on-primary rounded-lg text-[12px] font-bold shadow-sm active:scale-95 transition-all">
            Consult Expert
          </button>
          <Link
            className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all"
            href="/support"
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span className="text-[12px] font-medium">Support</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all w-full text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-[12px] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-8 md:pb-0">
        {/* TopNavBar — reused from dashboard */}
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 sticky top-0 z-40 flex items-center justify-between px-6 w-full shadow-sm">
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
        <main
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage pb-24"
        >
          <SchemesLayout />

          {/* Footer */}
          <footer className="w-full py-6 px-8 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant mt-8">
            <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
              <h4 className="text-base font-bold text-primary">Smart Farming India</h4>
              <p className="text-xs text-on-surface-variant mt-1 text-center md:text-left max-w-sm">
                © 2026 Smart Farming India. Empowering the roots of our nation.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 md:gap-8 whitespace-nowrap overflow-x-auto custom-scrollbar pb-2 md:pb-0 max-w-full">
              <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="/privacy">
                Privacy Policy
              </Link>
              <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="/terms">
                Terms of Service
              </Link>
              <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="/about">
                About Us
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function SchemesPage() {
  return (
    <SessionProvider>
      <SchemesContent />
    </SessionProvider>
  );
}












