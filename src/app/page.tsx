"use client"
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, animate, useInView, AnimatePresence } from 'framer-motion'
import { 
  Leaf, Menu, X, ArrowRight, CloudSun, TrendingUp, ShieldCheck,
  Scan, Calculator, BarChart2, Tractor, Users, Award, Star,
  Mail, Phone, MapPin
} from 'lucide-react'

function Counter({ value, suffix = "", decimals = 0 }: { value: number, suffix?: string, decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => 
    (decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toLocaleString()) + suffix
  )

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 2.5, ease: "easeOut" })
    }
  }, [count, inView, value])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle scroll for sticky navbar glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-200">
      
      {/* =========================================
          STEP 1: PERFECTED MILLION-DOLLAR NAVBAR
      ========================================= */}
      <div className="fixed top-0 w-full z-50 flex justify-center px-4 sm:px-6 transition-all duration-500 pt-4 sm:pt-6 pointer-events-none">
        <nav 
          className={`pointer-events-auto w-full max-w-7xl transition-all duration-500 rounded-[2rem] px-6 xl:px-8 flex items-center justify-between ${
            scrolled 
              ? 'bg-white/60 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/40 py-3' 
              : 'bg-transparent py-2'
          }`}
        >
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-lg transition-colors duration-300 ${scrolled ? 'bg-green-600 text-white' : 'bg-white/20 backdrop-blur-md text-white border border-white/30 group-hover:bg-white/30'}`}>
              <Leaf size={20} strokeWidth={2.5} />
            </div>
            <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              Smart Farming<span className="text-green-500">.</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            <div className={`flex gap-8 text-[15px] font-semibold transition-colors duration-300 ${scrolled ? 'text-slate-600' : 'text-white/90'}`}>
              <Link href="#features" className="hover:text-green-500 transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-green-500 transition-colors">How it works</Link>
              <Link href="#testimonials" className="hover:text-green-500 transition-colors">Testimonials</Link>
            </div>
            
            <div className="flex items-center gap-5">
              <Link href="/login" className={`text-[15px] font-bold transition-colors duration-300 ${scrolled ? 'text-slate-900 hover:text-green-600' : 'text-white hover:text-green-300'}`}>
                Sign In
              </Link>
              <Link href="/signup" className="px-6 py-2.5 rounded-full bg-green-600 text-white text-[15px] font-bold hover:bg-green-500 hover:shadow-lg hover:shadow-green-600/30 hover:-translate-y-0.5 transition-all">
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X size={28} className={scrolled ? 'text-slate-900' : 'text-white'} />
            ) : (
              <Menu size={28} className={scrolled ? 'text-slate-900' : 'text-white'} />
            )}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[90px] left-4 right-4 bg-white/95 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-slate-100 p-6 flex flex-col gap-4 z-40 pointer-events-auto md:hidden"
            >
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-slate-800 p-3 hover:bg-slate-50 rounded-2xl transition-colors">Features</Link>
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-slate-800 p-3 hover:bg-slate-50 rounded-2xl transition-colors">How it works</Link>
              <Link href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-slate-800 p-3 hover:bg-slate-50 rounded-2xl transition-colors">Testimonials</Link>
              
              <div className="h-px w-full bg-slate-100 my-2" />
              
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-green-700 p-3 text-center hover:bg-green-50 rounded-2xl transition-colors">Sign In</Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="bg-green-600 text-white font-bold py-4 rounded-2xl text-center hover:bg-green-500 shadow-lg shadow-green-600/30 transition-all">Get Started Free</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================
          STEP 1: PERFECTED MILLION-DOLLAR HERO
      ========================================= */}
      <section className="relative min-h-[100svh] flex flex-col justify-center pt-32 pb-24 overflow-hidden">
        
        {/* Background Image & Crisp Overlays */}
        <div className="absolute inset-0 z-0">
          <img src="/login-bg.png" alt="Farm Sunrise" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 z-0 bg-slate-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center">
          
          {/* Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-10 shadow-xl"
          >
            <ShieldCheck size={16} className="text-green-400" /> Trusted by 50,000+ Indian Farmers
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl"
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tight leading-[1.05] mb-8">
              The Operating System <br className="hidden md:block" />
              for <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Modern Farms.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
              Supercharge your yield with AI disease detection, satellite GPS mapping, and real-time market intelligence.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center"
          >
            <Link href="/signup" className="flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white rounded-full text-lg font-bold hover:bg-green-500 hover:shadow-xl hover:shadow-green-600/30 hover:-translate-y-1 transition-all">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-lg font-bold hover:bg-white/20 transition-all">
              Explore Features
            </Link>
          </motion.div>

          {/* Micro-Interactions (Moved here to prevent text overlap) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 flex flex-col sm:flex-row items-center gap-6"
          >
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl hover:-translate-y-1 transition-transform">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400"><CloudSun size={24} /></div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Weather</p>
                <p className="text-lg font-black text-white">28°C · Sunny</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl hover:-translate-y-1 transition-transform">
              <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><TrendingUp size={24} /></div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Wheat (Mandi)</p>
                <p className="text-lg font-black text-white">₹2,340 <span className="text-sm text-green-400">↑ 4.2%</span></p>
              </div>
            </div>
          </motion.div>

        </div>

      </section>

      {/* =========================================
          STEP 2: BENTO BOX FEATURES
      ========================================= */}
      <section id="features" className="py-32 bg-slate-50 relative z-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6 xl:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-green-600 font-bold tracking-widest uppercase text-sm mb-4">Platform Features</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Everything You Need. <br/>Nothing You Don't.</h3>
            <p className="text-lg text-slate-600 font-medium">A comprehensive, enterprise-grade suite designed to increase productivity, reduce costs, and help you make smarter decisions instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* BIG CARD: AI Disease Detection (Spans 2 cols on desktop) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner border border-blue-100">
                <Scan size={28} />
              </div>
              <h4 className="text-3xl font-black text-slate-900 mb-4">AI Disease Detection</h4>
              <p className="text-slate-600 text-lg max-w-md leading-relaxed">Upload a photo of your crop. Our advanced machine learning models instantly identify 50+ diseases and provide actionable treatment advice.</p>
              
              {/* Decorative visual */}
              <div className="absolute -bottom-10 -right-10 w-72 h-48 bg-slate-50 rounded-tl-3xl border-t border-l border-slate-200 shadow-2xl p-4 hidden sm:block transform group-hover:-translate-y-4 group-hover:-translate-x-4 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="w-full h-24 bg-slate-200 rounded-xl overflow-hidden relative">
                  <img src="/login-bg.png" alt="Scanner demo" className="w-full h-full object-cover opacity-80 grayscale" />
                  <div className="absolute inset-0 border-2 border-green-500 border-dashed m-2 rounded-lg bg-green-500/10" />
                </div>
              </div>
            </motion.div>

            {/* SQUARE CARD: GPS Calculator */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner border border-green-100">
                <Calculator size={28} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4">GPS Area Calculator</h4>
              <p className="text-slate-600 leading-relaxed font-medium">Calculate farm boundaries precisely using GPS technology and interactive satellite maps.</p>
            </motion.div>

            {/* SQUARE CARD: Market Intelligence */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner border border-purple-100">
                <BarChart2 size={28} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4">Market Intelligence</h4>
              <p className="text-slate-600 leading-relaxed font-medium">Real-time Mandi prices, trend charts, and smart alerts when your crop price peaks.</p>
            </motion.div>

            {/* WIDE CARD: Equipment Rental (Spans 2 cols) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:col-span-2 bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm relative overflow-hidden group cursor-pointer transform-gpu"
            >
              {/* Removed mix-blend-overlay as it causes severe scroll lag */}
              <div className="absolute inset-0 bg-[url('/login-bg.png')] bg-cover bg-center opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg border border-amber-400">
                  <Tractor size={28} />
                </div>
                <h4 className="text-3xl font-black text-white mb-4">Equipment Rental Hub</h4>
                <p className="text-slate-300 text-lg max-w-md leading-relaxed mb-8">Rent tractors, harvesters, and heavy machinery from verified owners near your farm. Book instantly and securely.</p>
                <Link href="#" className="inline-flex items-center gap-2 text-amber-400 font-bold hover:text-amber-300 transition-colors">
                  View Machinery <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================
          STEP 3: HOW IT WORKS & SOCIAL PROOF
      ========================================= */}
      <section id="how-it-works" className="py-32 bg-slate-900 relative z-20 overflow-hidden scroll-mt-16 transform-gpu">
        {/* Glow effect optimized with radial gradient instead of heavy CSS blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 xl:px-8">
          
          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-b border-white/10 pb-20">
            {[
              { label: 'Active Farmers', value: 50000, suffix: '+', icon: Users },
              { label: 'States Covered', value: 18, suffix: '+', icon: Leaf },
              { label: 'Detection Accuracy', value: 95, suffix: '%', icon: Award },
              { label: 'App Rating', value: 4.9, decimals: 1, suffix: '/5', icon: Star }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto bg-white/5 text-green-400 rounded-full flex items-center justify-center mb-4 border border-white/10">
                  <stat.icon size={24} />
                </div>
                <h4 className="text-4xl md:text-5xl font-black text-white mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                </h4>
                <p className="text-slate-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* How It Works - Staggered Layout */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-green-500 font-bold tracking-widest uppercase text-sm mb-4">How It Works</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Three Steps to a <br/>Smarter Harvest.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent hidden md:block -z-10" />
            
            {[
              { step: '01', title: 'Create Free Account', desc: 'Sign up in 30 seconds using just your phone number or email.' },
              { step: '02', title: 'Map Your Farm', desc: 'Use our GPS tool to trace your field boundaries for exact calculations.' },
              { step: '03', title: 'Get AI Insights', desc: 'Instantly access disease detection, weather, and market prices.' }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/10 transition-colors group"
              >
                <div className="w-16 h-16 mx-auto bg-green-500 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl font-black shadow-[0_0_30px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================
          TESTIMONIALS SECTION
      ========================================= */}
      <section id="testimonials" className="py-32 bg-slate-50 relative z-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6 xl:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-green-600 font-bold tracking-widest uppercase text-sm mb-4">Farmer Success Stories</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Don't just take our word for it.</h3>
            <p className="text-lg text-slate-600 font-medium">Hear how Smart Farming India is changing the lives of farmers across the country.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Rajesh Kumar", location: "Punjab", text: "The AI disease detection saved my entire wheat crop this season. I uploaded a photo and knew exactly what pesticide to buy within seconds.", role: "Wheat Farmer" },
              { name: "Amit Patel", location: "Gujarat", text: "Using the GPS calculator helped me measure my field accurately for the first time. I ended up saving 15% on fertilizer costs because I wasn't over-ordering.", role: "Cotton Farmer" },
              { name: "Suresh Singh", location: "Haryana", text: "The Mandi price alerts are a game changer. I waited exactly two extra days to sell my harvest and made an extra ₹20,000 profit.", role: "Sugarcane Farmer" }
            ].map((t, i) => (
              <motion.div 
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="flex text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 italic">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-sm font-medium text-slate-500">{t.role} • {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          STEP 4: FINAL CTA & ENTERPRISE FOOTER
      ========================================= */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6 xl:px-8">
          
          {/* FLOATING CTA BANNER */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-green-600 to-emerald-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl mb-24 transform-gpu"
          >
            {/* Optimized Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent rounded-full -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Ready to Transform <br className="hidden sm:block" /> Your Farming?</h2>
            <p className="text-green-100 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">Join thousands of farmers already using AI and satellite data to maximize their yield and profit.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-green-700 font-bold rounded-full text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all">
                Start Free Trial
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/20 transition-all">
                View Live Demo
              </Link>
            </div>
          </motion.div>

          {/* MULTI-COLUMN FOOTER */}
          <footer className="pt-12 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
              
              <div className="col-span-2 lg:col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 bg-green-600 rounded-lg text-white">
                    <Leaf size={18} strokeWidth={2.5} />
                  </div>
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">Smart Farming<span className="text-green-500">.</span></span>
                </Link>
                <p className="text-slate-500 font-medium max-w-sm mb-6 leading-relaxed">Empowering Indian agriculture with world-class AI, satellite mapping, and real-time market data to ensure a prosperous tomorrow.</p>
                <div className="space-y-3">
                  <p className="flex items-center gap-3 text-sm font-semibold text-slate-600"><Phone size={16} className="text-green-500"/> +91 1800-SMART-FARM</p>
                  <p className="flex items-center gap-3 text-sm font-semibold text-slate-600"><Mail size={16} className="text-green-500"/> support@smartfarming.in</p>
                  <p className="flex items-center gap-3 text-sm font-semibold text-slate-600"><MapPin size={16} className="text-green-500"/> AgriTech Park, Bengaluru</p>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-sm">Platform</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                  <li><Link href="/login" className="hover:text-green-600 transition-colors">AI Disease Detection</Link></li>
                  <li><Link href="/login" className="hover:text-green-600 transition-colors">GPS Area Calculator</Link></li>
                  <li><Link href="/login" className="hover:text-green-600 transition-colors">Live Mandi Prices</Link></li>
                  <li><Link href="/login" className="hover:text-green-600 transition-colors">Equipment Rental</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-sm">Company</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                  <li><Link href="/about" className="hover:text-green-600 transition-colors">About Us</Link></li>
                  <li><Link href="/careers" className="hover:text-green-600 transition-colors">Careers</Link></li>
                  <li><Link href="/partner-network" className="hover:text-green-600 transition-colors">Partner Network</Link></li>
                  <li><Link href="/press" className="hover:text-green-600 transition-colors">Press & Media</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-sm">Legal</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                  <li><Link href="/privacy" className="hover:text-green-600 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-green-600 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/security" className="hover:text-green-600 transition-colors">Data Security</Link></li>
                  <li><Link href="/refund" className="hover:text-green-600 transition-colors">Refund Policy</Link></li>
                </ul>
              </div>

            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-400">© 2026 Smart Farming India. All rights reserved.</p>
              <div className="flex gap-6 text-sm font-bold text-slate-400">
                <Link href="#" className="hover:text-green-600 transition-colors">Twitter</Link>
                <Link href="#" className="hover:text-green-600 transition-colors">LinkedIn</Link>
                <Link href="#" className="hover:text-green-600 transition-colors">YouTube</Link>
              </div>
            </div>
          </footer>

        </div>
      </section>

    </div>
  )
}
