"use client";

import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";

/** Footer with register link + legal links. Pure UI, routes point to existing pages. */
export default function AuthFooter() {
  const [modalContent, setModalContent] = useState<"privacy" | "terms" | null>(null);

  return (
    <>
      <footer className="mt-10 space-y-4 text-center">
        <p className="text-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
          >
            Sign up
          </Link>
        </p>
        <div className="text-xs text-outline">
          <p>© {new Date().getFullYear()} Smart Farming India. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4 relative z-50">
            <button 
              type="button" 
              onClick={() => setModalContent("privacy")} 
              className="hover:text-primary transition-colors cursor-pointer block relative z-50"
            >
              Privacy Policy
            </button>
            <button 
              type="button" 
              onClick={() => setModalContent("terms")} 
              className="hover:text-primary transition-colors cursor-pointer block relative z-50"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {modalContent && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative text-left">
            <button 
              onClick={() => setModalContent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            {modalContent === "privacy" && (
              <div className="text-sm text-slate-600 space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy Policy</h2>
                <p><strong>1. Data Collection:</strong> We collect information you provide directly to us when creating an account, such as your name, email, and farm location.</p>
                <p><strong>2. Use of Data:</strong> Your data is used to provide AI advisory services, marketplace connectivity, and scheme recommendations. We do not sell your personal data to third parties.</p>
                <p><strong>3. Data Security:</strong> We implement industry-standard encryption to protect your account and agricultural data.</p>
                <p><strong>4. Your Rights:</strong> You may request a complete export or permanent deletion of your account and all associated farm data at any time via the user dashboard settings.</p>
              </div>
            )}

            {modalContent === "terms" && (
              <div className="text-sm text-slate-600 space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms of Service</h2>
                <p><strong>1. Acceptance:</strong> By accessing and using Smart Farming India, you agree to be bound by these terms.</p>
                <p><strong>2. AI Advisory Disclaimer:</strong> The AI Disease Detection feature is an advisory tool based on machine learning. It does not replace professional agronomic advice. Smart Farming India shall not be held liable for crop loss.</p>
                <p><strong>3. User Conduct:</strong> You agree not to upload unauthorized images, scrape our databases, or use the marketplace for fraudulent transactions.</p>
                <p><strong>4. Modifications:</strong> We reserve the right to modify these terms at any time. Continued use implies acceptance.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
