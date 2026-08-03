"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronDown } from "lucide-react";
import type { EligibilityCriteria, Scheme } from "@/types/schemes";

interface EligibilityCheckerProps {
  onSubmit?: (criteria: EligibilityCriteria, matchCount: number) => void;
  schemes?: Scheme[];
}

const fields: { id: keyof EligibilityCriteria; label: string; options: string[] }[] = [
  { id: "state", label: "State", options: ["Gujarat"] },
  { id: "district", label: "District", options: [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", 
    "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", 
    "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", 
    "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", 
    "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", 
    "Tapi", "Vadodara", "Valsad"
  ] },
  { id: "farmerType", label: "Farmer Type", options: ["Small & Marginal", "Large Landholder", "Tenant Farmer", "Tribal Farmer"] },
  { id: "landSize", label: "Land Size", options: ["< 1 Hectare", "1-2 Hectares", "2-5 Hectares", "5+ Hectares"] },
  { id: "cropType", label: "Crop Type", options: [
    "Wheat", "Rice", "Sugarcane", "Cotton", "Groundnut", "Soybean", 
    "Maize", "Millets (Bajra/Jowar)", "Pulses", "Mustard", "Castor", 
    "Jute", "Tea", "Coffee", "Rubber", "Spices", "Fruits (Mango/Banana)", "Vegetables"
  ] },
  { id: "annualIncome", label: "Annual Income", options: ["< ₹2 Lakh", "₹2-5 Lakh", "₹5+ Lakh"] },
  { id: "category", label: "Category", options: ["General", "OBC", "SC", "ST"] },
  { id: "gender", label: "Gender", options: ["Male", "Female", "Other"] },
];

export default function EligibilityChecker({
  onSubmit,
  schemes = [],
}: EligibilityCheckerProps) {
  const [result, setResult] = useState<number | null>(null);
  const [matchedSchemesList, setMatchedSchemesList] = useState<Scheme[] | null>(null);
  const [criteria, setCriteria] = useState<Partial<EligibilityCriteria>>({});
  const [checking, setChecking] = useState(false);

  const handleSubmit = () => {
    setChecking(true);
    
    // Simulate API delay and perform matching logic against real schemes
    setTimeout(() => {
      let matchedSchemes = schemes.filter(s => s.status !== "closed");

      if (criteria.state) {
        matchedSchemes = matchedSchemes.filter(s => !s.state || s.state.toLowerCase() === criteria.state?.toLowerCase());
      }

      // Fuzzy filtering for realism based on real data
      if (criteria.landSize === "> 5 Hectares") {
        // Exclude schemes meant for small/marginal farmers
        matchedSchemes = matchedSchemes.filter(s => !s.eligibilitySummary.toLowerCase().includes("marginal"));
      }
      
      if (criteria.annualIncome === "₹5+ Lakh") {
        // High income might disqualify some strict income support schemes
        matchedSchemes = matchedSchemes.filter(s => s.categoryId !== "income" || s.eligibilitySummary.toLowerCase().includes("all"));
      }

      const count = matchedSchemes.length;
      
      setChecking(false);
      setResult(count);
      setMatchedSchemesList(matchedSchemes);
      onSubmit?.(criteria as EligibilityCriteria, count);
      
      // Auto-clear input fields after checking
      setCriteria({});
    }, 1200);
  };

  const handleClearAll = () => {
    setCriteria({});
    setResult(null);
    setMatchedSchemesList(null);
  };

  return (
    <div className="bg-surface-glass backdrop-blur-xl rounded-2xl border border-outline-variant/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-secondary-container rounded-lg text-on-secondary-container">
            <ShieldCheck size={20} />
          </span>
          <h2 className="text-lg font-bold text-on-surface">Eligibility Checker</h2>
        </div>
        {(Object.keys(criteria).length > 0 || result !== null) && (
          <button 
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {fields.map((f) => (
          <div key={f.id}>
            <label htmlFor={`eligibility-${f.id}`} className="block text-xs font-medium text-on-surface-variant mb-1.5 ml-1">
              {f.label}
            </label>
            <div className="relative group">
              <select
                id={`eligibility-${f.id}`}
                value={criteria[f.id] || ""}
                onChange={(e) => setCriteria((c) => ({ ...c, [f.id]: e.target.value }))}
                className="appearance-none w-full pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-[13px] md:text-sm outline-none cursor-pointer transition-all hover:bg-surface-container-low font-semibold text-on-surface"
              >
                <option value="">Select {f.label}</option>
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none group-hover:text-primary transition-colors" 
                size={18} 
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={checking}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 shadow-sm"
      >
        {checking ? "Checking Eligibility..." : "Check Eligible Schemes"}
      </button>

      <AnimatePresence>
        {result !== null && !checking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-4 bg-success-soft border border-primary/20 rounded-xl text-center mb-4">
              <p className="text-2xl font-bold text-primary">{result} Eligible Schemes</p>
              <p className="text-xs text-on-surface-variant mt-1">
                Based on the information provided. Apply now to avail benefits.
              </p>
            </div>
            
            {matchedSchemesList && matchedSchemesList.length > 0 && (
              <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                {matchedSchemesList.map(scheme => (
                  <div key={scheme.id} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-outline-variant/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={scheme.logoUrl} alt={scheme.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-sm font-bold text-on-surface truncate">{scheme.name}</h4>
                      <p className="text-[11px] text-on-surface-variant truncate">{scheme.benefit}</p>
                    </div>
                    <a 
                      href={scheme.applyUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-semibold text-primary px-3 py-1.5 bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-colors"
                    >
                      Apply
                    </a>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
