"use client";

import { motion } from "framer-motion";
import { FileCheck, Search, ShieldCheck, BadgeCheck, Wallet } from "lucide-react";
import type { ApplicationStage, ApplicationTrackerData } from "@/types/schemes";

interface ApplicationTrackerProps {
  data?: ApplicationTrackerData;
}

const stageOrder: ApplicationStage[] = [
  "submitted",
  "under_review",
  "verification",
  "approved",
  "benefit_released",
];

const stageIcons: Record<ApplicationStage, typeof FileCheck> = {
  submitted: FileCheck,
  under_review: Search,
  verification: ShieldCheck,
  approved: BadgeCheck,
  benefit_released: Wallet,
};

const defaultData: ApplicationTrackerData = {
  schemeName: "PM-Kisan Samman Nidhi",
  applicationId: "SFI-88291-K",
  currentStage: "approved",
  nextDisbursement: "₹2,000.00",
  stages: [
    {
      stage: "submitted",
      label: "Application Submitted",
      date: "Sep 24",
      note: "Documents uploaded and signature verified.",
    },
    { stage: "under_review", label: "Under Review", date: "Sep 25" },
    {
      stage: "verification",
      label: "Verification",
      date: "Sep 28",
      note: "District Agricultural Officer verification complete.",
    },
    { stage: "approved", label: "Approved", date: "Sep 29" },
    { stage: "benefit_released", label: "Benefit Released", note: "Expected Oct 15" },
  ],
};

export default function ApplicationTracker({ data = defaultData }: ApplicationTrackerProps) {
  const currentIndex = stageOrder.indexOf(data.currentStage);
  const progressPercent = ((currentIndex + 1) / stageOrder.length) * 100;

  return (
    <div className="bg-white rounded-2xl border-l-8 border-primary border-y border-r border-outline-variant/60 shadow-sm p-6 md:p-8 relative overflow-hidden">
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded mb-2">
              Active Application
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-on-surface">{data.schemeName}</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Application ID: #{data.applicationId}
            </p>
          </div>
          {data.nextDisbursement && (
            <div className="text-left md:text-right">
              <span className="text-xs text-on-surface-variant block">Next Disbursement</span>
              <span className="text-xl font-bold text-primary">{data.nextDisbursement}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between text-xs font-semibold text-primary mb-2">
          <span>{stageOrder[currentIndex] && data.stages[currentIndex]?.label}</span>
          <span>{Math.round(progressPercent)}% Complete</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 mb-6 rounded-full bg-outline-variant/50 overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-primary rounded-full"
          />
        </div>

        <ol className="space-y-4">
          {data.stages.map((s, i) => {
            const Icon = stageIcons[s.stage];
            const done = i <= currentIndex;
            return (
              <li key={s.stage} className="flex gap-3">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    done ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <Icon size={16} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${done ? "text-on-surface" : "text-on-surface-variant"}`}>
                      {s.label}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        done
                          ? "bg-success-soft text-primary"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {done ? (i === currentIndex ? "Current" : "Completed") : "Pending"}
                    </span>
                  </div>
                  {s.note && <p className="text-xs text-on-surface-variant mt-0.5">{s.note}</p>}
                  {s.date && <p className="text-[11px] text-on-surface-variant/70 mt-0.5">{s.date}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
