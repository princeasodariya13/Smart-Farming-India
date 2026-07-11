/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, SessionProvider } from 'next-auth/react';
import { Leaf } from 'lucide-react';

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

  // Scanner state management
  const [scannerState, setScannerState] = useState<'upload' | 'scanning' | 'results'>('upload');
  
  // Real implementation states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        setScannerState('results');
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



  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
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
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">agriculture</span>
            <span className="text-[12px] font-medium">My Farm</span>
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
            <span className="text-[12px] font-medium">Market</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="text-[12px] font-medium">Settings</span>
          </Link>
        </nav>
        <div className="mt-auto pt-3 border-t border-outline-variant space-y-1">
          <button className="w-full mb-3 py-2.5 bg-primary text-on-primary rounded-lg text-[12px] font-bold shadow-sm active:scale-95 transition-all">
            Consult Expert
          </button>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#">
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
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 sticky top-0 z-40 flex items-center justify-between px-6 w-full max-w-container-max mx-auto shadow-sm">
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
            <div className="hidden lg:flex items-center gap-5">
              <Link className="text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors" href="/market">Marketplace</Link>
              <Link className="text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors" href="/schemes">Schemes</Link>
              <Link className="text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors" href="/community">Community</Link>
              <Link className="text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Analytics</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <div className="w-7 h-7 rounded-full bg-surface-container-high border border-primary flex items-center justify-center overflow-hidden shrink-0 ml-1 shadow-sm">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="Profile" width={28} height={28} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[12px] font-bold text-primary">{getInitials(session?.user?.name)}</span>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-24">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-[32px] leading-tight font-bold text-primary tracking-tight font-body-lg">AI Crop Diagnostic</h1>
                <p className="text-sm text-on-surface-variant">Identify and treat crop diseases with state-of-the-art computer vision.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-full text-[13px] text-on-surface hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined text-[18px]">history</span> History
                </button>
                <button onClick={resetScanner} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full text-[13px] shadow-sm hover:shadow-primary-container/20 transition-all">
                  <span className="material-symbols-outlined text-[18px]">add_a_photo</span> New Scan
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
                             <button onClick={capturePhoto} className="flex-1 py-2.5 px-4 bg-primary text-on-primary rounded-xl font-medium text-[13px] hover:brightness-110 flex items-center justify-center gap-1.5 shadow-md">
                               <span className="material-symbols-outlined text-[18px]">camera</span> Capture
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
                            <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-2.5 px-4 bg-primary text-on-primary rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-medium hover:brightness-110 shadow-sm">
                              <span className="material-symbols-outlined text-[18px]">upload_file</span> Choose Files
                            </button>
                            <button onClick={startCamera} className="flex-1 py-2.5 px-4 bg-surface-container-high text-primary rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-medium hover:bg-surface-container-highest">
                              <span className="material-symbols-outlined text-[18px]">camera</span> Use Camera
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
                        <img className="w-full h-full object-cover" alt="Crop diagnostic" src={capturedImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuCd3SU41ImiSa9HB96wa3XiG_Osrt9ymIDfNZJE3Rg3Xv2zO0S1AcLtuNGe_uXDulUVjLksGZcA7d2y7TFO9L-aREIlbolbHFx7Rf-2j5S3PQN6MCH1gHkU1O5RmXc5gLkGix3DZSs4m1VdWOsl4kBZfaUuBZJlksjLAbm5eVDkgXuhHoKe9iE7ZMdLfbFdtzpVstFl77QN1WxbHF_CPo6PV5x91c5L1ucvKV4ORSM9WH0GIuFRvEdq0QAXIJ4WYHvEhtN6wt0Jdw"}/>
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
                        <img className="w-full h-full object-cover" alt="Crop diagnostic" src={capturedImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuCd3SU41ImiSa9HB96wa3XiG_Osrt9ymIDfNZJE3Rg3Xv2zO0S1AcLtuNGe_uXDulUVjLksGZcA7d2y7TFO9L-aREIlbolbHFx7Rf-2j5S3PQN6MCH1gHkU1O5RmXc5gLkGix3DZSs4m1VdWOsl4kBZfaUuBZJlksjLAbm5eVDkgXuhHoKe9iE7ZMdLfbFdtzpVstFl77QN1WxbHF_CPo6PV5x91c5L1ucvKV4ORSM9WH0GIuFRvEdq0QAXIJ4WYHvEhtN6wt0Jdw"}/>
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
                        <button onClick={resetScanner} className="px-5 py-2 bg-primary text-on-primary rounded-xl text-[13px] font-bold shadow-md hover:brightness-110 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">add_a_photo</span> Scan Another Leaf
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Scan History Card */}
                <div className="bg-white rounded-[16px] shadow-sm p-5 border border-[#E0E5DF]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-on-surface">Recent Diagnostics</h3>
                    <a className="text-primary text-[13px] font-medium hover:underline cursor-pointer">View All</a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="group relative bg-surface-container-low p-3 rounded-2xl border border-transparent hover:border-primary-fixed transition-all cursor-pointer">
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-3">
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Wheat Rust" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKFrynCYUgov6UiCo02jbgyV48b6vgcfCJCkUdzXVA7iSvy5g7H-nsUTqdxXZdOJ-mocX77aDjZA3aKU0lFSfzMn63DkRl0tbSUMfIYbM2CYX2dxbCmoG_MYjFe525XttdIF0w75AkALUmtrJyCp_ucOvC31BBQ1WZ4JPMG4eQpISmg9GycluBI06kdWUa3tbC-3hnYkHBipyNvOhHJJvzJs3FocQ7Syj7VEDO_A01SNwzy6lHw1O3FuGOlfn4Zqh7tlOSMo9mFg"/>
                      </div>
                      <p className="font-medium text-sm text-on-surface">Wheat Rust</p>
                      <p className="text-xs text-on-surface-variant">2 days ago • Healthy 12%</p>
                    </div>
                    <div className="group relative bg-surface-container-low p-3 rounded-2xl border border-transparent hover:border-primary-fixed transition-all cursor-pointer">
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-3">
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Early Blight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjXKW-nbNF9Qb2rsoSb1xrCcSTtwSEmJQF2k07Im61uRZGbGeRTUJ75I_I1VPFAp4x2zVEVAGWPjQ4-cWS5KwiLsg5eq1P8WpQAql3NFE8ofSgeS5WH5u4YKQw_3HFxoejp5ZocyipTovM_PBze6hZW77WJMVh7kqXNFBh_GOUj4259XYKOzTwHg9brnUNoaMHcx0_u82YiFrrh-fBlsQOXfGGNfTLp7pcRbQzG99lg2UiaZjOxKTa1HUPeBnqp46l2kHBuFM9aA"/>
                      </div>
                      <p className="font-medium text-sm text-on-surface">Early Blight</p>
                      <p className="text-xs text-on-surface-variant">5 days ago • Treated</p>
                    </div>
                    <div className="group relative bg-surface-container-low p-3 rounded-2xl border border-transparent hover:border-primary-fixed transition-all cursor-pointer">
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-3">
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Healthy Crop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGXijv0uqEZNijD1gRw5rwkElfndLwnkWgecNo-ESQ2-heOEg-n6kWLSeS0hGm1JGYogE0YqKiEZAMDV8la0JAV5FbXYwKvi7pC6HOjk1cVY9GJnLF8GqzJn0uRW6h0IykF70hK-GZLbrlsP4m74wyx12L5boMpsKFfrnSJLNoGFC3-f1Ten4Qej8V_BhhlQpCURZ9tvaGKSHrg_lQJ9YeiN__9O7T930-lwjDYNK_xrixSzgw6Qs-CcZ_FCEf5jFVNNWseR9l6A"/>
                      </div>
                      <p className="font-medium text-sm text-on-surface">Healthy Crop</p>
                      <p className="text-xs text-on-surface-variant">1 week ago • Optimized</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right: Analysis & Consultation (5 Columns) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Diagnostic Result Card */}
                <div className={`bg-white rounded-[16px] shadow-sm p-5 border border-[#E0E5DF] relative overflow-hidden transition-all duration-500 ${scannerState === 'results' ? 'opacity-100 translate-y-0' : 'opacity-50 blur-sm pointer-events-none grayscale'}`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
                  
                  {analysisResult ? (
                    <>
                      <div className="flex items-center gap-3 mb-5">
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
                        <img className="w-full h-full object-cover" alt="Expert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnjKdJ8IkqolUVeciOyWRvxitlVO8EUAl9iAjcSHvTRO6NQOjbv9UYAMQ2fwaPMO11Fc1kI0TCuYm0lJ2sM6H8TPL0tb8lhBv-RvgDlj6_91DNaFBhbrvSWre7A8mFrtjcCqe9to6pANsoKF35B0aRHZAVoaiJ7mPZrMpOBcRzpRuyV_Xg0ifcwTS-zw8SD5PtlWkEcFm9ikiNqIoEqtAQvc2H_vyOIpDiUBslWvNqizx7TSOhvd8JYAq6Bsdp7VYXCWATwkUKjw"/>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[13px]">Dr. Arjun Sharma</p>
                        <p className="text-[10px] opacity-70">Pathology Expert • 12km away</p>
                      </div>
                      <div className="flex items-center gap-1 bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> Online
                      </div>
                    </div>
                    
                    <button className="w-full py-2.5 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-md text-[13px]">
                      <span className="material-symbols-outlined text-[18px]">video_call</span> Start Video Consultation
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DiseaseDetectionPage() {
  return (
    <SessionProvider>
      <DiseaseDetectionContent />
    </SessionProvider>
  );
}
