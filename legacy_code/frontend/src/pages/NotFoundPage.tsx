import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, ArrowLeft } from 'lucide-react'
import './PageCommon.css'

const NotFoundPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--gray-50)', textAlign: 'center', padding: '2rem' }}>
    <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, var(--green-500), var(--green-700))', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '2rem', boxShadow: '0 10px 25px rgba(34,197,94,0.4)' }}>
      <Leaf size={40} />
    </div>
    <h1 style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--gray-900)', lineHeight: 1 }}>404</h1>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-800)', marginTop: '0.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
    <p style={{ color: 'var(--gray-500)', maxWidth: 400, lineHeight: 1.6, marginBottom: '2rem' }}>
      Oops! The page you are looking for seems to have gone missing or doesn't exist.
    </p>
    <Link to="/" className="btn btn-primary btn-lg">
      <ArrowLeft size={18} /> Back to Home
    </Link>
  </div>
)

export default NotFoundPage
