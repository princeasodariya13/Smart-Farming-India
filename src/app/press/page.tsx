import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Newspaper, Download } from 'lucide-react';

export default function PressPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-12">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">Press & Media</h1>
        <p className="text-2xl text-slate-600 mb-16 leading-relaxed max-w-3xl">
          The latest news, announcements, and media resources from Smart Farming India.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-8">Recent Press Releases</h2>
            <div className="space-y-6">
              {[
                { date: "Oct 12, 2025", title: "Smart Farming India crosses 50,000 active daily users." },
                { date: "Aug 04, 2025", title: "New AI Engine launched with 95% accuracy for 40+ crop diseases." },
                { date: "May 22, 2025", title: "Series A funding secured to expand drone mapping operations." }
              ].map((news, i) => (
                <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-green-500 transition-colors cursor-pointer group">
                  <span className="text-sm font-bold text-slate-400 mb-2 block">{news.date}</span>
                  <h4 className="text-lg font-bold text-slate-800 group-hover:text-green-600 transition-colors">{news.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-8">Media Assets</h2>
            <div className="bg-slate-900 p-8 rounded-3xl text-white">
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-2">Brand Guidelines & Logos</h4>
                <p className="text-slate-400 text-sm mb-4">High-resolution PNG and SVG logos, including our official color palette and typography rules.</p>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
                  <Download size={18} /> Download Brand Kit (.zip)
                </button>
              </div>
              <div className="h-px bg-white/10 w-full mb-8" />
              <div>
                <h4 className="text-xl font-bold mb-2">Media Inquiries</h4>
                <p className="text-slate-400 text-sm mb-4">For interview requests or comments, please email our PR department directly.</p>
                <a href="mailto:press@smartfarming.in" className="text-green-400 font-bold hover:underline">press@smartfarming.in</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
