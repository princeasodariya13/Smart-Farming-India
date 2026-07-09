import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-12">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="p-4 bg-green-100 text-green-600 rounded-2xl"><ShieldCheck size={40} /></div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
        </div>
        
        <p className="text-slate-500 font-medium mb-12">Last Updated: October 15, 2025</p>

        <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-sm border border-slate-100 max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8 first:mt-0">1. Information We Collect</h2>
          <p className="text-lg text-slate-600 mb-4 leading-relaxed">When you use Smart Farming India, we collect information that helps us deliver our services securely and efficiently. This includes:</p>
          <ul className="list-disc list-inside text-lg text-slate-600 mb-6 leading-relaxed space-y-2">
            <li><strong className="text-slate-900 font-bold">Account Data:</strong> Name, phone number, and email address used during registration.</li>
            <li><strong className="text-slate-900 font-bold">Farm Data:</strong> GPS coordinates, total land area, and crop types which you explicitly provide to use our calculator tools.</li>
            <li><strong className="text-slate-900 font-bold">Media:</strong> Photos of crops uploaded strictly for AI disease analysis.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">2. How We Use Your Data</h2>
          <p className="text-lg text-slate-600 mb-4 leading-relaxed">Your data is utilized exclusively for the operational functionality of the platform. We use it to:</p>
          <ul className="list-disc list-inside text-lg text-slate-600 mb-6 leading-relaxed space-y-2">
            <li>Provide real-time Mandi price alerts relevant to your registered geographic location.</li>
            <li>Train our localized Machine Learning models to better identify regional crop diseases.</li>
            <li>Process payments for equipment rentals securely via Stripe/Razorpay.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">3. Third-Party Sharing</h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed"><strong className="text-slate-900 font-bold">We do not sell your personal data to marketing agencies or third-party data brokers.</strong> Data is only shared with authorized vendors (like cloud hosting providers and payment processors) under strict confidentiality agreements necessary to run the platform.</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">4. Data Retention & Deletion</h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">You maintain full ownership of your data. You may request a complete export or permanent deletion of your account and all associated farm data at any time via the user dashboard settings. Deletion requests are processed within 72 hours.</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">5. Contact Us</h2>
          <p className="text-lg text-slate-600 leading-relaxed">If you have any questions about this Privacy Policy, please contact our Data Protection Officer at <a href="mailto:privacy@smartfarming.in" className="text-green-600 font-bold hover:underline">privacy@smartfarming.in</a>.</p>
        </div>
      </div>
    </div>
  );
}
