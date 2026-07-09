import React from 'react'
import { Shield, Users, Package, Tractor, BarChart3, Settings } from 'lucide-react'
import './PageCommon.css'

const AdminPage = () => (
  <div className="page">
    <div className="page-header">
      <div>
        <h1 className="page-title"><Shield size={24} /> Admin Console</h1>
        <p className="page-subtitle">Manage users, content, and platform settings</p>
      </div>
    </div>

    <div className="page-stats-row">
      {[
        { label: 'Total Users', value: '52,341', change: '+234 this week', icon: Users },
        { label: 'Active Equipment', value: '1,847', change: '+12 this week', icon: Tractor },
        { label: 'Supply Orders', value: '8,920', change: '+410 this month', icon: Package },
        { label: 'Revenue (MTD)', value: '₹12.4L', change: '+18% MoM', icon: BarChart3 },
      ].map(({ label, value, change, icon: Icon }) => (
        <div key={label} className="page-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'var(--green-100)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-600)' }}>
              <Icon size={18} />
            </div>
          </div>
          <p className="page-stat-value">{value}</p>
          <p className="page-stat-label">{label}</p>
          <p className="page-stat-change page-stat-change--up">{change}</p>
        </div>
      ))}
    </div>

    <div className="page-grid-2">
      <div className="page-card">
        <div className="page-card__header"><h2 className="page-card__title">Recent Users</h2></div>
        <div className="page-table-wrapper">
          <table className="page-table">
            <thead><tr><th>Name</th><th>Role</th><th>Joined</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { name: 'Rajesh Kumar', role: 'farmer', date: 'Jul 8, 2026', active: true },
                { name: 'Amit Patel', role: 'owner', date: 'Jul 7, 2026', active: true },
                { name: 'Sunita Singh', role: 'supplier', date: 'Jul 6, 2026', active: false },
                { name: 'Gurpreet S.', role: 'farmer', date: 'Jul 5, 2026', active: true },
              ].map((u, i) => (
                <tr key={i}>
                  <td><strong>{u.name}</strong></td>
                  <td><span className="badge badge-blue" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{u.role}</span></td>
                  <td>{u.date}</td>
                  <td><span className={`badge ${u.active ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>{u.active ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="page-card">
        <div className="page-card__header"><h2 className="page-card__title">Platform Settings</h2></div>
        {[
          { label: 'Maintenance Mode', desc: 'Take the platform offline for maintenance', enabled: false },
          { label: 'New Registrations', desc: 'Allow new users to register', enabled: true },
          { label: 'Email Notifications', desc: 'Send system email notifications', enabled: true },
          { label: 'SMS Alerts', desc: 'Send SMS price alerts to farmers', enabled: false },
        ].map(({ label, desc, enabled }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid var(--gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</p>
              <p style={{ fontSize: '0.775rem', color: 'var(--gray-500)' }}>{desc}</p>
            </div>
            <div style={{ width: 44, height: 24, background: enabled ? 'var(--green-500)' : 'var(--gray-200)', borderRadius: 12, position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: enabled ? 22 : 2, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'left 0.2s' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default AdminPage
