"use client";

import { KeyRound, ShieldCheck, Laptop2, History, Lock, ChevronRight } from "lucide-react";
import type { SecurityItem } from "@/types/profile";

interface SecurityCardProps {
  items?: SecurityItem[];
  onAction?: (id: string) => void;
}

const iconMap: Record<string, typeof KeyRound> = {
  password: KeyRound,
  twofa: ShieldCheck,
  devices: Laptop2,
  history: History,
  privacy: Lock,
};

const defaultItems: SecurityItem[] = [
  { id: "password", title: "Change Password", description: "Last changed 3 months ago", icon: "password", actionLabel: "Update" },
  { id: "twofa", title: "Two-Factor Authentication", description: "Enabled via SMS OTP", icon: "twofa", actionLabel: "Manage" },
  { id: "devices", title: "Active Devices", description: "2 devices currently signed in", icon: "devices", actionLabel: "View" },
  { id: "history", title: "Login History", description: "Review recent sign-ins", icon: "history", actionLabel: "View" },
  { id: "privacy", title: "Privacy Settings", description: "Control data sharing preferences", icon: "privacy", actionLabel: "Manage" },
];

export default function SecurityCard({ items = defaultItems, onAction }: SecurityCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm">
      <h2 className="text-lg font-bold text-on-surface mb-6">Security</h2>
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onAction?.(item.id)}
              className="w-full flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                  <p className="text-xs text-on-surface-variant">{item.description}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-on-surface-variant shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
