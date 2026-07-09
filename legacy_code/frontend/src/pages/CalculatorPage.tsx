import React, { useState } from 'react'
import { Calculator, MapPin, Maximize2, RotateCcw, Download } from 'lucide-react'
import './PageCommon.css'

const CalculatorPage = () => {
  const [area, setArea] = useState<number | null>(null)
  const [manualLength, setManualLength] = useState('')
  const [manualWidth, setManualWidth] = useState('')
  const [unit, setUnit] = useState('bigha')

  const CONVERSION: Record<string, number> = {
    bigha: 0.625, acre: 1, hectare: 2.471, sqmeter: 10764
  }

  const calculateManual = () => {
    const l = parseFloat(manualLength), w = parseFloat(manualWidth)
    if (l && w) setArea(parseFloat((l * w / CONVERSION[unit]).toFixed(3)))
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Calculator size={24} /> GPS Area Calculator</h1>
          <p className="page-subtitle">Calculate your farm area accurately using GPS or manual measurements</p>
        </div>
      </div>

      <div className="page-grid-2">
        {/* Map Placeholder */}
        <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="calc-map-placeholder">
            <div className="calc-map-inner">
              <div className="calc-map-icon">
                <MapPin size={32} />
              </div>
              <h3>Interactive GPS Map</h3>
              <p>Use the map to mark your farm boundaries by clicking corner points. The area will be calculated automatically.</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button className="btn btn-primary">
                  <MapPin size={16} /> Start GPS Mapping
                </button>
                <button className="btn btn-ghost">
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="page-card">
            <h2 className="page-card__title" style={{ marginBottom: '1.25rem' }}>Manual Calculation</h2>
            <div className="form-group">
              <label className="form-label">Unit of Measurement</label>
              <select className="form-control" value={unit} onChange={e => setUnit(e.target.value)}>
                <option value="bigha">Bigha</option>
                <option value="acre">Acre</option>
                <option value="hectare">Hectare</option>
                <option value="sqmeter">Square Meters</option>
              </select>
            </div>
            <div className="page-grid-2" style={{ gap: '0.875rem' }}>
              <div className="form-group">
                <label className="form-label">Length (meters)</label>
                <input type="number" className="form-control" placeholder="0" value={manualLength} onChange={e => setManualLength(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Width (meters)</label>
                <input type="number" className="form-control" placeholder="0" value={manualWidth} onChange={e => setManualWidth(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={calculateManual}>
              <Calculator size={16} /> Calculate Area
            </button>
          </div>

          {area !== null && (
            <div className="page-card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid var(--green-200)' }}>
              <h2 className="page-card__title" style={{ color: 'var(--green-700)', marginBottom: '1rem' }}>Calculation Result</h2>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--green-600)', lineHeight: 1 }}>{area}</div>
                <div style={{ fontSize: '1.1rem', color: 'var(--green-700)', fontWeight: 600, marginTop: '0.5rem', textTransform: 'capitalize' }}>{unit}</div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['bigha','acre','hectare'].filter(u => u !== unit).map(u => (
                  <div key={u} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid var(--green-200)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--green-700)', textTransform: 'capitalize' }}>{u}</span>
                    <strong style={{ color: 'var(--green-800)' }}>{(area * CONVERSION[unit] / CONVERSION[u]).toFixed(3)}</strong>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', borderColor: 'var(--green-500)', color: 'var(--green-700)' }}>
                <Download size={16} /> Save Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalculatorPage
