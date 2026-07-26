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
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-outline-variant/60 shadow-sm p-6 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-surface-container-low overflow-hidden shrink-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={scheme.logoUrl} alt={`${scheme.name} logo`} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusStyles[scheme.status]}`}>
            {statusLabels[scheme.status]}
          </span>
          <button
            type="button"
            aria-label={`${scheme.saved ? "Remove" : "Save"} ${scheme.name}`}
            onClick={() => onSave?.(scheme.id)}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <Bookmark size={18} fill={scheme.saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <h3 className="font-bold text-lg text-on-surface mb-1">{scheme.name}</h3>
      <p className="text-xs text-on-surface-variant mb-3">{scheme.ministry}</p>
      <p className="text-sm text-on-surface-variant mb-4">{scheme.description}</p>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Benefit</span>
          <span className="font-semibold text-primary">{scheme.benefit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Deadline</span>
          <span className="font-medium">{scheme.deadline}</span>
        </div>
      </div>

      <p className="text-xs text-on-surface-variant bg-surface-container-low rounded-lg p-3 mb-5">
        {scheme.eligibilitySummary}
      </p>

      <div className="mt-auto flex gap-2">
        <button
          type="button"
          onClick={() => onApply?.(scheme.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
        >
          Apply Now <ArrowRight size={15} />
        </button>
        <button
          type="button"
          onClick={() => onLearnMore?.(scheme.id)}
          className="flex-1 py-2.5 bg-white border border-outline-variant rounded-xl font-semibold text-sm hover:bg-surface-container-low transition-colors"
        >
          Learn More
        </button>
      </div>
    </motion.div>
  );
}
