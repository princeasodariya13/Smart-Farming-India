"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const NAV_LINKS = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/gps-area-calculator", icon: "map", label: "GPS Area Calculator" },
  { href: "/weather", icon: "early_on", label: "Weather" },
  { href: "/disease-detection", icon: "shutter_speed", label: "Scanner" },
  { href: "/market", icon: "storefront", label: "Marketplace" },
  { href: "/schemes", icon: "article", label: "Schemes" },
  { href: "/community", icon: "forum", label: "Community" },
  { href: "/analytics", icon: "insights", label: "Analytics" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
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
        {NAV_LINKS.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
              <span className={cn("text-[12px]", isActive ? "font-bold" : "font-medium")}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-3 border-t border-outline-variant space-y-1">
        <Link href="/consult" className="w-full block text-center mb-3 py-2.5 bg-primary text-on-primary rounded-lg text-[12px] font-bold shadow-sm active:scale-95 transition-all">
          Consult Expert
        </Link>
        <Link 
          className={cn(
            "flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all",
            pathname.startsWith("/support")
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          )} 
          href="/support"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          <span className={cn("text-[12px]", pathname.startsWith("/support") ? "font-bold" : "font-medium")}>Support</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all w-full text-left"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="text-[12px] font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
