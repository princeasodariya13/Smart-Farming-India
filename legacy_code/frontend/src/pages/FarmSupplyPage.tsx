import React, { useState } from 'react'
import { Package, ShoppingCart, Star, Search, MapPin, Plus, Minus } from 'lucide-react'
import './PageCommon.css'

const SUPPLIES = [
  { id:1, name:'Premium Wheat Seeds (HD-2967)', category:'Seeds', supplier:'AgroSeed Corp', location:'Ludhiana', price:1200, unit:'50kg bag', rating:4.8, reviews:124, emoji:'🌾', badge:'Bestseller' },
  { id:2, name:'DAP Fertilizer', category:'Fertilizer', supplier:'IFFCO Distributor', location:'Chandigarh', price:1380, unit:'50kg bag', rating:4.7, reviews:89, emoji:'💊', badge:'Quality' },
  { id:3, name:'NPK 20-20-0 Fertilizer', category:'Fertilizer', supplier:'Coromandel Agri', location:'Patiala', price:980, unit:'50kg bag', rating:4.5, reviews:56, emoji:'🧪', badge:'' },
  { id:4, name:'Propiconazole Fungicide', category:'Pesticide', supplier:'Bayer CropSci', location:'Amritsar', price:450, unit:'500ml bottle', rating:4.9, reviews:201, emoji:'🔬', badge:'Expert Pick' },
  { id:5, name:'Drip Irrigation Kit (1 Acre)', category:'Equipment', supplier:'Jain Irrigation', location:'Ludhiana', price:8500, unit:'set', rating:4.6, reviews:43, emoji:'💧', badge:'Popular' },
  { id:6, name:'Potassium Humate Bio Fertilizer', category:'Fertilizer', supplier:'OrganicFarm Ltd', location:'Punjab', price:650, unit:'1kg', rating:4.4, reviews:31, emoji:'🌱', badge:'Organic' },
]

const CATS = ['All', 'Seeds', 'Fertilizer', 'Pesticide', 'Equipment']

const FarmSupplyPage = () => {
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<Record<number,number>>({})

  const filtered = SUPPLIES.filter(s => (cat === 'All' || s.category === cat) && s.name.toLowerCase().includes(search.toLowerCase()))
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = SUPPLIES.find(s => s.id === +id)
    return sum + (item ? item.price * qty : 0)
  }, 0)
  const cartCount = Object.values(cart).reduce((a,b) => a+b, 0)

  const addToCart = (id: number) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const removeFromCart = (id: number) => setCart(c => { const n = { ...c }; if (n[id] > 1) n[id]--; else delete n[id]; return n })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Package size={24} /> Farm Supply</h1>
          <p className="page-subtitle">Order seeds, fertilizers, and supplies from trusted suppliers</p>
        </div>
        {cartCount > 0 && (
          <button className="btn btn-primary">
            <ShoppingCart size={16} /> Cart ({cartCount}) · ₹{cartTotal.toLocaleString('en-IN')}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="page-card" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="input-wrapper" style={{ flex: 1, minWidth: 200 }}>
            <Search size={16} className="input-icon-left" />
            <input className="form-control has-icon-left" placeholder="Search supplies..." value={search} onChange={e => setSearch(e.target.value)} style={{ height: 'auto', padding: '0.5rem 1rem 0.5rem 2.5rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {CATS.map(c => <button key={c} className={`btn btn-sm ${cat === c ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.375rem 0.875rem' }} onClick={() => setCat(c)}>{c}</button>)}
          </div>
        </div>
      </div>

      <div className="item-grid">
        {filtered.map(s => (
          <div key={s.id} className="item-card">
            <div className="item-card__image">
              {s.badge && <span className="badge badge-amber" style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.7rem' }}>{s.badge}</span>}
              <span style={{ position: 'relative', fontSize: '3rem' }}>{s.emoji}</span>
            </div>
            <div className="item-card__body">
              <span className="badge badge-blue" style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>{s.category}</span>
              <h3 className="item-card__title">{s.name}</h3>
              <div className="item-card__meta">
                <div className="item-card__meta-row"><MapPin size={12} />{s.supplier} · {s.location}</div>
                <div className="item-card__meta-row"><Star size={12} style={{ color: '#f59e0b' }} fill="#f59e0b" />{s.rating} ({s.reviews} reviews)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                <div>
                  <span className="item-card__price">₹{s.price.toLocaleString('en-IN')}</span>
                  <span className="item-card__price-unit"> / {s.unit}</span>
                </div>
                {cart[s.id] ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--green-50)', border: '1.5px solid var(--green-300)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
                    <button className="btn btn-sm" style={{ padding: '0.25rem 0.5rem', background: 'transparent', color: 'var(--green-600)', border: 'none' }} onClick={() => removeFromCart(s.id)}><Minus size={14} /></button>
                    <span style={{ fontWeight: 700, color: 'var(--green-700)', minWidth: '1.5rem', textAlign: 'center' }}>{cart[s.id]}</span>
                    <button className="btn btn-sm" style={{ padding: '0.25rem 0.5rem', background: 'transparent', color: 'var(--green-600)', border: 'none' }} onClick={() => addToCart(s.id)}><Plus size={14} /></button>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => addToCart(s.id)}>
                    <ShoppingCart size={14} /> Add
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FarmSupplyPage
