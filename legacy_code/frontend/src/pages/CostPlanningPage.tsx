import React, { useState } from 'react'
import { DollarSign, Plus, Trash2, TrendingUp, ChevronDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import './PageCommon.css'

const CROPS = ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Maize', 'Sugarcane']
const COST_CATEGORIES = [
  { key: 'seeds', label: 'Seeds', color: '#16a34a' },
  { key: 'fertilizer', label: 'Fertilizers', color: '#2563eb' },
  { key: 'pesticide', label: 'Pesticides', color: '#d97706' },
  { key: 'labor', label: 'Labor', color: '#7c3aed' },
  { key: 'irrigation', label: 'Irrigation', color: '#0891b2' },
  { key: 'equipment', label: 'Equipment', color: '#e11d48' },
]

const CostPlanningPage = () => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat')
  const [area, setArea] = useState('5')
  const [costs, setCosts] = useState<Record<string,string>>({ seeds: '5000', fertilizer: '8000', pesticide: '3000', labor: '12000', irrigation: '4000', equipment: '6000' })
  const [expectedYield, setExpectedYield] = useState('25')
  const [marketPrice, setMarketPrice] = useState('2420')

  const totalCost = Object.values(costs).reduce((s, v) => s + (parseFloat(v) || 0), 0)
  const revenue = (parseFloat(expectedYield) || 0) * (parseFloat(marketPrice) || 0)
  const profit = revenue - totalCost
  const roi = totalCost ? ((profit / totalCost) * 100).toFixed(1) : '0'

  const chartData = COST_CATEGORIES.map(c => ({ name: c.label, value: parseFloat(costs[c.key]) || 0, color: c.color }))

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><DollarSign size={24} /> Cost Planning</h1>
          <p className="page-subtitle">Plan your seasonal budget and forecast profitability</p>
        </div>
        <button className="btn btn-primary"><Plus size={16} /> New Plan</button>
      </div>

      <div className="page-grid-2">
        {/* Input Form */}
        <div className="page-card">
          <h2 className="page-card__title" style={{ marginBottom: '1.25rem' }}>Plan Details</h2>
          <div className="form-group">
            <label className="form-label">Crop</label>
            <select className="form-control" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
              {CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Farm Area (Acres)</label>
            <input type="number" className="form-control" value={area} onChange={e => setArea(e.target.value)} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <p className="form-label" style={{ marginBottom: '0.75rem' }}>Cost Breakdown (₹)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {COST_CATEGORIES.map(({ key, label, color }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <label style={{ fontSize: '0.85rem', color: 'var(--gray-600)', width: 120, flexShrink: 0 }}>{label}</label>
                  <input type="number" className="form-control" style={{ flex: 1 }} value={costs[key]} onChange={e => setCosts(c => ({ ...c, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
          </div>
          <div className="page-grid-2" style={{ gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label">Expected Yield (Qtl)</label>
              <input type="number" className="form-control" value={expectedYield} onChange={e => setExpectedYield(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Market Price (₹/Qtl)</label>
              <input type="number" className="form-control" value={marketPrice} onChange={e => setMarketPrice(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="page-card">
            <h2 className="page-card__title" style={{ marginBottom: '1.25rem' }}>Financial Summary</h2>
            {[
              { label: 'Total Investment', value: `₹${totalCost.toLocaleString('en-IN')}`, sub: 'across all categories', color: 'var(--gray-900)' },
              { label: 'Expected Revenue', value: `₹${revenue.toLocaleString('en-IN')}`, sub: `${expectedYield} qtl × ₹${marketPrice}`, color: '#2563eb' },
              { label: profit >= 0 ? 'Net Profit' : 'Net Loss', value: `₹${Math.abs(profit).toLocaleString('en-IN')}`, sub: `ROI: ${roi}%`, color: profit >= 0 ? '#16a34a' : '#dc2626' },
            ].map(({ label, value, sub, color }) => (
              <div key={label} style={{ padding: '1.125rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', marginBottom: '0.875rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>{label}</p>
                <p style={{ fontSize: '1.625rem', fontWeight: 800, color, lineHeight: 1.2 }}>{value}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{sub}</p>
              </div>
            ))}
          </div>

          <div className="page-card">
            <h2 className="page-card__title" style={{ marginBottom: '1.25rem' }}>Cost Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={20}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} hide />
                <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostPlanningPage
