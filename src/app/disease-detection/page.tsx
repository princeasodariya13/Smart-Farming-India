/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

interface AnalysisResult {
  plantName: string;
  scientificName: string;
  status: string;
  diseaseName: string;
  confidenceScore: number;
  severity: string;
  symptoms: string[];
  cause: string;
  organicTreatment: string;
  recommendedPesticides: string[];
  activeIngredient: string;
  dosePerLitre: string;
  recommendedFungicideInsecticide: string;
  prevention: string[];
  irrigationAdvice: string;
  fertilizerAdvice: string;
  expectedRecoveryTime: string;
}



function DiseaseDetectionContent() {
  const { data: session } = useSession();



  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  const { addNotification } = useNotification();
  const [isBookingExpert, setIsBookingExpert] = useState(false);
  const [expertBooked, setExpertBooked] = useState(false);

  const handleBookConsultation = () => {
    if (expertBooked) {
      router.push('/consult');
      return;
    }
    if (isBookingExpert) return;
    setIsBookingExpert(true);
    
    // Simulate API call for booking
    setTimeout(() => {
      setIsBookingExpert(false);
      setExpertBooked(true);
      
      const consultTime = new Date();
      consultTime.setMinutes(consultTime.getMinutes() + 15);
      const formattedTime = consultTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      addNotification({
        title: 'Consultation Confirmed',
        message: `Your video consultation with Dr. Arjun Sharma is booked for today at ${formattedTime}. Please keep your crop ready for inspection.`,
        type: 'booking'
      });

      // Automatically redirect to the consult page after confirming
      router.push('/consult');
    }, 1500);
  };

  // Scanner state management
  const [scannerState, setScannerState] = useState<'upload' | 'scanning' | 'results'>('upload');

  // Real implementation states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [originalEnglishResult, setOriginalEnglishResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Real history state
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedLang, setTranslatedLang] = useState<'English' | 'Translating...' | 'Gujarati'>('English');

  const toggleTranslation = async () => {
    if (!analysisResult || isTranslating) return;

    if (translatedLang === 'Gujarati') {
      // Toggle back to English
      if (originalEnglishResult) {
        setAnalysisResult(originalEnglishResult);
      }
      setTranslatedLang('English');
      return;
    }

    // Translate to Gujarati
    setIsTranslating(true);
    setTranslatedLang('Translating...');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textData: originalEnglishResult || analysisResult, targetLanguage: 'Gujarati' })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.result);
        setTranslatedLang('Gujarati');
      } else {
        setTranslatedLang('English'); // Revert on fail
      }
    } catch {
      setTranslatedLang('English');
    }
    setIsTranslating(false);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/disease-history');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setHistoryData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };
    fetchHistory();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setIsCameraActive(true);
      setErrorMsg(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMsg("Could not access camera. Please allow permissions.");
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const resizeImage = (dataUrl: string, callback: (resized: string) => void) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        callback(dataUrl);
      }
    };
    img.src = dataUrl;
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg');
        setCapturedImage(base64);
        stopCamera();
        resizeImage(base64, (resized) => {
          analyzeImage(resized);
        });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setCapturedImage(base64);
        resizeImage(base64, (resized) => {
          analyzeImage(resized);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64: string) => {
    setScannerState('scanning');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/analyze-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.result);
        setOriginalEnglishResult(data.result);
        setTranslatedLang('English');
        setScannerState('results');
        
        // Instantly add the new scan to the top of the Recent Diagnostics history list
        if (data.result && data.result.id) {
          setHistoryData(prev => [data.result, ...prev]);
        }
      } else if (data.notAPlant) {
        // Not a plant/crop image — show clear rejection message
        setErrorMsg("🌿 " + (data.error || 'This does not appear to be a plant image. Please upload a clear photo of a crop or leaf.'));
        resetScanner();
      } else if (data.needsNewKey) {
        setErrorMsg("🔑 Gemini API key is expired or banned. Get a new key at aistudio.google.com/apikey and update your .env file.");
        resetScanner();
      } else {
        setErrorMsg("Analysis failed: " + (data.error || 'Unknown error'));
        resetScanner();
      }
    } catch {
      setErrorMsg("Error connecting to analysis server.");
      resetScanner();
    }
  };

  const resetScanner = () => {
    setScannerState('upload');
    setCapturedImage(null);
    setAnalysisResult(null);
    setErrorMsg(null);
    stopCamera();
  };

  const loadHistoryItem = (historyItem: any) => {
    setCapturedImage(historyItem.imageUrl);
    setAnalysisResult(historyItem);
    setOriginalEnglishResult(historyItem);
    setTranslatedLang('English');
    setScannerState('results');
    setErrorMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHistoryItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/disease-history/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setHistoryData(prev => prev.filter(item => item.id !== id));
      } else {
        console.error('Failed to delete:', data.error);
      }
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleNewScanClick = () => {
    if (scannerState === 'upload') {
      fileInputRef.current?.click();
    } else {
      resetScanner();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToHistory = () => {
    document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">
      <style dangerouslySetInnerHTML={{
        __html: `
        .scanning-line {
            background: linear-gradient(to bottom, transparent, #2e7d32 50%, transparent);
            height: 100px;
            width: 100%;
            position: absolute;
            top: -100px;
            animation: scan 3s linear infinite;
            opacity: 0.6;
            z-index: 10;
        }
        @keyframes scan {
            0% { top: -100px; }
            100% { top: 100%; }
        }
      ` }} />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[45] md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full w-64 md:w-48 bg-surface-container-low border-r border-outline-variant p-2.5 gap-2 shadow-2xl md:shadow-none`}>
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary text-on-primary">
              <Leaf size={16} strokeWidth={2.5} />
            </div>
            <h1 className="text-[13px] font-extrabold tracking-tight text-on-surface">
              Smart Farming<span className="text-primary">.</span>
            </h1>
          </div>
          <button
            className="md:hidden text-on-surface hover:bg-surface-container-high p-1 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <nav data-lenis-prevent="true" className="flex-1 mt-2 space-y-1 overflow-y-auto custom-scrollbar">
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/dashboard">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="text-[12px] font-medium">Dashboard</span>
          </Link>

          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/gps-area-calculator">
            <span className="material-symbols-outlined text-[18px]">map</span>
            <span className="text-[12px] font-medium">GPS Area Calculator</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/weather">
            <span className="material-symbols-outlined text-[18px]">early_on</span>
            <span className="text-[12px] font-medium">Weather</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg transition-all" href="/disease-detection">
            <span className="material-symbols-outlined text-[18px]">shutter_speed</span>
            <span className="text-[12px] font-medium">Disease Detection</span>
          </Link>

          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/market">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span className="text-[12px] font-medium">Marketplace</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/schemes">
            <span className="material-symbols-outlined text-[18px]">article</span>
            <span className="text-[12px] font-medium">Schemes</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/community">
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span className="text-[12px] font-medium">Community</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/analytics">
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span className="text-[12px] font-medium">Analytics</span>
          </Link>

          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/settings">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="text-[12px] font-medium">Settings</span>
          </Link>
        </nav>
        <div className="mt-auto pt-3 border-t border-outline-variant space-y-1">
          <Link href="/consult" className="w-full block text-center mb-3 py-2.5 bg-primary text-on-primary rounded-lg text-[12px] font-bold shadow-sm active:scale-95 transition-all">Consult Expert</Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/support">
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span className="text-[12px] font-medium">Support</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all w-full text-left">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-[12px] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-8 md:pb-0">
        {/* TopNavBar */}
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 sticky top-0 shrink-0 z-30 flex items-center justify-between px-6 w-full max-w-container-max mx-auto shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex md:hidden items-center gap-2 mr-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 -ml-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
              <div className="p-1 rounded-lg bg-primary text-on-primary">
                <Leaf size={14} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-extrabold tracking-tight text-on-surface">
                Smart Farming<span className="text-primary">.</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <div className="w-7 h-7 rounded-full bg-surface-container-high border border-primary flex items-center justify-center overflow-hidden shrink-0 ml-1 shadow-sm">
              <Link href="/profile" className="block relative cursor-pointer hover:opacity-80 transition-opacity">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="Profile" width={28} height={28} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[12px] font-bold text-primary">{getInitials(session?.user?.name)}</span>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-24">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4 shrink-0">
              <div className="flex-1 min-w-[280px]">
                <h1 className="text-2xl md:text-[32px] leading-tight font-bold text-primary tracking-tight font-body-lg">AI Crop Diagnostic</h1>
                <p className="text-sm text-on-surface-variant">Identify and treat crop diseases with state-of-the-art computer vision.</p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <button onClick={scrollToHistory} className="flex items-center shrink-0 whitespace-nowrap gap-2 px-4 py-2 bg-white border border-outline-variant rounded-full text-[13px] text-on-surface hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined text-[18px] shrink-0">history</span>
                  <span>History</span>
                </button>
                <button onClick={handleNewScanClick} className="flex items-center shrink-0 whitespace-nowrap gap-2 px-4 py-2 bg-primary text-on-primary rounded-full text-[13px] shadow-sm hover:shadow-primary-container/20 transition-all">
                  <span className="material-symbols-outlined text-[18px] shrink-0">add_a_photo</span>
                  <span>New Scan</span>
                </button>
              </div>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Upload & Scanning (7 Columns) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Main Scanner Card */}
                <div className="bg-white rounded-[20px] shadow-sm p-6 border border-[#E0E5DF] relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                  <div className="absolute inset-0 bg-[#f9f9ff] opacity-40"></div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="absolute top-4 left-4 right-4 z-50 bg-error/10 text-error p-3 rounded-lg text-sm border border-error/20 flex items-center justify-between">
                      <span>{errorMsg}</span>
                      <button onClick={() => setErrorMsg(null)}><span className="material-symbols-outlined text-sm">close</span></button>
                    </div>
                  )}

                  {/* Scanner State 1: Ready to Upload */}
                  {scannerState === 'upload' && (
                    <div className="relative z-20 flex flex-col items-center text-center w-full max-w-sm">
                      {isCameraActive ? (
                        <div className="w-full flex flex-col items-center">
                          <div className="w-full aspect-square md:aspect-video rounded-xl overflow-hidden bg-black mb-4 relative">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                          </div>
                          <div className="flex gap-3 w-full">
                            <button onClick={capturePhoto} className="flex-1 py-2.5 px-4 bg-primary text-on-primary rounded-xl font-medium text-[13px] hover:brightness-110 flex items-center justify-center gap-1.5 shadow-md shrink-0">
                              <span className="material-symbols-outlined text-[18px] shrink-0">camera</span> <span>Capture</span>
                            </button>
                            <button onClick={stopCamera} className="flex-1 py-2.5 px-4 bg-surface-container-high text-primary rounded-xl font-medium text-[13px] hover:bg-surface-container-highest">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center text-primary mb-4 animate-pulse">
                            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                          </div>
                          <h3 className="text-lg font-semibold text-on-surface mb-1.5">Upload Crop Image</h3>
                          <p className="text-[13px] text-on-surface-variant mb-6">Drag and drop a clear photo of the infected area or leaf. For best results, use natural lighting.</p>
                          <div className="flex gap-3 w-full">
                            <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-2.5 px-4 bg-primary text-on-primary rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-medium hover:brightness-110 shadow-sm shrink-0">
                              <span className="material-symbols-outlined text-[18px] shrink-0">upload_file</span> <span>Choose Files</span>
                            </button>
                            <button onClick={startCamera} className="flex-1 py-2.5 px-4 bg-surface-container-high text-primary rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-medium hover:bg-surface-container-highest shrink-0">
                              <span className="material-symbols-outlined text-[18px] shrink-0">camera</span> <span>Use Camera</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Scanner State 2: Scanning Animation */}
                  {scannerState === 'scanning' && (
                    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
                      <div className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                        <img className="w-full h-full object-cover" alt="Crop diagnostic" src={capturedImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuCd3SU41ImiSa9HB96wa3XiG_Osrt9ymIDfNZJE3Rg3Xv2zO0S1AcLtuNGe_uXDulUVjLksGZcA7d2y7TFO9L-aREIlbolbHFx7Rf-2j5S3PQN6MCH1gHkU1O5RmXc5gLkGix3DZSs4m1VdWOsl4kBZfaUuBZJlksjLAbm5eVDkgXuhHoKe9iE7ZMdLfbFdtzpVstFl77QN1WxbHF_CPo6PV5x91c5L1ucvKV4ORSM9WH0GIuFRvEdq0QAXIJ4WYHvEhtN6wt0Jdw"} />
                        <div className="scanning-line"></div>
                        <div className="absolute inset-0 border-[20px] border-black/10"></div>
                      </div>
                      <div className="mt-6 flex items-center gap-3 text-primary">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-base font-semibold animate-pulse">Analyzing Patterns...</p>
                      </div>
                    </div>
                  )}

                  {/* Scanner State 3: Result Shown inline */}
                  {scannerState === 'results' && analysisResult && (
                    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
                      <div className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-sm border-4 border-white">
                        <img className="w-full h-full object-cover" alt="Crop diagnostic" src={capturedImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuCd3SU41ImiSa9HB96wa3XiG_Osrt9ymIDfNZJE3Rg3Xv2zO0S1AcLtuNGe_uXDulUVjLksGZcA7d2y7TFO9L-aREIlbolbHFx7Rf-2j5S3PQN6MCH1gHkU1O5RmXc5gLkGix3DZSs4m1VdWOsl4kBZfaUuBZJlksjLAbm5eVDkgXuhHoKe9iE7ZMdLfbFdtzpVstFl77QN1WxbHF_CPo6PV5x91c5L1ucvKV4ORSM9WH0GIuFRvEdq0QAXIJ4WYHvEhtN6wt0Jdw"} />
                        <div className="absolute top-4 left-4 border-2 border-primary-fixed bg-primary-fixed/60 rounded-lg flex flex-col items-start p-2 backdrop-blur-md">
                          <span className="text-on-primary-fixed text-xs font-bold">{analysisResult.diseaseName}</span>
                          <span className="text-on-primary-fixed text-[10px] opacity-80">{analysisResult.confidenceScore}% Match</span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col items-center gap-3">
                        <div className="flex items-center gap-1.5 text-success">
                          <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                          <p className="text-sm font-semibold text-primary">Analysis Complete</p>
                        </div>
                        <button onClick={resetScanner} className="px-5 py-2 bg-primary text-on-primary rounded-xl text-[13px] font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-2 shrink-0">
                          <span className="material-symbols-outlined text-[18px] shrink-0">add_a_photo</span> <span>Scan Another Leaf</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scan History Card */}
                <div id="history-section" className="bg-white rounded-[16px] shadow-sm p-5 border border-[#E0E5DF]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-on-surface">Recent Diagnostics</h3>
                    {historyData.length > 3 && (
                      <button 
                        onClick={() => setShowAllHistory(true)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[13px] font-bold hover:bg-primary/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">history</span> History
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    {historyData.length > 0 ? historyData.slice(0, 3).map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className="group relative bg-surface-container-low p-2 md:p-3 rounded-2xl border border-transparent hover:border-primary-fixed transition-all cursor-pointer shadow-sm"
                      >
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 md:mb-3">
                          <img className="w-full h-full object-cover group-hover:scale-110 transition-transform bg-surface-container" alt={item.plantName || "Crop"} src={item.imageUrl} />
                          <button 
                            onClick={(e) => deleteHistoryItem(e, item.id)}
                            className="absolute top-1 right-1 md:top-1.5 md:right-1.5 p-1 bg-error/90 hover:bg-error text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-sm flex items-center justify-center"
                            title="Delete this scan"
                          >
                            <span className="material-symbols-outlined text-[12px] md:text-[14px]">delete</span>
                          </button>
                        </div>
                        <p className="font-medium text-[11px] md:text-sm text-on-surface line-clamp-1">{item.diseaseName || item.plantName}</p>
                        <p className="text-[9px] md:text-xs text-on-surface-variant mt-0.5">
                          {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    )) : (
                      <p className="text-sm text-on-surface-variant col-span-3 text-center py-6">No recent diagnostics found.</p>
                    )}
                  </div>
                </div>

                {/* History Modal Overlay */}
                {showAllHistory && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[24px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                      <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#E0E5DF] bg-surface-container-lowest">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-2xl">history</span>
                          <h2 className="text-lg md:text-xl font-bold text-on-surface">Scan History</h2>
                        </div>
                        <button onClick={() => setShowAllHistory(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                      
                      <div className="p-3 md:p-5 overflow-y-auto" style={{ maxHeight: '600px' }}>
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                          {historyData.map((item) => (
                            <div 
                              key={item.id}
                              onClick={() => {
                                setShowAllHistory(false);
                                loadHistoryItem(item);
                              }}
                              className="group bg-surface-container-lowest p-2 md:p-3 rounded-2xl border border-[#E0E5DF] hover:border-primary-fixed hover:bg-surface-container-low transition-all cursor-pointer shadow-sm flex flex-col"
                            >
                              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 md:mb-3">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform bg-surface-container" alt={item.plantName || "Crop"} src={item.imageUrl} />
                                <button 
                                  onClick={(e) => deleteHistoryItem(e, item.id)}
                                  className="absolute top-1.5 right-1.5 md:top-2 md:right-2 p-1.5 bg-error/90 hover:bg-error text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-sm flex items-center justify-center"
                                  title="Delete this scan"
                                >
                                  <span className="material-symbols-outlined text-[14px] md:text-[16px]">delete</span>
                                </button>
                              </div>
                              <h4 className="font-semibold text-[11px] md:text-[15px] text-on-surface line-clamp-1">{item.diseaseName || item.plantName}</h4>
                              <p className="text-[9px] md:text-[12px] text-on-surface-variant mt-0.5 md:mt-1">
                                {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </p>
                              <div className="mt-1 md:mt-2 inline-flex">
                                <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-md text-[8px] md:text-[10px] font-bold uppercase tracking-wider line-clamp-1">
                                  {item.status || "Analyzed"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Analysis & Consultation (5 Columns) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Diagnostic Result Card */}
                <div className={`bg-white rounded-[16px] shadow-sm p-5 border border-[#E0E5DF] relative overflow-hidden transition-all duration-500 ${scannerState === 'results' ? 'opacity-100 translate-y-0' : 'opacity-50 blur-sm pointer-events-none grayscale'}`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>

                  {analysisResult ? (
                    <>
                      <div className="flex justify-between items-start mb-5 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${analysisResult.diseaseName.toLowerCase().includes('healthy') ? 'bg-success-soft text-success' : 'bg-error-container text-error'}`}>
                            <span className="material-symbols-outlined text-xl">
                              {analysisResult.diseaseName.toLowerCase().includes('healthy') ? 'eco' : 'warning'}
                            </span>
                          </div>
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${analysisResult.diseaseName.toLowerCase().includes('healthy') ? 'text-success' : 'text-error'}`}>
                              {analysisResult.plantName} • {analysisResult.diseaseName.toLowerCase().includes('healthy') ? 'Healthy' : 'Infection Detected'}
                            </p>
                            <h2 className="text-lg font-semibold text-on-surface leading-tight">{analysisResult.diseaseName}</h2>
                          </div>
                        </div>
                        
                        <button
                          onClick={toggleTranslation}
                          disabled={isTranslating}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            isTranslating
                              ? 'bg-surface-container-high text-on-surface-variant cursor-wait border border-[#E0E5DF]'
                              : translatedLang === 'Gujarati'
                                ? 'bg-primary text-white border border-primary hover:bg-primary/90'
                                : 'bg-surface-container border border-[#E0E5DF] text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {isTranslating ? (
                            <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <span className="material-symbols-outlined text-[12px]">translate</span>
                          )}
                          {translatedLang === 'Translating...' ? 'અનુવાદ...' : translatedLang === 'Gujarati' ? 'English (Switch)' : 'Translate'}
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[13px] font-medium text-on-surface-variant">Confidence Level</span>
                            <span className="text-[13px] font-bold text-primary">{analysisResult.confidenceScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${analysisResult.confidenceScore}%` }}></div>
                          </div>

                          {analysisResult.severity && analysisResult.status !== 'Healthy' && (
                            <div className="mt-3 flex justify-between items-center bg-error-container/30 px-3 py-1.5 rounded-lg border border-error-container">
                              <span className="text-[12px] font-medium text-on-surface">Severity</span>
                              <span className="text-[12px] font-bold text-error">{analysisResult.severity}</span>
                            </div>
                          )}

                          {analysisResult.scientificName && (
                            <div className="mt-2 flex justify-between items-center bg-surface-container px-3 py-1.5 rounded-lg">
                              <span className="text-[12px] font-medium text-on-surface">Scientific Name</span>
                              <span className="text-[12px] font-bold italic text-on-surface-variant">{analysisResult.scientificName}</span>
                            </div>
                          )}
                        </div>

                        {analysisResult.symptoms && analysisResult.symptoms.length > 0 && (
                          <div>
                            <h4 className="text-[13px] font-semibold text-on-surface mb-1.5 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-primary text-[16px]">list_alt</span> Symptoms / Indicators
                            </h4>
                            <ul className="space-y-1.5 text-on-surface-variant text-[12px]">
                              {analysisResult.symptoms.map((symptom, idx) => (
                                <li key={idx} className="flex gap-2"><span>•</span> {symptom}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysisResult.cause && (
                          <div>
                            <h4 className="text-[13px] font-semibold text-on-surface mb-1.5 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-primary text-[16px]">microbiology</span> Cause
                            </h4>
                            <p className="text-[12px] text-on-surface-variant">{analysisResult.cause}</p>
                          </div>
                        )}

                        {analysisResult.status !== 'Healthy' && (
                          <div className="p-3 bg-error-container/20 rounded-xl border border-error/20">
                            <h4 className="text-[13px] font-semibold text-error mb-2 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">pest_control</span> Chemical Treatment
                            </h4>
                            <div className="space-y-2 text-[12px] text-on-surface-variant">
                              <p><strong>Recommended:</strong> {analysisResult.recommendedFungicideInsecticide || analysisResult.recommendedPesticides?.join(', ')}</p>
                              <p><strong>Active Ingredient:</strong> {analysisResult.activeIngredient}</p>
                              <p><strong>Dose:</strong> {analysisResult.dosePerLitre}</p>
                            </div>
                          </div>
                        )}

                        {analysisResult.organicTreatment && (
                          <div className="p-3 bg-success-soft rounded-xl border border-primary-fixed/20">
                            <h4 className="text-[13px] font-semibold text-primary mb-2 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">eco</span> Organic Treatment
                            </h4>
                            <p className="text-[12px] text-on-surface-variant">{analysisResult.organicTreatment}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          {analysisResult.irrigationAdvice && (
                            <div className="bg-surface-container-low p-3 rounded-xl">
                              <h4 className="text-[12px] font-bold text-on-surface mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-primary">water_drop</span> Irrigation
                              </h4>
                              <p className="text-[11px] text-on-surface-variant leading-tight">{analysisResult.irrigationAdvice}</p>
                            </div>
                          )}
                          {analysisResult.fertilizerAdvice && (
                            <div className="bg-surface-container-low p-3 rounded-xl">
                              <h4 className="text-[12px] font-bold text-on-surface mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-primary">compost</span> Fertilizer
                              </h4>
                              <p className="text-[11px] text-on-surface-variant leading-tight">{analysisResult.fertilizerAdvice}</p>
                            </div>
                          )}
                        </div>

                        {analysisResult.prevention && analysisResult.prevention.length > 0 && (
                          <div>
                            <h4 className="text-[13px] font-semibold text-on-surface mb-1.5 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-primary text-[16px]">shield</span> Prevention
                            </h4>
                            <ul className="space-y-1.5 text-on-surface-variant text-[12px]">
                              {analysisResult.prevention.map((item, idx) => (
                                <li key={idx} className="flex gap-2"><span>•</span> {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysisResult.expectedRecoveryTime && (
                          <div className="flex items-center gap-2 text-[12px] font-medium text-on-surface bg-surface-container-high px-3 py-2 rounded-lg">
                            <span className="material-symbols-outlined text-[16px] text-primary">update</span>
                            Expected Recovery: {analysisResult.expectedRecoveryTime}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                      <span className="material-symbols-outlined text-4xl mb-2">science</span>
                      <p>Awaiting analysis data...</p>
                    </div>
                  )}
                </div>

                {/* Expert Consultation Card */}
                <div className="bg-inverse-surface text-inverse-on-surface rounded-[16px] shadow-lg p-5 relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold mb-1.5">Speak to a Crop Specialist</h3>
                    <p className="text-[13px] opacity-80 mb-4">Connect with a certified agronomist within 15 minutes for a personalized remediation plan.</p>

                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-md mb-5 border border-white/10">
                      <div className="w-10 h-10 rounded-full border-2 border-primary-fixed overflow-hidden">
                        <img className="w-full h-full object-cover" alt="Expert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnjKdJ8IkqolUVeciOyWRvxitlVO8EUAl9iAjcSHvTRO6NQOjbv9UYAMQ2fwaPMO11Fc1kI0TCuYm0lJ2sM6H8TPL0tb8lhBv-RvgDlj6_91DNaFBhbrvSWre7A8mFrtjcCqe9to6pANsoKF35B0aRHZAVoaiJ7mPZrMpOBcRzpRuyV_Xg0ifcwTS-zw8SD5PtlWkEcFm9ikiNqIoEqtAQvc2H_vyOIpDiUBslWvNqizx7TSOhvd8JYAq6Bsdp7VYXCWATwkUKjw" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[13px]">Dr. Arjun Sharma</p>
                        <p className="text-[10px] opacity-70">Pathology Expert</p>
                      </div>
                      <div className="flex items-center gap-1 bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> Online
                      </div>
                    </div>

                    <button 
                      onClick={handleBookConsultation}
                      disabled={isBookingExpert}
                      className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-[13px] shrink-0 ${
                        expertBooked 
                          ? 'bg-success text-on-success hover:scale-[1.02] active:scale-95 cursor-pointer'
                          : isBookingExpert
                            ? 'bg-primary/80 text-white cursor-wait'
                            : 'bg-primary text-on-primary hover:scale-[1.02] active:scale-95'
                      }`}
                    >
                      {expertBooked ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span> 
                          <span>Consultation Booked - View</span>
                        </>
                      ) : isBookingExpert ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Confirming...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px] shrink-0">video_call</span> 
                          <span>Start Video Consultation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer (Standard Shared) */}
          <footer className="w-full py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant mt-12">
            <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-lg font-bold text-primary">Smart Farming India</h4>
              <p className="text-sm text-on-surface-variant mt-1 max-w-sm">© 2026 Smart Farming India. Empowering the roots of our nation.</p>
            </div>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <li><Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="/terms">Terms of Service</Link></li>
              <li><Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="/contact">Contact Us</Link></li>
              <li><Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="/about">About Us</Link></li>
            </ul>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function DiseaseDetectionPage() {

  // Loading is handled by content component

  return (
    <SessionProvider>
      <DiseaseDetectionContent />
    </SessionProvider>
  );
}












