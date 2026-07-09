import React from 'react'
import { Wrench, Plus, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import './PageCommon.css'

const RECORDS = [
  { equipment: 'John Deere 5310', type: 'Oil Change', date: '2026-06-15', cost: 2500, status: 'completed' },
  { equipment: 'Combine Harvester', type: 'Belt Replacement', date: '2026-07-01', cost: 8000, status: 'completed' },
  { equipment: 'Sprayer', type: 'Nozzle Check', date: '2026-07-10', cost: 500, status: 'scheduled' },
  { equipment: 'John Deere 5310', type: 'Annual Service', date: '2026-08-01', cost: 12000, status: 'scheduled' },
]

const MaintenancePage = () => (
  <div className="page">
    <div className="page-header">
      <div>
        <h1 className="page-title"><Wrench size={24} /> Maintenance</h1>
        <p className="page-subtitle">Track and schedule equipment maintenance records</p>
      </div>
      <button className="btn btn-primary"><Plus size={16} /> Schedule Maintenance</button>
    </div>

    <div className="page-stats-row">
      {[
        { label: 'Total Equipment', value: '6', icon: '🚜' },
        { label: 'Completed This Month', value: '2', icon: '✅' },
        { label: 'Scheduled', value: '2', icon: '📅' },
        { label: 'Total Spent', value: '₹23,000', icon: '💰' },
      ].map(({ label, value, icon }) => (
        <div key={label} className="page-stat-card">
          <p className="page-stat-label">{label}</p>
          <p className="page-stat-value">{icon} {value}</p>
        </div>
      ))}
    </div>

    <div className="page-card">
      <div className="page-card__header">
        <h2 className="page-card__title">Maintenance Records</h2>
        <button className="btn btn-outline btn-sm"><Calendar size={14} /> View Calendar</button>
      </div>
      <div className="page-table-wrapper">
        <table className="page-table">
          <thead>
            <tr><th>Equipment</th><th>Maintenance Type</th><th>Date</th><th>Cost</th><th>Status</th></tr>
          </thead>
          <tbody>
            {RECORDS.map((r, i) => (
              <tr key={i}>
                <td><strong>{r.equipment}</strong></td>
                <td>{r.type}</td>
                <td>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td>₹{r.cost.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge ${r.status === 'completed' ? 'badge-green' : 'badge-amber'}`}>
                    {r.status === 'completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                    {' '}{r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

export default MaintenancePage
