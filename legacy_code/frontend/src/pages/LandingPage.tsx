import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Leaf, Calculator, Scan, DollarSign, BarChart2, Tractor, Package,
  ArrowRight, Star, Users, Award, Clock, Shield, TrendingUp, Menu, X,
  MapPin, Phone, Mail, ChevronRight, Play, CheckCircle, Zap, Globe
} from 'lucide-react'
import './LandingPage.css'

const FEATURES = [
  {
    icon: Calculator,
    title: 'GPS Area Calculator',
    desc: 'Calculate farm boundaries precisely using GPS technology and interactive satellite maps.',
    color: '#16a34a',
    bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
    tag: 'For Farmers',
  },
  {
    icon: Scan,
    title: 'AI Disease Detection',
    desc: 'Upload a photo of your crop — our AI instantly identifies 50+ diseases with treatment advice.',
    color: '#2563eb',
    bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    tag: 'AI Powered',
  },
  {
    icon: DollarSign,
    title: 'Cost Planning',
    desc: 'Plan seasonal budgets, track expenses, and get AI-powered crop profitability insights.',
    color: '#d97706',
    bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    tag: 'Finance',
  },
  {
    icon: BarChart2,
    title: 'Market Intelligence',
    desc: 'Real-time mandi prices, trend charts, and alerts when your crop price peaks.',
    color: '#7c3aed',
    bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    tag: 'Live Data',
  },
  {
    icon: Tractor,
    title: 'Equipment Rental',
    desc: 'Rent tractors, harvesters and more from verified owners near your farm — book in minutes.',
    color: '#0891b2',
    bg: 'linear-gradient(135deg, #ecfeff, #cffafe)',
    tag: 'Marketplace',
  },
  {
    icon: Package,
    title: 'Farm Supply',
    desc: 'Order seeds, fertilizers and tools from trusted suppliers with fast farm-door delivery.',
    color: '#e11d48',
    bg: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
    tag: 'E-Commerce',
  },
]

const STATS = [
  { value: '50,000+', label: 'Active Farmers', icon: Users },
  { value: '₹2.5 Cr+', label: 'Equipment Rentals', icon: Tractor },
  { value: '95%', label: 'Detection Accuracy', icon: Award },
  { value: '24/7', label: 'Support Available', icon: Clock },
]

const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    role: 'Wheat Farmer',
    location: 'Ludhiana, Punjab',
    stars: 5,
    text: "The disease detection saved my entire wheat crop last season. Diagnosed blight in minutes — I would have lost ₹3 lakhs!",
    initials: 'RK',
    color: '#16a34a',
  },
  {
    name: 'Priya Sharma',
    role: 'Organic Farmer',
    location: 'Mysore, Karnataka',
    stars: 5,
    text: "The cost planning tools helped me optimize my budget and increase profits by 40%. The market alerts are a game-changer.",
    initials: 'PS',
    color: '#7c3aed',
  },
  {
    name: 'Amit Patel',
    role: 'Equipment Owner',
    location: 'Ahmedabad, Gujarat',
    stars: 5,
    text: "As an equipment owner, this platform tripled my rental income. Connecting with farmers is seamless and bookings are smooth.",
    initials: 'AP',
    color: '#2563eb',
  },
]

const WHY_US = [
  { icon: Shield, title: 'Trusted by 50,000+ Farmers', desc: 'Verified data, secure payments, and real support from agricultural experts.' },
  { icon: TrendingUp, title: 'Proven Results', desc: 'Average 40% productivity gain and 30% cost reduction for our active users.' },
  { icon: Award, title: 'Award-Winning Platform', desc: 'Recognized by ICAR and NABARD for innovation in digital agriculture.' },
  { icon: Zap, title: 'AI-First Approach', desc: 'Every feature is powered by the latest machine learning and satellite data.' },
]

const STEPS = [
  { step: '01', title: 'Create Account', desc: 'Sign up in 60 seconds. Choose your role — Farmer, Equipment Owner, or Supplier.' },
  { step: '02', title: 'Setup Your Farm', desc: 'Add farm location, crop types, and land area using our GPS tool.' },
  { step: '03', title: 'Start Earning', desc: 'Access market prices, rent equipment, and boost productivity instantly.' },
]

