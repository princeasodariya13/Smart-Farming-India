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
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-12">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">Join the Revolution.</h1>
        <p className="text-2xl text-slate-600 mb-16 leading-relaxed max-w-3xl">
          We are looking for passionate builders, thinkers, and innovators to help us modernize one of the oldest and most important industries in the world.
        </p>

        <h2 className="text-3xl font-black text-slate-900 mb-8">Open Positions</h2>
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.title} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div>
                <span className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2 block">{job.dept}</span>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-green-600 transition-colors">{job.title}</h3>
                <div className="flex gap-6 text-slate-500 font-medium">
                  <span className="flex items-center gap-2"><MapPin size={18} /> {job.location}</span>
                  <span className="flex items-center gap-2"><Clock size={18} /> {job.type}</span>
                </div>
              </div>
              <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-green-600 transition-colors w-full md:w-auto">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-green-50 p-10 rounded-3xl border border-green-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Don't see a fit?</h2>
          <p className="text-slate-600 mb-6">We are always looking for exceptional talent. Send your resume and a brief intro to <a href="mailto:careers@smartfarming.in" className="text-green-600 font-bold underline">careers@smartfarming.in</a>.</p>
        </div>
      </div>
    </div>
  );
}
