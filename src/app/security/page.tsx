import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Server, Fingerprint } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-12">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">Enterprise Security.</h1>
        <p className="text-2xl text-slate-600 mb-16 leading-relaxed max-w-3xl">
          Your farm's operational data is your most valuable asset. We treat it with the highest levels of digital security available in the industry.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Lock size={32} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">AES-256 Encryption</h3>
            <p className="text-slate-600">All data at rest in our databases and all data in transit is encrypted using military-grade AES-256 and TLS 1.3 protocols.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 mx-auto bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Server size={32} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">ISO 27001 Certified</h3>
            <p className="text-slate-600">Our core infrastructure is hosted on AWS and Vercel, utilizing data centers that maintain strict SOC2 and ISO 27001 compliance.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 mx-auto bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6"><Fingerprint size={32} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Strict Access Control</h3>
            <p className="text-slate-600">We enforce strict Role-Based Access Control (RBAC). Only you can access your farm's GPS history and financial projections.</p>
          </div>
        </div>

        <div className="bg-slate-900 p-10 md:p-16 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-3xl font-black mb-4">Found a vulnerability?</h2>
            <p className="text-slate-400 max-w-xl">We actively run a bug bounty program. If you are a security researcher and have discovered a flaw in our system, please report it immediately.</p>
          </div>
          <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors whitespace-nowrap">
            View Bug Bounty Program
          </button>
        </div>
      </div>
    </div>
  );
}
