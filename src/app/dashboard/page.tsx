"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Leaf, Calculator, Scan, DollarSign, Tractor, Package, 
  BarChart2, Bell, Settings, LogOut, ChevronDown, 
  CloudSun, Droplets, Wind, ArrowRight
} from 'lucide-react'

// Mock Data for Dashboard
const WEATHER = { temp: '28°C', condition: 'Sunny', humidity: '45%', wind: '12 km/h' }
const USER = { name: 'Prince Asodariya', initials: 'PA', role: 'Premium Farmer' }

const PRIMARY_CARDS = [
  {
    title: 'GPS Area Calculator',
    desc: 'Map your farm boundaries with satellite precision to calculate seed & fertilizer needs.',
    icon: Calculator,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80',
    color: 'bg-emerald-500',
    link: '/calculator'
  },
  {
    title: 'AI Disease Detection',
    desc: 'Instantly diagnose crop diseases by uploading a photo. Get actionable treatment plans.',
    icon: Scan,
    image: 'https://images.unsplash.com/photo-1592982537447-6f29910d52b9?auto=format&fit=crop&q=80',
    color: 'bg-blue-500',
    link: '/disease-detection'
  },
  {
    title: 'Cost & Profit Planning',
    desc: 'Track expenses, project harvest revenues, and optimize your seasonal budget.',
    icon: DollarSign,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80',
    color: 'bg-amber-500',
    link: '/cost-planning'
  }
]

const SECONDARY_CARDS = [
  { title: 'Equipment Rental', desc: 'Rent tractors & heavy machinery locally.', icon: Tractor, color: 'text-purple-600', bg: 'bg-purple-100' },
  { title: 'Farm Supply Shop', desc: 'Order seeds, fertilizers, and pesticides.', icon: Package, color: 'text-rose-600', bg: 'bg-rose-100' },
  { title: 'Market Intelligence', desc: 'Live Mandi prices and demand forecasts.', icon: BarChart2, color: 'text-indigo-600', bg: 'bg-indigo-100' }
]

export default function Dashboard() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-slate-900 font-sans pb-24">
      
      {/* --- STICKY GLASSMORPHIC NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-3' : 'bg-white/50 backdrop-blur-md py-4 border-b border-white/40'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-2 rounded-xl text-white shadow-lg">
              <Leaf size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Smart Farming<span className="text-green-600">.</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Digital Agriculture</p>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100/50 rounded-full border border-slate-200/50">
            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-white shadow-sm text-sm font-bold text-green-700">Dashboard</Link>
            <Link href="#" className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Calculator</Link>
            <Link href="#" className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">AI Scanner</Link>
            <Link href="#" className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Planning</Link>
          </div>

          {/* Right Profile */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors bg-white rounded-full shadow-sm border border-slate-100">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 pl-2 pr-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                  {USER.initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-800 leading-tight">{USER.name}</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>
              
              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="font-bold text-sm text-slate-900">{USER.name}</p>
                    <p className="text-xs font-medium text-green-600">{USER.role}</p>
                  </div>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-green-600"><Settings size={16}/> Settings</Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut size={16}/> Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 pt-32">
        
        {/* Welcome & Weather Widget */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Welcome back, {USER.name.split(' ')[0]} 👋</h2>
            <p className="text-slate-500 font-medium text-lg">Your farm is looking healthy today. Here is your digital toolkit.</p>
          </div>
          
          <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
              <CloudSun size={28} className="text-amber-500" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{WEATHER.condition}</p>
                <p className="text-xl font-black text-slate-800 leading-none">{WEATHER.temp}</p>
              </div>
            </div>
            <div className="flex gap-4">
               <div className="flex flex-col items-center gap-1">
                 <Droplets size={16} className="text-blue-400" />
                 <span className="text-xs font-bold text-slate-600">{WEATHER.humidity}</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                 <Wind size={16} className="text-slate-400" />
                 <span className="text-xs font-bold text-slate-600">{WEATHER.wind}</span>
               </div>
            </div>
          </div>
        </div>

        {/* --- PREMIUM 3-COLUMN GRID --- */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {PRIMARY_CARDS.map((card, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={card.title} 
              className="group relative h-[380px] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 cursor-pointer"
            >
              <div className="absolute inset-0 bg-slate-900 z-0">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
              </div>
              
              <div className="relative z-10 h-full flex flex-col p-8">
                <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center text-white shadow-lg mb-auto`}>
                  <card.icon size={24} />
                </div>
                
                <div className="mt-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-slate-300 font-medium text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto">
                    {card.desc}
                  </p>
                  <Link href={card.link} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full backdrop-blur-md text-sm font-bold transition-all border border-white/30">
                    Open Tool <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- SECONDARY TOOLS GRID --- */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-1 bg-green-500 rounded-full" /> Marketplace & Intelligence
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {SECONDARY_CARDS.map((card, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1), duration: 0.5 }}
                key={card.title} 
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-green-100 transition-all group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <card.icon size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">{card.desc}</p>
                <Link href="#" className={`text-sm font-bold flex items-center gap-1 ${card.color} opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all`}>
                  Explore <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
