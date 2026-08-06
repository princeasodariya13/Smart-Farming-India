"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, SessionProvider } from 'next-auth/react';
import { Leaf } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import PageLoader from '@/components/PageLoader';
import NotificationSettings from "@/components/profile/NotificationSettings";
import SettingsCard from "@/components/profile/SettingsCard";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: "success" | "error" | "info" }) {
  const colors = {
    success: "bg-primary text-white",
    error: "bg-error text-white",
    info: "bg-surface-container-high text-on-surface",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-6 right-6 z-[300] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold ${colors[type]}`}
    >
      {message}
    </motion.div>
  );
}

function SettingsContent() {
  const { data: session, status } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  
  // Premium real-time state for interactive elements
  const [activeModal, setActiveModal] = useState<"language" | "delete" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("English");

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSettingsAction = (id: string) => {
    if (id === "language" || id === "delete") {
      setActiveModal(id);
    } else {
      showToast(`${id.charAt(0).toUpperCase() + id.slice(1)} settings — coming soon`, "info");
    }
  };

  const handleLanguageSelect = (lang: string) => {
    setIsProcessing(true);
    // Simulate real-time API call for saving language preference
    setTimeout(() => {
      setCurrentLanguage(lang);
      setIsProcessing(false);
      setActiveModal(null);
      showToast(`Language successfully changed to ${lang.split(" ")[0]}`, "success");
    }, 800);
  };

  const handleDeleteAccount = () => {
    setIsProcessing(true);
    // Simulate critical system operation
    setTimeout(() => {
      setIsProcessing(false);
      setActiveModal(null);
      signOut({ callbackUrl: "/" });
    }, 1500);
  };

  const handleLogout = () => signOut({ callbackUrl: "/" });

  if (status === "loading") {
    return <PageLoader />;
  }

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
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-6 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-on-surface">Platform Settings</h1>
              <p className="text-sm text-on-surface-variant mt-1">Manage your notification preferences and account security.</p>
            </div>
            
            {/* Real-time Notification Toggles */}
            <NotificationSettings />
            
            {/* Interactive Settings Card */}
            <SettingsCard
              settings={[
                { id: "language", label: "Language", value: currentLanguage, icon: "language" },
                { id: "delete", label: "Delete Account", value: "Permanently remove account", icon: "delete", destructive: true },
              ]}
              onAction={handleSettingsAction}
              onLogout={handleLogout}
            />
          </div>
          
          <footer className="w-full py-6 flex flex-col md:flex-row justify-between items-center border-t border-outline-variant mt-12 max-w-4xl mx-auto">
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

      {/* ── Premium Modals ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === "language" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-outline-variant/50 relative overflow-hidden"
            >
              {isProcessing && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <h3 className="text-xl font-bold text-on-surface mb-2">Select Language</h3>
              <p className="text-on-surface-variant text-sm mb-6">Choose your preferred language for the interface.</p>
              
              <div className="space-y-3 mb-6">
                {["English", "हिंदी (Hindi)", "ગુજરાતી (Gujarati)"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      currentLanguage === lang || currentLanguage === lang.split(" ")[0]
                        ? "border-primary bg-primary/5 font-bold text-primary"
                        : "border-outline-variant/40 hover:border-primary/50 text-on-surface font-medium"
                    }`}
                  >
                    <span>{lang}</span>
                    {(currentLanguage === lang || currentLanguage === lang.split(" ")[0]) && (
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeModal === "delete" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-error/20 relative overflow-hidden"
            >
              {isProcessing && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-4 border-error border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined font-bold">warning</span>
              </div>
              
              <h3 className="text-xl font-bold text-on-surface mb-2">Delete Account</h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                This action is permanent and cannot be undone. All your farm data, history, and community posts will be erased.
              </p>
              
              <div className="mb-6">
                <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface focus:outline-none focus:border-error focus:ring-1 focus:ring-error transition-all font-mono"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setDeleteConfirmText("");
                  }}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isProcessing || deleteConfirmText !== "DELETE"}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-error text-white hover:bg-error/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Permanently Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && <Toast key={toast.message} message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <SessionProvider>
      <SettingsContent />
    </SessionProvider>
  );
}
