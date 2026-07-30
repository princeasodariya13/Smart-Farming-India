"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/types/schemes";

interface FAQAccordionProps {
  items?: FAQItem[];
}

const defaultItems: FAQItem[] = [
  {
    id: "q1",
    question: "How do I apply for a government scheme?",
    answer:
      "Select a scheme, click Apply Now, and complete the online application form with your personal, land, and bank details. Upload the required documents to submit.",
  },
  {
    id: "q2",
    question: "What is the eligibility criteria?",
    answer:
      "Eligibility varies by scheme and typically depends on land size, farmer category, income, state, and crop type. Use the Eligibility Checker above to see schemes you qualify for.",
  },
  {
    id: "q3",
    question: "What documents are required?",
    answer:
      "Most schemes require Aadhaar, PAN, land records, a bank passbook, and a passport photo. Some schemes additionally require income or caste certificates.",
  },
  {
    id: "q4",
    question: "How long does approval take?",
    answer:
      "Approval timelines vary from 2 to 6 weeks depending on the scheme and district verification workload.",
  },
  {
    id: "q5",
    question: "How do I contact support?",
    answer:
      "Use the Government Helpline section below for the toll-free number, email support, and live chat options.",
  },
  {
    id: "q6",
    question: "What are common mistakes to avoid?",
    answer:
      "Common issues include mismatched Aadhaar details, incomplete land records, and incorrect bank account numbers. Double-check all fields before submitting.",
  },
];

export default function FAQAccordion({ items = defaultItems }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="bg-surface-glass backdrop-blur-xl rounded-2xl border border-outline-variant/60 shadow-sm p-6 md:p-8">
      <h2 className="text-lg font-bold text-on-surface mb-4">Frequently Asked Questions</h2>
      <div className="divide-y divide-outline-variant/40">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-sm font-semibold text-on-surface">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-on-surface-variant shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-on-surface-variant pb-4">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
