import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Handshake, TrendingUp, Users } from 'lucide-react';

export default function PartnerNetworkPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-8 md:mb-10">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">Partner Network</h1>
        <p className="text-xl text-slate-600 mb-10 md:mb-12 leading-relaxed max-w-3xl">
          Scale your agricultural business by integrating directly with India's fastest-growing digital farming platform. Connect with 50,000+ active users instantly.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12 md:mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-5 border border-amber-100"><TrendingUp size={24} /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Equipment OEMs</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              List your tractors, harvesters, and smart irrigation systems on our Equipment Rental marketplace. Reach farmers exactly when they are planning their harvest.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 border border-blue-100"><Handshake size={24} /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Agri-Input Suppliers</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Integrate your seed, fertilizer, and pesticide inventory with our AI recommendation engine. When our AI detects a disease, it can recommend your specific product to the farmer.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-5 border border-purple-100"><Users size={24} /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Govt & NGOs</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Utilize our aggregated, anonymized crop data to plan regional subsidies, manage drought relief efforts, and distribute resources more efficiently.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-center p-8 md:p-12 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to partner with us?</h2>
          <p className="text-slate-400 text-sm md:text-base mb-6 max-w-2xl mx-auto">Our API integration team is ready to help you onboard your services to our platform in less than two weeks.</p>
          <a href="mailto:partners@smartfarming.in" className="inline-block px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl text-xs md:text-sm hover:bg-green-500 transition-colors">
            Contact Partnerships Team
          </a>
        </div>
      </div>
    </div>
  );
}
