import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Expert Agricultural Blog & Smart Farming Insights",
  description:
    "Read practical guides on crop management, drought management, AI disease detection, and modern agricultural innovations for Indian farmers.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/blog",
  },
  openGraph: {
    title: "Expert Agricultural Blog & Smart Farming Insights | Smart Farming India",
    description:
      "Read practical guides on crop management, drought management, AI disease detection, and modern agricultural innovations for Indian farmers.",
    url: "https://smart-farming-india.vercel.app/blog",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India Blog" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expert Agricultural Blog & Smart Farming Insights | Smart Farming India",
    description:
      "Read practical guides on crop management, drought management, AI disease detection, and modern agricultural innovations for Indian farmers.",
    images: ["/logo.jpg"],
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://smart-farming-india.vercel.app/blog#blog",
  url: "https://smart-farming-india.vercel.app/blog",
  name: "Expert Agricultural Blog | Smart Farming India",
  description: "Latest insights in smart farming, crop management, and agricultural technology.",
  publisher: {
    "@id": "https://smart-farming-india.vercel.app/#organization",
  },
  blogPost: [
    {
      "@type": "BlogPosting",
      headline: "Maximizing Cotton Yield in Drought Conditions",
      description:
        "Learn how implementing micro-irrigation systems and drought-resistant seed varieties can protect your cotton harvest during delayed monsoons in the Saurashtra region.",
      datePublished: "2025-10-01",
      articleSection: "Crop Management",
      url: "https://smart-farming-india.vercel.app/blog",
      publisher: {
        "@id": "https://smart-farming-india.vercel.app/#organization",
      },
    },
    {
      "@type": "BlogPosting",
      headline: "How AI Disease Detection is Saving Crops",
      description:
        "Our latest analysis shows that early detection of Pink Bollworm using the Smart Farming scanner has saved farmers up to ₹15,000 per acre in pesticide costs.",
      datePublished: "2025-09-01",
      articleSection: "Technology",
      url: "https://smart-farming-india.vercel.app/blog",
      publisher: {
        "@id": "https://smart-farming-india.vercel.app/#organization",
      },
    },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <JsonLd data={blogJsonLd} />
      {/* Home Icon for auto-redirect */}
      <Link 
        href="/" 
        className="fixed top-24 left-6 p-3 bg-white/90 hover:bg-white rounded-full shadow-md backdrop-blur-sm transition-all border border-green-200 text-green-700 hover:text-green-800 z-50 flex items-center justify-center group"
        aria-label="Back to Home"
      >
        <Home size={24} className="group-hover:scale-110 transition-transform" />
      </Link>

      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24 pt-32">
        <h1 className="mb-8 text-4xl font-extrabold text-slate-900 tracking-tight">Expert Agricultural Blog</h1>
        
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Latest Insights in Smart Farming</h2>
        
        <article className="mb-10 pb-10 border-b border-slate-100">
          <span className="text-sm font-semibold text-green-600 mb-2 block">Crop Management • October 2025</span>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Maximizing Cotton Yield in Drought Conditions</h3>
          <p className="text-slate-600 leading-relaxed mb-3">Learn how implementing micro-irrigation systems and drought-resistant seed varieties can protect your cotton harvest during delayed monsoons in the Saurashtra region.</p>
          <Link href="/weather" className="inline-block text-sm font-bold text-green-700 hover:underline">Track Weather Radar & Irrigation Forecasts →</Link>
        </article>

        <article className="mb-10 pb-10 border-b border-slate-100">
          <span className="text-sm font-semibold text-green-600 mb-2 block">Technology • September 2025</span>
          <h3 className="text-xl font-bold text-slate-800 mb-3">How AI Disease Detection is Saving Crops</h3>
          <p className="text-slate-600 leading-relaxed mb-3">Our latest analysis shows that early detection of Pink Bollworm using the Smart Farming scanner has saved farmers up to ₹15,000 per acre in pesticide costs.</p>
          <Link href="/disease-detection" className="inline-block text-sm font-bold text-green-700 hover:underline">Try AI Crop Disease Scanner →</Link>
        </article>

        <article className="mb-4">
          <span className="text-sm font-semibold text-green-600 mb-2 block">Government Subsidies & Markets • August 2025</span>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Navigating PM-Kisan & APMC Mandi Rates</h3>
          <p className="text-slate-600 leading-relaxed mb-3">Discover step-by-step guides on applying for DBT subsidies and tracking real-time mandi prices across 1,000+ APMCs in India.</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link href="/schemes" className="text-sm font-bold text-green-700 hover:underline">Explore Govt Schemes →</Link>
            <Link href="/market" className="text-sm font-bold text-green-700 hover:underline">Check Mandi Rates →</Link>
          </div>
        </article>
      </div>
    
      </main>
      <Footer />
    </div>
  );
}
