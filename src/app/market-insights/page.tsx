"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, Search, BarChart2, AlertCircle } from 'lucide-react';

const gujaratiNames: Record<string, string> = {
  "groundnut": "મગફળી",
  "cotton": "કપાસ",
  "wheat": "ઘઉં",
  "jeera": "જીરું",
  "cumin": "જીરું",
  "garlic": "લસણ",
  "onion": "ડુંગળી",
  "sesame": "તલ",
  "castor": "દિવેલા",
  "mustard": "સરસવ",
  "coriander": "ધાણા",
  "soybean": "સોયાબીન",
  "green gram": "મગ",
  "black gram": "અડદ",
  "chickpea": "ચણા",
  "bengal gram": "ચણા",
  "turmeric": "હળદર",
  "pearl millet": "બાજરી",
  "bajra": "બાજરી",
  "sorghum": "જુવાર",
  "jowar": "જુવાર",
  "chilli": "મરચું",
  "red chilli": "લાલ મરચું",
  "fennel": "વરિયાળી",
  "fenugreek": "મેથી",
  "mousambi": "મોસંબી",
  "sweet lime": "મોસંબી",
  "lemon": "લીંબુ",
  "bhindi": "ભીંડા",
  "ladies finger": "ભીંડા",
  "tomato": "ટામેટાં",
  "potato": "બટાકા",
  "cabbage": "કોબીજ",
  "cauliflower": "ફુલાવર",
  "brinjal": "રીંગણ",
  "gourd": "દૂધી",
  "bitter gourd": "કારેલા",
  "pigeon pea": "તુવેર",
  "maize": "મકાઈ"
};

export default function MarketInsightsPage() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("a-z");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPrices = useCallback(async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setLoading(true);
    setErrorMsg(null);
    setWarningMsg(null);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/market-prices?market=Gondal', {
        signal: abortControllerRef.current.signal
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch");
      }

      if (data.success && data.data) {
        setPrices(data.data);
        setLastUpdated(data.lastUpdated);
        if (data.isFallback) {
          setWarningMsg("Market data is temporarily unavailable. Showing the latest available prices.");
        }
      } else {
        throw new Error("No data returned");
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error("Failed to load prices", error);
      
      if (prices.length > 0) {
        setWarningMsg("Market data is temporarily unavailable. Showing the latest available prices.");
      } else {
        setErrorMsg("Unable to load market prices. Please try again later.");
      }
    } finally {
      if (!isAutoRefresh) setLoading(false);
    }
  }, [prices.length]);

  useEffect(() => {
    fetchPrices();
    
    // Auto refresh every 15 minutes
    timerRef.current = setInterval(() => {
      fetchPrices(true);
    }, 15 * 60 * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchPrices]);

  // Filtering and Sorting
  let filteredPrices = prices.filter(p => 
    p.commodity?.toLowerCase().includes(search.toLowerCase())
  );

  filteredPrices.sort((a, b) => {
    if (sortBy === 'a-z') return a.commodity.localeCompare(b.commodity);
    if (sortBy === 'highest') return (b.modal_price || 0) - (a.modal_price || 0);
    if (sortBy === 'lowest') return (a.modal_price || 0) - (b.modal_price || 0);
    if (sortBy === 'latest') return new Date(b.arrival_date || 0).getTime() - new Date(a.arrival_date || 0).getTime();
    return 0;
  });

  const formatPrice = (price: any) => {
    if (!price || isNaN(price)) return 'N/A';
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return dateString;
  };
  
  const getGujaratiName = (englishName: string) => {
    const lowerName = englishName.toLowerCase();
    for (const key in gujaratiNames) {
      if (lowerName.includes(key)) {
        return ` (${gujaratiNames[key]})`;
      }
    }
    return "";
  };

  return (
    <div className="h-screen overflow-y-auto custom-scrollbar bg-background-sage flex flex-col pb-10" data-lenis-prevent>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Live Market Insights</h1>
              <p className="text-[12px] text-on-surface-variant flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Govt. AGMARKNET Data
              </p>
            </div>
          </div>
          <button onClick={() => fetchPrices()} disabled={loading} className="p-2 rounded-full hover:bg-surface-container transition-colors disabled:opacity-50">
            <RefreshCcw size={20} className={loading ? "animate-spin text-primary" : "text-on-surface-variant"} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-container-max w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Messages */}
        {errorMsg && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 font-bold text-sm">
            <AlertCircle size={20} />
            {errorMsg}
          </div>
        )}
        
        {warningMsg && !errorMsg && (
          <div className="bg-amber-100 text-amber-900 p-4 rounded-xl flex items-center gap-3 font-bold text-sm border border-amber-200">
            <AlertCircle size={20} className="text-amber-600" />
            {warningMsg}
          </div>
        )}

        {/* Search & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder="Search commodity..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border-2 border-outline-variant focus:border-primary focus:outline-none transition-colors text-on-surface"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-[12px] font-bold text-on-surface-variant shrink-0">Sort By:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto bg-surface border-2 border-outline-variant rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="a-z">Commodity A-Z</option>
              <option value="highest">Highest Price</option>
              <option value="lowest">Lowest Price</option>
              <option value="latest">Latest Date</option>
            </select>
          </div>
        </div>

        {loading && prices.length === 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="bg-surface rounded-2xl p-5 border border-outline-variant/30 animate-pulse h-40"></div>
             ))}
           </div>
        ) : filteredPrices.length === 0 && !errorMsg ? (
           <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
             <BarChart2 size={48} className="opacity-20 mb-4" />
             <p>No market data found for "{search}"</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((price, idx) => (
              <div key={idx} className="bg-surface rounded-2xl p-5 border border-outline-variant/30 hover:border-primary/40 hover:shadow-lg transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BarChart2 size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-sm font-bold text-on-surface">
                        {price.commodity}
                        <span className="text-on-surface-variant text-[15px] font-medium ml-1.5">
                          {getGujaratiName(price.commodity)}
                        </span>
                      </h3>
                      <p className="text-[12px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full inline-flex mt-1">
                        {price.market}, {price.district}, {price.state}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-on-surface-variant">Minimum Price</span>
                      <span className="font-bold text-on-surface">{formatPrice(price.min_price)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-on-surface-variant">Maximum Price</span>
                      <span className="font-bold text-on-surface">{formatPrice(price.max_price)}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-outline-variant/30">
                    <div>
                      <p className="text-[10px] text-primary uppercase tracking-wider font-bold mb-1">Modal Price</p>
                      <p className="text-2xl font-black text-on-surface">{formatPrice(price.modal_price)} <span className="text-[12px] text-on-surface-variant font-normal">per Quintal</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-on-surface-variant mb-0.5">Arrival Date</p>
                      <p className="text-[11px] font-bold text-on-surface">{formatDate(price.arrival_date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
