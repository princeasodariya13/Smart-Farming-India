import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Home } from 'lucide-react';
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans relative">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 pt-32">
        <Link 
          href="/" 
          className="fixed top-24 left-6 p-3 bg-white/90 hover:bg-white rounded-full shadow-md backdrop-blur-sm transition-all border border-green-200 text-green-700 hover:text-green-800 z-50 flex items-center justify-center group"
          aria-label="Back to Home"
        >
          <Home size={24} className="group-hover:scale-110 transition-transform" />
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl border border-green-100"><ShieldCheck size={24} /></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        </div>
        
        <p className="text-xs font-semibold text-slate-400 mb-8">Last Updated: October 15, 2025</p>

        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-100 max-w-none text-sm md:text-base text-slate-600 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-6 first:mt-0">1. Information We Collect</h2>
          <p className="mb-2">When you use Smart Farming India, we collect information that helps us deliver our services securely and efficiently. This includes:</p>
          <ul className="list-disc list-inside mb-4 space-y-1.5 pl-2">
            <li><strong className="text-slate-900 font-semibold">Account Data:</strong> Name, phone number, and email address used during registration.</li>
            <li><strong className="text-slate-900 font-semibold">Farm Data:</strong> GPS coordinates, total land area, and crop types which you explicitly provide to use our calculator tools.</li>
            <li><strong className="text-slate-900 font-semibold">Media:</strong> Photos of crops uploaded strictly for AI disease analysis.</li>
            <li><strong className="text-slate-900 font-semibold">Usage Data:</strong> Information on how you interact with our Services, including IP addresses, device types, browser types, and access times.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">2. How We Use Your Data</h2>
          <p className="mb-2">Your data is utilized exclusively for the operational functionality of the platform. We use it to:</p>
          <ul className="list-disc list-inside mb-4 space-y-1.5 pl-2">
            <li>Provide real-time Mandi price alerts relevant to your registered geographic location.</li>
            <li>Train our localized Machine Learning models to better identify regional crop diseases.</li>
            <li>Process payments for equipment rentals securely via authorized payment gateways.</li>
            <li>Send critical administrative messages, technical notices, and security alerts.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">3. Cookies and Tracking Technologies</h2>
          <p className="mb-4">We use cookies, web beacons, and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service (like localized weather caching).</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">4. Third-Party Sharing</h2>
          <p className="mb-4"><strong className="text-slate-900 font-semibold">We do not sell your personal data to marketing agencies or third-party data brokers.</strong> Data is only shared with authorized vendors (like cloud hosting providers and payment processors) under strict confidentiality agreements necessary to run the platform. Additionally, we may disclose your data if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">5. Data Retention & Deletion</h2>
          <p className="mb-4">You maintain full ownership of your data. You may request a complete export or permanent deletion of your account and all associated farm data at any time via the user dashboard settings. We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. Deletion requests are typically processed within 72 hours.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">6. Children's Privacy</h2>
          <p className="mb-4">Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact our Data Protection Officer at <a href="mailto:privacy@smartfarming.in" className="text-green-600 font-semibold hover:underline">privacy@smartfarming.in</a> or by mail at 123 Agritech Hub, Ahmedabad, Gujarat 380015.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
