import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Calculator,
  Scan,
  DollarSign,
  BarChart2,
  Tractor,
  Package,
  Wrench,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Leaf,
  Bell,
  ChevronDown,
} from 'lucide-react'
import './AppLayout.css'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',         path: '/dashboard',          roles: ['farmer','owner','supplier','admin'] },
  { icon: Calculator,      label: 'GPS Calculator',    path: '/calculator',         roles: ['farmer','admin'] },
  { icon: Scan,            label: 'Disease Detection', path: '/disease-detection',  roles: ['farmer','admin'] },
  { icon: DollarSign,      label: 'Cost Planning',     path: '/cost-planning',      roles: ['farmer','admin'] },
  { icon: BarChart2,       label: 'Market Intel',      path: '/market-intelligence',roles: ['farmer','owner','supplier','admin'] },
  { icon: Tractor,         label: 'Equipment Rental',  path: '/equipment-rental',   roles: ['farmer','owner','admin'] },
  { icon: Package,         label: 'Farm Supply',       path: '/farm-supply',        roles: ['farmer','owner','supplier','admin'] },
  { icon: Wrench,          label: 'Maintenance',       path: '/maintenance',        roles: ['owner','admin'] },
  { icon: Shield,          label: 'Admin',             path: '/admin',              roles: ['admin'] },
]

const AppLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const role = user?.role || 'farmer'
  const visibleNav = navItems.filter(n => n.roles.includes(role))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'KM'

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <Leaf size={20} />
            </div>
            <span className="sidebar__logo-text">Smart Farming India</span>
          </div>
          <button className="sidebar__close hide-desktop" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {visibleNav.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <NavLink to="/profile" className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <User size={18} />
            <span>Profile</span>
          </NavLink>
          <button className="sidebar__link sidebar__link--logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="app-main">
        {/* Topbar */}
        <header className="topbar">
          <button className="topbar__menu-btn hide-desktop" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="topbar__brand hide-desktop">
            <Leaf size={18} style={{ color: 'var(--green-600)' }} />
            <span>Smart Farming India</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Notifications */}
          <button className="topbar__icon-btn">
            <Bell size={20} />
            <span className="topbar__notif-dot" />
          </button>

          {/* Profile Dropdown */}
          <div className="topbar__profile" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="topbar__avatar">{initials}</div>
            <div className="topbar__user-info hide-mobile">
              <span className="topbar__user-name">{user?.name}</span>
              <span className="topbar__user-role">{role}</span>
            </div>
            <ChevronDown size={16} className={`topbar__chevron ${profileOpen ? 'topbar__chevron--open' : ''}`} />

            {profileOpen && (
              <div className="topbar__dropdown">
                <NavLink to="/profile" className="topbar__dropdown-item" onClick={() => setProfileOpen(false)}>
                  <User size={16} />
                  My Profile
                </NavLink>
                <div className="topbar__dropdown-divider" />
                <button className="topbar__dropdown-item topbar__dropdown-item--danger" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
