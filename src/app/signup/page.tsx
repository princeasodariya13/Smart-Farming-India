"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User, Phone } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' })
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
    <div className="min-h-screen flex text-slate-900 bg-white font-sans">
      
      {/* --- LEFT PANEL (Visual/Branding) --- */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/login-bg.png" alt="Smart Farming" className="w-full h-full object-cover opacity-60" />
        </div>
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 to-slate-900/90 z-0" />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="bg-white p-2 rounded-xl text-green-700 shadow-xl group-hover:scale-105 transition-transform">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Smart Farming<span className="text-green-400">.</span></span>
          </Link>
        </div>

        <div className="relative z-10 mt-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl font-black text-white leading-tight mb-6">
              Join the Future of<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">
                Modern Agriculture.
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-md leading-relaxed mb-12">
              Create your free account today to access AI disease detection, live market prices, and precision farming tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10">
            <div>
              <p className="text-3xl font-black text-white">50k+</p>
              <p className="text-sm text-green-400 font-medium mt-1">Active Farmers</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">95%</p>
              <p className="text-sm text-green-400 font-medium mt-1">AI Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">24/7</p>
              <p className="text-sm text-green-400 font-medium mt-1">Expert Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL (Form) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-24 relative bg-slate-50">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
           <div className="bg-green-600 p-1.5 rounded-lg text-white">
              <Leaf size={18} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Smart Farming.</span>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500">Join 50,000+ farmers revolutionizing agriculture</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                  placeholder="Kisan Kumar"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address (Optional)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                  placeholder="farmer@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-start pb-2 mt-2">
              <input id="terms" type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-slate-300 text-green-600 focus:ring-green-500" />
              <label htmlFor="terms" className="ml-2 text-sm text-slate-600 font-medium">
                I agree to the <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 transition-all disabled:opacity-70 disabled:hover:shadow-none mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-slate-50 px-6 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button 
              onClick={() => signIn('facebook', { callbackUrl: '/dashboard' })}
              type="button"
              className="flex items-center justify-center gap-3 bg-white border border-slate-200 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg> Facebook
            </button>
            <button 
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              type="button"
              className="flex items-center justify-center gap-3 bg-white border border-slate-200 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg> Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600 font-medium">
            Already have an account? <Link href="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
