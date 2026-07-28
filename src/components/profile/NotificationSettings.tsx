"use client";

import { useState, useEffect } from "react";
import type { NotificationPreference } from "@/types/profile";

interface NotificationSettingsProps {
  preferences?: NotificationPreference[];
  onChange?: (id: string, enabled: boolean) => void;
}

const defaultPreferences: NotificationPreference[] = [
  { id: "n1", label: "Weather Alerts", description: "Storm, rainfall & heat warnings", enabled: true },
  { id: "n2", label: "Disease Alerts", description: "AI scan results & outbreak warnings", enabled: true },
  { id: "n3", label: "Marketplace Offers", description: "Discounts and new listings", enabled: false },
  { id: "n4", label: "Rental Notifications", description: "Equipment booking updates", enabled: true },
  { id: "n5", label: "Government Scheme Updates", description: "New schemes & deadlines", enabled: true },
  { id: "n6", label: "Community Notifications", description: "Replies and mentions", enabled: false },
  { id: "n7", label: "Email Notifications", description: "Summary emails", enabled: true },
  { id: "n8", label: "SMS Notifications", description: "Critical alerts via SMS", enabled: true },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        checked ? "bg-primary" : "bg-surface-container-high"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function NotificationSettings({
  preferences: initial = defaultPreferences,
  onChange,
}: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState(initial);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setPreferences(data.settings);
        }
      })
      .catch(err => console.error("Failed to load settings:", err));
  }, []);

  const toggle = async (id: string) => {
    const newPrefs = preferences.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p));
    setPreferences(newPrefs);
    
    const pref = newPrefs.find((p) => p.id === id);
    if (pref) onChange?.(id, pref.enabled);

    setIsSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newPrefs })
      });
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-on-surface">Notification Preferences</h2>
        {isSaving && <span className="text-xs font-semibold text-primary animate-pulse">Saving...</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className="flex items-center justify-between gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/40"
          >
            <div>
              <p className="text-sm font-semibold text-on-surface">{pref.label}</p>
              <p className="text-xs text-on-surface-variant">{pref.description}</p>
            </div>
            <Toggle checked={pref.enabled} onChange={() => toggle(pref.id)} label={pref.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
