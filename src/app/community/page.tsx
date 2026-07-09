import Link from "next/link";
import { Home } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
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
        <h1 className="mb-8 text-4xl font-extrabold text-slate-900 tracking-tight">Community Forum</h1>
        
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to the Kisan Network</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">Connect with thousands of fellow farmers, agronomists, and local APMC experts. Share your experiences, ask questions about pest control, and discuss the latest crop pricing trends.</p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="border border-green-100 bg-green-50 rounded-xl p-6">
            <h3 className="font-bold text-green-800 mb-2">Regional Discussions (Gujarat)</h3>
            <p className="text-sm text-green-700">Join 15,000+ farmers discussing Cotton and Groundnut yields this Kharif season.</p>
          </div>
          <div className="border border-blue-100 bg-blue-50 rounded-xl p-6">
            <h3 className="font-bold text-blue-800 mb-2">Expert Q&A</h3>
            <p className="text-sm text-blue-700">Ask certified agricultural scientists about soil health and fertilizer usage.</p>
          </div>
        </div>
      </div>
    
      </main>
      <Footer />
    </div>
  );
}
