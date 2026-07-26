"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { EligibilityCriteria } from "@/types/schemes";

interface EligibilityCheckerProps {
  onSubmit?: (criteria: EligibilityCriteria) => void;
  eligibleCount?: number;
}

const fields: { id: keyof EligibilityCriteria; label: string; options: string[] }[] = [
  { id: "state", label: "State", options: ["Gujarat"] },
  { id: "district", label: "District", options: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"] },
  { id: "farmerType", label: "Farmer Type", options: ["Small & Marginal", "Large Landholder", "Tenant Farmer", "Tribal Farmer"] },
  { id: "landSize", label: "Land Size", options: ["< 1 Hectare", "1-2 Hectares", "2-5 Hectares", "5+ Hectares"] },
  { id: "cropType", label: "Crop Type", options: ["Wheat", "Rice", "Sugarcane", "Cotton", "Groundnut", "Soybean"] },
  { id: "annualIncome", label: "Annual Income", options: ["< ₹2 Lakh", "₹2-5 Lakh", "₹5+ Lakh"] },
  { id: "category", label: "Category", options: ["General", "OBC", "SC", "ST"] },
  { id: "gender", label: "Gender", options: ["Male", "Female", "Other"] },
];

export default function EligibilityChecker({
  onSubmit,
  eligibleCount = 14,
}: EligibilityCheckerProps) {
  const [result, setResult] = useState<number | null>(null);
  const [criteria, setCriteria] = useState<Partial<EligibilityCriteria>>({});
  const [checking, setChecking] = useState(false);

  const handleSubmit = () => {
    setChecking(true);
    onSubmit?.(criteria as EligibilityCriteria);
    setTimeout(() => {
      setChecking(false);
      setResult(eligibleCount);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2 bg-secondary-container rounded-lg text-on-secondary-container">
          <ShieldCheck size={20} />
        </span>
        <h2 className="text-lg font-bold text-on-surface">Eligibility Checker</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {fields.map((f) => (
          <div key={f.id}>
            <label htmlFor={`eligibility-${f.id}`} className="block text-xs font-medium text-on-surface-variant mb-1.5">
              {f.label}
            </label>
            <select
              id={`eligibility-${f.id}`}
              onChange={(e) => setCriteria((c) => ({ ...c, [f.id]: e.target.value }))}
              className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select {f.label}</option>
              {f.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={checking}
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:scale-[1.01] active:scale-95 transition-transform disabled:opacity-70"
      >
        {checking ? "Checking Eligibility..." : "Check Eligible Schemes"}
      </button>

      <AnimatePresence>
        {result !== null && !checking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-success-soft border border-primary/20 rounded-xl text-center"
          >
            <p className="text-2xl font-bold text-primary">{result} Eligible Schemes</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Based on the information provided. Apply now to avail benefits.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
