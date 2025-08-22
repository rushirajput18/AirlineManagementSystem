import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './features/login/LoginPage'
import AdminDashboard from './features/admin/AdminDashboard'
import StaffDashboard from './features/staff/StaffDashboard'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import TokenExpirationWarning from './components/TokenExpirationWarning'
import { isAuthenticated } from './utils/auth'

const App: React.FC = () => {

  const getRedirect = () => {
    if (!isAuthenticated()) return <Navigate to="/login" replace />
    
    const role = localStorage.getItem("userRole")
    if (role === 'admin') return <Navigate to="/admin-dashboard" replace />
    if (role === 'staff') return <Navigate to="/staff-dashboard" replace />
    return <Navigate to="/404" replace />
  }

  return (
    <div className="App">
      <TokenExpirationWarning />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff-dashboard" 
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/404" element={<NotFound />} />
        <Route path="/" element={getRedirect()} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  )
}

export default App


