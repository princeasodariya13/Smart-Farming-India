import type { Metadata } from "next";
import { Inter, Hind_Vadodara } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import GoogleTranslate from "@/components/GoogleTranslate";
import { Providers } from "@/components/Providers";
import { auth } from "@/auth";
import PWAInstallBanner from "@/components/PWAInstallBanner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const hindVadodara = Hind_Vadodara({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "gujarati"],
  display: "swap",
  variable: "--font-hind",
  preload: true,
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://smart-farming-india.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Smart Farming India — Digital Agriculture & Farmer Advisory Platform",
    template: "%s | Smart Farming India",
  },
  description:
    "Smart Farming India is a complete digital agriculture platform for Indian farmers. Access real-time mandi prices, live weather advisories, government schemes, AI crop disease detection, GPS field area calculation, and agricultural equipment rentals.",
  keywords: [
    "Smart Farming India",
    "Indian farmers",
    "agriculture technology",
    "farming tools",
    "government schemes for farmers",
    "mandi market prices",
    "crop weather",
    "crop disease detection",
    "agricultural equipment rental",
    "farming information",
    "Gujarat India agriculture",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Smart Farming India — Digital Agriculture & Farmer Advisory Platform",
    description:
      "Empowering Indian farmers with live mandi prices, AI crop disease diagnosis, local weather advisories, government schemes, and equipment rentals.",
    url: "./",
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
      "Empowering Indian farmers with live mandi prices, AI crop disease diagnosis, local weather advisories, government schemes, and equipment rentals.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Smart Farming",
  },
  verification: {
    google: "jL2-mH0VIO0U4cOAVCRPIteZ1fjXh2YXo43r-kQ5NNg",
  },
};

export const viewport = {
  themeColor: "#2E7D32",
};

import JsonLd from "@/components/JsonLd";

const globalJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://smart-farming-india.vercel.app/#organization",
    name: "Smart Farming India",
    url: "https://smart-farming-india.vercel.app",
    logo: "https://smart-farming-india.vercel.app/logo.jpg",
    description:
      "Smart Farming India is a complete digital agriculture platform for Indian farmers. Access real-time mandi prices, live weather advisories, government schemes, AI crop disease detection, GPS field area calculation, and agricultural equipment rentals.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@smartfarming.in",
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["en", "gu", "hi"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://smart-farming-india.vercel.app/#website",
    name: "Smart Farming India",
    url: "https://smart-farming-india.vercel.app",
    publisher: {
      "@id": "https://smart-farming-india.vercel.app/#organization",
    },
    inLanguage: "en-IN",
  },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hindVadodara.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <JsonLd data={globalJsonLd} />
      </head>
      <body className="bg-[#F8FAF7] text-on-surface font-sans">
        <Providers session={session}>
          <GoogleTranslate />
          <SmoothScrolling>{children}</SmoothScrolling>
          <PWAInstallBanner />
        </Providers>
      </body>
    </html>
  );
}
