import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Live Crop Weather & Agricultural Forecasts",
  description:
    "Real-time location weather forecasts, 5-day precipitation outlook, interactive weather radar maps, and custom agricultural advisories for Indian farmers.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/weather",
  },
  openGraph: {
    title: "Live Crop Weather & Agricultural Forecasts | Smart Farming India",
    description:
      "Real-time location weather forecasts, 5-day precipitation outlook, interactive weather radar maps, and custom agricultural advisories for Indian farmers.",
    url: "https://smart-farming-india.vercel.app/weather",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India Weather" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Crop Weather & Agricultural Forecasts | Smart Farming India",
    description:
      "Real-time location weather forecasts, 5-day precipitation outlook, interactive weather radar maps, and custom agricultural advisories for Indian farmers.",
    images: ["/logo.jpg"],
  },
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <>{children}</>;
}
