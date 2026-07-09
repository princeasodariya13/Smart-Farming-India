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
        <h1 className="mb-8 text-4xl font-extrabold text-slate-900 tracking-tight">Legal & Compliance</h1>
        
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Protection & IT Act Compliance</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">Smart Farming India operates in strict compliance with the Information Technology Act, 2000, and the upcoming Digital Personal Data Protection Act, 2023 of India.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 mt-8">Data Localization</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">All critical farmer data, including Aadhar references, land records, and payment histories, are stored securely on servers physically located within the sovereign borders of India. AWS data centers in Mumbai (ap-south-1) are strictly utilized for infrastructure.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 mt-8">APMC Integration & Fair Trade</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">Mandi pricing data is sourced legally and transparently via authorized government API endpoints (eNAM). We do not manipulate pricing and present raw data to ensure fair trade practices. Smart Farming India acts strictly as a data aggregator, not a market maker.</p>

        <h3 className="text-xl font-bold text-slate-800 mb-3 mt-8">Payment Card Industry (PCI DSS) Compliance</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">All transactions made on the equipment rental marketplace are processed through PCI-DSS Level 1 compliant payment gateways. Smart Farming India does not store, transmit, or process any raw credit card or banking credentials.</p>

        <h3 className="text-xl font-bold text-slate-800 mb-3 mt-8">AI Ethics and Unbiased Models</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">Our machine learning models for crop disease detection are continually audited for algorithmic bias. We adhere strictly to the NITI Aayog guidelines for Responsible AI in Agriculture, ensuring our diagnostic models work equitably across different geographical regions and farm scales.</p>

        <h3 className="text-xl font-bold text-slate-800 mb-3 mt-8">Information Security (ISO 27001)</h3>
        <p className="text-slate-600 leading-relaxed">We maintain comprehensive security protocols adhering to ISO/IEC 27001 standards. This includes routine penetration testing, mandatory employee security training, and encrypted-at-rest databases (AES-256) to protect farmer operational data.</p>
      </div>
    
      </main>
      <Footer />
    </div>
  );
}
