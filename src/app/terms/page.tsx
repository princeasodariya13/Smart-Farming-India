import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Home } from 'lucide-react';
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
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
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl border border-slate-200/60"><FileText size={24} /></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
        </div>
        
        <p className="text-xs font-semibold text-slate-400 mb-8">Last Updated: October 15, 2025</p>

        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-100 max-w-none text-sm md:text-base text-slate-600 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-6 first:mt-0">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing and using the Smart Farming India application, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">2. User Accounts & Registration</h2>
          <p className="mb-4">To access certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">3. Description of Service</h2>
          <p className="mb-4">Smart Farming India provides farmers with AI diagnostic tools, GPS field measurement, market data aggregation, and an equipment rental marketplace. The Service is provided "AS IS" and we assume no responsibility for the timeliness, deletion, mis-delivery, or failure to store any user communications or personalization settings.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">4. AI Advisory Disclaimer</h2>
          <p className="mb-4"><strong className="text-slate-900 font-bold">Crucial Notice:</strong> The AI Disease Detection feature is an advisory tool based on machine learning probability models. It does not replace professional agronomic advice. Smart Farming India shall not be held liable for crop loss, financial damages, or pesticide misuse resulting from reliance on the AI scanner.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">5. User Conduct & Responsibilities</h2>
          <p className="mb-2">You agree not to use the Service to:</p>
          <ul className="list-disc list-inside mb-4 space-y-1.5 pl-2">
            <li>Upload any crop images that do not belong to you or infringe on third-party intellectual property.</li>
            <li>Attempt to reverse-engineer the proprietary AI models or scrape Mandi price databases.</li>
            <li>Use the equipment rental marketplace for fraudulent transactions or money laundering.</li>
            <li>Harass, abuse, or harm another person in the Community Forums.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">6. Payments and Subscriptions</h2>
          <p className="mb-4">If you use our platform for equipment rentals or premium API access, you agree to pay all applicable fees. All payments are processed through secure third-party gateways. Smart Farming India is not responsible for any additional charges levied by your bank or credit card provider.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">7. Limitation of Liability</h2>
          <p className="mb-4">In no event shall Smart Farming India, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">8. Governing Law</h2>
          <p className="mb-4">These Terms shall be governed and construed in accordance with the laws of India, specifically the jurisdiction of the courts in Ahmedabad, Gujarat, without regard to its conflict of law provisions.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-8">9. Modification of Terms</h2>
          <p>We reserve the right to modify these terms at any time. Your continued use of the platform following the posting of changes will mean that you accept and agree to the changes.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
