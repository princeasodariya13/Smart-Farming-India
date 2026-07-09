import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Shield, Camera, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './PageCommon.css'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', location: user?.location || '' })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateUser(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title"><User size={24} /> My Profile</h1>
          <p className="page-subtitle">Manage your personal information and account settings</p>
        </div>
      </div>

      <div className="page-grid-2">
        {/* Avatar Card */}
        <div className="page-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-500), var(--green-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
              {initials}
            </div>
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, background: 'var(--green-600)', border: '3px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
              <Camera size={14} />
            </button>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: '1.25rem' }}>{form.name}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{form.email}</p>
          <span className="badge badge-green" style={{ marginTop: '0.75rem', textTransform: 'capitalize' }}>
            <Shield size={12} /> {user?.role}
          </span>
        </div>

        {/* Form */}
        <div className="page-card">
          <h2 className="page-card__title" style={{ marginBottom: '1.5rem' }}>Personal Information</h2>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon-left" />
              <input type="text" className="form-control has-icon-left" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon-left" />
              <input type="email" className="form-control has-icon-left" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="input-wrapper">
              <Phone size={16} className="input-icon-left" />
              <input type="tel" className="form-control has-icon-left" value={form.phone} placeholder="+91 98765 43210" onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <div className="input-wrapper">
              <MapPin size={16} className="input-icon-left" />
              <input type="text" className="form-control has-icon-left" value={form.location} placeholder="City, State" onChange={e => setForm(f => ({...f, location: e.target.value}))} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSave}>
            {saved ? <><span>✓</span> Saved!</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
