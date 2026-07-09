import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf, Target, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-12">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">About Smart Farming India.</h1>
        <p className="text-2xl text-slate-600 mb-16 leading-relaxed max-w-3xl">
          We are on a mission to democratize enterprise-grade agricultural technology, ensuring every farmer in India has the tools to maximize yield, minimize waste, and secure a prosperous future.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6"><Target size={28} /></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              Agriculture is the backbone of India, yet millions of farmers lack access to modern technology. Our mission is to bridge this gap by providing affordable, AI-driven tools that predict diseases, optimize land usage, and connect farmers directly to fair market prices.
            </p>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Globe size={28} /></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed">
              We envision a future where climate change and supply chain inefficiencies no longer threaten the livelihood of the Indian farmer. By leveraging satellite imagery and machine learning, we are building a sustainable, data-first agricultural ecosystem.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-8">Our Journey</h2>
        <div className="max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Founded in 2024 by a team of agronomists and software engineers, Smart Farming India started as a simple SMS-based weather alert system. We quickly realized that farmers needed much more than just weather data—they needed actionable insights. 
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Today, our platform is trusted by over 50,000 farmers across 18 states. We process thousands of crop images daily through our proprietary AI models, saving crops from devastating diseases and helping farmers increase their profit margins by an average of 25%.
          </p>
        </div>
      </div>
    </div>
  );
}
