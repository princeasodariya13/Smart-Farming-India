import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf, User, Mail, Lock, Phone, Eye, EyeOff, MapPin, ArrowRight, Shield, AlertCircle, CheckCircle, Facebook } from 'lucide-react'
import './AuthPages.css'

const ROLES = [
  { value: 'farmer', label: 'Farmer', emoji: '🌾', desc: 'Access all farming tools' },
  { value: 'owner', label: 'Equipment Owner', emoji: '🚜', desc: 'List & rent equipment' },
  { value: 'supplier', label: 'Supplier', emoji: '📦', desc: 'Sell farm supplies' },
]

const SignupPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'farmer', password: '', confirmPassword: '', otp: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (resendTimer > 0) t = setTimeout(() => setResendTimer(v => v - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const set = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    setError('')
  }

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setIsLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP')
      setSuccess(`OTP sent to ${form.email}`)
      setStep(2); setResendTimer(60)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally { setIsLoading(false) }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: form.role, otp: form.otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'OTP verification failed')
      login(data.data.user, data.data.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally { setIsLoading(false) }
  }

  return (
    <div className="auth-page">
      {/* Left */}
      <div className="auth-panel auth-panel--left">
        <div className="auth-panel__bg" />
        <div className="auth-panel__content">
          <Link to="/" className="auth-panel__logo">
            <div className="auth-panel__logo-icon"><Leaf size={22} /></div>
            <span>Smart Farming India</span>
          </Link>
          <div className="auth-panel__hero">
            <h1>Join 50,000+<br />Smart Farmers</h1>
            <p>Create your free account and start using AI-powered farming tools in minutes. No credit card required.</p>
          </div>
          <div className="auth-panel__features">
            {['AI crop disease detection','Live mandi price alerts','GPS farm area calculator','Equipment rental marketplace'].map(f => (
              <div key={f} className="auth-panel__feature">
                <CheckCircle size={16} style={{ color: 'var(--green-400)', flexShrink: 0 }} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <div className="step-progress" style={{ marginBottom: '0.75rem' }}>
              <div className={`step-dot ${step >= 1 ? 'step-dot--active' : ''}`} />
              <div style={{ flex: 1, height: 1, background: step === 2 ? 'var(--green-400)' : 'var(--gray-200)' }} />
              <div className={`step-dot ${step >= 2 ? 'step-dot--active' : ''}`} />
            </div>
            <h2>{step === 1 ? 'Create Account' : 'Verify Email'}</h2>
            <p>{step === 1 ? 'Fill in your details to get started' : `Enter the 6-digit OTP sent to ${form.email}`}</p>
          </div>

          {error && <div className="alert alert-error"><AlertCircle size={16} />{error}</div>}
          {success && step === 2 && <div className="alert alert-success"><CheckCircle size={16} />{success}</div>}

          {step === 1 ? (
            <form className="auth-form" onSubmit={handleRequestOTP}>
              {/* Role Selection */}
              <div className="form-group">
                <label className="form-label">I am a...</label>
                <div className="role-picker">
                  {ROLES.map(r => (
                    <button key={r.value} type="button" className={`role-option ${form.role === r.value ? 'role-option--active' : ''}`} onClick={() => set('role', r.value)}>
                      <span className="role-option__emoji">{r.emoji}</span>
                      <span className="role-option__label">{r.label}</span>
                      <span className="role-option__desc">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon-left" />
                  <input type="text" className="form-control has-icon-left" placeholder="Rajesh Kumar" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon-left" />
                  <input type="email" className="form-control has-icon-left" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone (optional)</label>
                <div className="input-wrapper">
                  <Phone size={16} className="input-icon-left" />
                  <input type="tel" className="form-control has-icon-left" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon-left" />
                  <input type={showPassword ? 'text' : 'password'} className="form-control has-icon-left has-icon-right" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
                  <button type="button" className="input-icon-right auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon-left" />
                  <input type="password" className="form-control has-icon-left" placeholder="Confirm your password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
                {isLoading ? <><div className="spinner" style={{ width: '1rem', height: '1rem', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Sending OTP...</> : <>Send OTP <ArrowRight size={16} /></>}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleVerifyOTP}>
              <div className="otp-display">OTP sent to <strong>{form.email}</strong></div>
              <div className="form-group">
                <label className="form-label">6-Digit OTP</label>
                <input type="text" className="form-control otp-input" placeholder="• • • • • •" value={form.otp} onChange={e => set('otp', e.target.value)} maxLength={6} required />
              </div>
              <div className="resend-row">
                <span>Didn't get it?</span>
                <button type="button" className="resend-btn" disabled={resendTimer > 0} onClick={handleRequestOTP}>
                  Resend OTP{resendTimer > 0 ? ` (${resendTimer}s)` : ''}
                </button>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
                {isLoading ? <><div className="spinner" style={{ width: '1rem', height: '1rem', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Verifying...</> : <>Verify & Create Account <ArrowRight size={16} /></>}
              </button>
              <button type="button" className="btn" style={{ width: '100%', background: 'transparent', color: 'var(--gray-500)', border: '1px solid var(--gray-200)' }} onClick={() => setStep(1)}>
                ← Back
              </button>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="divider" style={{ margin: '1.5rem 0' }}>Or sign up with</div>

              <div className="social-login-grid">
                <button type="button" className="btn-social">
                  <Facebook size={18} color="#1877F2" /> Facebook
                </button>
                <button type="button" className="btn-social">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg> Google
                </button>
              </div>
            </>
          )}

          <p className="auth-switch" style={{ marginTop: '1rem' }}>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