const LandingPage = () => {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="landing">
      {/* ── NAVBAR ── */}
      <nav className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : ''}`}>
        <div className="container landing-nav__inner">
          <Link to="/" className="landing-nav__logo">
            <div className="landing-nav__logo-icon"><Leaf size={20} /></div>
            <span>Smart Farming India</span>
          </Link>

          <ul className={`landing-nav__links ${navOpen ? 'landing-nav__links--open' : ''}`}>
            {['Features', 'How It Works', 'Testimonials', 'Pricing'].map(item => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="landing-nav__link"
                  onClick={() => setNavOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="landing-nav__actions">
            <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started Free</Link>
          </div>

          <button className="landing-nav__mobile-toggle" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg-pattern" />
        <div className="container hero__inner">
          <div className="hero__content animate-fadeInUp">
            <div className="section-tag">
              <Globe size={14} />
              Digital Agriculture Platform
            </div>
            <h1 className="hero__title">
              Smart Farming for<br />
              <span className="hero__title-accent">Every Indian Farmer</span>
            </h1>
            <p className="hero__subtitle">
              AI disease detection, GPS calculator, live market prices, equipment rental —
              all in one powerful platform built for Bharat's farmers.
            </p>
            <div className="hero__cta">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start Farming Smarter
                <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn btn-ghost btn-lg">
                <Play size={16} />
                See Features
              </a>
            </div>

            <div className="hero__trust">
              <div className="hero__trust-avatars">
                {['RK','PS','AP','MV'].map((i,idx) => (
                  <div key={idx} className="hero__trust-avatar" style={{ background: ['#16a34a','#7c3aed','#2563eb','#d97706'][idx] }}>{i}</div>
                ))}
              </div>
              <p className="hero__trust-text"><strong>50,000+</strong> farmers already growing with us</p>
              <div className="hero__stars">
                {[...Array(5)].map((_,i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                <span>4.9/5</span>
              </div>
            </div>
          </div>

          <div className="hero__image-area animate-fadeInUp delay-200">
            <div className="hero__image-card hero__image-card--main">
              <div className="hero__mock-screen">
                <div className="hero__mock-bar">
                  <div className="hero__mock-dot" style={{ background: '#ff5f57' }} />
                  <div className="hero__mock-dot" style={{ background: '#febc2e' }} />
                  <div className="hero__mock-dot" style={{ background: '#28c840' }} />
                </div>
                <div className="hero__mock-content">
                  <div className="hero__mock-header">
                    <Leaf size={16} style={{ color: '#16a34a' }} />
                    <span>Disease Detection</span>
                    <span className="badge badge-green" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>AI Active</span>
                  </div>
                  <div className="hero__mock-result">
                    <div className="hero__mock-img-box">🌾</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>Wheat Rust Detected</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Confidence: 97.3%</p>
                      <p style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '0.25rem' }}>Treatment ready ✓</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero__floating-card hero__floating-card--1 animate-float">
              <TrendingUp size={16} style={{ color: '#16a34a' }} />
              <div>
                <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>Wheat (Ludhiana)</p>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>₹2,340 / qtl</p>
                <p style={{ fontSize: '0.7rem', color: '#16a34a' }}>↑ 4.2% today</p>
              </div>
            </div>

            <div className="hero__floating-card hero__floating-card--2 animate-float delay-300">
              <CheckCircle size={16} style={{ color: '#16a34a' }} />
              <div>
                <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>Tractor Booked</p>
                <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Tomorrow 7 AM</p>
                <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>₹850 / hour</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="stats-band">
        <div className="container stats-band__grid">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="stats-band__item">
              <div className="stats-band__icon"><Icon size={22} /></div>
              <div>
                <div className="stats-band__value">{value}</div>
                <div className="stats-band__label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-center">
            <div className="section-tag"><Zap size={14} /> Platform Features</div>
            <h2 className="section-title">Everything You Need for Modern Farming</h2>
            <p className="section-subtitle">
              A comprehensive suite designed to increase productivity, reduce costs, and help you make smarter decisions.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg, tag }) => (
              <div key={title} className="feature-card" style={{ '--card-color': color, '--card-bg': bg } as React.CSSProperties}>
                <div className="feature-card__tag">{tag}</div>
                <div className="feature-card__icon-wrap">
                  <Icon size={24} />
                </div>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__desc">{desc}</p>
                <div className="feature-card__cta">
                  Learn More <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="section how-it-works">
        <div className="container">
          <div className="section-center">
            <div className="section-tag"><CheckCircle size={14} /> Simple Process</div>
            <h2 className="section-title">Get Started in 3 Easy Steps</h2>
            <p className="section-subtitle">From signup to your first crop insight in under 5 minutes.</p>
          </div>
          <div className="steps-grid">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="step-card">
                <div className="step-card__number">{step}</div>
                <h3 className="step-card__title">{title}</h3>
                <p className="step-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="features" className="section why-us">
        <div className="container why-us__inner">
          <div className="why-us__content">
            <div className="section-tag"><Shield size={14} /> Why Smart Farming India</div>
            <h2 className="section-title">Built by Farmers, for Farmers</h2>
            <p className="section-subtitle">
              We work directly with farming communities to build tools that solve real problems.
            </p>
            <div className="why-us__list">
              {WHY_US.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="why-us__item">
                  <div className="why-us__item-icon"><Icon size={20} /></div>
                  <div>
                    <h4 className="why-us__item-title">{title}</h4>
                    <p className="why-us__item-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/signup" className="btn btn-primary btn-lg" style={{ marginTop: '2rem' }}>
              Join 50,000+ Farmers <ArrowRight size={18} />
            </Link>
          </div>
          <div className="why-us__visual">
            <div className="why-us__big-card">
              <div className="why-us__big-stat">
                <span className="why-us__big-number">40%</span>
                <span className="why-us__big-label">Average Productivity Increase</span>
              </div>
              <div className="why-us__divider" />
              <div className="why-us__big-stat">
                <span className="why-us__big-number">₹2L+</span>
                <span className="why-us__big-label">Average Annual Savings</span>
              </div>
              <div className="why-us__divider" />
              <div className="why-us__big-stat">
                <span className="why-us__big-number">95%</span>
                <span className="why-us__big-label">Disease Detection Accuracy</span>
              </div>
            </div>
            <div className="why-us__map-badge">
              <MapPin size={16} />
              <span>Active in <strong>25 States</strong> across India</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="section testimonials">
        <div className="container">
          <div className="section-center">
            <div className="section-tag"><Star size={14} /> Success Stories</div>
            <h2 className="section-title">What Our Farmers Say</h2>
            <p className="section-subtitle">
              Real results from real farmers across India. Here's what they experienced.
            </p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(({ name, role, location, stars, text, initials, color }) => (
              <div key={name} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {[...Array(stars)].map((_,i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="testimonial-card__text">"{text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar" style={{ background: color }}>{initials}</div>
                  <div>
                    <p className="testimonial-card__name">{name}</p>
                    <p className="testimonial-card__meta">{role} · {location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-section__bg" />
        <div className="container cta-section__inner">
          <div className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            <Leaf size={14} /> Start Today
          </div>
          <h2 className="cta-section__title">Ready to Transform Your Farming?</h2>
          <p className="cta-section__subtitle">
            Join thousands of farmers who are already using Smart Farming India to increase productivity and profits.
          </p>
          <div className="cta-section__actions">
            <Link to="/signup" className="btn btn-lg" style={{ background: '#fff', color: 'var(--green-700)', fontWeight: 700 }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              Sign In to Dashboard
            </Link>
          </div>
          <p className="cta-section__note">
            No credit card required · Free for basic features · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="container">
          <div className="landing-footer__top">
            <div className="landing-footer__brand">
              <Link to="/" className="landing-footer__logo">
                <div className="landing-nav__logo-icon"><Leaf size={18} /></div>
                <span>Smart Farming India</span>
              </Link>
              <p className="landing-footer__tagline">Empowering Indian farmers with AI-powered digital agriculture tools.</p>
              <div className="landing-footer__contact">
                <span><Phone size={14} /> +91-800-SMARTFARM</span>
                <span><Mail size={14} /> support@smartfarmingindia.in</span>
              </div>
            </div>
            <div className="landing-footer__links-group">
              <h4>Platform</h4>
              <ul>
                <li><Link to="#">GPS Calculator</Link></li>
                <li><Link to="#">Disease Detection</Link></li>
                <li><Link to="#">Market Prices</Link></li>
                <li><Link to="#">Equipment Rental</Link></li>
                <li><Link to="#">Farm Supply</Link></li>
              </ul>
            </div>
            <div className="landing-footer__links-group">
              <h4>Company</h4>
              <ul>
                <li><Link to="#">About Us</Link></li>
                <li><Link to="#">Blog</Link></li>
                <li><Link to="#">Careers</Link></li>
                <li><Link to="#">Partner Program</Link></li>
              </ul>
            </div>
            <div className="landing-footer__links-group">
              <h4>Support</h4>
              <ul>
                <li><Link to="#">Help Center</Link></li>
                <li><Link to="#">Contact</Link></li>
                <li><Link to="#">Privacy Policy</Link></li>
                <li><Link to="#">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="landing-footer__bottom">
            <p>© 2026 Smart Farming India. All rights reserved. Made with ❤️ for Indian farmers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
