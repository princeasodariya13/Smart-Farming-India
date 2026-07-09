import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Facebook } from 'lucide-react'
import './AuthPages.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success && data.data?.user) {
        login(data.data.user, data.data.token)
        navigate('/dashboard')
      } else {
        setError(data.message || 'Invalid email or password.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // DEMO LOGIN — works without backend
  const demoLogin = (role: string) => {
    const demoUsers: Record<string, any> = {
      farmer:   { id: '1', name: 'Rajesh Kumar', email: 'farmer@demo.com', role: 'farmer', location: 'Punjab' },
      owner:    { id: '2', name: 'Amit Patel', email: 'owner@demo.com', role: 'owner', location: 'Gujarat' },
      supplier: { id: '3', name: 'Sunita Singh', email: 'supplier@demo.com', role: 'supplier', location: 'Maharashtra' },
      admin:    { id: '4', name: 'Admin User', email: 'admin@demo.com', role: 'admin', location: 'Delhi' },
    }
    login(demoUsers[role], 'demo-token-' + role)
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-panel auth-panel--left">
        <div className="auth-panel__bg" />
        <div className="auth-panel__content">
          <Link to="/" className="auth-panel__logo">
            <div className="auth-logo">
            <Leaf size={28} />
            <span>Smart Farming India</span>
          </div>
          </Link>
          <div className="auth-panel__hero">
            <h1>Welcome Back<br />to Smart Farming</h1>
            <p>Access AI disease detection, live market prices, equipment rental, and all your farming tools in one place.</p>
          </div>
          <div className="auth-panel__stats">
            <div className="auth-panel__stat">
              <span className="auth-panel__stat-value">50,000+</span>
              <span className="auth-panel__stat-label">Active Farmers</span>
            </div>
            <div className="auth-panel__stat-divider" />
            <div className="auth-panel__stat">
              <span className="auth-panel__stat-value">95%</span>
              <span className="auth-panel__stat-label">Detection Accuracy</span>
            </div>
            <div className="auth-panel__stat-divider" />
            <div className="auth-panel__stat">
              <span className="auth-panel__stat-value">24/7</span>
              <span className="auth-panel__stat-label">Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your farm dashboard</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon-left" />
                <input
                  type="email"
                  className="form-control has-icon-left"
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="auth-form__label-row">
                <label className="form-label">Password</label>
              </div>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control has-icon-left has-icon-right"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="input-icon-right auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-form__label-row" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
              <label className="remember-row" style={{ cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--green-600)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-form__forgot">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
              {isLoading ? <><div className="spinner" style={{ width: '1rem', height: '1rem', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
            
            <div className="divider" style={{ margin: '1.5rem 0' }}>Or continue with</div>

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
          </form>

          <div className="demo-grid" style={{ marginTop: '1rem' }}>
            {['farmer','owner','supplier','admin'].map(role => (
              <button key={role} className="demo-btn" onClick={() => demoLogin(role)}>
                <span className="demo-btn__role">{role}</span>
              </button>
            ))}
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
