"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Globe, Leaf, User, Menu, X, LayoutDashboard, LogOut } from "lucide-react";

const NAV_LINKS = [
  { label: "Marketplace", href: "/#marketplace", current: true },
  { label: "Schemes", href: "/#schemes", current: false },
  { label: "Community", href: "/#community", current: false },
  { label: "Analytics", href: "/#analytics", current: false },
];

export default function Header() {
  const { data: session } = useSession();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read current lang from cookie
    const cookieLang = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (cookieLang && cookieLang[1]) {
      setCurrentLang(cookieLang[1]);
    }

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (lang: string) => {
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/`;
    window.location.reload();
  };

  const pathname = usePathname();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a hash link for the home page
    if (href.startsWith('/#')) {
      if (pathname === '/') {
        // If we're already on the home page, smoothly scroll to it
        e.preventDefault();
        const targetId = href.replace('/#', '');
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 80; // Account for sticky header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          setMobileMenuOpen(false); // Close mobile menu after clicking
        }
      } else {
        // If we are on another page (like /privacy), let Next.js navigate normally
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8 relative"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-green-600 text-white transition-colors">
              <Leaf size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Smart Farming<span className="text-green-500">.</span>
            </span>
          </Link>
          <ul className="hidden gap-6 md:flex">
            {!session && NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  aria-current={link.current ? "page" : undefined}
                  className={
                    link.current
                      ? "border-b-2 border-green-600 pb-1 text-sm font-bold text-green-700"
                      : "text-sm text-slate-600 transition-colors hover:text-green-700"
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 md:gap-4 relative" ref={dropdownRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              aria-label="Change language"
              className="rounded-full p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-green-700 flex items-center gap-1"
            >
              <Globe size={20} />
              <span className="text-xs font-bold uppercase hidden sm:inline-block">{currentLang}</span>
            </button>
            
            {langDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg overflow-hidden">
                <button
                  onClick={() => switchLanguage('en')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${currentLang === 'en' ? 'bg-green-50 text-green-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  English
                </button>
                <button
                  onClick={() => switchLanguage('gu')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${currentLang === 'gu' ? 'bg-green-50 text-green-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  ગુજરાતી
                </button>
              </div>
            )}
          </div>
          
          {session ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/dashboard"
                className="h-9 flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 text-sm font-semibold text-white transition-all hover:bg-green-700"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="h-9 flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex h-9 items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-600 transition-all hover:border-green-500 hover:text-green-700"
            >
              <User size={16} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {!session && NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-base font-semibold text-slate-700 py-2 border-b border-slate-100"
            >
              {link.label}
            </a>
          ))}
          {session ? (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                href="/dashboard"
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-bold text-white transition-all hover:bg-green-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 text-sm font-bold text-red-600 transition-all hover:bg-red-100"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-bold text-white transition-all hover:bg-green-700 mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
