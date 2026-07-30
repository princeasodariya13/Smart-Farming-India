"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import SearchBar from "./SearchBar";
import CategoryCard from "./CategoryCard";
import SchemeCard from "./SchemeCard";
import EligibilityChecker from "./EligibilityChecker";
import RecommendationCard from "./RecommendationCard";
import AnnouncementTimeline from "./AnnouncementTimeline";
import ApplicationTracker from "./ApplicationTracker";
import DocumentCard from "./DocumentCard";
import FAQAccordion from "./FAQAccordion";
import HelplineCard from "./HelplineCard";
import EmptyState from "./EmptyState";
import Toast, { ToastType } from "./Toast";
import SchemeDetailsModal from "./SchemeDetailsModal";
import { useNotification } from "@/contexts/NotificationContext";

import type { Scheme } from "@/types/schemes";

// NOTE: Sidebar, TopNavbar, and Footer are provided by the existing
// dashboard layout in src/app/schemes/page.tsx — not re-implemented here.

const allSchemes: Scheme[] = [
  {
    id: "s1",
    categoryId: "income",
    state: "Gujarat",
    logoUrl:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=200&auto=format&fit=crop",
    name: "PM-KISAN",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description: "Direct income support of ₹6,000/year to all landholding farmer families.",
    benefit: "₹6,000/year",
    deadline: "Rolling application",
    status: "open",
    eligibilitySummary: "All landholding farmer families with valid land records.",
  },
  {
    id: "s2",
    categoryId: "insurance",
    state: "Gujarat",
    logoUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=200&auto=format&fit=crop",
    name: "PM Fasal Bima Yojana",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description: "Crop insurance scheme covering yield losses due to natural calamities.",
    benefit: "Up to 100% sum insured",
    deadline: "Closing in 6 days",
    status: "closing_soon",
    eligibilitySummary: "Farmers growing notified crops in notified areas.",
  },
  {
    id: "s3",
    categoryId: "loans",
    state: "Gujarat",
    logoUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=200&auto=format&fit=crop",
    name: "Kisan Credit Card",
    ministry: "Ministry of Finance",
    description: "Short-term credit support for cultivation and allied activities.",
    benefit: "Up to ₹3 Lakh at 4% interest",
    deadline: "Rolling application",
    status: "open",
    eligibilitySummary: "All farmers, tenant farmers and sharecroppers.",
  },
  {
    id: "s4",
    categoryId: "organic",
    state: "Gujarat",
    logoUrl:
      "https://images.unsplash.com/photo-1592982573971-2c0703d84e4d?q=80&w=200&auto=format&fit=crop",
    name: "Soil Health Card Scheme",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description: "Free soil testing and nutrient recommendation for every farm holding.",
    benefit: "Free soil testing",
    deadline: "Rolling application",
    status: "open",
    eligibilitySummary: "All farmers with registered land holdings.",
  },
  {
    id: "s5",
    categoryId: "solar",
    state: "Gujarat",
    logoUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=200&auto=format&fit=crop",
    name: "PM Kusum Yojana",
    ministry: "Ministry of New & Renewable Energy",
    description: "Subsidy for solar-powered irrigation pumps and grid-connected plants.",
    benefit: "Up to 90% subsidy",
    deadline: "Closed for this cycle",
    status: "closed",
    eligibilitySummary: "Individual farmers, cooperatives and farmer groups.",
  },
  {
    id: "s6",
    categoryId: "income",
    state: "Gujarat",
    logoUrl:
      "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=200&auto=format&fit=crop",
    name: "National Agriculture Market (eNAM)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description: "Online trading platform connecting farmers to a nationwide market.",
    benefit: "Better price discovery",
    deadline: "Always open",
    status: "open",
    eligibilitySummary: "Registered farmers and licensed traders.",
  },
];

