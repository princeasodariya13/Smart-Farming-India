"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Tractor,
  CloudSun,
  ScanSearch,
  Store,
  Settings,
  HelpCircle,
  LogOut,
  Globe,
  Bell,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Farm", href: "/farm", icon: Tractor },
  { label: "Weather", href: "/weather", icon: CloudSun, active: true },
  { label: "Disease Detection", href: "/disease-detection", icon: ScanSearch },
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface WeatherLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared dashboard shell (top nav + sidebar + footer) for the Weather page.
 * Presentational only — links and handlers point at existing routes/logic.
 */
export default function WeatherLayout({ children }: WeatherLayoutProps) {
  return (
    <div className="min-h-screen bg-background-sage text-on-surface">
      <nav className="sticky top-0 z-50 border-b border-white/20 bg-surface-glass shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between px-4 md:px-margin-desktop">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-primary">
              <Sprout size={22} />
              <span className="text-xl tracking-tight">Smart Farming India</span>
            </Link>
            <div className="hidden gap-6 md:flex">
              {["Marketplace", "Schemes", "Community", "Analytics"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Change language"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              <Globe size={20} />
            </button>
            <button
              aria-label="Notifications"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-container" aria-hidden="true" />
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 flex-col gap-2 border-r border-outline-variant bg-surface-container-low p-4 md:flex">
          <span className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Navigation
          </span>
          {NAV_ITEMS.map(({ label, href, icon: Icon, active }) => (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
                active
                  ? "bg-secondary-container font-bold text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
          <div className="mt-auto flex flex-col gap-2 border-t border-outline-variant pt-4">
            <a
              href="#"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container-high"
            >
              <HelpCircle size={20} />
              <span>Support</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container-high"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </a>
          </div>
        </aside>

        <main className="min-h-screen flex-1 bg-[linear-gradient(135deg,#F8FAF7_0%,#E9EDFF_100%)] p-4 md:p-8">
          <div className="mx-auto w-full max-w-container-max space-y-8">{children}</div>
        </main>
      </div>

      <footer className="flex w-full flex-col items-center justify-between gap-8 border-t border-outline-variant bg-surface-container-lowest px-4 py-12 md:flex-row md:px-margin-desktop">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <span className="text-xl font-bold text-primary">Smart Farming India</span>
          <p className="text-sm text-on-surface-variant">
            © {new Date().getFullYear()} Smart Farming India. Empowering the roots of our nation.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {["Privacy Policy", "Terms of Service", "Contact Us", "About Us"].map((label) => (
            <a key={label} href="#" className="text-sm text-on-surface-variant hover:text-primary">
              {label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
