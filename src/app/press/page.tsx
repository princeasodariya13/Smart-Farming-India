import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Newspaper, Download } from 'lucide-react';

export default function PressPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-8 md:mb-10">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">Press & Media</h1>
        <p className="text-xl text-slate-600 mb-10 md:mb-12 leading-relaxed max-w-3xl">
          The latest news, announcements, and media resources from Smart Farming India.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12 md:mb-16">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Recent Press Releases</h2>
            <div className="space-y-4">
              {[
                { date: "Oct 12, 2025", title: "Smart Farming India crosses 50,000 active daily users." },
                { date: "Aug 04, 2025", title: "New AI Engine launched with 95% accuracy for 40+ crop diseases." },
                { date: "May 22, 2025", title: "Series A funding secured to expand drone mapping operations." }
              ].map((news, i) => (
                <div key={i} className="p-5 bg-white border border-slate-100 rounded-xl hover:border-green-500 transition-colors cursor-pointer group">
                  <span className="text-xs font-bold text-slate-400 mb-1.5 block">{news.date}</span>
                  <h4 className="text-base font-bold text-slate-800 group-hover:text-green-600 transition-colors">{news.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Media Assets</h2>
            <div className="bg-slate-900 p-6 md:p-8 rounded-2xl text-white">
              <div className="mb-6 md:mb-8">
                <h4 className="text-lg font-bold mb-1.5">Brand Guidelines & Logos</h4>
                <p className="text-slate-400 text-xs md:text-sm mb-4">High-resolution PNG and SVG logos, including our official color palette and typography rules.</p>
                <button className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-colors">
                  <Download size={14} /> Download Brand Kit (.zip)
                </button>
              </div>
              <div className="h-px bg-white/10 w-full mb-6 md:mb-8" />
              <div>
                <h4 className="text-lg font-bold mb-1.5">Media Inquiries</h4>
                <p className="text-slate-400 text-xs md:text-sm mb-4">For interview requests or comments, please email our PR department directly.</p>
                <a href="mailto:press@smartfarming.in" className="text-green-400 text-sm font-semibold hover:underline">press@smartfarming.in</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
