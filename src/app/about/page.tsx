import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf, Target, Users, Globe } from 'lucide-react';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "About Smart Farming India — Our Mission & Vision",
  description:
    "Empowering over 50,000 Indian farmers with AI-driven technology, real-time market data, and sustainable agricultural tools.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/about",
  },
  openGraph: {
    title: "About Smart Farming India — Our Mission & Vision",
    description:
      "Empowering over 50,000 Indian farmers with AI-driven technology, real-time market data, and sustainable agricultural tools.",
    url: "https://smart-farming-india.vercel.app/about",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "About Smart Farming India" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Smart Farming India — Our Mission & Vision",
    description:
      "Empowering over 50,000 Indian farmers with AI-driven technology, real-time market data, and sustainable agricultural tools.",
    images: ["/logo.jpg"],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://smart-farming-india.vercel.app/about#webpage",
  url: "https://smart-farming-india.vercel.app/about",
  name: "About Smart Farming India",
  description:
    "Smart Farming India is on a mission to democratize enterprise-grade agricultural technology, ensuring every farmer in India has the tools to maximize yield, minimize waste, and secure a prosperous future.",
  mainEntity: {
    "@id": "https://smart-farming-india.vercel.app/#organization",
  },
};

export default function AboutPage() {
  return (
    <div className="h-screen overflow-y-auto custom-scrollbar bg-slate-50/50 font-sans relative" data-lenis-prevent>
      <JsonLd data={aboutJsonLd} />
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-8 md:mb-10">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">About Smart Farming India.</h1>
        <p className="text-xl text-slate-600 mb-10 md:mb-12 leading-relaxed max-w-3xl">
          We are on a mission to democratize enterprise-grade agricultural technology, ensuring every farmer in India has real-time AI tools to maximize crop yield, minimize input costs, and secure fair market prices.
        </p>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-5 border border-green-100"><Target size={24} /></div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Agriculture supports over half of India's population, yet access to precision technology remains fragmented. Our mission is to bridge this gap with affordable, AI-driven tools that detect crop diseases, forecast hyper-local weather, calculate plot boundaries, and connect farmers directly to APMC mandi rates.
            </p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 border border-blue-100"><Globe size={24} /></div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              We envision an interconnected agricultural ecosystem where climate volatility, pest outbreaks, and price opacity no longer threaten the livelihood of Indian farmers. By combining satellite GIS, machine learning, and community intelligence, we build a resilient, data-first future for Indian farming.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">Empowering Farmers Across India</h2>
        <div className="max-w-none space-y-4 text-sm md:text-base text-slate-600 leading-relaxed">
          <p>
            Founded by agronomists and software engineers, Smart Farming India started as a localized SMS alert service for regional weather and Mandi rates. Recognizing the broader challenges faced by smallholders, we expanded into an end-to-end digital farming platform.
          </p>
          <p>
            Today, our platform serves farmers across multiple agricultural states, offering computer vision diagnostic scanners, government scheme eligibility tools, tractor &amp; equipment rental networks, and direct peer-to-peer knowledge sharing.
          </p>
        </div>
      </div>
    </div>
  );
}
