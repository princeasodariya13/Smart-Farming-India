import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-12">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl"><RefreshCcw size={40} /></div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">Refund Policy</h1>
        </div>

        <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-sm border border-slate-100 max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8 first:mt-0">Our 14-Day Guarantee</h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">We want you to be completely satisfied with Smart Farming India's premium tier. If you are unhappy with the software for any reason, we offer a strict 14-day, no-questions-asked money-back guarantee for all digital subscriptions.</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Equipment Rental Cancellations</h2>
          <p className="text-lg text-slate-600 mb-4 leading-relaxed">Because equipment rentals require physical logistics and planning by the owners, the following cancellation policy applies:</p>
          <ul className="list-disc list-inside text-lg text-slate-600 mb-6 leading-relaxed space-y-2">
            <li><strong className="text-slate-900 font-bold">48+ Hours Notice:</strong> 100% full refund of the rental deposit.</li>
            <li><strong className="text-slate-900 font-bold">24-48 Hours Notice:</strong> 50% refund of the rental deposit.</li>
            <li><strong className="text-slate-900 font-bold">Less than 24 Hours:</strong> No refund on the deposit, as the equipment has already been mobilized.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">How to Request a Refund</h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">To request a refund on a digital subscription or a valid rental cancellation, simply navigate to your Billing Dashboard and click "Request Refund", or email us directly at <a href="mailto:billing@smartfarming.in" className="text-green-600 font-bold hover:underline">billing@smartfarming.in</a> with your Invoice ID.</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Processing Time</h2>
          <p className="text-lg text-slate-600 leading-relaxed">Once approved, refunds are automatically routed back to your original payment method (UPI, NetBanking, or Credit Card). Please allow 5-7 business days for the funds to reflect in your bank account.</p>
        </div>
      </div>
    </div>
  );
}
