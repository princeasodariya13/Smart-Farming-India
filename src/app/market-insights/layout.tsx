import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Live Mandi Prices & Commodity Trends",
  description:
    "Track real-time market yard (mandi) prices, daily crop rates, and historical price trend analytics across agricultural mandis in India.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/market-insights",
  },
  openGraph: {
    title: "Live Mandi Prices & Commodity Trends | Smart Farming India",
    description:
      "Track real-time market yard (mandi) prices, daily crop rates, and historical price trend analytics across agricultural mandis in India.",
    url: "https://smart-farming-india.vercel.app/market-insights",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India Mandi Prices" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Mandi Prices & Commodity Trends | Smart Farming India",
    description:
      "Track real-time market yard (mandi) prices, daily crop rates, and historical price trend analytics across agricultural mandis in India.",
    images: ["/logo.jpg"],
  },
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <>{children}</>;
}
