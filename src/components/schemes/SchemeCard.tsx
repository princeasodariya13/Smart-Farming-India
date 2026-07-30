"use client";

import { motion } from "framer-motion";
import { Bookmark, ArrowRight } from "lucide-react";
import type { Scheme } from "@/types/schemes";

interface SchemeCardProps {
  scheme: Scheme;
  onApply?: (id: string) => void;
  onLearnMore?: (id: string) => void;
  onSave?: (id: string) => void;
}

const statusStyles: Record<Scheme["status"], string> = {
  open: "bg-secondary-container text-on-secondary-container",
  closing_soon: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  closed: "bg-error-container text-error",
};

const statusLabels: Record<Scheme["status"], string> = {
  open: "Open",
  closing_soon: "Closing Soon",
  closed: "Closed",
};

export default function SchemeCard({ scheme, onApply, onLearnMore, onSave }: SchemeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="bg-surface-glass backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 flex flex-col transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none"></div>
      
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-white border border-outline-variant/30 shadow-sm overflow-hidden shrink-0 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={scheme.logoUrl} alt={`${scheme.name} logo`} className="w-full h-full object-cover rounded-xl" />
        </div>
        <div className="flex items-center gap-2.5">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${statusStyles[scheme.status]}`}>
            {statusLabels[scheme.status]}
          </span>
          <button
            type="button"
            aria-label={`${scheme.saved ? "Remove" : "Save"} ${scheme.name}`}
            onClick={() => onSave?.(scheme.id)}
            className={`p-2 rounded-full transition-all duration-300 ${scheme.saved ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary border border-outline-variant/50'}`}
          >
            <Bookmark size={16} fill={scheme.saved ? "currentColor" : "none"} strokeWidth={scheme.saved ? 2 : 2.5} />
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="font-extrabold text-[17px] text-on-surface leading-tight mb-1.5 group-hover:text-primary transition-colors">{scheme.name}</h3>
        <p className="text-[12px] font-semibold text-primary mb-3 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">account_balance</span> {scheme.ministry}
        </p>
        <p className="text-[13px] text-on-surface-variant leading-relaxed mb-5 flex-1">{scheme.description}</p>

        <div className="space-y-2.5 mb-5 text-[13px] bg-white/40 p-3 rounded-2xl border border-white/60">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-primary">payments</span> Benefit</span>
            <span className="font-extrabold text-primary">{scheme.benefit}</span>
          </div>
          <div className="w-full h-px bg-outline-variant/20"></div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-error">event</span> Deadline</span>
            <span className="font-semibold text-on-surface">{scheme.deadline}</span>
          </div>
        </div>

        <div className="text-[11px] text-on-surface-variant bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl p-3 mb-6 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40"></div>
          <span className="font-bold text-on-surface block mb-0.5">Eligibility:</span>
          {scheme.eligibilitySummary}
        </div>

        <div className="mt-auto flex gap-3">
          <button
            type="button"
            onClick={() => onApply?.(scheme.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-xl font-bold text-[13px] hover:scale-[1.02] active:scale-95 transition-all shadow-md"
          >
            Apply Now <ArrowRight size={16} strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={() => onLearnMore?.(scheme.id)}
            className="flex-1 py-3 bg-white border border-outline-variant/50 rounded-xl font-bold text-[13px] text-on-surface hover:bg-surface-container-low hover:border-primary/30 transition-all shadow-sm"
          >
            Learn More
          </button>
        </div>
      </div>
    </motion.div>
  );
}
