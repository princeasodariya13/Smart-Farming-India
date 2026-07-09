import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf, Target, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-8 md:mb-10">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">About Smart Farming India.</h1>
        <p className="text-xl text-slate-600 mb-10 md:mb-12 leading-relaxed max-w-3xl">
          We are on a mission to democratize enterprise-grade agricultural technology, ensuring every farmer in India has the tools to maximize yield, minimize waste, and secure a prosperous future.
        </p>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-5 border border-green-100"><Target size={24} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Agriculture is the backbone of India, yet millions of farmers lack access to modern technology. Our mission is to bridge this gap by providing affordable, AI-driven tools that predict diseases, optimize land usage, and connect farmers directly to fair market prices.
            </p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 border border-blue-100"><Globe size={24} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              We envision a future where climate change and supply chain inefficiencies no longer threaten the livelihood of the Indian farmer. By leveraging satellite imagery and machine learning, we are building a sustainable, data-first agricultural ecosystem.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Journey</h2>
        <div className="max-w-none space-y-4 text-sm md:text-base text-slate-600 leading-relaxed">
          <p>
            Founded in 2024 by a team of agronomists and software engineers, Smart Farming India started as a simple SMS-based weather alert system. We quickly realized that farmers needed much more than just weather data—they needed actionable insights. 
          </p>
          <p>
            Today, our platform is trusted by over 50,000 farmers across 18 states. We process thousands of crop images daily through our proprietary AI models, saving crops from devastating diseases and helping farmers increase their profit margins by an average of 25%.
          </p>
        </div>
      </div>
    </div>
  );
}
