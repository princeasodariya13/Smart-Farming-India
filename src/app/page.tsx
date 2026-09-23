import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import FeaturesBento from "@/components/landing/FeaturesBento";
import Footer from "@/components/landing/Footer";

const ExpertBanner = dynamic(() => import("@/components/landing/ExpertBanner"));

export const metadata: Metadata = {
  title: "Smart Farming India — Digital Agriculture & Farmer Advisory Platform",
  description:
    "India's leading digital agriculture platform empowering farmers with live mandi prices, crop weather advisories, government schemes, AI crop disease detection, GPS field area calculation, and equipment rentals.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app",
  },
  openGraph: {
    title: "Smart Farming India — Digital Agriculture & Farmer Advisory Platform",
    description:
      "India's leading digital agriculture platform empowering farmers with live mandi prices, crop weather advisories, government schemes, AI crop disease detection, GPS field area calculation, and equipment rentals.",
    url: "https://smart-farming-india.vercel.app",
    siteName: "Smart Farming India",
    images: [
      {
        url: "/logo.jpg",
        width: 512,
        height: 512,
        alt: "Smart Farming India Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Farming India — Digital Agriculture & Farmer Advisory Platform",
    description:
      "India's leading digital agriculture platform empowering farmers with live mandi prices, crop weather advisories, government schemes, AI crop disease detection, GPS field area calculation, and equipment rentals.",
    images: ["/logo.jpg"],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-200">

      <Header />
      <main id="main-content" className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-12 pt-2 md:gap-16 md:px-8 md:pb-24 md:pt-4">
        <Hero />
        <FeaturesBento />
        <ExpertBanner />
      </main>
      <Footer />
    </div>
  );
}
