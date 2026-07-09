"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Leaf, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Password reset link sent to your email.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to send reset link.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('An unexpected error occurred.')
    }
  }

  return (
    <div className="min-h-screen flex text-slate-900 bg-slate-50/50 font-sans items-center justify-center p-6">
      
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100/80">
        
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-green-600 p-2 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Smart Farming.</span>
          </Link>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Reset Password</h2>
          <p className="text-slate-500 text-sm font-medium">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{message}</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 font-medium">{message}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                placeholder="farmer@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Send Reset Link <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-green-600 transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
