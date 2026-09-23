import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Read our clear refund and cancellation terms for marketplace transactions and premium agricultural advisory bookings.",
  alternates: {
    canonical: "https://smart-farming-india.vercel.app/refund",
  },
  openGraph: {
    title: "Refund & Cancellation Policy | Smart Farming India",
    description:
      "Read our clear refund and cancellation terms for marketplace transactions and premium agricultural advisory bookings.",
    url: "https://smart-farming-india.vercel.app/refund",
    siteName: "Smart Farming India",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Smart Farming India Refund Policy" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund & Cancellation Policy | Smart Farming India",
    description:
      "Read our clear refund and cancellation terms for marketplace transactions and premium agricultural advisory bookings.",
    images: ["/logo.jpg"],
  },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors mb-8 md:mb-10">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100"><RefreshCcw size={24} /></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Refund Policy</h1>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-100 max-w-none text-sm md:text-base text-slate-600 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-6 first:mt-0">Our 14-Day Guarantee</h2>
          <p className="mb-4">We want you to be completely satisfied with Smart Farming India's premium tier. If you are unhappy with the software for any reason, we offer a strict 14-day, no-questions-asked money-back guarantee for all digital subscriptions.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-6">Equipment Rental Cancellations</h2>
          <p className="mb-2">Because equipment rentals require physical logistics and planning by the owners, the following cancellation policy applies:</p>
          <ul className="list-disc list-inside mb-4 space-y-1.5 pl-2">
            <li><strong className="text-slate-900 font-semibold">48+ Hours Notice:</strong> 100% full refund of the rental deposit.</li>
            <li><strong className="text-slate-900 font-semibold">24-48 Hours Notice:</strong> 50% refund of the rental deposit.</li>
            <li><strong className="text-slate-900 font-semibold">Less than 24 Hours Notice:</strong> No refund on the deposit, as the equipment has already been mobilized.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-6">How to Request a Refund</h2>
          <p className="mb-4">To request a refund on a digital subscription or a valid rental cancellation, simply navigate to your Billing Dashboard and click "Request Refund", or email us directly at <a href="mailto:billing@smartfarming.in" className="text-green-600 font-semibold hover:underline">billing@smartfarming.in</a> with your Invoice ID.</p>

          <h2 className="text-lg font-bold text-slate-900 mb-2 mt-6">Processing Time</h2>
          <p>Once approved, refunds are automatically routed back to your original payment method (UPI, NetBanking, or Credit Card). Please allow 5-7 business days for the funds to reflect in your bank account.</p>
        </div>
      </div>
    </div>
  );
}
