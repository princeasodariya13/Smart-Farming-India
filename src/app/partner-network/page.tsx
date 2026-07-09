import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Handshake, TrendingUp, Users } from 'lucide-react';

export default function PartnerNetworkPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-12">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">Partner Network</h1>
        <p className="text-2xl text-slate-600 mb-16 leading-relaxed max-w-3xl">
          Scale your agricultural business by integrating directly with India's fastest-growing digital farming platform. Connect with 50,000+ active users instantly.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6"><TrendingUp size={28} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Equipment OEMs</h3>
            <p className="text-slate-600 leading-relaxed">
              List your tractors, harvesters, and smart irrigation systems on our Equipment Rental marketplace. Reach farmers exactly when they are planning their harvest.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Handshake size={28} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Agri-Input Suppliers</h3>
            <p className="text-slate-600 leading-relaxed">
              Integrate your seed, fertilizer, and pesticide inventory with our AI recommendation engine. When our AI detects a disease, it can recommend your specific product to the farmer.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6"><Users size={28} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Govt & NGOs</h3>
            <p className="text-slate-600 leading-relaxed">
              Utilize our aggregated, anonymized crop data to plan regional subsidies, manage drought relief efforts, and distribute resources more efficiently.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-center p-16 rounded-[3rem] shadow-xl">
          <h2 className="text-3xl font-black text-white mb-6">Ready to partner with us?</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">Our API integration team is ready to help you onboard your services to our platform in less than two weeks.</p>
          <a href="mailto:partners@smartfarming.in" className="inline-block px-10 py-5 bg-green-500 text-white font-bold rounded-full text-lg hover:bg-green-400 hover:scale-105 transition-all">
            Contact Partnerships Team
          </a>
        </div>
      </div>
    </div>
  );
}
