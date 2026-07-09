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
        <h1 className="mb-8 text-4xl font-extrabold text-slate-900 tracking-tight">Government Schemes Guide</h1>
        
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">PM-KISAN Samman Nidhi</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a central sector scheme that provides an income support of ₹6,000 per year in three equal installments to all landholding farmer families.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Pradhan Mantri Fasal Bima Yojana (PMFBY)</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">PMFBY aims to provide insurance coverage and financial support to the farmers in the event of failure of any of the notified crops as a result of natural calamities, pests & diseases.</p>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">Kisan Credit Card (KCC)</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">The Kisan Credit Card scheme aims at providing adequate and timely credit support from the banking system under a single window with flexible and simplified procedure to the farmers for their cultivation and other needs.</p>
        
        <p className="text-sm text-slate-500 italic mt-8">Note: Ensure your Aadhaar is linked to your bank account and land records are digitized in your respective state portal (e.g., AnyRoR for Gujarat) to avail these benefits smoothly.</p>
      </div>
    
      </main>
      <Footer />
    </div>
  );
}
