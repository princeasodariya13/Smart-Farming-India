import React, { useState } from 'react'
import { Tractor, MapPin, Star, Filter, Search, Calendar, CheckCircle } from 'lucide-react'
import './PageCommon.css'

const EQUIPMENT = [
  { id:1, name:'John Deere 5310 Tractor', category:'Tractor', owner:'Amit Patel', location:'Ludhiana, Punjab', price:850, unit:'hour', rating:4.8, reviews:32, available:true, emoji:'🚜', features:['55 HP','Power Steering','AC Cabin'] },
  { id:2, name:'Mahindra 475 DI', category:'Tractor', owner:'Rajesh Singh', location:'Amritsar, Punjab', price:700, unit:'hour', rating:4.6, reviews:18, available:true, emoji:'🚜', features:['42 HP','4WD','Heavy Duty'] },
  { id:3, name:'Combine Harvester', category:'Harvester', owner:'GreenFarm Rentals', location:'Ludhiana, Punjab', price:3500, unit:'hour', rating:4.9, reviews:55, available:false, emoji:'🌾', features:['Wide Cut','GPS Track','Grain Tank'] },
  { id:4, name:'Rotavator', category:'Tillage', owner:'KisanEquip Co.', location:'Patiala, Punjab', price:400, unit:'hour', rating:4.5, reviews:22, available:true, emoji:'🔩', features:['6-ft Cut','All Soils'] },
  { id:5, name:'Sprayer (Boom 12m)', category:'Sprayer', owner:'AgroMech Punjab', location:'Chandigarh', price:600, unit:'hour', rating:4.7, reviews:14, available:true, emoji:'💦', features:['12m Boom','500L Tank','Nozzle Set'] },
  { id:6, name:'Potato Harvester', category:'Harvester', owner:'Mr. Gurpreet', location:'Jalandhar, Punjab', price:2200, unit:'hour', rating:4.4, reviews:9, available:true, emoji:'🥔', features:['Row Width: 90cm','Auto-sort'] },
]

const CATEGORIES = ['All', 'Tractor', 'Harvester', 'Tillage', 'Sprayer']

const EquipmentRentalPage = () => {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [selected, setSelected] = useState<typeof EQUIPMENT[0] | null>(null)

  const filtered = EQUIPMENT.filter(e =>
    (cat === 'All' || e.category === cat) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Tractor size={24} /> Equipment Rental</h1>
          <p className="page-subtitle">Rent verified farm equipment from owners near you</p>
        </div>
      </div>

      {/* Filters */}
      <div className="page-card" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="input-wrapper" style={{ flex: 1, minWidth: 200 }}>
            <Search size={16} className="input-icon-left" />
            <input className="form-control has-icon-left" placeholder="Search equipment or location..." value={search} onChange={e => setSearch(e.target.value)} style={{ height: 'auto', padding: '0.5rem 1rem 0.5rem 2.5rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {CATEGORIES.map(c => (
              <button key={c} className={`btn btn-sm ${cat === c ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.375rem 0.875rem' }} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="item-grid">
        {filtered.map(eq => (
          <div key={eq.id} className="item-card" onClick={() => setSelected(eq)}>
            <div className="item-card__image">{eq.emoji}</div>
            <div className="item-card__body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 className="item-card__title" style={{ marginBottom: 0 }}>{eq.name}</h3>
                <span className={`badge ${eq.available ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                  {eq.available ? '✓ Available' : 'Booked'}
                </span>
              </div>
              <div className="item-card__meta">
                <div className="item-card__meta-row"><MapPin size={12} />{eq.location}</div>
                <div className="item-card__meta-row"><Star size={12} style={{ color: '#f59e0b' }} fill="#f59e0b" />{eq.rating} ({eq.reviews} reviews)</div>
              </div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {eq.features.map(f => <span key={f} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{f}</span>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span className="item-card__price">₹{eq.price}</span>
                  <span className="item-card__price-unit">/{eq.unit}</span>
                </div>
                <button className="btn btn-primary btn-sm" disabled={!eq.available} onClick={e => { e.stopPropagation(); setSelected(eq) }}>
                  <Calendar size={14} /> Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Book: {selected.name}</h3>
              <button className="modal__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal__body">
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', alignItems: 'center' }}>
                <span style={{ fontSize: '2.5rem' }}>{selected.emoji}</span>
                <div>
                  <p style={{ fontWeight: 700 }}>{selected.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{selected.location} · ₹{selected.price}/{selected.unit}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Booking Date</label>
                <input type="date" className="form-control" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="page-grid-2" style={{ gap: '0.875rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input type="time" className="form-control" defaultValue="07:00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (hours)</label>
                  <input type="number" className="form-control" defaultValue={4} min={1} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Special Requirements</label>
                <textarea className="form-control" rows={3} placeholder="Any specific requirements..." style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal__footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary"><CheckCircle size={16} /> Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EquipmentRentalPage
