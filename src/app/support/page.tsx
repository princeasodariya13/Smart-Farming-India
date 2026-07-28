"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Leaf, Search, Phone, Mail, FileText, ChevronDown, MessageSquare, AlertCircle } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

export default function SupportPage() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (status === "loading") {
    return <PageLoader />;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  const faqs = [
    {
      question: "How do I use the GPS Area Calculator?",
      answer: "Navigate to the GPS Area Calculator from the sidebar. You can search for your location, then use the drawing tools on the map to outline your field boundaries. The area and perimeter will be calculated automatically in various units (Acres, Hectares, Bigha)."
    },
    {
      question: "Why is my weather data not updating?",
      answer: "Weather data is fetched automatically based on your saved location. Make sure you have a stable internet connection. If the issue persists, try refreshing the page or checking your location permissions in Settings."
    },
    {
      question: "How do I list my crops on the Marketplace?",
      answer: "Go to the Marketplace section and click on the 'Add Listing' button. Fill in the details of your produce including type, quantity, expected price, and upload clear images. Once submitted, it will be visible to buyers."
    },
    {
      question: "Are government schemes applicable to my region?",
      answer: "The Schemes page curates government programs based on the state registered in your profile. Ensure your profile details are up to date to see the most relevant subsidies and schemes."
    },
    {
      question: "How do I contact an agriculture expert?",
      answer: "Click the 'Consult Expert' button located at the bottom of the sidebar navigation. You can schedule a video call or chat directly with certified agronomists."
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[45] md:hidden backdrop-blur-sm" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full w-64 md:w-48 bg-surface-container-low border-r border-outline-variant p-2.5 gap-2 shadow-2xl md:shadow-none`}>
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary text-on-primary">
              <Leaf size={16} strokeWidth={2.5} />
            </div>
            <h1 className="text-[13px] font-extrabold tracking-tight text-on-surface">
              Smart Farming<span className="text-primary">.</span>
            </h1>
          </div>
          <button 
            className="md:hidden text-on-surface hover:bg-surface-container-high p-1 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        
        <nav data-lenis-prevent="true" className="flex-1 mt-2 space-y-1 overflow-y-auto custom-scrollbar">
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/dashboard">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="text-[12px] font-medium">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/gps-area-calculator">
            <span className="material-symbols-outlined text-[18px]">map</span>
            <span className="text-[12px] font-medium">GPS Area Calculator</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/weather">
            <span className="material-symbols-outlined text-[18px]">early_on</span>
            <span className="text-[12px] font-medium">Weather</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/disease-detection">
            <span className="material-symbols-outlined text-[18px]">shutter_speed</span>
            <span className="text-[12px] font-medium">Scanner</span>
          </Link>

          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/market">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span className="text-[12px] font-medium">Marketplace</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/schemes">
            <span className="material-symbols-outlined text-[18px]">article</span>
            <span className="text-[12px] font-medium">Schemes</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/community">
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span className="text-[12px] font-medium">Community</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span className="text-[12px] font-medium">Analytics</span>
          </Link>

          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/settings">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="text-[12px] font-medium">Settings</span>
          </Link>
        </nav>

        <div className="mt-auto pt-3 border-t border-outline-variant space-y-1">
          <button className="w-full mb-3 py-2.5 bg-primary text-on-primary rounded-lg text-[12px] font-bold shadow-sm active:scale-95 transition-all">
            Consult Expert
          </button>
          {/* Support Active */}
          <Link className="flex items-center gap-2 px-3 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg transition-all" href="/support">
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span className="text-[12px] font-medium">Support</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all w-full text-left">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-[12px] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-8 md:pb-0">
        {/* TopNavBar */}
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 sticky top-0 shrink-0 z-30 flex items-center justify-between px-6 w-full max-w-container-max mx-auto shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex md:hidden items-center gap-2 mr-2">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 -ml-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
              <div className="p-1 rounded-lg bg-primary text-on-primary">
                <Leaf size={14} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-extrabold tracking-tight text-on-surface">
                Smart Farming<span className="text-primary">.</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </button>
            <div className="h-6 w-px bg-outline-variant mx-1"></div>
            <div className="flex items-center gap-2 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-on-surface leading-none">{session?.user?.name || "Farmer"}</p>
              </div>
              <Link href="/profile" className="block relative cursor-pointer hover:opacity-80 transition-opacity">
                {session?.user?.image ? (
                  <Image width={32} height={32} className="w-8 h-8 rounded-full border border-outline-variant object-cover" alt="Farmer Portrait" src={session.user.image} />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-outline-variant bg-primary-container text-on-primary-container flex items-center justify-center text-[12px] font-bold tracking-wider">
                    {getInitials(session?.user?.name)}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 md:p-6 pb-24">
          <div className="max-w-container-max mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl border border-primary/10 text-center">
              <h2 className="font-headline-md text-headline-md md:text-3xl font-bold text-on-surface mb-2 tracking-tight">Help & Support</h2>
              <p className="text-on-surface-variant font-body-sm max-w-lg mb-6">Find answers to your questions, explore detailed guides, or contact our team directly for assistance.</p>
              
              <div className="relative w-full max-w-md px-4">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input 
                  type="text" 
                  placeholder="Search for topics, guides, or issues..." 
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-surface text-on-surface border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Quick Contact Cards */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-surface-glass border border-outline-variant/60 rounded-2xl p-5 hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-3">
                    <Phone size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-on-surface mb-1">Call Helpline</h3>
                  <p className="text-xs text-on-surface-variant mb-3">Available Mon-Sat, 9 AM to 6 PM IST.</p>
                  <a href="tel:18001234567" className="text-primary font-bold text-sm hover:underline">1800-123-4567</a>
                </div>

                <div className="bg-surface-glass border border-outline-variant/60 rounded-2xl p-5 hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center mb-3">
                    <Mail size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-on-surface mb-1">Email Us</h3>
                  <p className="text-xs text-on-surface-variant mb-3">Drop us an email and we will reply within 24 hours.</p>
                  <a href="mailto:support@smartfarming.in" className="text-primary font-bold text-sm hover:underline">support@smartfarming.in</a>
                </div>

                <div className="bg-surface-glass border border-outline-variant/60 rounded-2xl p-5 hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-3">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-on-surface mb-1">Documentation</h3>
                  <p className="text-xs text-on-surface-variant mb-3">Read detailed guides and API references.</p>
                  <Link href="/docs" className="text-primary font-bold text-sm hover:underline inline-block">View Docs &rarr;</Link>
                </div>
              </div>

              {/* FAQs & Contact Form */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* FAQs */}
                <div className="bg-surface-glass border border-outline-variant/60 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
                    <MessageSquare size={20} className="text-primary" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div 
                        key={index} 
                        className={`border rounded-xl transition-all ${openFaq === index ? 'border-primary/40 bg-surface' : 'border-outline-variant/50 bg-surface-container-lowest hover:bg-surface'}`}
                      >
                        <button 
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left"
                        >
                          <span className="font-bold text-[13px] text-on-surface pr-4">{faq.question}</span>
                          <ChevronDown size={18} className={`text-on-surface-variant transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          <div className="px-4 pb-4 text-[13px] text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-2 mt-1">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Report Issue Form */}
                <div className="bg-surface-glass border border-outline-variant/60 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-error" />
                    Report an Issue
                  </h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Issue Category</label>
                        <select className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50">
                          <option>Bug / Technical Glitch</option>
                          <option>Account / Billing</option>
                          <option>Feature Request</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Urgency</label>
                        <select className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50">
                          <option>Low (General Inquiry)</option>
                          <option>Medium (Feature broken)</option>
                          <option>High (Platform down)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Description</label>
                      <textarea 
                        rows={4}
                        placeholder="Please describe the issue in detail..."
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-sm">
                        Submit Ticket
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
