"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, Users, Landmark, AlertCircle, Briefcase, ChevronRight } from "lucide-react";
import type { Scheme } from "@/types/schemes";
import Image from "next/image";

interface SchemeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: Scheme | null;
  onApply: (id: string) => void;
}

export default function SchemeDetailsModal({ isOpen, onClose, scheme, onApply }: SchemeDetailsModalProps) {
  if (!scheme) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
          />
          <motion.div
            initial={{ opacity: 0, y: "100%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[1000] w-full md:w-[600px] max-h-[90vh] bg-surface-glass backdrop-blur-xl border border-white/20 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-outline-variant/30 flex items-start gap-4 shrink-0 bg-gradient-to-b from-white/40 to-transparent">
              <div className="w-16 h-16 rounded-2xl bg-white border border-outline-variant/30 shadow-sm overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={scheme.logoUrl} alt={`${scheme.name} logo`} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                    scheme.status === "open" ? "bg-secondary-container text-on-secondary-container" :
                    scheme.status === "closing_soon" ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" :
                    "bg-error-container text-error"
                  }`}>
                    {scheme.status === "open" ? "Open" : scheme.status === "closing_soon" ? "Closing Soon" : "Closed"}
                  </span>
                </div>
                <h2 className="font-extrabold text-xl text-on-surface leading-tight mb-1">{scheme.name}</h2>
                <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <Landmark size={14} /> {scheme.ministry}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              <div>
                <h3 className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
                  <AlertCircle size={16} className="text-primary" /> About the Scheme
                </h3>
                <p className="text-[13px] text-on-surface-variant leading-relaxed">
                  {scheme.description}
                  {" This scheme is designed to empower farmers and boost agricultural productivity by providing direct financial or structural support."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest/50 border border-outline-variant/30 p-4 rounded-2xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40"></div>
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-on-surface-variant">Benefit Amount</span>
                  </div>
                  <p className="font-extrabold text-base text-primary pl-6">{scheme.benefit}</p>
                </div>
                
                <div className="bg-surface-container-lowest/50 border border-outline-variant/30 p-4 rounded-2xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-error/40"></div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} className="text-error" />
                    <span className="text-xs font-semibold text-on-surface-variant">Deadline</span>
                  </div>
                  <p className="font-bold text-sm text-on-surface pl-6">{scheme.deadline}</p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                  <Users size={16} className="text-primary" /> Eligibility Criteria
                </h3>
                <ul className="space-y-2.5">
                  <li className="text-[13px] text-on-surface-variant flex items-start gap-2">
                    <ChevronRight size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{scheme.eligibilitySummary}</span>
                  </li>
                  <li className="text-[13px] text-on-surface-variant flex items-start gap-2">
                    <ChevronRight size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>Must be a permanent resident of {scheme.state || "the state"}.</span>
                  </li>
                  <li className="text-[13px] text-on-surface-variant flex items-start gap-2">
                    <ChevronRight size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>Must possess an active Aadhar card linked to a bank account.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-outline-variant/30 bg-surface-container-lowest shrink-0">
              <button
                onClick={() => {
                  onApply(scheme.id);
                  onClose();
                }}
                disabled={scheme.status === "closed"}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {scheme.status === "closed" ? "Application Closed" : "Start Application Now"}
                {scheme.status !== "closed" && <ExternalLink size={18} strokeWidth={2.5} />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
