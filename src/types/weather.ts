import type { LucideIcon } from "lucide-react";

export type TrendDirection = "up" | "down" | "flat";
export type AlertSeverity = "low" | "moderate" | "high" | "severe";
export type RiskLevel = "low" | "moderate" | "high";

export interface WeatherLocation {
  city: string;
  state: string;
  lastUpdated: string;
}

export interface CurrentWeather {
  location: WeatherLocation;
  temperatureC: number;
  feelsLikeC: number;
  highC: number;
  lowC: number;
  condition: string;
  icon: LucideIcon;
}

export interface WeatherMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: TrendDirection;
  trendValue?: string;
  status?: { label: string; tone: "primary" | "warning" | "danger" | "info" };
}

export interface HourlyForecastItem {
  time: string;
  icon: LucideIcon;
  temperatureC: number;
  rainChance: number;
  windKmh: number;
}

export interface DailyForecastItem {
  day: string;
  icon: LucideIcon;
  highC: number;
  lowC: number;
  rainChance: number;
}

export interface RainfallDataPoint {
  label: string;
  actualMm: number | null;
  forecastMm: number | null;
}

export interface FarmingAdvisory {
  irrigation: string;
  spraying: string;
  fertilizer: string;
  harvest: string;
  pestRisk: RiskLevel;
  diseaseRisk: RiskLevel;
}

export interface WeatherAlert {
  id: string;
  type: "Heavy Rain" | "Heatwave" | "Strong Wind" | "Frost" | "Storm";
  severity: AlertSeverity;
  description: string;
  timestamp: string;
  actionLabel?: string;
}

export interface CropWeatherImpact {
  cropName: string;
  impact: string;
  riskLevel: RiskLevel;
  recommendedAction: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}
