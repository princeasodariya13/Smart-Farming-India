import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Calculator, Scan, DollarSign, BarChart2, Tractor, Package, Wrench,
  TrendingUp, Users, Leaf, AlertTriangle, CheckCircle, Clock,
  ArrowRight, BarChart3, CloudRain, Sun, Wind
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

const priceData = [
  { month: 'Feb', wheat: 2100, rice: 1800, cotton: 5200 },
  { month: 'Mar', wheat: 2250, rice: 1900, cotton: 5400 },
  { month: 'Apr', wheat: 2180, rice: 2050, cotton: 5100 },
  { month: 'May', wheat: 2340, rice: 2200, cotton: 5600 },
  { month: 'Jun', wheat: 2290, rice: 2150, cotton: 5800 },
  { month: 'Jul', wheat: 2420, rice: 2300, cotton: 6100 },
]

const QUICK_ACTIONS = [
  { icon: Calculator, label: 'GPS Calculator', path: '/calculator', color: '#16a34a', bg: '#f0fdf4', roles: ['farmer', 'admin'] },
  { icon: Scan, label: 'Disease Check', path: '/disease-detection', color: '#2563eb', bg: '#eff6ff', roles: ['farmer', 'admin'] },
  { icon: DollarSign, label: 'Cost Planning', path: '/cost-planning', color: '#d97706', bg: '#fffbeb', roles: ['farmer', 'admin'] },
  { icon: BarChart2, label: 'Market Prices', path: '/market-intelligence', color: '#7c3aed', bg: '#f5f3ff', roles: ['farmer', 'owner', 'supplier', 'admin'] },
  { icon: Tractor, label: 'Rent Equipment', path: '/equipment-rental', color: '#0891b2', bg: '#ecfeff', roles: ['farmer', 'owner', 'admin'] },
  { icon: Package, label: 'Farm Supply', path: '/farm-supply', color: '#e11d48', bg: '#fff1f2', roles: ['farmer', 'owner', 'supplier', 'admin'] },
]

const RECENT_ALERTS = [
  { type: 'warning', icon: AlertTriangle, msg: 'Wheat rust disease reported in your district', time: '2h ago' },
  { type: 'success', icon: CheckCircle, msg: 'Tractor booking confirmed for tomorrow 7 AM', time: '4h ago' },
  { type: 'info', icon: TrendingUp, msg: 'Wheat prices up 4.2% at Ludhiana mandi', time: '6h ago' },
  { type: 'info', icon: CloudRain, msg: 'Heavy rain forecast for next 3 days in your area', time: '8h ago' },
]

