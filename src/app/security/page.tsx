import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Server, Fingerprint } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-8 md:mb-10">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">Enterprise Security.</h1>
        <p className="text-xl text-slate-600 mb-10 md:mb-12 leading-relaxed max-w-3xl">
          Your farm's operational data is your most valuable asset. We treat it with the highest levels of digital security available in the industry.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12 md:mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 border border-blue-100"><Lock size={24} /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-3.5">AES-256 Encryption</h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">All data at rest in our databases and all data in transit is encrypted using military-grade AES-256 and TLS 1.3 protocols.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 mx-auto bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 border border-emerald-100"><Server size={24} /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-3.5">ISO 27001 Certified</h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">Our core infrastructure is hosted on AWS and Vercel, utilizing data centers that maintain strict SOC2 and ISO 27001 compliance.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 mx-auto bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-5 border border-purple-100"><Fingerprint size={24} /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-3.5">Strict Access Control</h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">We enforce strict Role-Based Access Control (RBAC). Only you can access your farm's GPS history and financial projections.</p>
          </div>
        </div>

        <div className="bg-slate-900 p-8 md:p-12 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-3">Found a vulnerability?</h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">We actively run a bug bounty program. If you are a security researcher and have discovered a flaw in our system, please report it immediately.</p>
          </div>
          <button className="px-5 py-2 bg-white text-slate-900 font-semibold rounded-xl text-xs md:text-sm hover:bg-slate-200 transition-colors whitespace-nowrap">
            View Bug Bounty Program
          </button>
        </div>
      </div>
    </div>
  );
}
