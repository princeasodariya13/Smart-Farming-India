const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'src', 'app');

const pages = {
  schemes: {
    title: 'Government Schemes Guide',
    content: `
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">PM-KISAN Samman Nidhi</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a central sector scheme that provides an income support of ₹6,000 per year in three equal installments to all landholding farmer families.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Pradhan Mantri Fasal Bima Yojana (PMFBY)</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">PMFBY aims to provide insurance coverage and financial support to the farmers in the event of failure of any of the notified crops as a result of natural calamities, pests & diseases.</p>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">Kisan Credit Card (KCC)</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">The Kisan Credit Card scheme aims at providing adequate and timely credit support from the banking system under a single window with flexible and simplified procedure to the farmers for their cultivation and other needs.</p>
        
        <p className="text-sm text-slate-500 italic mt-8">Note: Ensure your Aadhaar is linked to your bank account and land records are digitized in your respective state portal (e.g., AnyRoR for Gujarat) to avail these benefits smoothly.</p>
      </div>
    `
  },
  community: {
    title: 'Community Forum',
    content: `
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
    `
  },
  blog: {
    title: 'Expert Agricultural Blog',
    content: `
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
    `
  },
  compliance: {
    title: 'Legal & Compliance',
    content: `
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Protection & IT Act Compliance</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">Smart Farming India operates in strict compliance with the Information Technology Act, 2000, and the upcoming Digital Personal Data Protection Act, 2023 of India.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 mt-8">Data Localization</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">All critical farmer data, including Aadhar references, land records, and payment histories, are stored securely on servers physically located within the sovereign borders of India.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 mt-8">APMC Integration</h3>
        <p className="text-slate-600 leading-relaxed">Mandi pricing data is sourced legally and transparently via authorized government API endpoints. We do not manipulate pricing and present raw data to ensure fair trade practices.</p>
      </div>
    `
  }
};

const template = (title, content) => `import Link from "next/link";
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
        <h1 className="mb-8 text-4xl font-extrabold text-slate-900 tracking-tight">${title}</h1>
        ${content}
      </main>
      <Footer />
    </div>
  );
}
`;

Object.keys(pages).forEach(dir => {
  const dirPath = path.join(baseDir, dir);
  const data = pages[dir];
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), template(data.title, data.content));
});
