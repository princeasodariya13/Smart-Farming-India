"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, SessionProvider } from 'next-auth/react';
import { Leaf } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import PageLoader from '@/components/PageLoader';
import ProfileLayout from "@/components/profile/ProfileLayout";
import { Sidebar } from "@/components/layout/Sidebar";

function ProfileContent() {
  const { data: session, status } = useSession();

  

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

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
            <NotificationBell />
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
        
    <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage">
      <ProfileLayout />
      <footer className="w-full py-6 px-margin-desktop flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant mt-8">
            <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
              <h4 className="font-body-lg text-body-lg font-bold text-primary">Smart Farming India</h4>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 text-center md:text-left max-w-sm">© 2026 Smart Farming India. Empowering the roots of our nation.</p>
            </div>
            <div className="flex items-center justify-center gap-4 md:gap-8 whitespace-nowrap overflow-x-auto custom-scrollbar pb-2 md:pb-0 max-w-full">
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link>
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/terms">Terms of Service</Link>
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/contact">Contact Us</Link>
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="/about">About Us</Link>
            </div>
          </footer>
        
    </main>
    </div>
    </div>
  );
}

export default function ProfilePage() {
  
  // Loading is handled by content component

  return (
    <SessionProvider>
      <ProfileContent />
    </SessionProvider>
  );
}