export default function SchemesLayout() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    // Fetch Schemes
    fetch('/api/schemes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.schemes) {
          setSchemes(data.schemes);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

    // Fetch Active Applications
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.applications && data.applications.length > 0) {
          setActiveApplication(data.applications[0]);
        }
      })
      .catch(console.error);

    // Fetch Required Documents
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.documents) {
          setActiveDocuments(data.documents);
        }
      })
      .catch(console.error);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [activeState, setActiveState] = useState<string>("Gujarat");
  const [activeUiCategory, setActiveUiCategory] = useState<string>("All Categories");
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [activeApplication, setActiveApplication] = useState<any>(null);
  const [activeDocuments, setActiveDocuments] = useState<any[]>([]);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const toggleSave = (id: string) => {
    setSchemes((prev) => {
      const isSaving = !prev.find((s) => s.id === id)?.saved;
      showToast(isSaving ? "Scheme saved successfully." : "Scheme removed from saved.", "success");
      return prev.map((s) => (s.id === id ? { ...s, saved: !s.saved } : s));
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApply = (id: string) => {
    const scheme = schemes.find(s => s.id === id);
    if (!scheme) return;

    if (scheme.applyUrl) {
      showToast(`Redirecting to ${scheme.name} portal...`, "info");
      
      addNotification({
        title: 'Application Initiated',
        message: `You are being redirected to the official portal to apply for ${scheme.name}. Please keep your Aadhar and land records ready.`,
        type: 'system'
      });

      setTimeout(() => {
        window.open(scheme.applyUrl, "_blank", "noopener,noreferrer");
      }, 800);
    } else {
      showToast(`Application submitted for ${scheme.name}!`, "success");
      
      addNotification({
        title: 'Application Submitted',
        message: `Your application for ${scheme.name} has been successfully submitted to the local authorities. You will receive an SMS update shortly.`,
        type: 'system'
      });
    }
  };

  const handleLearnMore = (id: string) => {
    setSelectedSchemeId(id);
  };

  const handleUpload = (id: string) => {
    showToast(`Opening document upload dialog...`, "info");
  };

  const handleLiveChat = () => {
    showToast(`Connecting to a support agent...`, "info");
  };

  const handleDownloadGuidelines = () => {
    showToast(`Downloading guidelines PDF...`, "success");
  };

  const scrollToEligibility = () => {
    const el = document.getElementById("eligibility-checker-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("Please fill in your details to check eligibility.", "info");
    }
  };

  // Map UI category dropdown to grid categories if needed, but here we just use activeCategory
  // Filter logic
  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch = searchQuery.trim() === ""
      ? true
      : s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ministry.toLowerCase().includes(searchQuery.toLowerCase());
        
    const matchesCategory = !activeCategory || s.categoryId === activeCategory;
    const matchesState = !activeState || s.state === activeState;
    
    // UI Category dropdown mapping (simple implementation)
    const matchesUiCategory = activeUiCategory === "All Categories" ? true : 
      (activeUiCategory === "Income Support" && s.categoryId === "income") ||
      (activeUiCategory === "Crop Insurance" && s.categoryId === "insurance") ||
      (activeUiCategory === "Loans" && s.categoryId === "loans") ||
      (activeUiCategory === "Solar Energy" && s.categoryId === "solar") ||
      (activeUiCategory === "Organic Farming" && s.categoryId === "organic") ||
      // Default to matching if category mapping isn't exact
      (!["Income Support", "Crop Insurance", "Loans", "Solar Energy", "Organic Farming"].includes(activeUiCategory));

    return matchesSearch && matchesCategory && matchesState && matchesUiCategory;
  });

  const savedSchemes = schemes.filter((s) => s.saved);

  return (
    <>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto space-y-10 p-4 md:p-8"
      >
        {/* Hero */}
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">
            Government Schemes &amp; Subsidies
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl mb-6">
            Streamlined access to agricultural financial support. Secure, transparent, and
            direct-to-farmer benefits.
          </p>
          <SearchBar
            onSearch={handleSearch}
            onStateChange={setActiveState}
            onCategoryChange={setActiveUiCategory}
            onCheckEligibility={scrollToEligibility}
          />
        </header>

        {/* Categories */}
        <section>
          <h2 className="text-lg font-bold text-on-surface mb-4">Browse by Category</h2>
          <CategoryCard
            schemes={schemes}
            activeId={activeCategory}
            onSelect={(id) => setActiveCategory((prev) => (prev === id ? undefined : id))}
          />
        </section>

        {/* Featured schemes */}
        <section>
          <h2 className="text-lg font-bold text-on-surface mb-4">Featured Schemes</h2>
          {filteredSchemes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSchemes.map((scheme) => (
                <SchemeCard 
                  key={scheme.id} 
                  scheme={scheme} 
                  onSave={toggleSave} 
                  onApply={handleApply}
                  onLearnMore={handleLearnMore}
                />
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-8">
            <ApplicationTracker data={activeApplication || undefined} />
            <RecommendationCard schemes={schemes} onApply={handleApply} />
            <DocumentCard documents={activeDocuments.length > 0 ? activeDocuments : undefined} onUpload={handleUpload} />
            <FAQAccordion />
          </div>
          <div className="space-y-8">
            <div id="eligibility-checker-section">
              <EligibilityChecker 
                schemes={schemes}
                onSubmit={(_, count) => showToast(`Eligibility check complete. Found ${count} matching schemes.`, "success")} 
              />
            </div>
            <AnnouncementTimeline schemes={schemes} />
            <HelplineCard onLiveChat={handleLiveChat} onDownloadGuidelines={handleDownloadGuidelines} />

            {/* Saved schemes */}
            <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-sm p-6">
              <h2 className="text-lg font-bold text-on-surface mb-4">Saved Schemes</h2>
              {savedSchemes.length === 0 ? (
                <p className="text-sm text-on-surface-variant">
                  Bookmark schemes to see them here.
                </p>
              ) : (
                <ul className="space-y-2">
                  {savedSchemes.map((s) => (
                    <li
                      key={s.id}
                      className="text-sm font-medium text-on-surface p-3 bg-surface-container-low rounded-xl flex justify-between items-center"
                    >
                      <span>{s.name}</span>
                      <button onClick={() => toggleSave(s.id)} className="text-error hover:text-error-container p-1 rounded-full bg-error/10 hover:bg-error/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <SchemeDetailsModal 
        isOpen={!!selectedSchemeId} 
        onClose={() => setSelectedSchemeId(null)} 
        scheme={schemes.find(s => s.id === selectedSchemeId) || null} 
        onApply={handleApply} 
      />
    </>
  );
}
