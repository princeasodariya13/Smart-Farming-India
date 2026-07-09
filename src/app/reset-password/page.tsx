"use client"

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Leaf, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setStatus('error')
      setMessage('Passwords do not match.')
      return
    }

    if (!token) {
      setStatus('error')
      setMessage('Invalid or missing reset token.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStatus('success')
        setMessage('Password successfully reset. Redirecting to login...')
        setTimeout(() => router.push('/login'), 2500)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to reset password.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('An unexpected error occurred.')
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
      <div className="flex justify-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="bg-green-600 p-2.5 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform">
            <Leaf size={24} />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Smart Farming.</span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">New Password</h2>
        <p className="text-slate-500 font-medium">Create a new, strong password for your account.</p>
      </div>

      {status === 'error' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{message}</p>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
          <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 font-medium">{message}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
              placeholder="••••••••••••"
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

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
              placeholder="••••••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Reset Password <ArrowRight size={18} /></>
          )}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex text-slate-900 bg-slate-50 font-sans items-center justify-center p-6">
      <Suspense fallback={<div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