const Dashboard = () => {
  const { user } = useAuth()
  const role = user?.role || 'farmer'
  const visible = QUICK_ACTIONS.filter(a => a.roles.includes(role))

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="dash-welcome">
        <div className="dash-welcome__text">
          <div className="dash-welcome__greeting">{greeting}, {user?.name?.split(' ')[0]} 🌾</div>
          <h1 className="dash-welcome__title">Your Farm Dashboard</h1>
          <p className="dash-welcome__subtitle">Here's what's happening with your farm today.</p>
        </div>
        <div className="dash-welcome__badge">
          <Leaf size={16} />
          <span>{role.charAt(0).toUpperCase() + role.slice(1)} Account</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-card__icon" style={{ background: '#f0fdf4', color: '#16a34a' }}><BarChart3 size={20} /></div>
          <div>
            <div className="dash-stat-card__value">₹2,420</div>
            <div className="dash-stat-card__label">Wheat / Qtl</div>
            <div className="dash-stat-card__change dash-stat-card__change--up">↑ 4.2% today</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-card__icon" style={{ background: '#eff6ff', color: '#2563eb' }}><Scan size={20} /></div>
          <div>
            <div className="dash-stat-card__value">3</div>
            <div className="dash-stat-card__label">Scans This Month</div>
            <div className="dash-stat-card__change">All crops healthy</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-card__icon" style={{ background: '#ecfeff', color: '#0891b2' }}><Tractor size={20} /></div>
          <div>
            <div className="dash-stat-card__value">1</div>
            <div className="dash-stat-card__label">Active Booking</div>
            <div className="dash-stat-card__change">Tomorrow 7 AM</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-card__icon" style={{ background: '#fffbeb', color: '#d97706' }}><DollarSign size={20} /></div>
          <div>
            <div className="dash-stat-card__value">₹48K</div>
            <div className="dash-stat-card__label">Monthly Budget</div>
            <div className="dash-stat-card__change">72% utilized</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dash-grid">
        {/* Left Column */}
        <div className="dash-col-main">
          {/* Quick Actions */}
          <div className="dash-section">
            <div className="dash-section__header">
              <h2 className="dash-section__title">Quick Actions</h2>
              <span className="dash-section__sub">Access your most-used tools</span>
            </div>
            <div className="quick-actions-grid">
              {visible.map(({ icon: Icon, label, path, color, bg }) => (
                <Link key={path} to={path} className="quick-action-card">
                  <div className="quick-action-card__icon" style={{ background: bg, color }}>
                    <Icon size={22} />
                  </div>
                  <span className="quick-action-card__label">{label}</span>
                  <ArrowRight size={14} className="quick-action-card__arrow" />
                </Link>
              ))}
            </div>
          </div>

          {/* Price Chart */}
          <div className="dash-section">
            <div className="dash-section__header">
              <h2 className="dash-section__title">Market Price Trends</h2>
              <Link to="/market-intelligence" className="dash-section__link">View All <ArrowRight size={14} /></Link>
            </div>
            <div className="price-chart-card">
              <div className="price-chart-legend">
                <span style={{ color: '#16a34a' }}>● Wheat</span>
                <span style={{ color: '#2563eb' }}>● Rice</span>
                <span style={{ color: '#d97706' }}>● Cotton</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={priceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wheat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                  <Area type="monotone" dataKey="wheat" stroke="#16a34a" strokeWidth={2} fill="url(#wheat)" name="Wheat (₹/qtl)" />
                  <Area type="monotone" dataKey="rice" stroke="#2563eb" strokeWidth={2} fill="url(#rice)" name="Rice (₹/qtl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dash-col-side">
          {/* Weather Widget */}
          <div className="dash-section weather-widget">
            <div className="weather-widget__header">
              <div>
                <p className="weather-widget__location">📍 {user?.location || 'Punjab, India'}</p>
                <p className="weather-widget__date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
            </div>
            <div className="weather-widget__main">
              <div className="weather-widget__temp">
                <Sun size={40} style={{ color: '#f59e0b' }} />
                <span>32°C</span>
              </div>
              <span className="weather-widget__desc">Sunny & Warm</span>
            </div>
            <div className="weather-widget__details">
              <div><Wind size={14} /><span>12 km/h</span></div>
              <div><CloudRain size={14} /><span>45% humidity</span></div>
              <div><Sun size={14} /><span>UV: High</span></div>
            </div>
            <div className="weather-widget__advisory">
              <AlertTriangle size={14} />
              <span>Good day for spraying. Avoid afternoon heat.</span>
            </div>
          </div>

          {/* Alerts */}
          <div className="dash-section">
            <div className="dash-section__header">
              <h2 className="dash-section__title">Recent Alerts</h2>
              <span className="badge badge-red" style={{ fontSize: '0.7rem' }}>4 new</span>
            </div>
            <div className="alerts-list">
              {RECENT_ALERTS.map((alert, idx) => {
                const Icon = alert.icon
                return (
                  <div key={idx} className={`alert-item alert-item--${alert.type}`}>
                    <Icon size={15} className="alert-item__icon" />
                    <div className="alert-item__body">
                      <p className="alert-item__msg">{alert.msg}</p>
                      <p className="alert-item__time"><Clock size={11} /> {alert.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
