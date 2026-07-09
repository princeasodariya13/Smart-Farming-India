import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import CalculatorPage from './pages/CalculatorPage'
import DiseaseDetectionPage from './pages/DiseaseDetectionPage'
import CostPlanningPage from './pages/CostPlanningPage'
import MarketIntelligencePage from './pages/MarketIntelligencePage'
import EquipmentRentalPage from './pages/EquipmentRentalPage'
import FarmSupplyPage from './pages/FarmSupplyPage'
import MaintenancePage from './pages/MaintenancePage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

// Layout
import AppLayout from './layouts/AppLayout'

// Route Guards
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderColor: 'var(--green-200)', borderTopColor: 'var(--green-600)' }} />
        <p>Loading Smart Farming India...</p>
      </div>
    )
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

    {/* Protected Routes – wrapped in AppLayout */}
    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calculator" element={<CalculatorPage />} />
      <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
      <Route path="/cost-planning" element={<CostPlanningPage />} />
      <Route path="/market-intelligence" element={<MarketIntelligencePage />} />
      <Route path="/equipment-rental" element={<EquipmentRentalPage />} />
      <Route path="/farm-supply" element={<FarmSupplyPage />} />
      <Route path="/maintenance" element={<MaintenancePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
)

export default App
