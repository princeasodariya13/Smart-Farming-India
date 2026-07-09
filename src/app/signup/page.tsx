"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Loader2, Tractor, Brain, Store, Landmark, 
  User, Smartphone, Mail, Lock, Eye, EyeOff, 
  MapPin, LayoutGrid, ChevronDown, ArrowRight, Fingerprint, Home 
} from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    password: '',
    location: '', 
    category: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        router.push('/login?registered=true')
      } else {
        setError(data.error || 'Failed to create account. Please try again.')
      }
    } catch (err) {
      setError('A network error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4 md:p-8 font-sans relative">
      <Link 
        href="/" 
        className="absolute top-6 left-6 p-2.5 bg-white/80 hover:bg-white rounded-full shadow-sm backdrop-blur-sm transition-all border border-outline-variant text-on-surface-variant hover:text-primary z-50 flex items-center justify-center group"
      >
        <Home size={20} className="group-hover:scale-110 transition-transform" />
      </Link>
      <main className="w-full max-w-[1200px] min-h-[800px] flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-2xl bg-white border border-outline-variant">
        
        {/* --- LEFT PANEL --- */}
        <section className="hidden md:flex w-1/2 bg-gradient-to-br from-[#0d631b] to-[#1b6d24] relative flex-col justify-between p-12 text-white">
          {/* Grid Background */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            {/* Logo Header */}
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <Tractor className="text-primary w-6 h-6" />
              </div>
              <span className="text-[24px] leading-[32px] font-bold tracking-tight text-white">Smart Farming India</span>
            </div>
            
            {/* Hero Text */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-[48px] leading-[56px] font-bold tracking-[-0.02em] text-white mb-8">
                Join the Future of<br/>Indian Agriculture
              </h1>

              {/* Feature List */}
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center shrink-0">
                    <Brain className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] leading-[24px] font-bold text-white">AI-Powered Insights</h3>
                    <p className="text-[14px] leading-[20px] font-medium tracking-[0.01em] text-white/70 mt-1">Predictive analytics for higher crop yield and health.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center shrink-0">
                    <Store className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] leading-[24px] font-bold text-white">Direct Marketplace Access</h3>
                    <p className="text-[14px] leading-[20px] font-medium tracking-[0.01em] text-white/70 mt-1">Eliminate middlemen and sell directly to top buyers.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center shrink-0">
                    <Landmark className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] leading-[24px] font-bold text-white">Seamless Government Integration</h3>
                    <p className="text-[14px] leading-[20px] font-medium tracking-[0.01em] text-white/70 mt-1">Instant updates on schemes, subsidies, and grants.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative z-10 bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-xl flex items-center gap-4 mt-auto"
          >
            <div className="flex -space-x-3 shrink-0">
              <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" alt="Farmer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgNUT1VOI4HsoAx8rAvO3BQWCFjP-ohqow9-ZWnJtpUqlmidTIoMrBc6rKnbVMrosMJAFbrF3El7hGoj8FmXnJUHLH1qR0qg8W3CWfradvT11OQKMbVgkJv5JZm1LB4A9_loELPHpUbEsOPWT6mkY71IlrogQWI7zSwHh_lrmwwPXPmCTtdk-QlMCV7eEEI8Rq_2s36QwdTWT37KkDYzfa-3BiTpu6O5xTwpsbLcSesA5iWWLwdfkw_wL1hgR2giknpt4n65xUrQ"/>
              <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" alt="Farmer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAry1mSLERN1Ct8oshbkECVA8J3FYCPz4XSSAHKnscnd9W3LmmTqLzCL0p18hlaP9d7Ev2RRR2YHd4-8Wh3nVDMF_PHZXobq3I5siWJt7H3A-qWShUga8VYGAcuFuxwuor4chokC5ELoun7fJ_qgWQ_Lp3Zs4GMOAfclrdWHRwD8IPenqSCAvUNV5mWbH8NJokb_qimayHnGROG3RjVGtSAR8d2cly5Ca4s0R4rN2WNVl_HbjeanzFAk7mWPY9CQZ6aCiZuol9JgQ"/>
              <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" alt="Farmer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqYdwCPxiyuWjD5zii4zV052axR04bqpcrzWbziualpu50foayZUGWWGdpfYQec57wNFJdr2PokOd-h4Y0PpF34oYuqwmfk-gIT8yJ3EYyWi7zKb-MnpEjVYLTUYH6GGiPdwUj1JiuUr6giKR7cyh3HIuwHo78CVr5nYLtD-2zuoQoJsvIvK-HBryIQi49eXsYAovRRvlW4FWuQ22kBb02OFSeOHuo7gza2mzIXOHSV9Ov91Ayze8Ck5qV82gk5saJ7bqiytg18A"/>
            </div>
            <div>
              <p className="text-[12px] leading-[16px] font-semibold text-white">1.2M+ Farmers Joined</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/60 mt-1">Growing India's Prosperity</p>
            </div>
          </motion.div>
        </section>

        {/* --- RIGHT PANEL --- */}
        <section className="w-full md:w-1/2 flex flex-col p-8 md:p-12 lg:p-16 overflow-y-auto bg-white">
          <header className="mb-8">
            <h2 className="text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-on-surface mb-2">Create Account</h2>
            <p className="text-[16px] leading-[24px] font-normal text-on-surface-variant">Start your journey towards tech-driven farming today.</p>
          </header>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error-container/40 border border-error-container text-[14px] leading-[20px] font-medium text-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="text-[14px] leading-[20px] font-medium tracking-[0.01em] text-on-surface-variant flex items-center gap-2 mb-2">
                <User className="w-[18px] h-[18px] text-gray-600" />
                Full Name
              </label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-[16px] leading-[24px] font-normal text-on-surface transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-outline" 
                placeholder="e.g., Rajesh Kumar" 
                type="text"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-[14px] leading-[20px] font-medium tracking-[0.01em] text-on-surface-variant flex items-center gap-2 mb-2">
                <Smartphone className="w-[18px] h-[18px] text-gray-600" />
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-4 bg-surface-container-low border border-outline-variant rounded-xl text-[16px] leading-[24px] text-on-surface-variant">
                  +91
                </div>
                <input 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="flex-1 px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-[16px] leading-[24px] font-normal text-on-surface transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-outline min-w-0" 
                  placeholder="9876543210" 
                  type="tel"
                />
              </div>
            </div>

            {/* Email & Password (Injected) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[14px] leading-[20px] font-medium tracking-[0.01em] text-on-surface-variant flex items-center gap-2 mb-2">
                  <Mail className="w-[18px] h-[18px] text-gray-600" />
                  Email Address
                </label>
                <input 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-[16px] leading-[24px] font-normal text-on-surface transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-outline" 
                  placeholder="rajesh@example.com" 
                  type="email"
                />
              </div>
              <div>
                <label className="text-[14px] leading-[20px] font-medium tracking-[0.01em] text-on-surface-variant flex items-center gap-2 mb-2">
                  <Lock className="w-[18px] h-[18px] text-gray-600" />
                  Password
                </label>
                <div className="relative">
                  <input 
                    required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-4 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-[16px] leading-[24px] font-normal text-on-surface transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-outline" 
                    placeholder="Create a password" 
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Farm Location & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[14px] leading-[20px] font-medium tracking-[0.01em] text-on-surface-variant flex items-center gap-2 mb-2">
                  <MapPin className="w-[18px] h-[18px] text-gray-600" />
                  Farm Location
                </label>
                <div className="relative">
                  <select 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full appearance-none bg-none px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-[16px] leading-[24px] font-normal text-on-surface transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-outline cursor-pointer"
                  >
                    <option value="">Select State</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-5 h-5" />
                </div>
              </div>

              <div>
                <label className="text-[14px] leading-[20px] font-medium tracking-[0.01em] text-on-surface-variant flex items-center gap-2 mb-2">
                  <LayoutGrid className="w-[18px] h-[18px] text-gray-600" />
                  Farmer Category
                </label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full appearance-none bg-none px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-[16px] leading-[24px] font-normal text-on-surface transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-outline cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="Small">Small &amp; Marginal</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-5 h-5" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-surface-tint text-white rounded-xl py-4 text-[14px] leading-[20px] font-medium tracking-[0.01em] flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2 disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-outline-variant"></div>
            <span className="text-[12px] leading-[16px] font-semibold text-on-surface-variant uppercase tracking-wider">OR SIGN UP WITH</span>
            <div className="h-[1px] flex-1 bg-outline-variant"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <button 
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              type="button"
              className="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="text-[14px] leading-[20px] font-medium tracking-[0.01em] text-on-surface">Continue with Google</span>
            </button>
          </div>

          <footer className="mt-auto pt-6 text-center">
            <p className="text-[16px] leading-[24px] font-normal text-on-surface-variant">
              Already have an account?{' '}
              <Link className="text-primary font-bold hover:underline" href="/login">
                Login
              </Link>
            </p>
          </footer>
        </section>
      </main>
    </div>
  )
}
