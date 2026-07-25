"use client";

import { Languages, Palette, Trash2, LogOut, ChevronRight } from "lucide-react";
import type { AccountSetting } from "@/types/profile";

interface SettingsCardProps {
  settings?: AccountSetting[];
  onAction?: (id: string) => void;
  onLogout?: () => void;
}

const iconMap: Record<string, typeof Languages> = {
  language: Languages,
  theme: Palette,
  delete: Trash2,
};

const defaultSettings: AccountSetting[] = [
  { id: "language", label: "Language", value: "Hindi / English", icon: "language" },
  { id: "delete", label: "Delete Account", value: "Permanently remove account", icon: "delete", destructive: true },
];

export default function SettingsCard({
  settings = defaultSettings,
  onAction,
  onLogout,
}: SettingsCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm">
      <h2 className="text-lg font-bold text-on-surface mb-6">Account Settings</h2>
      <div className="space-y-2">
        {settings.map((s) => {
          const Icon = iconMap[s.icon];
          if (!Icon) return null;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onAction?.(s.id)}
              className={`w-full flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors text-left ${
                s.destructive ? "text-error" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    s.destructive ? "bg-error-container text-error" : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="text-xs text-on-surface-variant">{s.value}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-on-surface-variant shrink-0" />
            </button>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-error-container/20 transition-colors text-error font-semibold text-sm"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
