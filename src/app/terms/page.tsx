import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-12">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="p-4 bg-slate-200 text-slate-700 rounded-2xl"><FileText size={40} /></div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
        </div>
        
        <p className="text-slate-500 font-medium mb-12">Last Updated: October 15, 2025</p>

        <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-sm border border-slate-100 max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8 first:mt-0">1. Acceptance of Terms</h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">By accessing and using the Smart Farming India application, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">2. Description of Service</h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">Smart Farming India provides farmers with AI diagnostic tools, GPS field measurement, and market data aggregation. The Service is provided "AS IS" and we assume no responsibility for the timeliness, deletion, mis-delivery, or failure to store any user communications or personalization settings.</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">3. AI Advisory Disclaimer</h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed"><strong className="text-slate-900 font-bold">Crucial Notice:</strong> The AI Disease Detection feature is an advisory tool based on machine learning probability models. It does not replace professional agronomic advice. Smart Farming India shall not be held liable for crop loss, financial damages, or pesticide misuse resulting from reliance on the AI scanner.</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">4. User Conduct & Responsibilities</h2>
          <p className="text-lg text-slate-600 mb-4 leading-relaxed">You agree not to use the Service to:</p>
          <ul className="list-disc list-inside text-lg text-slate-600 mb-6 leading-relaxed space-y-2">
            <li>Upload any crop images that do not belong to you or infringe on third-party intellectual property.</li>
            <li>Attempt to reverse-engineer the proprietary AI models or scrape Mandi price databases.</li>
            <li>Use the equipment rental marketplace for fraudulent transactions.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">5. Modification of Terms</h2>
          <p className="text-lg text-slate-600 leading-relaxed">We reserve the right to modify these terms at any time. Your continued use of the platform following the posting of changes will mean that you accept and agree to the changes.</p>
        </div>
      </div>
    </div>
  );
}
