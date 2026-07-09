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
        <h1 className="mb-8 text-4xl font-extrabold text-slate-900 tracking-tight">Expert Agricultural Blog</h1>
        
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Latest Insights in Smart Farming</h2>
        
        <article className="mb-10 pb-10 border-b border-slate-100">
          <span className="text-sm font-semibold text-green-600 mb-2 block">Crop Management • October 2025</span>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Maximizing Cotton Yield in Drought Conditions</h3>
          <p className="text-slate-600 leading-relaxed">Learn how implementing micro-irrigation systems and drought-resistant seed varieties can protect your cotton harvest during delayed monsoons in the Saurashtra region.</p>
        </article>

        <article className="mb-10 pb-10 border-b border-slate-100">
          <span className="text-sm font-semibold text-green-600 mb-2 block">Technology • September 2025</span>
          <h3 className="text-xl font-bold text-slate-800 mb-3">How AI Disease Detection is Saving Crops</h3>
          <p className="text-slate-600 leading-relaxed">Our latest analysis shows that early detection of Pink Bollworm using the Smart Farming scanner has saved farmers up to ₹15,000 per acre in pesticide costs.</p>
        </article>
      </div>
    
      </main>
      <Footer />
    </div>
  );
}
