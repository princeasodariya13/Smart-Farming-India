import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Clock } from 'lucide-react';

export default function CareersPage() {
  const jobs = [
    { title: "Senior AI/ML Engineer", dept: "Engineering", location: "Bengaluru (Hybrid)", type: "Full-time" },
    { title: "Lead Agronomy Specialist", dept: "Agriculture", location: "Pune (On-site)", type: "Full-time" },
    { title: "Product Marketing Manager", dept: "Marketing", location: "Remote", type: "Full-time" },
    { title: "Customer Success Representative", dept: "Support", location: "Remote", type: "Contract" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-8 md:mb-10">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">Join the Revolution.</h1>
        <p className="text-xl text-slate-600 mb-10 md:mb-12 leading-relaxed max-w-3xl">
          We are looking for passionate builders, thinkers, and innovators to help us modernize one of the oldest and most important industries in the world.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions</h2>
        <div className="grid gap-4 md:gap-5">
          {jobs.map((job) => (
            <div key={job.title} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow cursor-pointer group">
              <div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1 block">{job.dept}</span>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">{job.title}</h3>
                <div className="flex gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {job.type}</span>
                </div>
              </div>
              <button className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-green-600 transition-colors w-full md:w-auto">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 bg-green-50/50 p-6 md:p-8 rounded-2xl border border-green-100">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3">Don't see a fit?</h2>
          <p className="text-sm text-slate-600 mb-4">We are always looking for exceptional talent. Send your resume and a brief intro to <a href="mailto:careers@smartfarming.in" className="text-green-600 font-bold underline">careers@smartfarming.in</a>.</p>
        </div>
      </div>
    </div>
  );
}
