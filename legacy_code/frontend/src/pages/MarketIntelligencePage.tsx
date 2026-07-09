import React, { useState } from 'react'
import { BarChart2, TrendingUp, TrendingDown, Bell, Search, Filter, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './PageCommon.css'

const priceHistory = [
  { date: 'Jan', wheat: 2050, rice: 1750, soybean: 3800, cotton: 5100 },
  { date: 'Feb', wheat: 2100, rice: 1800, soybean: 3950, cotton: 5200 },
  { date: 'Mar', wheat: 2250, rice: 1900, soybean: 4100, cotton: 5400 },
  { date: 'Apr', wheat: 2180, rice: 2050, soybean: 3900, cotton: 5100 },
  { date: 'May', wheat: 2340, rice: 2200, soybean: 4200, cotton: 5600 },
  { date: 'Jun', wheat: 2290, rice: 2150, soybean: 4050, cotton: 5800 },
  { date: 'Jul', wheat: 2420, rice: 2300, soybean: 4350, cotton: 6100 },
]

const MANDIS = [
  { name: 'Ludhiana', state: 'Punjab', crop: 'Wheat', price: 2420, change: 4.2, unit: 'qtl' },
  { name: 'Nagpur', state: 'Maharashtra', crop: 'Cotton', price: 6100, change: 2.8, unit: 'qtl' },
  { name: 'Indore', state: 'MP', crop: 'Soybean', price: 4350, change: -1.2, unit: 'qtl' },
  { name: 'Warangal', state: 'Telangana', crop: 'Rice', price: 2300, change: 3.5, unit: 'qtl' },
  { name: 'Vadodara', state: 'Gujarat', crop: 'Groundnut', price: 5800, change: 1.9, unit: 'qtl' },
  { name: 'Amritsar', state: 'Punjab', crop: 'Potato', price: 1200, change: -3.1, unit: 'qtl' },
]

const MarketIntelligencePage = () => {
  const [search, setSearch] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('wheat')

  const filtered = MANDIS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.crop.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><BarChart2 size={24} /> Market Intelligence</h1>
          <p className="page-subtitle">Live mandi prices, trends, and market alerts across India</p>
        </div>
        <button className="btn btn-primary">
          <Bell size={16} /> Set Price Alert
        </button>
      </div>

      {/* Summary Cards */}
      <div className="page-stats-row">
        {[
          { label: 'Wheat (Best)', value: '₹2,420/qtl', change: '+4.2%', up: true },
          { label: 'Rice (Best)', value: '₹2,300/qtl', change: '+3.5%', up: true },
          { label: 'Cotton (Best)', value: '₹6,100/qtl', change: '+2.8%', up: true },
          { label: 'Soybean', value: '₹4,350/qtl', change: '-1.2%', up: false },
        ].map(({ label, value, change, up }) => (
          <div key={label} className="page-stat-card">
            <p className="page-stat-label">{label}</p>
            <p className="page-stat-value">{value}</p>
            <p className={`page-stat-change ${up ? 'page-stat-change--up' : 'page-stat-change--down'}`}>
              {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="page-card">
        <div className="page-card__header">
          <h2 className="page-card__title">Price Trend (Last 7 Months)</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['wheat','rice','soybean','cotton'].map(c => (
              <button key={c} className={`btn btn-sm ${selectedCrop === c ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.375rem 0.875rem' }} onClick={() => setSelectedCrop(c)}>
                {c.charAt(0).toUpperCase()+c.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={priceHistory}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(v: any) => [`₹${v}/qtl`]} />
            <Area type="monotone" dataKey={selectedCrop} stroke="#16a34a" strokeWidth={2.5} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mandi Table */}
      <div className="page-card">
        <div className="page-card__header">
          <h2 className="page-card__title">Live Mandi Prices</h2>
          <div className="input-wrapper" style={{ width: 260 }}>
            <Search size={16} className="input-icon-left" />
            <input className="form-control has-icon-left" placeholder="Search mandi or crop..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', height: 'auto' }} />
          </div>
        </div>
        <div className="page-table-wrapper">
          <table className="page-table">
            <thead>
              <tr>
                <th>Mandi</th>
                <th>State</th>
                <th>Crop</th>
                <th>Price</th>
                <th>Change</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={i}>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.state}</td>
                  <td><span className="badge badge-green">{m.crop}</span></td>
                  <td><strong>₹{m.price.toLocaleString('en-IN')}/{m.unit}</strong></td>
                  <td>
                    <span style={{ color: m.change > 0 ? '#16a34a' : '#dc2626', display:'flex', alignItems:'center', gap:4, fontWeight:600 }}>
                      {m.change > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {m.change > 0 ? '+' : ''}{m.change}%
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm">
                      <Bell size={12} /> Alert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MarketIntelligencePage
